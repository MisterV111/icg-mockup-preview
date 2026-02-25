#!/usr/bin/env python3
"""Generate vintage section backgrounds Phase 2: 1960s + 1980s via Flux 2 Flex."""
import subprocess, os, json, time, sys, functools
print = functools.partial(print, flush=True)

FAL_KEY = "3b076811-c8e4-4975-9348-2e3b4a197bba:71dcf43ca6673ee859b5d6f262a3f163"
QUEUE_ENDPOINT = "https://queue.fal.run/fal-ai/flux-2-flex"
OUT_DIR = "assets/backgrounds"
os.makedirs(OUT_DIR, exist_ok=True)

images = {
    "system-bg": {
        "prompt": (
            "Vintage photograph from the 1960s, NASA-era mission control room. Rows of engineers in white "
            "short-sleeve dress shirts and thin dark ties seated at massive analog consoles stretching across "
            "the frame. Each console station has oscilloscopes with green phosphor traces, banks of toggle switches, "
            "rows of indicator lights glowing amber and red, rotary dials, and handwritten labels on masking tape. "
            "Shot from behind and slightly above at a 3/4 angle looking down the long row of stations — engineers "
            "seen from behind, hunched forward in concentration, faces obscured or lit only by console glow. "
            "Large wall-mounted plotting boards and projection screens visible in the far background showing "
            "trajectory diagrams. Overhead fluorescent tube lighting creates flat institutional illumination mixed "
            "with the warm glow of vacuum tube electronics. Coffee cups, paper printouts, slide rules, and ashtrays "
            "on consoles. Cables bundled across the floor. "
            "Shot on Kodachrome 64 film — warm saturated color, slightly boosted greens and blues, subtle magenta "
            "shift in shadows, fine grain structure. Institutional government-archive aesthetic. Mild halation "
            "around bright console lights. The photograph has aged: slight yellowing of highlights, minor foxing "
            "at edges, fingerprint smudge near one corner. Narrow tonal range from decades of storage. "
            "All visual elements clustered in center of frame. Edges fade to dark ceiling infrastructure and shadow. "
            "No modern equipment. Period-authentic 1960s space program aesthetic. Editorial documentary photograph."
        ),
        "width": 2560,
        "height": 1440,
    },
    "services-bg": {
        "prompt": (
            "Vintage photograph from the 1980s, professional post-production editing suite. A producer-editor "
            "viewed from behind sits at a massive analog mixing console — dozens of sliding faders in rows, "
            "large VU meters with bouncing needles, patch bays with cables plugged in. The editor wears a dark "
            "jacket, face seen only in profile silhouette lit by the cool blue glow of CRT monitors. "
            "Multiple CRT screens arranged above the console showing SMPTE color bars, vectorscope displays, "
            "a paused film frame of a dramatic scene. U-matic and Betacam SP tape decks stacked in professional "
            "rack-mount equipment behind and to the sides — reels visible, LED indicators glowing red. Film canisters "
            "and tape labels organized on shelves. A warm tungsten desk lamp on the left creates a split warm/cool "
            "color palette with the cool CRT glow on the right. Subtle cigarette smoke curling through the lamp light. "
            "Shot on Kodak Ektachrome 400 — warm amber-magenta color shift, visible film grain, period color science "
            "with slightly muted blacks and lifted shadows. Soft halation around the bright CRT screens. VHS-era "
            "texture. The photograph shows age: slight color fading, chemical development marks along edges, "
            "minor dust specks embedded in the emulsion. "
            "All key visual elements (editor, console, CRTs) clustered in center 50 percent of frame. "
            "Edges = dark equipment racks, cable shadows, atmospheric haze. "
            "No modern flat screens or digital equipment. Period-authentic 1980s MTV-era post-production. "
            "Editorial documentary photograph. Intimate, technical, professional atmosphere."
        ),
        "width": 2560,
        "height": 1440,
    },
}

def submit_and_poll(name, config):
    """Submit to Flux 2 Flex queue API and poll for result."""
    print(f"\n🎨 Submitting {name}...")
    payload = json.dumps({
        "prompt": config["prompt"],
        "image_size": {"width": config["width"], "height": config["height"]},
        "num_images": 1,
        "num_inference_steps": 28,
        "guidance_scale": 3.5,
    })
    
    # Submit to queue
    result = subprocess.run(
        ["curl", "-s", "--max-time", "30",
         "-X", "POST", QUEUE_ENDPOINT,
         "-H", f"Authorization: Key {FAL_KEY}",
         "-H", "Content-Type: application/json",
         "-d", payload],
        capture_output=True, text=True
    )
    
    if result.returncode != 0:
        print(f"  ❌ Submit failed: {result.stderr}")
        return None
    
    try:
        data = json.loads(result.stdout)
    except json.JSONDecodeError:
        print(f"  ❌ JSON parse error: {result.stdout[:300]}")
        return None
    
    request_id = data.get("request_id")
    status_url = data.get("status_url")
    response_url = data.get("response_url")
    
    if not request_id:
        print(f"  ❌ No request_id: {data}")
        return None
    
    print(f"  📋 Request ID: {request_id}")
    print(f"  ⏳ Polling for result...")
    
    # Poll for completion
    for attempt in range(60):  # up to 5 minutes
        time.sleep(5)
        
        poll = subprocess.run(
            ["curl", "-s", "--max-time", "15",
             "-H", f"Authorization: Key {FAL_KEY}",
             status_url or f"{QUEUE_ENDPOINT}/requests/{request_id}/status"],
            capture_output=True, text=True
        )
        
        try:
            status_data = json.loads(poll.stdout)
        except json.JSONDecodeError:
            continue
        
        status = status_data.get("status", "")
        print(f"    [{attempt+1}] Status: {status}", end="")
        
        if status == "COMPLETED":
            print(" ✅")
            # Fetch result
            res = subprocess.run(
                ["curl", "-s", "--max-time", "30",
                 "-H", f"Authorization: Key {FAL_KEY}",
                 response_url or f"{QUEUE_ENDPOINT}/requests/{request_id}"],
                capture_output=True, text=True
            )
            try:
                return json.loads(res.stdout)
            except json.JSONDecodeError:
                print(f"  ❌ Result parse error: {res.stdout[:300]}")
                return None
        elif status == "FAILED":
            print(f" ❌ Error: {status_data.get('error', 'unknown')}")
            return None
        else:
            queue_pos = status_data.get("queue_position", "?")
            print(f" (queue: {queue_pos})")

    print("  ❌ Timed out after 5 minutes")
    return None


for name, config in images.items():
    result = submit_and_poll(name, config)
    if not result:
        continue
    
    img_url = result.get("images", [{}])[0].get("url")
    if not img_url:
        print(f"  ❌ No image URL in result: {json.dumps(result)[:300]}")
        continue
    
    print(f"  📥 Downloading...")
    outpath = f"{OUT_DIR}/{name}.jpg"
    dl = subprocess.run(
        ["curl", "-s", "--max-time", "60", "-o", outpath, img_url],
        capture_output=True, text=True
    )
    
    if os.path.exists(outpath):
        size = os.path.getsize(outpath) // 1024
        print(f"  ✅ Saved: {outpath} ({size}KB)")
    else:
        print(f"  ❌ Download failed")
    
    time.sleep(2)

print("\n✅ Phase 2 vintage backgrounds generation complete!")
