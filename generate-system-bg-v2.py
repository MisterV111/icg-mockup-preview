#!/usr/bin/env python3
"""Generate 1960s TV broadcast control room for AI System section."""
import subprocess, os, json, time, functools
print = functools.partial(print, flush=True)

FAL_KEY = "3b076811-c8e4-4975-9348-2e3b4a197bba:71dcf43ca6673ee859b5d6f262a3f163"
QUEUE_ENDPOINT = "https://queue.fal.run/fal-ai/flux-2-flex"
OUT_DIR = "assets/backgrounds"

prompt = (
    "Black and white vintage photograph from the early 1960s. A television broadcast control room "
    "during a live show. A wall of small cathode ray tube monitors arranged in two rows — each showing "
    "a different camera angle of a studio set, some showing title cards, one showing the live program output. "
    "The monitors glow with soft phosphor light in the otherwise dark room. Below the monitor wall, "
    "a long switching desk with rows of illuminated push buttons, rotary faders, and tally lights. "
    "Three men seated at the desk viewed from behind — the director in center wearing a headset and "
    "pointing at one of the monitors, the technical director to his right with hands on the switcher buttons, "
    "an assistant to the left taking notes. All wearing white dress shirts with sleeves rolled up, "
    "dark ties loosened. Cigarette smoke drifting upward through the monitor glow. "
    "Coffee cups and paper scripts scattered on the desk. Cables bundled underneath. "
    "A clock on the wall showing broadcast time. The atmosphere is tense, focused, professional — "
    "the nerve center where content meets the audience. "
    "Shot on Kodak Tri-X 400 black and white film, pushed processing for high contrast. "
    "Deep rich blacks, luminous monitor highlights, visible grain structure. "
    "The photograph shows age: slight foxing at edges, minor chemical stains, fingerprint near corner, "
    "yellowed from decades of storage. Narrow tonal range from fading. "
    "All key visual elements clustered in center of frame — monitor wall and crew at desk. "
    "Edges fade to dark ceiling and walls. No modern flat screens or digital equipment. "
    "Period-authentic 1960s American network television production. Editorial documentary photograph."
)

payload = json.dumps({
    "prompt": prompt,
    "image_size": {"width": 2560, "height": 1440},
    "num_images": 1,
    "num_inference_steps": 28,
    "guidance_scale": 3.5,
})

print("🎨 Submitting 1960s TV broadcast control room...")
result = subprocess.run(
    ["curl", "-s", "--max-time", "30", "-X", "POST", QUEUE_ENDPOINT,
     "-H", f"Authorization: Key {FAL_KEY}", "-H", "Content-Type: application/json",
     "-d", payload], capture_output=True, text=True)

data = json.loads(result.stdout)
request_id = data["request_id"]
status_url = data.get("status_url")
response_url = data.get("response_url")
print(f"📋 Request ID: {request_id}")

for i in range(60):
    time.sleep(5)
    poll = subprocess.run(
        ["curl", "-s", "--max-time", "15", "-H", f"Authorization: Key {FAL_KEY}",
         status_url or f"{QUEUE_ENDPOINT}/requests/{request_id}/status"],
        capture_output=True, text=True)
    try:
        sd = json.loads(poll.stdout)
    except: continue
    status = sd.get("status", "")
    print(f"  [{i+1}] {status}", end="")
    if status == "COMPLETED":
        print(" ✅")
        res = subprocess.run(
            ["curl", "-s", "--max-time", "30", "-H", f"Authorization: Key {FAL_KEY}",
             response_url or f"{QUEUE_ENDPOINT}/requests/{request_id}"],
            capture_output=True, text=True)
        img_data = json.loads(res.stdout)
        img_url = img_data["images"][0]["url"]
        # Save raw
        subprocess.run(["curl", "-s", "--max-time", "60", "-o", f"{OUT_DIR}/system-bg-raw.jpg", img_url])
        # Desaturate (keep hint of monitor glow but mostly B&W)
        subprocess.run(["ffmpeg", "-y", "-i", f"{OUT_DIR}/system-bg-raw.jpg",
                       "-vf", "eq=saturation=0.2,colorbalance=rs=0.02:gs=0.01:bs=-0.01",
                       "-q:v", "4", f"{OUT_DIR}/system-bg.jpg"], capture_output=True)
        # Mobile
        subprocess.run(["ffmpeg", "-y", "-i", f"{OUT_DIR}/system-bg.jpg",
                       "-vf", "scale=1280:-1", "-q:v", "8", f"{OUT_DIR}/system-bg-mobile.jpg"], capture_output=True)
        os.remove(f"{OUT_DIR}/system-bg-raw.jpg")
        for f in ["system-bg.jpg", "system-bg-mobile.jpg"]:
            sz = os.path.getsize(f"{OUT_DIR}/{f}") // 1024
            print(f"  ✅ {f}: {sz}KB")
        break
    elif status == "FAILED":
        print(f" ❌ {sd.get('error')}")
        break
    else:
        print()

print("\n✅ Done!")
