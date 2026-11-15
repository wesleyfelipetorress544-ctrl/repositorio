#!/usr/bin/env python3
"""Real GTA VI trailer frames + official 2022 Rockstar Tommy Vercetti tribute art.
Prefer 1080p official YouTube source; gracefully fall back to indexed real trailer stills.
"""
import re,urllib.request,urllib.parse,html,pathlib,subprocess,os,glob
P=pathlib.Path("public");P.mkdir(exist_ok=True)
H={"User-Agent":"Mozilla/5.0 Chrome/126 Safari/537.36"}
def fetch(u):
 return urllib.request.urlopen(urllib.request.Request(u,headers=H),timeout=45).read()
def run(*args):
 return subprocess.run(args,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True)
shots=[(2,33.0,'Tommy shirt lizard in shop'),(2,127.0,'RDR2 presidents on banknotes'),(2,134.0,"Phil's Ammu-Nation TV"),(1,77.0,'Petty Forever sticker'),(2,11.3,'Jason fixing leaks')]
pages={}
for n in (1,2):
 url=f"https://leonidabay.com/en/trailers/trailer-{n}"
 raw=fetch(url).decode("utf-8","replace")
 matches=[(float(t),html.unescape(src)) for t,src in re.findall(r'<a href="\\?t=\\d+#reproductor" data-seek="([\\d.]+)"[^>]*>\\s*<img src="([^"]+)"',raw,re.S)]
 assert len(matches)>=25, f"Indexed real trailer frames unavailable for trailer {n}"
 pages[n]=(url,matches)
 print("TRAILER INDEX",n,len(matches),flush=True)
# Download official Rockstar tribute artwork featuring Tommy's original Hawaiian shirt
art=[
 "https://pbs.twimg.com/media/FTtB1EEX0AAExKL?format=jpg&name=large",
 "https://pbs.twimg.com/media/FTtB1EEX0AAExKL.jpg",
]
for src in art:
 try:
  data=fetch(src)
  if len(data)>12000:
   (P/"tommy.jpg").write_bytes(data);print("TOMMY_OFFICIAL_REFERENCE",len(data),src,flush=True);break
 except Exception as e: print("Tommy source fallback",str(e)[:100],flush=True)
assert (P/"tommy.jpg").exists(),"Cannot make the Tommy comparison without verified original Rockstar artwork."

# Try full resolution Rockstar trailers first. Never fake the source imagery.
video_urls={
 1:"https://www.youtube.com/watch?v=QdBZY2fkU-0",
 2:"https://www.youtube.com/watch?v=VQRLujxTm3c",
}
for n in (1,2):
 if not any(k==n for k,_,_ in shots): continue
 path=f"trailer{n}.mp4"
 result=run("yt-dlp","--no-playlist","--socket-timeout","18","--retries","1",
            "-f","best[height<=1080][ext=mp4]/best[height<=1080]/best","-o",path,video_urls[n])
 if result.returncode!=0 or not pathlib.Path(path).exists():
  print("HD trailer unavailable; use authentic indexed frame",n,result.stderr[-280:],flush=True)
  continue
 print("HD trailer downloaded",n,os.stat(path).st_size,flush=True)

for i,(n,t,label) in enumerate(shots):
 out=P/f"scene{i}.jpg"
 path=f"trailer{n}.mp4"
 if pathlib.Path(path).exists():
  result=run("ffmpeg","-y","-loglevel","error","-ss",str(t),"-i",path,"-frames:v","1","-q:v","2",str(out))
  if result.returncode==0 and out.exists() and out.stat().st_size>12000:
   print("HD SOURCE",i,label,out.stat().st_size,flush=True);continue
 url,matches=pages[n]
 best=min(matches,key=lambda item:abs(item[0]-t))
 assert abs(best[0]-t)<=3.6, f"Wrong scene frame: {n} {t}"
 original=fetch(urllib.parse.urljoin(url,best[1]))
 source=P/f"fallback{i}.webp";source.write_bytes(original)
 subprocess.run(["ffmpeg","-y","-loglevel","error","-i",str(source),"-frames:v","1","-q:v","2",str(out)],check=True)
 print("AUTHENTIC TRAILER STILL",i,best[0],out.stat().st_size,flush=True)
(P/"poster.webp").write_bytes(fetch(urllib.parse.urljoin(pages[2][0],"/trailers/trailer2/poster.webp")))
for i in range(5): assert (P/f"scene{i}.jpg").stat().st_size>2000
print("Verified five scene images plus original Tommy reference",flush=True)
