#!/usr/bin/env python3
"""
Generate 3 before/after pairs using Nano Banana Pro on Fal.ai.
Generic prompt vs skill-optimized prompt — same model, same settings.
"""
import os, json, requests

FAL_KEY = ""
with open(os.path.expanduser("~/.openclaw/.env")) as f:
    for line in f:
        if line.startswith("FAL_KEY="):
            FAL_KEY = line.strip().split("=", 1)[1].strip('"').strip("'")

assert FAL_KEY, "FAL_KEY not found"

API_URL = "https://fal.run/fal-ai/nano-banana-pro"
HEADERS = {"Authorization": f"Key {FAL_KEY}", "Content-Type": "application/json"}
OUT_DIR = "assets/images/lead-magnet"
os.makedirs(OUT_DIR, exist_ok=True)

PAIRS = [
    {
        "name": "portrait",
        "before": "portrait of an old man",
        "after": (
            "intimate portrait of a weathered elderly man in his 80s, deep wrinkles "
            "telling stories of a lifetime, Rembrandt lighting from a single window "
            "on the left casting warm golden light across one side of his face while "
            "the other falls into soft shadow, sharp catchlights in pale blue eyes, "
            "individual white beard hairs visible, shallow depth of field at f/1.8, "
            "dark muted background with subtle warm bokeh, skin pores and texture "
            "visible, photorealistic, shot on medium format camera, emotional and dignified"
        ),
    },
    {
        "name": "food",
        "before": "a plate of pasta",
        "after": (
            "artisanal fresh pasta dish with hand-rolled tagliatelle in a rich "
            "slow-cooked beef ragu, wisps of steam rising from the plate caught "
            "in dramatic side-lighting from the right, freshly grated Parmigiano-Reggiano "
            "scattered on top with visible crystal texture, rustic dark wooden table, "
            "shallow depth of field blurring a glass of red wine in the background, "
            "moody restaurant atmosphere with warm tungsten lighting, food photography "
            "shot on 100mm macro lens, dark and editorial, Michelin-star presentation"
        ),
    },
    {
        "name": "interior",
        "before": "modern living room",
        "after": (
            "architect-designed loft living room during golden hour, floor-to-ceiling "
            "windows flooding the space with warm directional sunlight, visible dust "
            "particles floating in light beams, lived-in details — an open book on "
            "the leather Eames chair, a half-finished coffee on the concrete side table, "
            "plants casting long shadows across polished concrete floors, wide-angle "
            "shot at 24mm showing depth and scale, muted earth tones with warm amber "
            "highlights, interior architecture photography, photorealistic, natural "
            "imperfections in the textures"
        ),
    },
]

SETTINGS = {
    "aspect_ratio": "16:9",
    "seed": 42,
}


def generate(prompt, filename):
    payload = {**SETTINGS, "prompt": prompt}
    print(f"\n⏳ {filename}")
    print(f"   Prompt: {prompt[:70]}...")
    r = requests.post(API_URL, headers=HEADERS, json=payload, timeout=180)
    r.raise_for_status()
    data = r.json()
    if "images" in data and data["images"]:
        img = requests.get(data["images"][0]["url"]).content
        path = os.path.join(OUT_DIR, filename)
        with open(path, "wb") as f:
            f.write(img)
        print(f"   ✅ {len(img)//1024}KB")
        return path
    else:
        print(f"   ❌ {json.dumps(data)[:200]}")
        return None


if __name__ == "__main__":
    print("=" * 60)
    print("BEFORE/AFTER v2 — Nano Banana Pro × 3 pairs")
    print("=" * 60)
    
    results = []
    for pair in PAIRS:
        b = generate(pair["before"], f"before-{pair['name']}.jpg")
        a = generate(pair["after"], f"after-{pair['name']}.jpg")
        results.append((pair["name"], b, a))
    
    print("\n" + "=" * 60)
    for name, b, a in results:
        status = "✅" if b and a else "⚠️"
        print(f"{status} {name}: before={b}, after={a}")
