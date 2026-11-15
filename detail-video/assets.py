#!/usr/bin/env python3
"""Frame grabs tied to genuine Reddit-discovered GTA VI easter eggs in Rockstar trailers."""
import re,urllib.request,urllib.parse,html,pathlib
ROOT=pathlib.Path("public");ROOT.mkdir(exist_ok=True)
H={"User-Agent":"Mozilla/5.0 Chrome/126 Safari/537.36"}
def fetch(u):return urllib.request.urlopen(urllib.request.Request(u,headers=H),timeout=35).read()
pages={}
for which in (1,2):
 url=f"https://leonidabay.com/en/trailers/trailer-{which}"
 raw=fetch(url).decode("utf-8","replace")
 pairs=[(float(s),html.unescape(src)) for s,src in re.findall(r'<a href="\?t=\d+#reproductor" data-seek="([\d.]+)"[^>]*>\s*<img src="([^"]+)"',raw,re.S)]
 assert len(pairs)>30,f"No archive frames for trailer {which}"
 pages[which]=(url,pairs)
 print(f"Trailer {which} indexed {len(pairs)} real frames",flush=True)

# Frame target, from indexed fan analysis of the original Rockstar videos. The
# commentary distinguishes interpretation from visually verified imagery.
shots=[
 (2,33.0,"Iguana painting in shop with shirt resembling Tommy Vercetti"),
 (2,127.0,"Hardin and Waxman RDR2 presidents printed on GTA VI club banknotes"),
 (2,134.0,"Phil's Ammu-Nation advert with mullet presenter"),
 (1,77.0,"Petty Forever memorial sticker on store door"),
 (2,11.3,"Jason fixing the roof leaks, possible nod to GTA VI 2022 leaks"),
]
for i,(which,sec,label) in enumerate(shots):
 url,pairs=pages[which]
 nearest=min(pairs,key=lambda p:abs(p[0]-sec))
 assert abs(nearest[0]-sec)<3.6,f"Cannot map trailer {which} timestamp {sec} to source frame"
 data=fetch(urllib.parse.urljoin(url,nearest[1]))
 assert len(data)>2000
 p=ROOT/f"scene{i}.webp";p.write_bytes(data)
 print(f"{i+1}: trailer={which} frame={nearest[0]} caption={label} bytes={len(data)}",flush=True)
poster=ROOT/"poster.webp"
poster.write_bytes(fetch(urllib.parse.urljoin(pages[2][0],"/trailers/trailer2/poster.webp")))
print("Five source-specific trailer frames downloaded",flush=True)

# Dedicated closeups when available: real GTA VI screenshots, not AI-generated images.
# Also prepare a focus still for each item so the Remotion close-up transition
# always shows exactly the referenced game's own image.
import subprocess
closeups={
  1:"https://rockstarintel.com/wp-content/uploads/2025/05/Vice_City_07-Copy.jpg",
  2:"https://image.thenerdstash.com/2025/05/phil-gta.jpg",
}
for i in range(5):
    target=ROOT/f"close{i}.jpg"
    if i in closeups:
        try:
            data=fetch(closeups[i])
            if len(data)>4000:
                temp=ROOT/f"extra{i}.dat";temp.write_bytes(data)
                subprocess.run(["ffmpeg","-y","-loglevel","error","-i",str(temp),"-frames:v","1",str(target)],check=True)
                temp.unlink()
                print("Specialized real-photo closeup",i,len(data),flush=True)
                continue
        except Exception as e:
            print("Closeup source unavailable; using official trailer frame",i,str(e)[:160],flush=True)
    subprocess.run(["ffmpeg","-y","-loglevel","error","-i",str(ROOT/f"scene{i}.webp"),"-frames:v","1",str(target)],check=True)
    print("Closeup from actual trailer frame",i,flush=True)
