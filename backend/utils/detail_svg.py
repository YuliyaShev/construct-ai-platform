from typing import Dict


def build_detail_svg(detail_type: str, params: Dict) -> str:
    width = 400
    height = 300
    ft = params.get("frame_thickness", 50)
    gt = params.get("glass_thickness", 28)
    embed = params.get("embed_depth", 100)
    svg = f"""
<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
  <rect x="50" y="50" width="{ft}" height="{embed}" fill="#e5e7eb" stroke="#111827" stroke-width="2"/>
  <rect x="{50+ft}" y="{60}" width="{gt}" height="{embed-20}" fill="#93c5fd" stroke="#2563eb" stroke-width="1.5"/>
  <line x1="40" y1="{50+embed}" x2="{120+gt}" y2="{50+embed}" stroke="#111827" stroke-width="2"/>
  <text x="50" y="40" font-size="12" fill="#111827">{detail_type}</text>
  <text x="20" y="{50+embed+15}" font-size="10" fill="#111827">Embed depth: {embed} mm</text>
  <text x="{50+ft+gt+10}" y="{60+gt}" font-size="10" fill="#2563eb">Glass {gt} mm</text>
</svg>
""".strip()
    return svg
