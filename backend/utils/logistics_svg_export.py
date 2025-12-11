import os


def export_logistics_svg(data: dict, output_path: str):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    boundary = data.get("boundary", {"x": 0, "y": 0, "width": 200, "height": 150})
    crane = data.get("crane", {})
    laydowns = data.get("laydown_areas", [])
    safety = data.get("safety_zones", [])
    routes = data.get("truck_routes", [])

    svg = [
        f'<svg width="800" height="600" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">',
        f'<rect x="{boundary["x"]}" y="{boundary["y"]}" width="{boundary["width"]}" height="{boundary["height"]}" fill="none" stroke="#111" stroke-width="1.5" />',
    ]
    if crane:
        cx, cy = crane.get("location", {}).get("x", 0), crane.get("location", {}).get("y", 0)
        r = crane.get("max_radius_m", 0) * 0.5
        svg.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="rgba(255,0,0,0.08)" stroke="#ef4444" stroke-width="1" />')
        svg.append(f'<circle cx="{cx}" cy="{cy}" r="2" fill="#ef4444" />')
    for ld in laydowns:
        svg.append(
            f'<rect x="{ld["x"]}" y="{ld["y"]}" width="{ld["width"]}" height="{ld["height"]}" fill="rgba(96,165,250,0.3)" stroke="#1d4ed8" />'
        )
    for s in safety:
        svg.append(f'<rect x="{s["x"]}" y="{s["y"]}" width="{s["width"]}" height="{s["height"]}" fill="rgba(248,113,113,0.2)" />')
    for route in routes:
        pts = " ".join([f'{p["x"]},{p["y"]}' for p in route.get("path", [])])
        svg.append(f'<polyline points="{pts}" fill="none" stroke="#10b981" stroke-width="1" />')
    svg.append("</svg>")
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(svg))
