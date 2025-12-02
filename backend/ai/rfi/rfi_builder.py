from typing import Dict, List, Optional


class RFIBuilder:
    """Builds structured RFI payloads."""

    def __init__(self, file_meta: Dict, issues: List[Dict], heatmap: List[Dict], ocr_pages: Optional[List[Dict]] = None):
        self.file_meta = file_meta
        self.issues = issues
        self.heatmap = heatmap
        self.ocr_pages = ocr_pages or []

    def _find_bbox_for_issue(self, issue: Dict) -> Optional[List]:
        for hm in self.heatmap or []:
            if hm.get("page") == issue.get("page") and hm.get("bbox"):
                return hm["bbox"]
        return issue.get("bbox")

    def build(self, issue: Dict, llm_result: Dict, rfi_number: str, references: Optional[List[str]] = None) -> Dict:
        bbox = self._find_bbox_for_issue(issue) or issue.get("bbox")
        return {
            "id": "generated",
            "rfi_number": rfi_number,
            "title": llm_result.get("title") or issue.get("message") or "Request for Information",
            "issue_type": issue.get("type") or issue.get("severity") or "info",
            "page": issue.get("page") or 1,
            "bbox": bbox,
            "issue_summary": llm_result.get("issue_summary") or llm_result.get("description") or issue.get("message") or "",
            "drawing_reference": llm_result.get("drawing_reference") or (references[0] if references else None),
            "description": llm_result.get("description") or issue.get("message") or "",
            "question": llm_result.get("question") or "",
            "required_information": llm_result.get("required_information") or "",
            "recommendation": llm_result.get("recommendation") or "",
            "possible_causes": llm_result.get("possible_causes") or [],
            "required_from_engineer": llm_result.get("required_from_engineer") or "",
            "attachments": [{"page": issue.get("page") or 1, "bbox": bbox, "type": "heatmap"}],
        }
