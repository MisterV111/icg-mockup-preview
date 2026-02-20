#!/usr/bin/env python3
"""Generate vintage 'behind the scenes' photographer images for PDF backgrounds."""
import subprocess, os, json, time

FAL_KEY = "3b076811-c8e4-4975-9348-2e3b4a197bba:71dcf43ca6673ee859b5d6f262a3f163"
ENDPOINT = "https://fal.run/fal-ai/nano-banana-pro"
OUT_DIR = "assets/images/pdf"
os.makedirs(OUT_DIR, exist_ok=True)

images = {
    "cover-1920s-factory": {
        "prompt": (
            "Vintage sepia-toned photograph from the 1920s industrial era. A photographer in period clothing — "
            "flat cap, wool vest, rolled sleeves — crouches with a large-format bellows camera on a wooden tripod, "
            "photographing factory workers operating heavy machinery in a cavernous industrial workshop. "
            "Dramatic shafts of dusty light pour through tall arched windows, illuminating steam and metal sparks. "
            "Workers in the background wear leather aprons, surrounded by gears, pulleys, and iron equipment. "
            "Shot on silver gelatin glass plate. Deep blacks, luminous highlights, visible grain structure. "
            "The photographer is in sharp focus in the foreground left third, workers slightly soft in the background. "
            "Lewis Hine documentary photography style. Warm sepia tone with rich midtones. "
            "Period-authentic: no modern equipment visible. Atmospheric, reverent, editorial."
        ),
        "aspect_ratio": "3:4",
    },
    "camera-1910s-boxcamera": {
        "prompt": (
            "Black and white photograph from the 1910s. A photographer in a long dark coat and bowler hat "
            "operates a large wooden box camera on a sturdy tripod in a portrait studio. The subject — a woman "
            "in an Edwardian high-collar dress — sits perfectly still on a wooden chair against a painted backdrop. "
            "A flash powder tray on a tall stand is visible to the side. The studio has exposed brick walls, "
            "a skylight overhead casting soft directional light. Glass plate photography aesthetic — "
            "orthochromatic film rendering with luminous skin tones and deep velvety blacks. "
            "Incredibly fine detail in the camera's brass fittings and bellows leather. "
            "The photographer's hands are slightly blurred from adjusting the lens — subtle motion. "
            "August Sander meets Edward Curtis. Formal, precise, contemplative mood. "
            "Period-authentic darkroom chemistry feel. Visible film grain, slight vignetting at corners."
        ),
        "aspect_ratio": "3:4",
    },
    "techniques-1960s-darkroom": {
        "prompt": (
            "Atmospheric photograph of a 1960s darkroom. A photographer in a black turtleneck leans over "
            "a developer tray, using tongs to lift a large black-and-white print emerging from the chemical bath. "
            "The image on the print is just becoming visible — a portrait slowly appearing like magic. "
            "Deep red safelight casts everything in warm crimson tones, creating dramatic shadows on the "
            "photographer's concentrated face. Shelves of brown chemical bottles line the walls. "
            "An enlarger with its cone of light stands in the background. Clothesline with hanging prints "
            "crosses above. Timer clock on the wall. Multiple trays of developer, stop bath, and fixer "
            "in a row on the wet bench. Shot on Kodak Tri-X 400 pushed to 1600 — heavy grain, high contrast, "
            "rich blacks. The red safelight is the only illumination. Intimate, alchemical atmosphere. "
            "Gordon Parks darkroom aesthetic. Period-authentic: no digital anything."
        ),
        "aspect_ratio": "3:4",
    },
}

for name, config in images.items():
    print(f"\n🎨 Generating {name}...")
    payload = json.dumps({
        "prompt": config["prompt"],
        "aspect_ratio": config["aspect_ratio"],
        "num_images": 1,
    })
    
    result = subprocess.run(
        ["curl", "-s", "--max-time", "120",
         "-X", "POST", ENDPOINT,
         "-H", f"Authorization: Key {FAL_KEY}",
         "-H", "Content-Type: application/json",
         "-d", payload],
        capture_output=True, text=True
    )
    
    if result.returncode != 0:
        print(f"  ❌ curl failed: {result.stderr}")
        continue
    
    try:
        data = json.loads(result.stdout)
    except json.JSONDecodeError:
        print(f"  ❌ JSON parse error: {result.stdout[:200]}")
        continue
    
    img_url = data["images"][0]["url"]
    print(f"  📥 Downloading from {img_url[:60]}...")
    
    dl = subprocess.run(
        ["curl", "-s", "--max-time", "60", "-o", f"{OUT_DIR}/{name}.jpg", img_url],
        capture_output=True, text=True
    )
    
    size = os.path.getsize(f"{OUT_DIR}/{name}.jpg") // 1024
    print(f"  ✅ Saved: {OUT_DIR}/{name}.jpg ({size}KB)")
    time.sleep(2)

print("\n✅ All vintage photography images generated!")
