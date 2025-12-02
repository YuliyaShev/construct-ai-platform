def analyze_image(file_bytes: bytes, content_type: str, client):
    """Analyze architectural drawing images with OpenAI."""
    valid_types = ["image/jpeg", "image/png", "image/heic", "image/jpg", "image/webp", "image/heif"]
    if content_type not in valid_types:
        raise ValueError("Only image files are allowed.")

    prompt = """
You are an expert in reading architectural and shop drawings.
Analyze this IMAGE (photo or scan) and extract:

1. All text labels
2. Dimensions (mm, inches, fractions)
3. Materials (steel, aluminum, glass, wood, concrete)
4. Profiles (HSS, angles, channels, tubes, bars)
5. Components (posts, rails, brackets, anchors)
6. Drawing type (plan / section / elevation / detail)
7. Issues and conflicts
8. Build-of-Materials (BOM)
9. Recommended RFIs

Return JSON in this exact structure:

{
  "drawing_type": "",
  "dimensions": [...],
  "materials": [...],
  "components": [...],
  "bom": {
     "steel": [...],
     "aluminum": [...],
     "glass": [...],
     "wood": [...],
     "mechanical": [...],
     "electrical": [...],
     "plumbing": [...],
     "misc": [...]
  },
  "issues": [...],
  "rfi_to_generate": [...],
  "notes": "..."
}
"""

    response = client.responses.create(
        model="gpt-4.1",
        input=[
            {
                "role": "user",
                "content": [
                    {"type": "input_image", "image": file_bytes},
                    {"type": "text", "text": prompt}
                ]
            }
        ],
        response_format={"type": "json_object"}
    )

    return response.output_json
