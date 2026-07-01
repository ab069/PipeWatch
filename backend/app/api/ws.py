import json
import random
import math
from datetime import datetime, timezone

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy import select

from app.core.database import async_session
from app.models.pipeline import Pipeline
from app.models.alert import Alert
from app.agents.leak_detector import analyze_pressure_drop, analyze_flow_anomaly, calculate_integrity

router = APIRouter()

active_connections: dict[str, WebSocket] = {}


async def send_alert(ws: WebSocket, alert: dict):
    try:
        await ws.send_json({"type": "alert", "data": alert})
    except Exception:
        pass


@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await websocket.accept()
    active_connections[user_id] = websocket

    await websocket.send_json({"type": "connected", "message": "WebSocket connected"})

    try:
        while True:
            raw = await websocket.receive_text()
            msg = json.loads(raw)

            if msg.get("action") == "analyze" and msg.get("pipeline_id"):
                async with async_session() as db:
                    result = await db.execute(
                        select(Pipeline).where(Pipeline.id == msg["pipeline_id"])
                    )
                    pipeline = result.scalar_one_or_none()
                    if not pipeline:
                        await websocket.send_json({"type": "error", "message": "Pipeline not found"})
                        continue

                    previous_pressure = pipeline.current_pressure + random.uniform(-5, 15)
                    pressure_result = analyze_pressure_drop(
                        pipeline.current_pressure, previous_pressure, pipeline.max_pressure
                    )
                    flow_result = analyze_flow_anomaly(
                        pipeline.flow_rate, pipeline.diameter_mm, pipeline.current_pressure
                    )
                    days_online = max(1, random.randint(30, 730))
                    pressure_stability = max(0, 100 - abs(pressure_result["drop_percentage"]) * 2)
                    flow_consistency = max(0, 100 - abs(flow_result["deviation_percentage"]) * 1.5)
                    new_score = calculate_integrity(pressure_stability, flow_consistency, days_online)

                    pipeline.integrity_score = new_score

                    findings = []
                    if pressure_result["leak_detected"]:
                        pipeline.leak_status = "confirmed"
                        findings.append(f"Critical pressure drop: {pressure_result['drop_percentage']:.1f}%")
                        alert = Alert(
                            user_id=user_id,
                            pipeline_id=str(pipeline.id),
                            title=f"Leak Detected on {pipeline.name}",
                            alert_type="leak_detected",
                            severity="critical",
                            status="active",
                            description=pressure_result["message"],
                        )
                        db.add(alert)
                        await db.commit()
                        await send_alert(websocket, {
                            "id": str(alert.id),
                            "pipeline_id": str(pipeline.id),
                            "pipeline_name": pipeline.name,
                            "title": alert.title,
                            "alert_type": "leak_detected",
                            "severity": "critical",
                            "description": pressure_result["message"],
                        })
                    elif pressure_result["severity"] in ("high", "medium"):
                        pipeline.leak_status = "suspicious"
                        findings.append(f"Pressure anomaly: {pressure_result['drop_percentage']:.1f}% drop")
                    else:
                        pipeline.leak_status = "normal"

                    if flow_result["anomaly_detected"]:
                        findings.append(f"Flow anomaly: {flow_result['deviation_percentage']:.1f}% deviation")

                    await db.commit()

                    await websocket.send_json({
                        "type": "analysis_result",
                        "data": {
                            "pipeline_id": str(pipeline.id),
                            "pipeline_name": pipeline.name,
                            "pressure_analysis": pressure_result,
                            "flow_analysis": flow_result,
                            "integrity_score": new_score,
                            "leak_status": pipeline.leak_status,
                            "findings": findings,
                        },
                    })

    except WebSocketDisconnect:
        active_connections.pop(user_id, None)
    except Exception:
        active_connections.pop(user_id, None)
