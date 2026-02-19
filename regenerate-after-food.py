#!/usr/bin/env python3
"""
Regenerate the 'after' food image using the upgraded Image Prompt Engineer skill.
Uses real photography parameters: film stock, lens, lighting library, anti-AI realism.
"""
import os, json, requests, base64

FAL_KEY = ""
with open(os.path.expanduser("~/.openclaw/.env")) as f:
    for line in f:
        if line.startswith("FAL_KEY="):
            FAL_KEY = line.strip().split("=", 1)[1].strip('"').strip("'")

assert FAL_KEY, "FAL_KEY not found"

API_URL = "https://fal.run/fal-ai/nano-banana-pro"
HEADERS = {"Authorization": f"Key {FAL_KEY}", "Content-Type": "application/json"}
OUT_DIR = "assets/images/lead-magnet"

# Upgraded prompt using the skill's photography intelligence:
# - Film stock: CineStill 800T (tungsten warmth, halation around highlights)
# - Lens: 100mm macro (extreme food detail, shallow DOF)
# - Lighting: Practical lighting from a single candle + warm tungsten side-light (Rembrandt-style)
# - Anti-AI realism: film grain, slight chromatic aberration, uneven lighting, dust in light
# - Capture context: "shot on location" approach rather than "professional studio"
# - Texture-first: steam texture, cheese crystal texture, sauce viscosity, wood grain
PROMPT = (
    "A plate of fresh tagliatelle pasta in rich beef ragu, photographed in a dimly lit "
    "Italian trattoria. Shot on a 100mm macro lens with shallow depth of field — the pasta "
    "ribbons are tack-sharp while the background dissolves into warm bokeh. CineStill 800T "
    "film stock giving the scene tungsten-warm tones with subtle halation around the candle "
    "flame to the left. Practical lighting only — a single candle and distant kitchen glow "
    "creating uneven, natural illumination with Rembrandt-style shadow on the far side of "
    "the plate. Wisps of steam rising and catching the warm light. Freshly grated Parmigiano "
    "with visible crystal texture scattered on top. Dark rustic wooden table with visible "
    "grain and wear marks. A glass of red wine soft and out of focus in the background. "
    "Slight film grain throughout, natural chromatic aberration at the edges of frame, subtle "
    "lens vignetting darkening the corners. The feel of a candid moment — authentic, unposed, "
    "as if the photographer just sat down and captured this before eating. Moody, intimate, "
    "editorial food photography."
)

payload = {
    "prompt": PROMPT,
    "aspect_ratio": "16:9",
    "seed": 42,
}

print(f"Generating upgraded 'after' food image...")
print(f"Prompt length: {len(PROMPT)} chars")
resp = requests.post(API_URL, headers=HEADERS, json=payload)
resp.raise_for_status()
data = resp.json()

img_url = data["images"][0]["url"]
img_data = requests.get(img_url).content
out_path = os.path.join(OUT_DIR, "after-food.jpg")
with open(out_path, "wb") as f:
    f.write(img_data)

print(f"✅ Saved: {out_path} ({len(img_data) // 1024}KB)")
print(f"Seed: 42 | Aspect: 16:9 | Model: Nano Banana Pro")
