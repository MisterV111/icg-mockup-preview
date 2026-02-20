#!/usr/bin/env python3
"""
Generate: "Generate Better AI Images in Minutes: The Prompt Engineering Toolkit"
ICG Lead Magnet PDF — companion guide for the Image Prompt Engineer skill.

Design standards: DESIGN_TRUTH.md compliant
- 60-30-10 color rule (white bg 60%, dark text 30%, red accent 10%)
- Clear 3-level type hierarchy (Display → H1 → H2 → Body)
- Generous negative space (40-60% content area)
- Colored accent elements for visual interest
- Consistent brand identity throughout
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch, mm
from reportlab.lib.colors import HexColor, white, black, Color
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, Image as RLImage, Flowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.platypus.flowables import HRFlowable
from reportlab.graphics.shapes import Drawing, Rect, Line, Circle
from reportlab.graphics import renderPDF
import os

# ── Brand Colors (from ICG design tokens) ──
RED = HexColor("#E8000D")
RED_LIGHT = HexColor("#FFF0F0")
RED_DARK = HexColor("#B8000A")
DARK = HexColor("#0A0A0A")
SURFACE = HexColor("#111111")
NEAR_BLACK = HexColor("#1A1A1A")
CHARCOAL = HexColor("#2A2A2A")
MID_GRAY = HexColor("#555555")
TEXT_SECONDARY = HexColor("#666666")
LIGHT_GRAY = HexColor("#999999")
BORDER_GRAY = HexColor("#E0E0E0")
LIGHT_BG = HexColor("#F7F7F7")
WARM_BG = HexColor("#FAFAFA")
PAGE_BG = HexColor("#FFFFFF")
WHITE = HexColor("#FFFFFF")

OUTPUT_PATH = "assets/downloads/prompt-engineering-toolkit-2026.pdf"
LOGO_PATH = "images/logo.png"

os.makedirs("assets/downloads", exist_ok=True)

PAGE_W, PAGE_H = letter  # 612 x 792
MARGIN_L = 0.9 * inch
MARGIN_R = 0.9 * inch
MARGIN_T = 0.75 * inch
MARGIN_B = 0.7 * inch
CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R


# ── Custom Flowables ──

class AccentBar(Flowable):
    """A thin colored accent bar — visual punctuation."""
    def __init__(self, width=40, height=3, color=RED):
        Flowable.__init__(self)
        self.bar_width = width
        self.bar_height = height
        self.bar_color = color
        self.width = width
        self.height = height + 4

    def draw(self):
        self.canv.setFillColor(self.bar_color)
        self.canv.roundRect(0, 2, self.bar_width, self.bar_height, 1.5, fill=1, stroke=0)


class AccentBarCentered(Flowable):
    """Centered accent bar."""
    def __init__(self, bar_width=50, height=3, color=RED, page_width=CONTENT_W):
        Flowable.__init__(self)
        self.bar_width = bar_width
        self.bar_height = height
        self.bar_color = color
        self.width = page_width
        self.height = height + 6

    def draw(self):
        x = (self.width - self.bar_width) / 2
        self.canv.setFillColor(self.bar_color)
        self.canv.roundRect(x, 3, self.bar_width, self.bar_height, 1.5, fill=1, stroke=0)


class SectionDivider(Flowable):
    """Full-width subtle divider line."""
    def __init__(self, width=CONTENT_W, color=BORDER_GRAY):
        Flowable.__init__(self)
        self.line_width = width
        self.line_color = color
        self.width = width
        self.height = 16

    def draw(self):
        self.canv.setStrokeColor(self.line_color)
        self.canv.setLineWidth(0.5)
        self.canv.line(0, 8, self.line_width, 8)


class ModelCard(Flowable):
    """A model card with left accent bar — visual container for each model."""
    def __init__(self, content_flowables, accent_color=RED, width=CONTENT_W):
        Flowable.__init__(self)
        self.content = content_flowables
        self.accent_color = accent_color
        self.card_width = width

    # ModelCard is complex — we'll use simpler approach with tables instead


# ── Document Setup ──
doc = SimpleDocTemplate(
    OUTPUT_PATH,
    pagesize=letter,
    topMargin=MARGIN_T,
    bottomMargin=MARGIN_B,
    leftMargin=MARGIN_L,
    rightMargin=MARGIN_R,
)

# ── Typography System ──
# Following DESIGN_TRUTH: clear hierarchy, max 2 families, size ratio ~1.5x between levels
# Helvetica family only (built into reportlab, clean sans-serif)

styles = getSampleStyleSheet()

# Display — Cover title (largest, most impact)
s_display = ParagraphStyle(
    "Display", parent=styles["Title"],
    fontName="Helvetica-Bold", fontSize=32, leading=38,
    textColor=NEAR_BLACK, alignment=TA_CENTER, spaceAfter=0,
)

# H1 — Section titles
s_h1 = ParagraphStyle(
    "H1", parent=styles["Heading1"],
    fontName="Helvetica-Bold", fontSize=24, leading=30,
    textColor=NEAR_BLACK, spaceBefore=0, spaceAfter=6,
)

# H2 — Subsection titles
s_h2 = ParagraphStyle(
    "H2", parent=styles["Heading2"],
    fontName="Helvetica-Bold", fontSize=16, leading=21,
    textColor=NEAR_BLACK, spaceBefore=16, spaceAfter=6,
)

# H3 — Minor headings
s_h3 = ParagraphStyle(
    "H3", parent=styles["Heading3"],
    fontName="Helvetica-Bold", fontSize=12, leading=16,
    textColor=CHARCOAL, spaceBefore=12, spaceAfter=4,
)

# Body — Primary reading text
s_body = ParagraphStyle(
    "Body", parent=styles["Normal"],
    fontName="Helvetica", fontSize=10.5, leading=16.5,
    textColor=MID_GRAY, spaceAfter=8,
)

# Body emphasis
s_body_bold = ParagraphStyle(
    "BodyBold", parent=s_body,
    fontName="Helvetica-Bold", textColor=CHARCOAL,
)

# Small — Captions, secondary info
s_small = ParagraphStyle(
    "Small", parent=s_body,
    fontSize=9, leading=13.5, textColor=LIGHT_GRAY,
)

# Bullet points
s_bullet = ParagraphStyle(
    "Bullet", parent=s_body,
    leftIndent=16, bulletIndent=4, spaceAfter=4,
)

# Red label — category/section tag
s_label = ParagraphStyle(
    "Label", parent=styles["Normal"],
    fontName="Helvetica-Bold", fontSize=9, leading=12,
    textColor=RED, spaceBefore=0, spaceAfter=2,
    tracking=120,  # wide tracking for labels
)

# Center aligned
s_center = ParagraphStyle("Center", parent=s_body, alignment=TA_CENTER)
s_center_bold = ParagraphStyle("CenterBold", parent=s_body_bold, alignment=TA_CENTER)

# Cover subtitle
s_cover_sub = ParagraphStyle(
    "CoverSub", parent=styles["Normal"],
    fontName="Helvetica", fontSize=13, leading=19,
    textColor=TEXT_SECONDARY, alignment=TA_CENTER,
)

# Cover toolkit line
s_cover_toolkit = ParagraphStyle(
    "CoverToolkit", parent=styles["Normal"],
    fontName="Helvetica-Bold", fontSize=15, leading=20,
    textColor=RED, alignment=TA_CENTER,
)

# Footer
s_footer = ParagraphStyle(
    "Footer", parent=styles["Normal"],
    fontName="Helvetica", fontSize=7.5, leading=10,
    textColor=LIGHT_GRAY, alignment=TA_CENTER,
)

# Pro tip style (italic, slightly indented)
s_tip = ParagraphStyle(
    "Tip", parent=s_body,
    fontName="Helvetica-Oblique", fontSize=10, leading=15,
    leftIndent=12, rightIndent=12,
    textColor=TEXT_SECONDARY,
    spaceBefore=6, spaceAfter=8,
)

# ── Helpers ──
def spacer(h=0.2):
    return Spacer(1, h * inch)

def accent_bar(w=45):
    return AccentBar(width=w)

def accent_bar_center(w=50):
    return AccentBarCentered(bar_width=w)

def divider():
    return SectionDivider()

def section_label(text):
    return Paragraph(text.upper(), s_label)

def table_style_clean(header_bg=RED, header_text=WHITE):
    """Consistent table styling throughout."""
    return TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), header_bg),
        ("TEXTCOLOR", (0, 0), (-1, 0), header_text),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 9),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 1), (-1, -1), 9),
        ("FONTNAME", (0, 1), (0, -1), "Helvetica-Bold"),
        ("BACKGROUND", (0, 1), (-1, -1), LIGHT_BG),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [LIGHT_BG, WHITE]),
        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("GRID", (0, 0), (-1, -1), 0.5, BORDER_GRAY),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ])


def model_section(num, name, maker, best_for, strengths, copy_paste, api_providers, price, pro_tip):
    """Build a model section with consistent visual structure."""
    elems = []
    elems.append(section_label(f"MODEL {num} OF 6"))
    elems.append(Paragraph(name, s_h2))
    elems.append(Paragraph(f"by {maker}", s_small))
    elems.append(spacer(0.08))
    elems.append(Paragraph(f"<b>Best for:</b> {best_for}", s_body))
    elems.append(spacer(0.06))

    # Strengths
    elems.append(Paragraph("<b>Key Strengths</b>", s_h3))
    for s in strengths:
        elems.append(Paragraph(f"\u2022  {s}", s_bullet))
    elems.append(spacer(0.08))

    # Where to generate — two-column table
    gen_data = [["Copy-Paste (Web UI)", "API (Automation)"]]
    max_rows = max(len(copy_paste), len(api_providers))
    for i in range(max_rows):
        cp = copy_paste[i] if i < len(copy_paste) else ""
        ap = api_providers[i] if i < len(api_providers) else ""
        gen_data.append([cp, ap])

    gen_table = Table(gen_data, colWidths=[CONTENT_W * 0.48, CONTENT_W * 0.48])
    gen_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), CHARCOAL),
        ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 8.5),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 1), (-1, -1), 8.5),
        ("BACKGROUND", (0, 1), (-1, -1), LIGHT_BG),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [LIGHT_BG, WARM_BG]),
        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.5, BORDER_GRAY),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
    ]))
    elems.append(gen_table)
    elems.append(spacer(0.1))

    # Price
    elems.append(Paragraph(f"<b>Price:</b>  {price}", s_body))
    elems.append(spacer(0.06))

    # Pro tip — visually distinct
    elems.append(Paragraph(f"\u2728  {pro_tip}", s_tip))
    elems.append(divider())
    elems.append(spacer(0.1))
    # Wrap entire model section in KeepTogether so it never splits across pages
    return [KeepTogether(elems)]


# ══════════════════════════════════════════════
#  BUILD STORY
# ══════════════════════════════════════════════
story = []

# ═══════════════════════════════════════
# PAGE 1: COVER
# ═══════════════════════════════════════
story.append(spacer(1.2))
if os.path.exists(LOGO_PATH):
    story.append(RLImage(LOGO_PATH, width=1.4*inch, height=1.4*inch, hAlign="CENTER"))
    story.append(spacer(0.4))

story.append(accent_bar_center(60))
story.append(spacer(0.2))
story.append(Paragraph("One Skill From Our Pipeline.<br/>Yours Free.", s_display))
story.append(spacer(0.15))
story.append(Paragraph("The Prompt Engineering Toolkit", s_cover_toolkit))
story.append(spacer(0.35))
story.append(Paragraph("A practical guide for agencies and creative teams.", s_cover_sub))
story.append(spacer(0.08))
story.append(Paragraph("6 AI Models  \u00b7  Film Stocks & Lenses  \u00b7  Anti-AI Realism", s_cover_sub))
story.append(spacer(2.0))
story.append(accent_bar_center(30))
story.append(spacer(0.1))
story.append(Paragraph("inspiredcreativegroupinc.com", ParagraphStyle(
    "CoverURL", parent=s_center, fontName="Helvetica-Bold", fontSize=9.5, textColor=RED,
)))
story.append(PageBreak())

# ═══════════════════════════════════════
# PAGE 2: WHAT'S INSIDE
# ═══════════════════════════════════════
story.append(section_label("WHAT'S INSIDE"))
story.append(spacer(0.05))
story.append(Paragraph("This Toolkit", s_h1))
story.append(accent_bar())
story.append(spacer(0.15))

story.append(Paragraph(
    "This guide and the <b>Image Prompt Engineer</b> skill work together. "
    "The skill teaches AI to think like a photographer\u200a\u2014\u200athe guide tells you what to aim at.", s_body
))
story.append(spacer(0.15))

# Two-column explanation
toolkit_data = [
    [
        Paragraph("<b>\U0001f527  The Skill</b>", ParagraphStyle("", parent=s_body, textColor=NEAR_BLACK)),
        Paragraph("<b>\U0001f4d6  This Guide</b>", ParagraphStyle("", parent=s_body, textColor=NEAR_BLACK)),
    ],
    [
        Paragraph(
            "Transforms plain English into production-ready prompts "
            "using real photography knowledge\u200a\u2014\u200afilm stocks, lens focal lengths, "
            "lighting setups, and anti-AI realism techniques mapped across "
            "6 models. Includes quality scoring and per-model optimization.", s_body
        ),
        Paragraph(
            "Covers which model to use, when, and why. "
            "Where to generate\u200a\u2014\u200afrom free web UIs to API pipelines. "
            "The photography intelligence that powers the skill. "
            "Plus techniques that make an immediate difference.", s_body
        ),
    ],
]
toolkit_table = Table(toolkit_data, colWidths=[CONTENT_W * 0.48, CONTENT_W * 0.48], spaceBefore=0)
toolkit_table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), LIGHT_BG),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("TOPPADDING", (0, 0), (-1, -1), 10),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ("LEFTPADDING", (0, 0), (-1, -1), 12),
    ("RIGHTPADDING", (0, 0), (-1, -1), 12),
    ("GRID", (0, 0), (-1, -1), 0.5, BORDER_GRAY),
    ("LINEBELOW", (0, 0), (-1, 0), 1, RED),
]))
story.append(toolkit_table)
story.append(spacer(0.2))

# How they work together
story.append(Paragraph("<b>How they work together:</b>", s_body_bold))
story.append(spacer(0.06))
steps = [
    "Describe the image you want in plain English.",
    "The skill optimizes your prompt for the best model.",
    "Take the output to any generation service\u200a\u2014\u200aweb UI or API.",
    "This guide helps you pick the right model and service for your workflow.",
]
for i, step in enumerate(steps, 1):
    story.append(Paragraph(
        f'<font color="{RED.hexval()}">{i}.</font>  {step}', s_bullet
    ))
story.append(spacer(0.15))
story.append(Paragraph(
    "The skill does <b>not</b> generate images\u200a\u2014\u200ait engineers the best possible prompt. "
    "You\u2019re never locked into a single provider.", s_body
))
story.append(PageBreak())

# ═══════════════════════════════════════
# PAGE 3: WHY THESE 6 MODELS
# ═══════════════════════════════════════
story.append(section_label("MODEL SELECTION"))
story.append(spacer(0.05))
story.append(Paragraph("Why These 6 Models", s_h1))
story.append(accent_bar())
story.append(spacer(0.15))

story.append(Paragraph(
    "We evaluated dozens of AI image generators across photorealism, text rendering, "
    "design quality, speed, resolution, editing, and price. These 6 cover every "
    "professional use case\u200a\u2014\u200ano gaps, no redundancy.", s_body
))
story.append(spacer(0.15))

why_data = [
    ["Model", "What It Covers"],
    ["Flux 2", "Photorealism, multi-reference consistency, detailed scenes"],
    ["Nano Banana Pro", "High-resolution (up to 4K), general purpose, natural language"],
    ["Recraft V4", "Vector/SVG output, design assets, marketing materials"],
    ["Ideogram 3.0", "Text rendering, color-controlled branding, style codes"],
    ["GPT Image 1.5", "Instruction following, conversational editing, iteration"],
    ["Grok Imagine", "Quick aesthetics, budget batch work, phone-screen ratios"],
]
t = Table(why_data, colWidths=[1.5*inch, CONTENT_W - 1.5*inch])
t.setStyle(table_style_clean())
story.append(t)
story.append(spacer(0.2))

story.append(Paragraph(
    "Each model is best-in-class at something no other does as well. "
    "Flux\u00a02 owns photorealism. Recraft\u00a0V4 is the only model producing real SVG vectors. "
    "Ideogram\u00a03.0 leads in text rendering. GPT Image\u00a01.5 is uniquely conversational. "
    "Together: full coverage from $0.02 drafts to production 4K prints.", s_body
))
story.append(PageBreak())

# ═══════════════════════════════════════
# CAMERA & PHOTOGRAPHY INTELLIGENCE
# ═══════════════════════════════════════
story.append(section_label("THE HEADLINE FEATURE"))
story.append(spacer(0.05))
story.append(Paragraph("Camera & Photography Intelligence", s_h1))
story.append(accent_bar())
story.append(spacer(0.15))

story.append(Paragraph(
    "This isn\u2019t prompt templates\u200a\u2014\u200ait\u2019s the same photography knowledge professionals "
    "spend years learning, mapped to 6 AI image models through empirical testing.", s_body
))
story.append(spacer(0.12))

# Film Stocks
story.append(Paragraph("<b>Film Stock Color Science</b>", s_h3))
story.append(spacer(0.04))
story.append(Paragraph(
    "Each film stock shifts AI color rendering in specific, repeatable ways. "
    "The skill maps these to model-specific behavior:", s_body
))
story.append(spacer(0.06))
film_data = [
    ["Film Stock", "Character"],
    ["Kodak Portra 400", "Warm skin tones, creamy highlights, subtle grain"],
    ["CineStill 800T", "Tungsten-balanced, halation glow, neon color shift"],
    ["Fuji Pro 400H", "Cool greens, muted pastels, soft contrast"],
    ["Kodachrome 64", "Punchy saturation, deep reds, dense shadows"],
    ["Ilford HP5", "Classic B&W, rich midtones, visible grain structure"],
]
t_film = Table(film_data, colWidths=[1.6*inch, CONTENT_W - 1.6*inch])
t_film.setStyle(table_style_clean())
story.append(t_film)
story.append(spacer(0.15))

# Lens & Lighting
story.append(Paragraph("<b>Lens Focal Length \u2192 Composition</b>", s_h3))
story.append(spacer(0.04))
lens_items = [
    "24mm wide-angle \u2192 environmental context, dramatic perspective",
    "50mm standard \u2192 natural perspective, documentary feel",
    "85mm portrait \u2192 flattering compression, creamy background separation",
    "135mm telephoto \u2192 strong compression, isolated subjects, cinematic depth",
]
for item in lens_items:
    story.append(Paragraph(f"\u2022  {item}", s_bullet))
story.append(spacer(0.12))

story.append(Paragraph("<b>Camera Body Aesthetic Anchors</b>", s_h3))
story.append(spacer(0.04))
story.append(Paragraph(
    "Naming a camera body shifts the AI\u2019s entire rendering approach:", s_body
))
camera_items = [
    "\u201cHasselblad X2D\u201d \u2192 medium format creaminess, extreme detail",
    "\u201cLeica M6\u201d \u2192 street photography character, rangefinder aesthetic",
    "\u201cFujifilm X-T5\u201d \u2192 warm film-like tones, rich color science",
]
for item in camera_items:
    story.append(Paragraph(f"\u2022  {item}", s_bullet))
story.append(spacer(0.12))

lighting_block = []
lighting_block.append(Paragraph("<b>Professional Lighting Library</b>", s_h3))
lighting_block.append(spacer(0.04))
lighting_block.append(Paragraph(
    "Lighting is the most reliable parameter across ALL 6 models. "
    "The skill includes a full library:", s_body
))
light_items = [
    "Rembrandt \u2014 triangle highlight on cheek, dramatic portraiture",
    "Butterfly \u2014 glamour/beauty, overhead with fill below",
    "Split \u2014 half-face illumination, maximum drama",
    "Rim / edge \u2014 silhouette separation, cinematic depth",
    "Golden hour \u2014 the universal quality booster across every model",
    "Practical \u2014 in-scene light sources (lamps, neon, candles) for authenticity",
]
for item in light_items:
    lighting_block.append(Paragraph(f"\u2022  {item}", s_bullet))
lighting_block.append(spacer(0.12))
lighting_block.append(Paragraph(
    "Every parameter includes a <b>per-model compatibility matrix</b> "
    "(\U0001f7e2/\U0001f7e1/\U0001f534) showing exactly what works on which model\u200a\u2014\u200a"
    "so you never waste a generation on an unsupported feature.", s_body
))
story.append(KeepTogether(lighting_block))

story.append(PageBreak())

# ═══════════════════════════════════════
# ANTI-AI REALISM
# ═══════════════════════════════════════
story.append(section_label("THE DIFFERENTIATOR"))
story.append(spacer(0.05))
story.append(Paragraph("Anti-AI Realism System", s_h1))
story.append(accent_bar())
story.append(spacer(0.15))

story.append(Paragraph(
    "The biggest myth in AI image generation: \u201c8K ultra-detailed hyper-realistic\u201d "
    "makes images look better. The truth? <b>It makes them look more artificial.</b>", s_body
))
story.append(spacer(0.1))

story.append(Paragraph(
    "Real photographs have imperfections. AI images are too perfect\u200a\u2014\u200athat\u2019s how you spot them. "
    "The skill includes per-model realism recipes based on empirical testing:", s_body
))
story.append(spacer(0.1))

story.append(Paragraph("<b>The 4 Realism Levers</b>", s_h3))
story.append(spacer(0.06))
realism_items = [
    ("<b>Imperfection cues</b> \u2014 film grain, uneven lighting, slight chromatic aberration, "
     "dust particles. The #1 realism lever across all models."),
    ("<b>Capture context</b> \u2014 \u201cshot on location\u201d beats \u201cprofessional studio.\u201d "
     "Describing how/where the photo was taken adds authenticity that equipment names don\u2019t."),
    ("<b>Texture-first approach</b> \u2014 prioritize material textures (weathered wood, matte skin, "
     "rough concrete) over global quality keywords. Specific textures = specific realism."),
    ("<b>What-to-avoid guidance</b> \u2014 per-model anti-patterns that waste credits. "
     "No negative prompts on Flux 2. Don\u2019t ignore Ideogram\u2019s style mode selector. "
     "GPT Image\u2019s \u201cstudio polish\u201d trap. Each model has specific pitfalls."),
]
for item in realism_items:
    story.append(Paragraph(f"\u2022  {item}", s_bullet))
    story.append(spacer(0.04))

story.append(spacer(0.1))
story.append(Paragraph(
    "The skill includes <b>copy-paste realism recipes</b> for each of the 6 models\u200a\u2014\u200a"
    "tested combinations that consistently produce images indistinguishable from real photographs.",
    s_body
))
story.append(spacer(0.08))
story.append(Paragraph(
    "\u2728  Based on empirical testing\u200a\u2014\u200aReddit A/B comparisons, official documentation, "
    "and community validation. Not guesswork.", s_tip
))

story.append(PageBreak())

# ═══════════════════════════════════════
# PAGES 4–9: THE 6 MODELS
# ═══════════════════════════════════════
story.append(section_label("THE MODELS"))
story.append(spacer(0.05))
story.append(Paragraph("6 Models, Explained", s_h1))
story.append(accent_bar())
story.append(spacer(0.15))

# ── Model 1: Flux 2 ──
story.extend(model_section(
    num=1,
    name="Flux 2",
    maker="Black Forest Labs",
    best_for="Photorealistic product shots, portraits, detailed scenes, multi-reference consistency",
    strengths=[
        "Best photorealism of any current model\u200a\u2014\u200anatural skin, lighting, materials",
        "32K token prompt context\u200a\u2014\u200amore detail always helps",
        "Up to 10 reference images for character/style consistency across campaigns",
        "Sub-10-second generation (Pro/Flex variants)",
        "Strong text rendering, especially with the Flex variant",
    ],
    copy_paste=[
        "Leonardo.ai",
        "Freepik AI Image Generator",
        "Any interface offering Flux 2",
    ],
    api_providers=[
        "Fal.ai \u2014 ~$0.025/image",
        "BFL.ai (direct) \u2014 ~$0.025/image",
        "Replicate \u2014 usage-based",
    ],
    price="$0.025\u2013$0.05/image depending on variant and provider",
    pro_tip="Enable prompt expansion (on by default)\u200a\u2014\u200athe model enhances your prompt with its own knowledge. For product photography, provide reference images for consistency across an entire catalog.",
))

# ── Model 2: Nano Banana Pro ──
story.extend(model_section(
    num=2,
    name="Nano Banana Pro",
    maker="Google (Gemini 3 Pro Image)",
    best_for="High-resolution output (up to 4K), general purpose, natural language prompting",
    strengths=[
        "Up to 4K resolution\u200a\u2014\u200aideal for large-format prints and gallery work",
        "Simple, conversational prompting\u200a\u2014\u200adescribe naturally, skip the keywords",
        "Google\u2019s multimodal intelligence understands context and composition",
        "Great all-rounder for teams that want one reliable default model",
    ],
    copy_paste=[
        "Google AI Studio (Gemini)",
        "Any Gemini-powered creative tool",
    ],
    api_providers=[
        "Fal.ai \u2014 ~$0.02/image",
        "Google AI API \u2014 direct Gemini access",
    ],
    price="~$0.02/image",
    pro_tip="Write prompts like you\u2019re describing the image to a colleague\u200a\u2014\u200aconversational language outperforms keyword stacking with this model. Use the \u20184K\u2019 resolution tier for anything going to print.",
))

story.append(PageBreak())

# ── Model 3: Recraft V4 ──
story.extend(model_section(
    num=3,
    name="Recraft V4",
    maker="Recraft",
    best_for="Logos, icons, vector graphics (SVG), design assets, marketing materials",
    strengths=[
        "The ONLY model producing real, editable SVG vector files",
        "Outputs: SVG, PNG, JPG, PDF, TIFF, and Lottie animations",
        "Design-forward aesthetic\u200a\u2014\u200aunderstands hierarchy and composition",
        "Exploration mode: multiple design directions from one prompt",
        "Free plan available on recraft.ai",
    ],
    copy_paste=[
        "Recraft.ai \u2014 free web interface",
        "Any tool with Recraft integration",
    ],
    api_providers=[
        "Fal.ai \u2014 pricing TBD",
        "Recraft.ai API \u2014 free plan available",
        "Replicate \u2014 usage-based",
    ],
    price="Free plan available; API pricing varies",
    pro_tip="Use design vocabulary: \u2018balanced composition,\u2019 \u2018cohesive color palette,\u2019 \u2018visual hierarchy.\u2019 Recraft was built for designers and responds to design language better than photography terms.",
))

# ── Model 4: Ideogram 3.0 ──
story.extend(model_section(
    num=4,
    name="Ideogram 3.0",
    maker="Ideogram",
    best_for="Text-in-image rendering, branded content, color-controlled designs, reproducible styles",
    strengths=[
        "Gold standard for text rendering\u200a\u2014\u200asigns, logos, titles, dense typography",
        "Style codes (8-char hex) for exact style reproduction across campaigns",
        "Color palette with hex weights for brand-precise color control",
        "Negative prompts to explicitly exclude unwanted elements",
        "Magic prompt auto-enhancement for quick generation",
    ],
    copy_paste=[
        "Ideogram.ai \u2014 free web interface",
        "ChatGPT (for text-heavy requests)",
        "Any tool with Ideogram integration",
    ],
    api_providers=[
        "Fal.ai \u2014 ~$0.02/image",
        "Ideogram.ai API \u2014 direct",
        "Together.ai",
        "Replicate",
    ],
    price="~$0.02/image; free tier on ideogram.ai",
    pro_tip="Always put text you want rendered in quotes within the prompt\u200a\u2014\u200a\u2018\"SALE 50% OFF\"\u2019. Save your style codes and reuse them across an entire campaign for perfect visual consistency.",
))

story.append(PageBreak())

# ── Model 5: GPT Image 1.5 ──
story.extend(model_section(
    num=5,
    name="GPT Image 1.5",
    maker="OpenAI",
    best_for="Instruction following, multi-turn editing, conversational refinement, concept iteration",
    strengths=[
        "Best instruction following\u200a\u2014\u200aunderstands complex, nuanced directions",
        "Unique multi-turn editing: generate, then refine (\u2018make the sky more orange\u2019)",
        "Broad real-world knowledge\u200a\u2014\u200areferences brands, locations, styles accurately",
        "Three quality tiers: low ($0.009), medium, high ($0.20)\u200a\u2014\u200abudget flexibility",
        "Transparent background support",
    ],
    copy_paste=[
        "ChatGPT \u2014 native, multi-turn editing",
        "OpenAI Playground",
    ],
    api_providers=[
        "OpenAI API \u2014 $0.009\u2013$0.20/image",
    ],
    price="$0.009 (low) to $0.20 (high) per image",
    pro_tip="Structure your first prompt with clearly separate elements\u200a\u2014\u200athis makes follow-up edits easier. \u2018A woman in a red dress, standing in a modern office, with city skyline through windows\u2019 lets you later say \u2018change the dress to blue\u2019 without regenerating everything.",
))

# ── Model 6: Grok Imagine ──
story.extend(model_section(
    num=6,
    name="Grok Imagine",
    maker="xAI",
    best_for="Quick aesthetic images, budget batch work, phone wallpapers, exploration",
    strengths=[
        "Cheapest option at $0.02/image\u200a\u2014\u200agreat for exploration and drafts",
        "Unique phone-screen ratios (19.5:9, 20:9) for mobile content",
        "Fast generation with attractive aesthetic output",
        "Combined image generation + editing in one API family",
    ],
    copy_paste=[
        "Grok (x.ai / X platform)",
        "Any tool with Grok integration",
    ],
    api_providers=[
        "Fal.ai \u2014 $0.02/image",
        "xAI API \u2014 direct access",
    ],
    price="~$0.02/image",
    pro_tip="Focus on mood and aesthetics rather than technical details. Perfect for quick mood boards before committing to a detailed generation with Flux 2 or Ideogram.",
))

story.append(PageBreak())

# ═══════════════════════════════════════
# COMPARISON MATRIX
# ═══════════════════════════════════════
story.append(section_label("AT A GLANCE"))
story.append(spacer(0.05))
story.append(Paragraph("Comparison Matrix", s_h1))
story.append(accent_bar())
story.append(spacer(0.15))

matrix_data = [
    ["", "Flux 2", "Nano\nBanana", "Recraft\nV4", "Ideogram\n3.0", "GPT\nImage", "Grok\nImagine"],
    ["Photo\u00adrealism", "\u2605\u2605\u2605\u2605\u2605", "\u2605\u2605\u2605\u2605", "\u2605\u2605\u2605\u2605", "\u2605\u2605\u2605\u2605", "\u2605\u2605\u2605\u2605", "\u2605\u2605\u2605"],
    ["Text", "\u2605\u2605\u2605\u2605\u2605", "\u2605\u2605\u2605", "\u2605\u2605\u2605\u2605", "\u2605\u2605\u2605\u2605\u2605", "\u2605\u2605\u2605\u2605\u2605", "\u2605\u2605\u2605"],
    ["Speed", "\u2605\u2605\u2605\u2605\u2605", "\u2605\u2605\u2605\u2605", "\u2605\u2605\u2605", "\u2605\u2605\u2605\u2605", "\u2605\u2605\u2605", "\u2605\u2605\u2605\u2605\u2605"],
    ["Max Res", "4MP", "4K", "2048\u00b2", "Varies", "1536px", "Varies"],
    ["SVG", "\u2014", "\u2014", "\u2713", "\u2014", "\u2014", "\u2014"],
    ["Editing", "\u2605\u2605\u2605\u2605", "\u2605", "\u2605", "\u2605\u2605\u2605\u2605", "\u2605\u2605\u2605\u2605\u2605", "\u2605\u2605\u2605"],
    ["Price", "$0.025+", "~$0.02", "Free+", "~$0.02", "$0.009+", "~$0.02"],
]

col_w = [0.85*inch] + [(CONTENT_W - 0.85*inch) / 6] * 6
t2 = Table(matrix_data, colWidths=col_w)
t2.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), NEAR_BLACK),
    ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ("FONTSIZE", (0, 0), (-1, 0), 8),
    ("FONTNAME", (0, 1), (0, -1), "Helvetica-Bold"),
    ("FONTSIZE", (0, 1), (-1, -1), 8),
    ("TEXTCOLOR", (0, 1), (0, -1), CHARCOAL),
    ("BACKGROUND", (0, 1), (-1, -1), LIGHT_BG),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [LIGHT_BG, WARM_BG]),
    ("ALIGN", (1, 0), (-1, -1), "CENTER"),
    ("ALIGN", (0, 0), (0, -1), "LEFT"),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("GRID", (0, 0), (-1, -1), 0.5, BORDER_GRAY),
    ("TOPPADDING", (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("LEFTPADDING", (0, 0), (-1, -1), 5),
]))
story.append(t2)
story.append(spacer(0.25))

# Quick decision guide
story.append(Paragraph("Quick Decision Guide", s_h2))
story.append(spacer(0.08))
decisions = [
    ("Need a realistic photo?", "Flux 2"),
    ("Need text in the image?", "Ideogram 3.0 or GPT Image 1.5"),
    ("Need a logo or vector?", "Recraft V4"),
    ("Need 4K for print?", "Nano Banana Pro"),
    ("Need to iterate and edit?", "GPT Image 1.5"),
    ("Need it fast and cheap?", "Grok Imagine ($0.02)"),
    ("Need brand consistency?", "Flux 2 (references) or Ideogram (style codes)"),
]
for q, a in decisions:
    story.append(Paragraph(
        f'<b>{q}</b>  <font color="{RED.hexval()}">\u2192</font>  {a}', s_body
    ))
story.append(PageBreak())

# ═══════════════════════════════════════
# 5 PROMPT TIPS
# ═══════════════════════════════════════
story.append(section_label("TECHNIQUES"))
story.append(spacer(0.05))
story.append(Paragraph("5 Techniques That Actually Work", s_h1))
story.append(accent_bar())
story.append(spacer(0.15))

tips = [
    (
        "Think Like a Photographer, Not a Prompter",
        "Instead of \u2018beautiful photo of a woman,\u2019 think about what a photographer would set up: "
        "\u2018Rembrandt lighting, 85mm f/1.4, Kodak Portra 400 film stock, shallow depth of field.\u2019 "
        "Real photography parameters produce real-looking results. The skill maps these automatically."
    ),
    (
        "Specify Lighting\u200a\u2014\u200aThe #1 Lever",
        "Lighting is the single most reliable parameter across ALL 6 models. "
        "\u2018Golden hour side-lighting with long shadows\u2019 produces dramatically better results than "
        "leaving it unspecified. The skill includes a full lighting library\u200a\u2014\u200aRembrandt, butterfly, "
        "split, rim, practical\u200a\u2014\u200aeach mapped per model."
    ),
    (
        "Add Imperfections for Realism",
        "The fastest way to make AI images look less AI: add film grain, slight chromatic aberration, "
        "dust motes, uneven natural lighting. Real photos aren\u2019t perfect. "
        "\u2018Shot on Fuji Pro 400H, slight vignette, natural window light\u2019 beats \u2018ultra-realistic 8K.\u2019"
    ),
    (
        "Stop Using \u20188K Ultra-Detailed\u2019",
        "Quality keyword spam (\u20188K, ultra-detailed, hyper-realistic, masterpiece\u2019) is the most common "
        "mistake. It actually makes images look MORE artificial by pushing toward synthetic perfection. "
        "The skill replaces these with empirically-tested parameters that work per model."
    ),
    (
        "Match Language to the Model",
        "Each model responds differently. Flux\u00a02 rewards photography terms and film stocks. "
        "Nano Banana Pro and GPT Image prefer conversational descriptions. Recraft\u00a0V4 responds to "
        "design vocabulary. Grok\u2019s \u2018Aggressive Realism\u2019 technique is model-specific. "
        "The skill handles all of this automatically."
    ),
]

for i, (title, body) in enumerate(tips, 1):
    story.append(Paragraph(
        f'<font color="{RED.hexval()}" size="14"><b>{i}</b></font>  '
        f'<font size="13"><b>{title}</b></font>', s_body
    ))
    story.append(spacer(0.04))
    story.append(Paragraph(body, s_body))
    if i < 5:
        story.append(spacer(0.12))

story.append(PageBreak())

# ═══════════════════════════════════════
# HOW TO USE THE SKILL
# ═══════════════════════════════════════
story.append(section_label("GETTING STARTED"))
story.append(spacer(0.05))
story.append(Paragraph("How to Use the Skill", s_h1))
story.append(accent_bar())
story.append(spacer(0.15))

story.append(Paragraph(
    "This skill is a plain markdown file. It works with any AI assistant that can read uploaded "
    "documents\u200a\u2014\u200anot just Claude. Here\u2019s how to set it up in each environment:", s_body
))
story.append(spacer(0.1))

platforms = [
    (
        "Claude Code (Terminal)",
        "Place the skill folder in your workspace\u2019s skills/ directory. Claude discovers it automatically and uses it whenever you describe an image.",
        "code.claude.com/docs/en/skills",
    ),
    (
        "Claude Desktop (App)",
        "Open Settings \u2192 Skills \u2192 Upload skill folder. Select the image-prompt-engineer-skill folder from the ZIP. The skill appears in your Skills list and stays available across conversations.",
        "support.claude.com/en/articles/12512180-using-skills-in-claude",
    ),
    (
        "OpenClaw",
        "Copy the skill folder to your OpenClaw skills directory (e.g. ~/.agents/skills/). Add an entry in your openclaw.json config under skills.entries with enabled: true. Restart the gateway.",
        "docs.openclaw.ai/tools/skills",
    ),
    (
        "ChatGPT",
        "Two options: (1) Upload SKILL.md as an attachment in any conversation\u200a\u2014\u200atell ChatGPT \u2018Use the attached skill to optimize my image prompts.\u2019 (2) For persistent use, create a Custom GPT: go to Explore GPTs \u2192 Create \u2192 paste the contents of SKILL.md into Instructions. This gives you a reusable, shareable prompt engineer.",
        "help.openai.com/en/articles/8554397-creating-a-gpt",
    ),
    (
        "Google Gemini",
        "Upload SKILL.md as a context document in any Gemini conversation, or create a Gem (Gemini\u2019s custom instructions): go to Gem Manager \u2192 New Gem \u2192 paste SKILL.md contents into the instructions field.",
        "support.google.com/gemini/answer/15235603",
    ),
    (
        "Any Other LLM",
        "The skill is plain markdown\u200a\u2014\u200ait works with any LLM that accepts file uploads or system instructions. Upload SKILL.md and the references/ folder, or paste the contents as context. Works with Copilot, Perplexity, local models, and more.",
        None,
    ),
]
for title, desc, link in platforms:
    block = []
    block.append(Paragraph(f"<b>{title}</b>", s_body_bold))
    block.append(Paragraph(desc, s_body))
    if link:
        block.append(Paragraph(
            f'<font color="{RED.hexval()}">\u2192</font>  '
            f'<font color="{TEXT_SECONDARY.hexval()}" size="9">Setup guide: {link}</font>',
            ParagraphStyle("LinkLine", parent=s_body, fontSize=9, spaceAfter=4, leftIndent=4)
        ))
    block.append(spacer(0.08))
    story.append(KeepTogether(block))

story.append(spacer(0.1))
story.append(Paragraph("<b>What you get for every image description:</b>", s_body_bold))
story.append(spacer(0.06))
outputs = [
    "An <b>optimized prompt</b>\u200a\u2014\u200awith real photography parameters (film stock, lens, lighting), copy-paste ready",
    "A <b>model recommendation</b>\u200a\u2014\u200awhich AI model fits your specific needs",
    "<b>Anti-AI realism recipes</b>\u200a\u2014\u200aper-model techniques for authentically photographic results",
    "<b>Provider options</b>\u200a\u2014\u200awhere to generate, with estimated pricing",
    "A <b>quality score</b> (0\u201310)\u200a\u2014\u200aweighted across 6 dimensions with model-specific nuances",
    "<b>What-to-avoid warnings</b>\u200a\u2014\u200amodel-specific pitfalls that waste generation credits",
]
for o in outputs:
    story.append(Paragraph(f"\u2022  {o}", s_bullet))

story.append(spacer(0.15))
story.append(Paragraph(
    "The optimized prompt is always written in plain English. Paste it into "
    "Midjourney, Canva AI, Leonardo, ChatGPT, or any API.", s_body
))

story.append(PageBreak())

# ═══════════════════════════════════════
# CTA PAGE
# ═══════════════════════════════════════
story.append(spacer(1.5))
story.append(accent_bar_center(60))
story.append(spacer(0.25))
story.append(Paragraph(
    "Ready to See AI-Powered<br/>Production at Scale?",
    ParagraphStyle("CTATitle", parent=s_display, fontSize=28, leading=34)
))
story.append(spacer(0.3))
story.append(Paragraph(
    "This toolkit is one piece of a 40+ agent system we built for creative "
    "production\u200a\u2014\u200avideo, music, design, and strategy, all working together. "
    "The same photography knowledge that took professionals years to learn, "
    "mapped to 6 AI models.", s_center
))
story.append(spacer(0.08))
story.append(Paragraph(
    "We don\u2019t compete with your agency\u200a\u2014\u200awe complete it.", s_center_bold
))
story.append(spacer(0.5))
story.append(Paragraph(
    f'<font color="{RED.hexval()}"><b>Schedule a Discovery Call \u2192</b></font>', s_center
))
story.append(spacer(0.06))
story.append(Paragraph("inspiredcreativegroupinc.com/partners", s_center))
story.append(spacer(2.5))
story.append(divider())
story.append(spacer(0.08))
story.append(Paragraph(
    "\u00a9 2026 Inspired Creative Group Inc.  \u00b7  All rights reserved.",
    s_footer
))
story.append(Paragraph(
    "Halifax, Nova Scotia  \u00b7  Toronto, Ontario  \u00b7  Bogot\u00e1, Colombia",
    s_footer
))

# ═══ BUILD ═══
doc.build(story)
fsize = os.path.getsize(OUTPUT_PATH)
print(f"\u2705 PDF generated: {OUTPUT_PATH} ({fsize // 1024}KB)")
