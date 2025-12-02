from typing import Dict, List

try:
    import cv2  # type: ignore
    import numpy as np  # type: ignore
except ImportError:
    cv2 = None
    np = None


def _detect_lines(gray):
    lines = []
    detected = cv2.HoughLinesP(gray, 1, np.pi / 180, threshold=80, minLineLength=50, maxLineGap=10)
    if detected is not None:
        for x1, y1, x2, y2 in detected[:, 0]:
            lines.append({"p1": [int(x1), int(y1)], "p2": [int(x2), int(y2)]})
    return lines


def _detect_rectangles(contours):
    rects = []
    for cnt in contours:
        approx = cv2.approxPolyDP(cnt, 0.02 * cv2.arcLength(cnt, True), True)
        if len(approx) == 4 and cv2.contourArea(approx) > 1000:
            pts = approx.reshape(4, 2).tolist()
            rects.append({"points": pts})
    return rects


def _detect_circles(gray):
    circles_out = []
    circles = cv2.HoughCircles(gray, cv2.HOUGH_GRADIENT, dp=1.2, minDist=20, param1=50, param2=30, minRadius=5, maxRadius=100)
    if circles is not None:
        circles = np.round(circles[0, :]).astype("int")
        for (x, y, r) in circles:
            circles_out.append({"center": [int(x), int(y)], "radius": int(r)})
    return circles_out


def detect_geometry(image_path: str, page: int) -> Dict:
    """Detect basic geometry primitives on a page image."""
    if cv2 is None or np is None:
        return {"page": page, "lines": [], "rectangles": [], "circles": [], "arrows": [], "dimensions_graphics": []}

    img = cv2.imread(image_path, cv2.IMREAD_COLOR)
    if img is None:
        return {"page": page, "lines": [], "rectangles": [], "circles": [], "arrows": [], "dimensions_graphics": []}

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 50, 150, apertureSize=3)

    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    return {
        "page": page,
        "lines": _detect_lines(edges),
        "rectangles": _detect_rectangles(contours),
        "circles": _detect_circles(gray),
        "arrows": [],  # Placeholder for arrow/leader detection
        "dimensions_graphics": [],  # Placeholder for dimension line grouping
    }
