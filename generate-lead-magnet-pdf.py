#!/usr/bin/env python3
"""
Generate: "Generate Better AI Images in Minutes: The Prompt Engineering Toolkit"
ICG Lead Magnet PDF — companion guide for the Image Prompt Engineer skill.
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white, black
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, Image as RLImage
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.platypus.flowables import HRFlowable
import os

# ── Brand Colors ──
RED = HexColor("#E8000D")
DARK = HexColor("#0A0A0A")
SURFACE = HexColor("#111111")
LIGHT_BG = HexColor("#F5F5F5")
MID_GRAY = HexColor("#666666")
LIGHT_GRAY = HexColor("#999999")
WHITE_BG = HexColor("#FFFFFF")
ACCENT_RED_LIGHT = HexColor("#FFF0F0")

OUTPUT_PATH = "assets/downloads/prompt-engineering-toolkit-2026.pdf"
LOGO_PATH = "images/logo.png"

os.makedirs("assets/downloads", exist_ok=True)

doc = SimpleDocTemplate(
    OUTPUT_PATH,
    pagesize=letter,
    topMargin=0.6*inch,
    bottomMargin=0.6*inch,
    leftMargin=0.75*inch,
    rightMargin=0.75*inch,
)

# ── Styles ──
styles = getSampleStyleSheet()

s_cover_title = ParagraphStyle(
    "CoverTitle", parent=styles["Title"],
    fontName="Helvetica-Bold", fontSize=28, leading=34,
    textColor=DARK, alignment=TA_CENTER, spaceAfter=12,
)
s_cover_subtitle = ParagraphStyle(
    "CoverSubtitle", parent=styles["Normal"],
    fontName="Helvetica", fontSize=14, leading=20,
    textColor=MID_GRAY, alignment=TA_CENTER, spaceAfter=6,
)
s_h1 = ParagraphStyle(
    "H1", parent=styles["Heading1"],
    fontName="Helvetica-Bold", fontSize=22, leading=28,
    textColor=DARK, spaceBefore=20, spaceAfter=10,
)
s_h2 = ParagraphStyle(
    "H2", parent=styles["Heading2"],
    fontName="Helvetica-Bold", fontSize=16, leading=22,
    textColor=DARK, spaceBefore=14, spaceAfter=6,
)
s_h3 = ParagraphStyle(
    "H3", parent=styles["Heading3"],
    fontName="Helvetica-Bold", fontSize=13, leading=18,
    textColor=DARK, spaceBefore=10, spaceAfter=4,
)
s_body = ParagraphStyle(
    "Body", parent=styles["Normal"],
    fontName="Helvetica", fontSize=10.5, leading=16,
    textColor=DARK, spaceAfter=8,
)
s_body_small = ParagraphStyle(
    "BodySmall", parent=s_body,
    fontSize=9.5, leading=14, textColor=MID_GRAY,
)
s_bold = ParagraphStyle(
    "BodyBold", parent=s_body,
    fontName="Helvetica-Bold",
)
s_bullet = ParagraphStyle(
    "Bullet", parent=s_body,
    leftIndent=18, bulletIndent=6,
    spaceAfter=4,
)
s_red_label = ParagraphStyle(
    "RedLabel", parent=styles["Normal"],
    fontName="Helvetica-Bold", fontSize=11, leading=16,
    textColor=RED, spaceAfter=2,
)
s_center = ParagraphStyle(
    "Center", parent=s_body,
    alignment=TA_CENTER,
)
s_footer = ParagraphStyle(
    "Footer", parent=styles["Normal"],
    fontName="Helvetica", fontSize=8, leading=10,
    textColor=LIGHT_GRAY, alignment=TA_CENTER,
)

# ── Helpers ──
def hr():
    return HRFlowable(width="100%", thickness=0.5, color=HexColor("#DDDDDD"), spaceAfter=10, spaceBefore=6)

def spacer(h=0.2):
    return Spacer(1, h * inch)

def red_tag(text):
    return Paragraph(text, s_red_label)

def model_page(tag, name, maker, best_for, strengths, copy_paste, api_providers, price, pro_tip):
    """Build a one-page model section."""
    elems = []
    elems.append(red_tag(tag))
    elems.append(Paragraph(name, s_h2))
    elems.append(Paragraph(f"<i>by {maker}</i>", s_body_small))
    elems.append(spacer(0.1))
    elems.append(Paragraph(f"<b>Best for:</b> {best_for}", s_body))
    elems.append(spacer(0.05))
    elems.append(Paragraph("<b>Strengths</b>", s_h3))
    for s in strengths:
        elems.append(Paragraph(f"• {s}", s_bullet))
    elems.append(spacer(0.1))

    # Copy-paste section
    elems.append(Paragraph("🖥️  Where to Generate (Copy-Paste)", s_h3))
    elems.append(Paragraph("Paste the optimized prompt directly into any of these web interfaces:", s_body_small))
    for cp in copy_paste:
        elems.append(Paragraph(f"• {cp}", s_bullet))
    elems.append(spacer(0.1))

    # API section
    elems.append(Paragraph("⚡  API Providers (For Automation)", s_h3))
    elems.append(Paragraph("Connect via API for batch processing, pipelines, and agent workflows:", s_body_small))
    for ap in api_providers:
        elems.append(Paragraph(f"• {ap}", s_bullet))
    elems.append(spacer(0.1))

    elems.append(Paragraph(f"<b>💰 Price range:</b> {price}", s_body))
    elems.append(spacer(0.1))
    elems.append(Paragraph(f"<b>💡 Pro tip:</b> <i>{pro_tip}</i>", s_body))
    elems.append(hr())
    return elems


# ══════════════════════════════════════════════
#  BUILD STORY
# ══════════════════════════════════════════════
story = []

# ── PAGE 1: COVER ──
story.append(spacer(1.5))
if os.path.exists(LOGO_PATH):
    story.append(RLImage(LOGO_PATH, width=1.8*inch, height=1.8*inch, hAlign="CENTER"))
    story.append(spacer(0.3))
story.append(Paragraph("Generate Better AI Images<br/>in Minutes", s_cover_title))
story.append(spacer(0.15))
story.append(Paragraph("The Prompt Engineering Toolkit", ParagraphStyle(
    "CoverToolkit", parent=s_cover_subtitle,
    fontName="Helvetica-Bold", fontSize=16, textColor=RED,
)))
story.append(spacer(0.3))
story.append(Paragraph("A practical guide for agencies and creative teams", s_cover_subtitle))
story.append(spacer(0.1))
story.append(Paragraph("6 AI Models · Optimized Prompts · Zero Guesswork", s_cover_subtitle))
story.append(spacer(1.5))
story.append(Paragraph("inspiredcreativegroupinc.com", ParagraphStyle(
    "CoverURL", parent=s_center, textColor=RED, fontSize=11,
)))
story.append(PageBreak())

# ── PAGE 2: WHAT'S INSIDE ──
story.append(Paragraph("What's Inside This Toolkit", s_h1))
story.append(hr())
story.append(Paragraph(
    "This guide and the <b>Image Prompt Engineer</b> skill work together as a complete toolkit.", s_body
))
story.append(spacer(0.1))
story.append(Paragraph("<b>🔧 The Skill</b> (included in your download)", s_h3))
story.append(Paragraph(
    "A Claude skill that transforms plain English descriptions into production-ready, "
    "model-optimized prompts for 6 leading AI image generators. It handles model selection, "
    "keyword optimization, quality scoring, and technical specs — so you don't have to.", s_body
))
story.append(spacer(0.1))
story.append(Paragraph("<b>📖 This Guide</b>", s_h3))
story.append(Paragraph(
    "Tells you <i>which</i> model to use, <i>when</i>, and <i>why</i>. Covers the strengths of each model, "
    "where to generate images (from free web UIs to API pipelines), and 5 prompt engineering "
    "techniques that make an immediate difference in output quality.", s_body
))
story.append(spacer(0.15))
story.append(Paragraph("<b>How they work together:</b>", s_bold))
story.append(Paragraph("1. You describe the image you want in plain English", s_bullet))
story.append(Paragraph("2. The skill optimizes your prompt for the best model", s_bullet))
story.append(Paragraph("3. You take the output to any generation service — web UI or API", s_bullet))
story.append(Paragraph("4. This guide helps you understand which model and service fits your workflow", s_bullet))
story.append(spacer(0.2))
story.append(Paragraph(
    "The skill does <b>not</b> generate images itself — it engineers the best possible prompt. "
    "This means you're never locked into a single provider. Use whichever service works for you.", s_body
))
story.append(PageBreak())

# ── PAGE 3: WHY THESE 6 MODELS ──
story.append(Paragraph("Why These 6 Models", s_h1))
story.append(hr())
story.append(Paragraph(
    "We evaluated dozens of AI image generators across photorealism, text rendering, "
    "design quality, speed, resolution, editing capabilities, and price. These 6 cover "
    "every professional use case with no gaps and no redundancy:", s_body
))
story.append(spacer(0.1))

why_data = [
    ["Model", "Covers"],
    ["Flux 2", "Photorealism, multi-reference consistency, detailed scenes"],
    ["Nano Banana Pro", "High-resolution (up to 4K), general purpose, natural language"],
    ["Recraft V4", "Vector/SVG output, design assets, marketing materials"],
    ["Ideogram 3.0", "Text rendering, color-controlled branding, style codes"],
    ["GPT Image 1.5", "Instruction following, conversational editing, iteration"],
    ["Grok Imagine", "Quick aesthetics, budget batch work, phone-screen ratios"],
]
t = Table(why_data, colWidths=[1.8*inch, 4.7*inch])
t.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), RED),
    ("TEXTCOLOR", (0, 0), (-1, 0), white),
    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ("FONTSIZE", (0, 0), (-1, -1), 10),
    ("FONTNAME", (0, 1), (0, -1), "Helvetica-Bold"),
    ("BACKGROUND", (0, 1), (-1, -1), LIGHT_BG),
    ("ALIGN", (0, 0), (-1, -1), "LEFT"),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("GRID", (0, 0), (-1, -1), 0.5, HexColor("#DDDDDD")),
    ("TOPPADDING", (0, 0), (-1, -1), 6),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ("LEFTPADDING", (0, 0), (-1, -1), 8),
]))
story.append(t)
story.append(spacer(0.2))
story.append(Paragraph(
    "<b>Selection criteria:</b> Each model is best-in-class at something no other model does as well. "
    "Flux 2 owns photorealism. Recraft V4 is the only model producing real SVG vectors. "
    "Ideogram 3.0 leads in text rendering. GPT Image 1.5 is uniquely conversational. "
    "Together, they give you full coverage — from quick $0.02 drafts to production 4K prints.", s_body
))
story.append(PageBreak())

# ── PAGES 4-9: MODEL PAGES ──
story.append(Paragraph("The 6 Models", s_h1))
story.append(hr())
story.append(spacer(0.1))

# Model 1: Flux 2
story.extend(model_page(
    tag="MODEL 1 OF 6",
    name="Flux 2",
    maker="Black Forest Labs",
    best_for="Photorealistic product shots, portraits, detailed scenes, multi-reference consistency",
    strengths=[
        "Best photorealism of any current model — natural skin, lighting, materials",
        "32K token prompt context — more detail = better results",
        "Up to 10 reference images for character/style consistency across a campaign",
        "Sub-10-second generation (Pro/Flex variants)",
        "Strong text rendering, especially with the Flex variant",
    ],
    copy_paste=[
        "Leonardo.ai — paste prompt, select Flux model",
        "Freepik AI Image Generator",
        "Any interface offering Flux 2 models",
    ],
    api_providers=[
        "Fal.ai — fal-ai/flux-2-flex (~$0.025/image)",
        "BFL.ai — direct from Black Forest Labs (~$0.025/image)",
        "Replicate — flux-2-flex (usage-based pricing)",
    ],
    price="$0.025–$0.05/image (varies by variant and provider)",
    pro_tip="Enable prompt expansion (on by default) — the model enhances your prompt with its own knowledge. For product photography, provide reference images for consistency across an entire catalog.",
))

# Model 2: Nano Banana Pro
story.extend(model_page(
    tag="MODEL 2 OF 6",
    name="Nano Banana Pro (Gemini 3 Pro Image)",
    maker="Google",
    best_for="High-resolution output (up to 4K), general purpose, natural language prompting",
    strengths=[
        "Up to 4K resolution — ideal for large-format prints and gallery work",
        "Simple, conversational prompting — describe naturally, no keyword engineering needed",
        "Google's multimodal intelligence understands context and composition",
        "Great all-rounder for teams that want one reliable default model",
    ],
    copy_paste=[
        "Google AI Studio (Gemini) — native access",
        "Any Gemini-powered creative tool",
    ],
    api_providers=[
        "Fal.ai — fal-ai/nano-banana-pro (~$0.02/image)",
        "Google AI API — direct Gemini access",
    ],
    price="~$0.02/image",
    pro_tip="Write prompts like you're describing the image to a friend — conversational language outperforms keyword stacking with this model. Use '4K' resolution tier for anything going to print.",
))

# Model 3: Recraft V4
story.extend(model_page(
    tag="MODEL 3 OF 6",
    name="Recraft V4",
    maker="Recraft",
    best_for="Logos, icons, vector graphics (SVG), design assets, marketing materials",
    strengths=[
        "The ONLY model producing real, editable SVG vector files",
        "Outputs: SVG, PNG, JPG, PDF, TIFF, and even Lottie animations",
        "Design-forward aesthetic — understands visual hierarchy and composition",
        "Exploration mode gives multiple design directions from one prompt",
        "Free plan available on recraft.ai",
    ],
    copy_paste=[
        "Recraft.ai — free web interface with full vector support",
        "Any design tool with Recraft integration",
    ],
    api_providers=[
        "Fal.ai — fal-ai/recraft-v4 (pricing TBD)",
        "Recraft.ai API — direct access (free plan available)",
        "Replicate — recraft-v4 (usage-based pricing)",
    ],
    price="Free plan available; API pricing varies",
    pro_tip="Use design vocabulary in your prompts — 'balanced composition,' 'cohesive color palette,' 'visual hierarchy.' Recraft was built for designers and responds to design language better than photography terms.",
))

story.append(PageBreak())

# Model 4: Ideogram 3.0
story.extend(model_page(
    tag="MODEL 4 OF 6",
    name="Ideogram 3.0",
    maker="Ideogram",
    best_for="Text-in-image rendering, branded content, color-controlled designs, reproducible styles",
    strengths=[
        "Industry gold standard for text rendering — signs, logos, titles, dense typography",
        "Style codes (8-char hex) for exact style reproduction across campaigns",
        "Color palette with hex weights for brand-precise color control",
        "Negative prompts to explicitly exclude unwanted elements",
        "Magic prompt auto-enhancement for quick generation",
    ],
    copy_paste=[
        "Ideogram.ai — free web interface, best text rendering UX",
        "ChatGPT (with DALL-E) — for text-heavy requests",
        "Any creative tool with Ideogram integration",
    ],
    api_providers=[
        "Fal.ai — fal-ai/ideogram-3 (~$0.02/image)",
        "Ideogram.ai API — direct access",
        "Together.ai — ideogram/ideogram-3.0",
        "Replicate — ideogram-3.0",
    ],
    price="~$0.02/image; free tier available on ideogram.ai",
    pro_tip="Always put text you want rendered in quotes within the prompt — 'SALE 50% OFF'. Save your style codes and reuse them across an entire campaign for perfect visual consistency.",
))

# Model 5: GPT Image 1.5
story.extend(model_page(
    tag="MODEL 5 OF 6",
    name="GPT Image 1.5",
    maker="OpenAI",
    best_for="Instruction following, multi-turn editing, conversational refinement, concept iteration",
    strengths=[
        "Best instruction following — understands complex, nuanced directions",
        "Unique multi-turn editing: generate, then refine ('make the sky more orange')",
        "Broad real-world knowledge — can reference brands, locations, styles accurately",
        "Three quality tiers: low ($0.009), medium, high ($0.20) — budget flexibility",
        "Transparent background support",
    ],
    copy_paste=[
        "ChatGPT — the native interface, supports multi-turn editing",
        "OpenAI Playground — direct access with parameter control",
    ],
    api_providers=[
        "OpenAI API — gpt-image-1.5 ($0.009–$0.20/image depending on quality)",
    ],
    price="$0.009 (low) to $0.20 (high) per image",
    pro_tip="Structure your first prompt with clearly separate elements — this makes follow-up edits much easier. 'A woman in a red dress, standing in a modern office, with city skyline through windows' lets you later say 'change the dress to blue' without regenerating everything.",
))

# Model 6: Grok Imagine
story.extend(model_page(
    tag="MODEL 6 OF 6",
    name="Grok Imagine",
    maker="xAI",
    best_for="Quick aesthetic images, budget-friendly batch work, phone wallpapers, exploration",
    strengths=[
        "Cheapest option at $0.02/image — great for exploration and drafts",
        "Unique phone-screen aspect ratios (19.5:9, 20:9) for mobile content",
        "Fast generation with attractive aesthetic output",
        "Combined image generation + editing in one API family",
        "Simple API with minimal configuration needed",
    ],
    copy_paste=[
        "Grok (x.ai / X platform) — native interface",
        "Any tool with Grok Imagine integration",
    ],
    api_providers=[
        "Fal.ai — xai/grok-imagine-image ($0.02/image)",
        "xAI API — direct access",
    ],
    price="~$0.02/image",
    pro_tip="Focus on mood and aesthetics rather than technical details — this model interprets artistic intent better than precise specifications. Perfect for quick mood boards before committing to a more detailed generation with Flux 2 or Ideogram.",
))

story.append(PageBreak())

# ── COMPARISON MATRIX ──
story.append(Paragraph("Comparison Matrix", s_h1))
story.append(hr())
story.append(spacer(0.1))

matrix_data = [
    ["", "Flux 2", "Nano\nBanana", "Recraft\nV4", "Ideogram\n3.0", "GPT\nImage", "Grok\nImagine"],
    ["Photorealism", "★★★★★", "★★★★", "★★★★", "★★★★", "★★★★", "★★★"],
    ["Text Render", "★★★★★", "★★★", "★★★★", "★★★★★", "★★★★★", "★★★"],
    ["Speed", "★★★★★", "★★★★", "★★★", "★★★★", "★★★", "★★★★★"],
    ["Max Res.", "4MP", "4K", "2048²", "Varies", "1536px", "Varies"],
    ["Vector/SVG", "—", "—", "✓", "—", "—", "—"],
    ["Editing", "★★★★", "★", "★", "★★★★", "★★★★★", "★★★"],
    ["Price/img", "$0.025+", "~$0.02", "Free+", "~$0.02", "$0.009+", "~$0.02"],
]

col_w = [1.05*inch] + [0.95*inch]*6
t2 = Table(matrix_data, colWidths=col_w)
t2.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), RED),
    ("TEXTCOLOR", (0, 0), (-1, 0), white),
    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ("FONTSIZE", (0, 0), (-1, 0), 8),
    ("FONTNAME", (0, 1), (0, -1), "Helvetica-Bold"),
    ("FONTSIZE", (0, 1), (-1, -1), 8.5),
    ("BACKGROUND", (0, 1), (-1, -1), LIGHT_BG),
    ("ALIGN", (1, 0), (-1, -1), "CENTER"),
    ("ALIGN", (0, 0), (0, -1), "LEFT"),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("GRID", (0, 0), (-1, -1), 0.5, HexColor("#DDDDDD")),
    ("TOPPADDING", (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("LEFTPADDING", (0, 0), (-1, -1), 5),
]))
story.append(t2)
story.append(spacer(0.3))

# Quick decision guide
story.append(Paragraph("Quick Decision Guide", s_h2))
story.append(spacer(0.1))
decisions = [
    ("Need a realistic photo?", "→ Flux 2"),
    ("Need text in the image?", "→ Ideogram 3.0 or GPT Image 1.5"),
    ("Need a logo or vector?", "→ Recraft V4"),
    ("Need 4K for print?", "→ Nano Banana Pro"),
    ("Need to iterate/edit?", "→ GPT Image 1.5"),
    ("Need it fast and cheap?", "→ Grok Imagine ($0.02)"),
    ("Need brand consistency?", "→ Flux 2 (references) or Ideogram (style codes)"),
    ("Need a phone wallpaper?", "→ Grok Imagine (19.5:9 ratio)"),
]
for q, a in decisions:
    story.append(Paragraph(f"<b>{q}</b>  {a}", s_body))
story.append(PageBreak())

# ── 5 PROMPT TIPS ──
story.append(Paragraph("5 Prompt Tips That Actually Work", s_h1))
story.append(hr())
story.append(spacer(0.1))

story.append(Paragraph("1. Be Specific About What Makes It Good", s_h2))
story.append(Paragraph(
    "Don't say 'beautiful sunset.' Say 'golden hour sunset with warm amber light casting long shadows "
    "across wet sand, scattered clouds lit from below in pink and coral, gentle wave foam in the "
    "foreground.' The more specific your description, the less the AI has to guess — and guessing "
    "is where quality drops.", s_body
))
story.append(spacer(0.1))

story.append(Paragraph("2. Front-Load the Subject", s_h2))
story.append(Paragraph(
    "Put your main subject first, then add context. 'A golden retriever sitting in a sunlit "
    "meadow, wildflowers in soft focus behind, gentle breeze, photorealistic' works better than "
    "burying the subject mid-sentence. AI models weight the beginning of prompts more heavily.", s_body
))
story.append(spacer(0.1))

story.append(Paragraph("3. Specify Lighting — Always", s_h2))
story.append(Paragraph(
    "Lighting is the single biggest quality lever in AI image generation. 'Studio lighting with "
    "soft shadows' produces dramatically better results than leaving it unspecified. Good options: "
    "golden hour, blue hour, studio lighting, natural window light, backlit, dramatic rim lighting, "
    "overcast soft light.", s_body
))
story.append(spacer(0.1))

story.append(Paragraph("4. Match Your Language to the Model", s_h2))
story.append(Paragraph(
    "Each model responds to different prompt styles. Flux 2 rewards detail and photography terms. "
    "Nano Banana Pro and GPT Image 1.5 prefer natural conversation. Recraft V4 responds to design "
    "vocabulary. Grok Imagine wants aesthetic and mood keywords. The skill handles this automatically, "
    "but knowing it helps you write better starting descriptions.", s_body
))
story.append(spacer(0.1))

story.append(Paragraph("5. Use the Negative (When Available)", s_h2))
story.append(Paragraph(
    "Ideogram 3.0 supports negative prompts — telling the AI what to avoid. 'Negative: blurry, "
    "low quality, distorted faces, cluttered background' can prevent common failure modes. Even for "
    "models without formal negative prompts, you can add 'avoid blurry details, no clutter' to the "
    "end of your positive prompt.", s_body
))
story.append(PageBreak())

# ── HOW TO USE THE SKILL ──
story.append(Paragraph("How to Use the Skill", s_h1))
story.append(hr())
story.append(spacer(0.1))
story.append(Paragraph(
    "The Image Prompt Engineer skill works in any Claude environment. "
    "Here's how to get started:", s_body
))
story.append(spacer(0.1))

story.append(Paragraph("Claude Code (Terminal)", s_h2))
story.append(Paragraph(
    "Drop the skill folder into your workspace's skills directory. Claude automatically "
    "picks it up — just start describing images.", s_body
))
story.append(spacer(0.1))

story.append(Paragraph("Claude Desktop", s_h2))
story.append(Paragraph(
    "Add the skill folder as a project in Claude Desktop settings. "
    "Include SKILL.md and the references/ folder. Start a conversation and describe what you want.", s_body
))
story.append(spacer(0.1))

story.append(Paragraph("Claude Web (claude.ai)", s_h2))
story.append(Paragraph(
    "Upload SKILL.md as an attachment in a new conversation. For deeper model knowledge, "
    "also upload the files from the references/ folder. Tell Claude: 'Use the attached skill "
    "to optimize my image prompts.'", s_body
))
story.append(spacer(0.15))

story.append(Paragraph("What You'll Get", s_h2))
story.append(Paragraph("For every image description, the skill returns:", s_body))
story.append(Paragraph("• An <b>optimized prompt</b> — human-readable, copy-paste ready", s_bullet))
story.append(Paragraph("• A <b>model recommendation</b> — which AI model fits your needs", s_bullet))
story.append(Paragraph("• <b>Provider options</b> — where to generate, with pricing", s_bullet))
story.append(Paragraph("• A <b>quality score</b> (0–10) — how effective the prompt is", s_bullet))
story.append(Paragraph("• <b>Technical specs</b> — resolution, aspect ratio, parameters", s_bullet))
story.append(Paragraph("• <b>Warnings</b> — anything that might cause issues", s_bullet))
story.append(spacer(0.1))
story.append(Paragraph(
    "The optimized prompt text is always written in plain English — you can paste it directly "
    "into any image generation interface, from Midjourney to Canva AI to any API.", s_body
))
story.append(PageBreak())

# ── CTA PAGE ──
story.append(spacer(1.0))
story.append(Paragraph("Ready to See What AI-Powered<br/>Production Looks Like at Scale?", s_cover_title))
story.append(spacer(0.3))
story.append(Paragraph(
    "This toolkit is one piece of a 40+ agent system we built for creative production — "
    "video, music, design, and strategy, all working together.", s_body
))
story.append(spacer(0.1))
story.append(Paragraph(
    "We don't compete with your agency — we complete it. Whether you need production "
    "now or want to build AI workflows for your own team, let's talk.", s_body
))
story.append(spacer(0.4))
story.append(Paragraph(
    '<b><font color="#E8000D">Schedule a Discovery Call</font></b>', 
    ParagraphStyle("CTALink", parent=s_center, fontSize=14)
))
story.append(Paragraph("inspiredcreativegroupinc.com/partners", s_center))
story.append(spacer(1.5))
story.append(hr())
story.append(Paragraph(
    "© 2026 Inspired Creative Group Inc. All rights reserved.<br/>"
    "Halifax, Nova Scotia · Toronto, Ontario · Bogotá, Colombia",
    s_footer
))

# ── BUILD ──
doc.build(story)
print(f"✅ PDF generated: {OUTPUT_PATH}")
print(f"   Pages: ~12")
