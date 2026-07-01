class RefineryAgent:
    NORMAL_RANGES = {
        "atmospheric_distillation": {"temp_min": 300, "temp_max": 400, "pressure_min": 1.0, "pressure_max": 3.0},
        "vacuum_distillation": {"temp_min": 350, "temp_max": 450, "pressure_min": 0.1, "pressure_max": 0.5},
        "catalytic_cracker": {"temp_min": 480, "temp_max": 550, "pressure_min": 1.5, "pressure_max": 3.5},
        "hydrocracker": {"temp_min": 300, "temp_max": 450, "pressure_min": 80, "pressure_max": 200},
        "reformer": {"temp_min": 490, "temp_max": 530, "pressure_min": 5, "pressure_max": 50},
        "alkylation": {"temp_min": 10, "temp_max": 40, "pressure_min": 3, "pressure_max": 10},
        "coker": {"temp_min": 480, "temp_max": 520, "pressure_min": 1, "pressure_max": 5},
        "hydrotreater": {"temp_min": 300, "temp_max": 400, "pressure_min": 30, "pressure_max": 100},
    }

    def analyze_unit_health(self, temperature: float, pressure: float, unit_type: str) -> dict:
        ranges = self.NORMAL_RANGES.get(unit_type)
        if not ranges:
            return {"healthy": True, "issue": "unknown unit type", "message": "Cannot validate unknown unit type"}
        issues = []
        if temperature < ranges["temp_min"] or temperature > ranges["temp_max"]:
            issues.append(f"Temperature {temperature}°C outside normal range ({ranges['temp_min']}-{ranges['temp_max']}°C)")
        if pressure < ranges["pressure_min"] or pressure > ranges["pressure_max"]:
            issues.append(f"Pressure {pressure} outside normal range ({ranges['pressure_min']}-{ranges['pressure_max']})")
        if issues:
            return {"healthy": False, "issue": "; ".join(issues), "message": "Unit parameters outside normal operating ranges"}
        return {"healthy": True, "issue": "", "message": "Unit operating within normal parameters"}

    def calculate_efficiency(self, temperature: float, pressure: float, feed_rate: float, product_yield: float) -> int:
        if feed_rate <= 0:
            return 0
        yield_ratio = min(product_yield / feed_rate, 1.0)
        temp_factor = max(0, 1.0 - abs(temperature - 400) / 400)
        press_factor = max(0, 1.0 - abs(pressure - 50) / 200)
        efficiency = int((yield_ratio * 0.5 + temp_factor * 0.25 + press_factor * 0.25) * 100)
        return max(0, min(100, efficiency))

    def detect_upset(self, temperature_trend: list[float], pressure_trend: list[float]) -> dict:
        upset = False
        reasons = []
        if len(temperature_trend) >= 3:
            temp_change = temperature_trend[-1] - temperature_trend[0]
            if abs(temp_change) > 50:
                upset = True
                reasons.append(f"Temperature swing of {temp_change:.1f}°C detected")
        if len(pressure_trend) >= 3:
            press_change = pressure_trend[-1] - pressure_trend[0]
            if abs(press_change) > 20:
                upset = True
                reasons.append(f"Pressure swing of {press_change:.1f} detected")
        return {"upset": upset, "reasons": reasons, "severity": "high" if upset else "none"}

    def generate_unit_report(self, unit_name: str, efficiency: int, findings: list[str]) -> str:
        header = f"=== Refinery Unit Report: {unit_name} ===\n"
        eff_line = f"Efficiency: {efficiency}%\n"
        status_emoji = "GOOD" if efficiency >= 70 else "WARNING" if efficiency >= 40 else "CRITICAL"
        findings_text = "\n".join(f"- {f}" for f in findings) if findings else "No significant findings"
        return f"{header}{eff_line}Status: {status_emoji}\nFindings:\n{findings_text}"
