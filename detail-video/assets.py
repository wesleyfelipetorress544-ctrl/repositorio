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
 (2,33.0,"Iguana wooden ornament wearing Tommy's shirt"),
 (2,126.0,"Red Dead presidents on banknotes at nightclub"),
 (2,129.0,"Phil's Ammu-Nation on TV"),
 (2,18.0,"Jason and the Vice City V-Rock callbacks"),
 (2,11.3,"Just fixing some leaks after 2022 leaks"),
 (2,60.0,"Let Freedom Reign shirt outside prison"),
 (2,45.0,"Miami metro and hidden transit behind police"),
 (1,32.0,"Ocean View Hotel from original Vice City"),
 (1,76.0,"Red Dead Online outlaw poster/sticker on shop door"),
 (1,76.0,"Petty Forever sticker and Tom Petty tribute on shop door"),
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
print("All 10 verified-source frames downloaded",flush=True)
