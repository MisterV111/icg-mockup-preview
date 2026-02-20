#!/usr/bin/env python3
"""Generate macro close-up images for the lead magnet PDF."""
import requests, os, time

FAL_KEY = os.environ.get("FAL_KEY", "3b076811-c8e4-4975-9348-2e3b4a197bba:71dcf43ca6673ee859b5d6f262a3f163")
ENDPOINT = "https://fal.run/fal-ai/nano-banana-pro"
HEADERS = {"Authorization": f"Key {FAL_KEY}", "Content-Type": "application/json"}
OUT_DIR = "assets/images/pdf"
os.makedirs(OUT_DIR, exist_ok=True)

images = {
    "cover-spiral": {
        "prompt": (
            "Extreme close-up macro photograph of a nautilus shell cross-section, "
            "revealing the perfect golden spiral chambers. Shot on Hasselblad X2D with 100mm macro lens, "
            "f/2.8 aperture. Dramatic Rembrandt lighting from upper left, warm golden hour side-light "
            "illuminating the pearlescent inner chambers. CineStill 800T film stock rendering — warm tungsten tones, "
            "subtle halation glow on highlights. Shallow depth of field with creamy bokeh. "
            "Deep blacks in background fading to nothing. Visible film grain, slight chromatic aberration at edges. "
            "The spiral geometry is the hero — mathematical precision meets organic beauty. "
            "Museum-quality fine art photography, editorial lighting."
        ),
        "aspect_ratio": "16:9",
    },
    "macro-lens": {
        "prompt": (
            "Extreme macro close-up photograph of a vintage camera lens element, "
            "showing the glass coating reflections and internal lens groups. Shot on Fujifilm GFX 100S "
            "with extension tubes, 90mm macro. Practical lighting from behind the lens creates a golden glow "
            "through the glass elements. Kodak Portra 400 film stock — warm skin tones even on glass, creamy highlights. "
            "Razor-thin depth of field, only the front element in focus. Visible dust motes caught in the light beam. "
            "The lens coating shows iridescent purple and green reflections. Dark matte background. "
            "Film grain texture, subtle vignetting. Professional product photography with editorial mood."
        ),
        "aspect_ratio": "16:9",
    },
    "macro-texture": {
        "prompt": (
            "Extreme close-up macro photograph of light passing through a crystal prism, "
            "splitting into a rainbow spectrum on a white surface. Shot on Leica M6 with vintage 50mm Summicron, "
            "Fuji Pro 400H film stock — cool greens in the shadows, muted pastels in the rainbow refraction. "
            "Soft natural window light from the side. Very shallow depth of field. "
            "The crystal itself is slightly out of focus, the projected light spectrum is tack sharp. "
            "Minimal composition, generous negative space. Film grain, slight lens flare from the refraction. "
            "Clean, editorial, almost abstract. White background with subtle shadow gradients."
        ),
        "aspect_ratio": "16:9",
    },
}

for name, config in images.items():
    print(f"Generating {name}...")
    payload = {
        "prompt": config["prompt"],
        "aspect_ratio": config["aspect_ratio"],
        "num_images": 1,
    }
    resp = requests.post(ENDPOINT, json=payload, headers=HEADERS, timeout=120)
    resp.raise_for_status()
    data = resp.json()
    img_url = data["images"][0]["url"]
    img_data = requests.get(img_url, timeout=60).content
    path = os.path.join(OUT_DIR, f"{name}.jpg")
    with open(path, "wb") as f:
        f.write(img_data)
    print(f"  ✅ Saved: {path} ({len(img_data)//1024}KB)")
    time.sleep(1)

print("\n✅ All PDF images generated!")
