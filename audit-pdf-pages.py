#!/usr/bin/env python3
"""Run Gemini vision audit on PDF photo pages against DESIGN_TRUTH."""
import google.generativeai as genai
import time, os

genai.configure(api_key="AIzaSyCXFxiB_XOreBLplAWwNKiHIn9I2Uyitrs")
model = genai.GenerativeModel("gemini-2.5-flash")

DESIGN_TRUTH_EXCERPT = """
KEY DESIGN_TRUTH PRINCIPLES FOR PDF DESIGN AUDIT:

1. TYPOGRAPHY HIERARCHY: Clear 3-level type hierarchy (Display → H1 → Body). Max 2 font families.
2. 60-30-10 COLOR RULE: 60% dominant (background), 30% secondary (text/structure), 10% accent (brand red #E8000D).
3. NEGATIVE SPACE: 40-60% content area. Generous whitespace. Elements need breathing room.
4. COMPOSITION: Rule of thirds, intentional placement, visual weight balance.
5. DEPTH & TEXTURE: Layered depth — gradients, shadows, grain, atmosphere. NOT flat.
6. CONTRAST & READABILITY: Text must be immediately legible. Background images need sufficient overlay for text contrast.
7. VISUAL VARIETY within brand consistency: Each page should feel distinct yet part of the same system.
8. THE "GUT TEST": Professional judges form opinion in 2-3 seconds. If a frame doesn't immediately communicate quality, it fails.
9. WHAT SEPARATES PRO FROM AMATEUR: Designed illustrations > geometric primitives. Sophisticated timing. Every design choice serves narrative.
10. BRAND IDENTITY: ICG brand — #E8000D red accent, Space Grotesk headings, Inter body, dark/light contrast.
11. EDITORIAL MAGAZINE STANDARD: These are section-opener pages with full-page photography backgrounds. They should feel like Esquire, GQ, or National Geographic editorial spreads.
12. RESTRAINT PRINCIPLE: One strong placement > three weak ones. Less is more.
"""

pages = {
    "Page 1 — Cover (1920s Factory)": "/Users/claudiabot/.openclaw/media/pdf-page-1.png",
    "Page 4 — Camera Intelligence Opener (1910s Box Camera)": "/Users/claudiabot/.openclaw/media/pdf-page-4.png",
    "Page 16 — Techniques Opener (1960s Darkroom)": "/Users/claudiabot/.openclaw/media/pdf-page-16.png",
    "Page 22 — CTA Bookend (1920s Factory reuse)": "/Users/claudiabot/.openclaw/media/pdf-page-22.png",
}

AUDIT_PROMPT = """You are a professional design auditor evaluating PDF pages against the DESIGN_TRUTH standards below.

{design_truth}

ANALYZE THIS PAGE: "{page_name}"

Score each criterion 1-10 and provide specific, actionable feedback:

1. **Typography & Hierarchy** (1-10): Is the type hierarchy clear? Are fonts readable over the background? Size ratios appropriate?
2. **Color & Contrast** (1-10): Is the overlay opacity right — can you read ALL text easily? Does the image show through enough to be impactful, or is it too dark/too light?
3. **Composition & Layout** (1-10): Is the text placement intentional? Does it use rule of thirds? Is there sufficient negative space?
4. **Image-Text Integration** (1-10): Does the background image enhance the content or fight it? Does it feel like an editorial magazine spread?
5. **Brand Consistency** (1-10): Does it feel like the same brand system as the other pages? ICG red accent used appropriately?
6. **The Gut Test** (1-10): In 2-3 seconds, does this page communicate professional quality?
7. **Period Authenticity** (1-10): Does the vintage photography feel genuinely from the era, or does it look like modern AI-generated "vintage style"?

OVERALL SCORE: /10
TOP 3 ISSUES (most critical first):
WHAT'S WORKING WELL:
"""

results = []
for page_name, img_path in pages.items():
    print(f"\n{'='*60}")
    print(f"Analyzing: {page_name}")
    print('='*60)
    
    img_file = genai.upload_file(img_path)
    while img_file.state.name != 'ACTIVE':
        time.sleep(1)
        img_file = genai.get_file(img_file.name)
    
    prompt = AUDIT_PROMPT.format(design_truth=DESIGN_TRUTH_EXCERPT, page_name=page_name)
    response = model.generate_content(
        [img_file, prompt],
        generation_config=genai.types.GenerationConfig(
            temperature=0.4,
            max_output_tokens=2048
        )
    )
    
    print(response.text)
    results.append(f"## {page_name}\n\n{response.text}")
    time.sleep(2)

# Save full report
report = "# PDF Photo Pages — Design Audit (Gemini Vision)\n\n" + "\n\n---\n\n".join(results)
with open("/Users/claudiabot/clawd-pixel/docs/PDF_PHOTO_PAGES_AUDIT.md", "w") as f:
    f.write(report)
print(f"\n\n✅ Full report saved to docs/PDF_PHOTO_PAGES_AUDIT.md")
