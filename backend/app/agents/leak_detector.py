import math
import random


def analyze_pressure_drop(current_pressure: float, previous_pressure: float, max_pressure: float) -> dict:
    if previous_pressure == 0:
        drop_pct = 0
    else:
        drop_pct = ((previous_pressure - current_pressure) / previous_pressure) * 100

    severity = "low"
    if drop_pct > 30:
        severity = "critical"
    elif drop_pct > 15:
        severity = "high"
    elif drop_pct > 5:
        severity = "medium"

    leak_detected = drop_pct > 15

    return {
        "drop_percentage": round(drop_pct, 2),
        "severity": severity,
        "leak_detected": leak_detected,
        "message": f"Pressure drop of {drop_pct:.1f}% detected"
    }


def analyze_flow_anomaly(flow_rate: float, pipeline_diameter: float, pressure: float) -> dict:
    area = math.pi * (pipeline_diameter / 2000) ** 2
    expected_velocity = math.sqrt(2 * pressure * 100000 / 1000)
    expected_flow = expected_velocity * area * 1000

    if expected_flow == 0:
        deviation = 0
    else:
        deviation = ((flow_rate - expected_flow) / expected_flow) * 100

    anomaly = abs(deviation) > 20

    return {
        "expected_flow": round(expected_flow, 2),
        "actual_flow": round(flow_rate, 2),
        "deviation_percentage": round(deviation, 2),
        "anomaly_detected": anomaly,
        "message": f"Flow deviation of {deviation:.1f}% from expected"
    }


def calculate_integrity(pressure_stability: float, flow_consistency: float, days_online: int) -> int:
    score = 100

    score -= max(0, (100 - pressure_stability) * 0.3)
    score -= max(0, (100 - flow_consistency) * 0.3)

    if days_online < 30:
        score -= 10
    elif days_online > 365:
        score += 5

    age_factor = min(days_online / 365, 10)
    score -= age_factor * 0.5

    return max(0, min(100, round(score)))


def generate_pipeline_report(name: str, score: int, findings: list) -> str:
    status = "EXCELLENT" if score >= 90 else "GOOD" if score >= 70 else "FAIR" if score >= 50 else "POOR"
    report = f"Pipeline Report: {name}\n"
    report += f"Integrity Score: {score}/100 - {status}\n"
    report += f"Findings ({len(findings)}):\n"
    for f in findings:
        report += f"  - {f}\n"
    return report
