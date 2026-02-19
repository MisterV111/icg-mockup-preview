#!/usr/bin/env python3
"""
Generate before/after comparison images for lead magnet.
Both use Flux 2 Flex on Fal.ai with IDENTICAL settings — only prompt differs.
"""
import os
import json
import time
import requests

FAL_KEY = os.environ.get("FAL_KEY", "")
if not FAL_KEY:
    # Try loading from .env
    env_path = os.path.expanduser("~/.openclaw/.env")
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                if line.startswith("FAL_KEY="):
                    FAL_KEY = line.strip().split("=", 1)[1].strip('"').strip("'")

assert FAL_KEY, "FAL_KEY not found"

API_URL = "https://fal.run/fal-ai/flux/dev"
HEADERS = {
    "Authorization": f"Key {FAL_KEY}",
    "Content-Type": "application/json",
}

OUT_DIR = "assets/images/lead-magnet"
os.makedirs(OUT_DIR, exist_ok=True)

# ── BEFORE: What a regular person types ──
# Realistic lazy prompt — not intentionally bad, just unoptimized
BEFORE_PROMPT = "rainy city at night"

# ── AFTER: Skill-optimized prompt ──
# What the Image Prompt Engineer skill would output for the same concept
AFTER_PROMPT = (
    "cinematic urban street at night after rainfall, wet asphalt reflecting neon signs "
    "and warm streetlamp glow in puddles, atmospheric fog diffusing distant city lights, "
    "a lone figure with an umbrella walking away from camera creating depth, "
    "shallow depth of field with gentle bokeh from car headlights, "
    "film grain texture, muted teal and amber color grading reminiscent of Blade Runner, "
    "shot on 35mm anamorphic lens, photorealistic, moody noir atmosphere"
)

# Identical settings for both
SETTINGS = {
    "image_size": "landscape_16_9",
    "num_inference_steps": 28,
    "guidance_scale": 3.5,
    "seed": 42,  # Same seed for fair comparison
    "enable_safety_checker": True,
    "output_format": "jpeg",
}


def generate(prompt, filename):
    payload = {**SETTINGS, "prompt": prompt}
    print(f"\n⏳ Generating: {filename}")
    print(f"   Prompt: {prompt[:80]}...")
    
    # Synchronous call
    r = requests.post(API_URL, headers=HEADERS, json=payload, timeout=120)
    r.raise_for_status()
    data = r.json()
    
    # Download image
    if "images" in data and data["images"]:
        img_url = data["images"][0]["url"]
        img_data = requests.get(img_url).content
        path = os.path.join(OUT_DIR, filename)
        with open(path, "wb") as f:
            f.write(img_data)
        print(f"   ✅ Saved: {path} ({len(img_data) // 1024}KB)")
        return path
    else:
        print(f"   ❌ No images in response: {json.dumps(data)[:200]}")
        return None


if __name__ == "__main__":
    print("=" * 60)
    print("BEFORE/AFTER COMPARISON — Flux 2 Dev")
    print("=" * 60)
    print(f"\nBEFORE prompt: {BEFORE_PROMPT}")
    print(f"\nAFTER prompt: {AFTER_PROMPT[:100]}...")
    print(f"\nSettings: seed={SETTINGS['seed']}, steps={SETTINGS['num_inference_steps']}, guidance={SETTINGS['guidance_scale']}")
    
    before = generate(BEFORE_PROMPT, "before-generic-prompt.jpg")
    after = generate(AFTER_PROMPT, "after-optimized-prompt.jpg")
    
    if before and after:
        print(f"\n✅ Both images generated!")
        print(f"   Before: {before}")
        print(f"   After:  {after}")
    else:
        print("\n⚠️  One or both images failed.")
