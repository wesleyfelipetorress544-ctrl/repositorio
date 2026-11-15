#!/usr/bin/env python3
"""Download the exact Trailer 2 frame grabs for ten verifiable visible moments.
The stills are from the official Rockstar trailer as indexed by Leonida Bay;
do not substitute generic art or fabricate in-game screenshots.
"""
import re, urllib.request, urllib.parse, pathlib, html as htmlmod, math
ROOT=pathlib.Path("public");ROOT.mkdir(exist_ok=True)
url="https://leonidabay.com/en/trailers/trailer-2"
agent={"User-Agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126 Safari/537.36"}
def fetch(url):
    return urllib.request.urlopen(urllib.request.Request(url,headers=agent),timeout=40).read()
raw=fetch(url).decode("utf-8","replace")
# The original source contains an image per scene, with a precise seeking timestamp.
pattern=r'<a href="\?t=\d+#reproductor" data-seek="([\d.]+)"[^>]*>\s*<img src="([^"]+)"'
pairs=[]
for at,src in re.findall(pattern,raw,re.S):
    src=htmlmod.unescape(src)
    pairs.append((float(at),src))
print("SCENE_FRAME_PAIRS",len(pairs),flush=True)
assert len(pairs)>=50,"Source does not provide enough scene-specific trailer frame stills."
moments=[
    (11.28,"Jason fixes his leaking roof"),
    (9.16,"Brian Heder and his pickup"),
    (34.25,"Airport and downtown direction signs"),
    (38.40,"Bench press at beach gym"),
    (45.15,"Police checkpoint on road"),
    (63.32,"Lucia exits the penitentiary"),
    (85.1,"Brian's Boat Works sign"),
    (124.17,"Video selfie in nightclub"),
    (138.30,"Helicopter chases boat over Grassrivers"),
    (152.87,"Waves flooding the coastal road"),
]
for idx,(sec,title) in enumerate(moments):
    best=min(pairs,key=lambda a:abs(a[0]-sec))
    if abs(best[0]-sec)>3.6: raise ValueError(f"Frame mismatch {idx} sought {sec}, found {best}")
    src=urllib.parse.urljoin(url,best[1])
    data=fetch(src)
    assert len(data)>2500,f"Too small: {src}"
    p=ROOT/f"scene{idx}.webp"
    p.write_bytes(data)
    print(f"FRAME {idx+1}: target={sec}, source={best[0]}, bytes={len(data)}, image={src}, subject={title}",flush=True)
poster=ROOT/"poster.webp"
poster_src=urllib.parse.urljoin(url,"/trailers/trailer2/poster.webp")
poster.write_bytes(fetch(poster_src))
print("All 10 unique original video frame grabs downloaded",flush=True)
