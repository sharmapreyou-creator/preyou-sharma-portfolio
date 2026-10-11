#!/usr/bin/env python3
"""
Build the looping hero clip + portrait + OG image from your intro video.

Needs: ffmpeg, ffprobe, python3, numpy, Pillow.

  python3 scripts/build-hero-assets.py \
      --src intro.mp4 --photo my-photo.jpg \
      [--crop W:H:X:Y] [--portrait-crop W:H:X:Y]

Outputs (into ./public):
  hero/hero.mp4, hero/hero.webm, portrait-bust.webp, og.jpg, favicon.ico

The loop is seamless: the last XFADE seconds are cross-faded into the first
XFADE seconds (picture with ffmpeg xfade, audio sample-accurately in numpy),
and the clip is never stretched or retimed, so the lips stay in sync.
"""
import argparse, json, subprocess, sys, tempfile, wave
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont

OUT_W, OUT_H, FPS = 768, 960, 24


def run(cmd, **kw):
    return subprocess.run(cmd, check=True, **kw)


def probe(src):
    out = run(["ffprobe", "-v", "error", "-print_format", "json", "-show_streams",
               "-show_format", str(src)], capture_output=True, text=True).stdout
    j = json.loads(out)
    v = next(s for s in j["streams"] if s["codec_type"] == "video")
    has_audio = any(s["codec_type"] == "audio" for s in j["streams"])
    return int(v["width"]), int(v["height"]), float(j["format"]["duration"]), has_audio


def frames_gray(src, w, h, times):
    frames = []
    for t in times:
        raw = run(["ffmpeg", "-v", "error", "-ss", f"{t:.2f}", "-i", str(src), "-frames:v", "1",
                   "-f", "rawvideo", "-pix_fmt", "gray", "-"], capture_output=True).stdout
        frames.append(np.frombuffer(raw, np.uint8).reshape(h, w))
    return frames


def detect(src, w, h, dur):
    """Find the person (dark pixels on a light backdrop) and return crop + backdrop level."""
    frames = frames_gray(src, w, h, np.linspace(0.3, max(0.4, dur - 0.5), 6))
    stack = np.stack(frames).min(axis=0)  # union of everything dark in any frame
    ys, xs = np.where(stack < 150)
    if len(xs) == 0:
        sys.exit("Could not find a person. Pass --crop W:H:X:Y yourself.")
    x0, x1 = np.percentile(xs, [0.2, 99.8])
    y0, y1 = np.percentile(ys, [0.2, 99.8])
    person_h = (y1 - y0) * 1.07  # + white shoes
    ch = min(h, int(person_h * 1.12))
    cw = int(ch * OUT_W / OUT_H)
    cx = (x0 + x1) / 2
    cy0 = int(max(0, min(h - ch, y0 - (ch - person_h) * 0.45)))
    cx0 = int(max(0, min(w - cw, cx - cw / 2)))
    cw -= cw % 2
    ch -= ch % 2
    region = frames[0][cy0:cy0 + ch, cx0:cx0 + cw]
    bg = region[region > 200]
    level = float(np.percentile(bg, 8)) / 255 if bg.size else 0.98
    return (cw, ch, cx0, cy0), level


def build_video_filter(crop, rimax, xf, dur):
    cw, ch, cx, cy = crop
    base = (f"crop={cw}:{ch}:{cx}:{cy},scale={OUT_W}:{OUT_H}:flags=lanczos,"
            f"colorlevels=rimax={rimax:.3f}:gimax={rimax:.3f}:bimax={rimax:.3f},"
            f"fps={FPS},setsar=1,format=yuv420p")
    return (f"[0:v]trim=0:{dur},setpts=PTS-STARTPTS,{base},split=3[a][b][c];"
            f"[a]trim=start={xf}:end={dur - xf},setpts=PTS-STARTPTS[body];"
            f"[b]trim=start={dur - xf}:end={dur},setpts=PTS-STARTPTS[tail];"
            f"[c]trim=start=0:end={xf},setpts=PTS-STARTPTS[head];"
            f"[tail][head]xfade=transition=fade:duration={xf}:offset=0[blend];"
            f"[body][blend]concat=n=2:v=1:a=0[v]")


def loop_audio(src, dur, xf, wav_out):
    """Equal-power cross-fade of the last xf seconds into the first xf seconds."""
    sr, ch = 48000, 2
    raw = run(["ffmpeg", "-v", "error", "-t", f"{dur}", "-i", str(src), "-vn", "-ac", str(ch),
               "-ar", str(sr), "-f", "f32le", "-"], capture_output=True).stdout
    a = np.frombuffer(raw, np.float32).reshape(-1, ch)
    total = int(round(dur * sr))
    n = int(round(xf * sr))
    if a.shape[0] < total:
        a = np.vstack([a, np.zeros((total - a.shape[0], ch), np.float32)])
    a = a[:total]
    t = np.linspace(0, np.pi / 2, n, dtype=np.float32)[:, None]
    blend = a[total - n:] * np.cos(t) + a[:n] * np.sin(t)
    out = np.vstack([a[n:total - n], blend])
    pcm = (np.clip(out, -1, 1) * 32767).astype("<i2")
    with wave.open(str(wav_out), "wb") as w:
        w.setnchannels(ch)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(pcm.tobytes())
    return a


def encode(src, flt, wav, out, kind):
    cmd = ["ffmpeg", "-v", "error", "-y", "-i", str(src)]
    if wav:
        cmd += ["-i", str(wav)]
    cmd += ["-filter_complex", flt, "-map", "[v]"]
    if wav:
        cmd += ["-map", "1:a"]
    if kind == "mp4":
        cmd += ["-c:v", "libx264", "-crf", "24", "-preset", "slow", "-pix_fmt", "yuv420p"]
        if wav:
            cmd += ["-c:a", "aac", "-b:a", "96k"]
        cmd += ["-movflags", "+faststart"]
    else:
        cmd += ["-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1", "-pix_fmt", "yuv420p"]
        if wav:
            cmd += ["-c:a", "libopus", "-b:a", "80k"]
    cmd += ["-shortest", str(out)]
    run(cmd)


def font(size, bold=False):
    for p in ["/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf" % ("-Bold" if bold else ""),
              "/Library/Fonts/Arial.ttf", "C:/Windows/Fonts/arial.ttf"]:
        if Path(p).exists():
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def portrait(photo, crop, out_dir):
    im = Image.open(photo).convert("RGB")
    W, H = im.size
    if crop:
        w, h, x, y = crop
    else:  # trim a 6% border (removes rounded black corners), then head-to-shirt
        b = int(min(W, H) * 0.06)
        w = int((W - 2 * b) * 0.9)
        h = int(w / 0.8)
        x = (W - w) // 2
        y = b
    p = im.crop((x, y, x + w, min(H, y + h))).resize((480, 600), Image.LANCZOS)
    p.save(out_dir / "portrait-bust.webp", quality=88)
    return p


def og(p, out_dir, name, role):
    paper = Image.new("RGB", (1200, 630), (244, 242, 238))
    d = ImageDraw.Draw(paper)
    paper.paste(p.resize((420, 525), Image.LANCZOS), (700, 52))
    d.text((70, 230), name, font=font(68, True), fill=(13, 13, 13))
    d.text((72, 330), role, font=font(40), fill=(119, 117, 111))
    paper.save(out_dir / "og.jpg", quality=90)


def favicon(out_dir, initials):
    im = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.ellipse((4, 4, 124, 124), fill=(13, 13, 13))
    f = font(56, True)
    bb = d.textbbox((0, 0), initials, font=f)
    d.text(((128 - (bb[2] - bb[0])) / 2 - bb[0], (128 - (bb[3] - bb[1])) / 2 - bb[1]),
           initials, font=f, fill=(255, 255, 255))
    im.save(out_dir / "favicon.ico", sizes=[(64, 64), (32, 32), (16, 16)])


def parse(s):
    return tuple(int(v) for v in s.split(":")) if s else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", required=True)
    ap.add_argument("--photo")
    ap.add_argument("--out", default="public")
    ap.add_argument("--crop", help="W:H:X:Y crop of the source (default: auto-detect)")
    ap.add_argument("--portrait-crop", help="W:H:X:Y crop of the photo")
    ap.add_argument("--xfade", type=float, default=0.5)
    ap.add_argument("--max-seconds", type=float, default=10.0)
    ap.add_argument("--name", default="Preyou Sharma")
    ap.add_argument("--role", default="HR Executive")
    ap.add_argument("--initials", default="PS")
    a = ap.parse_args()

    out = Path(a.out)
    (out / "hero").mkdir(parents=True, exist_ok=True)
    w, h, dur, has_audio = probe(a.src)
    dur = min(dur, a.max_seconds)
    crop = parse(a.crop)
    if crop is None:
        crop, level = detect(a.src, w, h, dur)
    else:
        level = 0.98
    rimax = min(0.98, max(0.9, level - 0.005))
    print(f"source {w}x{h} {dur:.2f}s | crop {crop} | backdrop->white at rimax={rimax:.3f}")

    flt = build_video_filter(crop, rimax, a.xfade, dur)
    with tempfile.TemporaryDirectory() as td:
        wav = None
        if has_audio:
            wav = Path(td) / "loop.wav"
            loop_audio(a.src, dur, a.xfade, wav)
        encode(a.src, flt, wav, out / "hero" / "hero.mp4", "mp4")
        encode(a.src, flt, wav, out / "hero" / "hero.webm", "webm")
    print("wrote hero.mp4 and hero.webm (loop length %.2fs)" % (dur - a.xfade))

    if a.photo:
        p = portrait(a.photo, parse(a.portrait_crop), out)
    else:  # fall back to a frame from the video
        run(["ffmpeg", "-v", "error", "-y", "-ss", str(dur / 2), "-i", a.src, "-frames:v", "1", "/tmp/_f.png"])
        p = portrait("/tmp/_f.png", parse(a.portrait_crop), out)
    og(p, out, a.name, a.role)
    favicon(out, a.initials)
    print("wrote portrait-bust.webp, og.jpg, favicon.ico")


if __name__ == "__main__":
    main()
