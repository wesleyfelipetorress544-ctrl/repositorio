#!/usr/bin/env python3
"""Download seven different real GTA VI police stills, from published Rockstar material."""
from pathlib import Path
from urllib.parse import urljoin
import requests, re, html, subprocess
P=Path("public");P.mkdir(exist_ok=True)
# Each target is a distinct, real image; no unrelated fallback is permitted.
photos=[
 ("city","https://leonidahub.org/en/gallery/lucia-and-a-cop-at-night"),
 ("night","https://leonidahub.org/en/gallery/vehiculos-vcpd-lowline-frame"),
 ("beach","https://leonidahub.org/en/gallery/vice-city-17"),
 ("birds","https://leonidahub.org/en/gallery/lucia-caminos-07"),
 ("boats","https://leonidahub.org/en/gallery/jason-duval-08"),
 ("characters","https://leonidahub.org/en/gallery/police-at-the-grassrivers-visitor-center-lockers"),
 ("swamp","https://leonidahub.org/en/gallery/jason-duval-18"),
]
h={"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/136 Safari/537.36"}
def request(u):
 r=requests.get(u,timeout=30,headers=h);r.raise_for_status();return r
for name,page in photos:
 source=request(page).text
 urls=[]
 for p in [r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)',r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image']:
  urls+=re.findall(p,source,re.I)
 # The actual displayed image, not navigation thumbnails.
 urls+=re.findall(r'<img[^>]+src=["\'](https?://api\.leonidahub\.org/[^"\']+)["\']',source,re.I)
 urls+=re.findall(r'https?://api\.leonidahub\.org/[^"\' <]+',source,re.I)
 errors=[]
 for url in dict.fromkeys(urls):
  try:
   url=html.unescape(url).replace("&amp;","&")
   data=request(url).content
   if len(data)<11000:continue
   raw=P/f"{name}.download";raw.write_bytes(data)
   out=P/f"{name}.jpg"
   r=subprocess.run(["ffmpeg","-y","-hide_banner","-loglevel","error","-i",str(raw),"-frames:v","1","-q:v","2",str(out)],capture_output=True,text=True)
   if r.returncode:raise RuntimeError(r.stderr[-240:])
   assert out.stat().st_size>9000
   print("PHOTO",name,len(data),url,flush=True);break
  except Exception as e:errors.append(str(e)[:150])
 else:raise RuntimeError(f"Cannot retrieve real {name} image from {page}. Candidates={len(urls)}, errors={errors[:4]}")
assert len(list(P.glob("*.jpg")))==7
