import json
import fitz  # PyMuPDF
from typing import Dict, List

from ai.analyzer_v4.geometry_extractor import extract_geometry
from ai.analyzer_v4.text_extractor import extract_text
from ai.analyzer_v4.vision_analyzer import analyze_regions_with_vision
from ai.analyzer_v4.issue_detector import detect_rule_based_issues, merge_issues
from ai.analyzer_v4.coordinate_mapper import map_issues_to_heatmap


def analyze(file_path: str) -> Dict:
    doc = fitz.open(file_path)
    pages_output = []

    for page_index in range(len(doc)):
        geom = extract_geometry(doc, page_index)
        text = extract_text(doc, page_index)

        # Vision analysis placeholder: no actual cropping; pass metadata
        regions = [{"page": page_index + 1, "bbox": geom.get("bbox")}]
        vision = analyze_regions_with_vision(regions, "\n".join([b.get("text", "") for b in text.get("blocks", [])][:100]))

        issues = merge_issues(
            detect_rule_based_issues(geom, text),
            [],  # vision-based issues could be added here
        )

        heatmap = map_issues_to_heatmap(issues, geom.get("bbox"))
        # attach normalized centers to issues for downstream RFI generation
        if geom.get("bbox"):
            for issue in issues:
                if issue.get("bbox"):
                    norm_heat = map_issues_to_heatmap([issue], geom.get("bbox"))
                    if norm_heat:
                        issue["x"] = norm_heat[0].get("x")
                        issue["y"] = norm_heat[0].get("y")

        pages_output.append({
            "page": page_index + 1,
            "geometry": geom,
            "text": text,
            "vision": vision,
            "issues": issues,
            "heatmap": heatmap,
        })

    return {"pages": pages_output}
