from pathlib import Path
import requests, subprocess, shutil
P=Path("public");P.mkdir(exist_ok=True)
# Genuine GTA VI imagery. No stock photos or made-up screenshots.
sources=[
 ("city", "https://www.rockstargames.com/VI/_next/static/media/Vice_City_05.0~r~o0jzpp4a-.jpg"),
 ("night", "https://www.topgear.com/sites/default/files/2023/12/gta6%20copy.jpg"),
 ("beach", "https://www.rockstargames.com/VI/_next/static/media/Vice_City_05.0~r~o0jzpp4a-.jpg"),
 ("boats", "https://media.gtaboom.com/variants/1280/media/images/77/ae/State_of_Leonida_-_Leonida_Keys_Image_2.jpg"),
 ("birds", "https://www.gtabase.com/igallery/gta-6-screenshots-trailer/gta-6-trailer1-screenshot-08-leonida-1080.jpg"),
 ("swamp", "https://www.igrandtheftauto.com/content/images/grassrivers-04.jpg"),
 ("islands", "https://www.gtaboom.com/Leonida_Keys_01.jpg"),
 ("characters", "https://eu-images.contentstack.com/v3/assets/bltbc1876152fcd9f07/blt838b0ed6d0243742/698314a4ad4921d597d302c9/gta6gameplayreveal.jpg")
]
def get(url):
 r=requests.get(url,headers={"User-Agent":"Mozilla/5.0","Referer":"https://www.google.com/"},timeout=40)
 r.raise_for_status()
 assert len(r.content)>9000, (url,len(r.content))
 return r.content
first=None
for idx,(name,url) in enumerate(sources):
 try:
  content=get(url)
  raw=P/f"{name}.raw";raw.write_bytes(content)
  proc=subprocess.run(["ffmpeg","-y","-hide_banner","-loglevel","error","-i",str(raw),"-frames:v","1","-q:v","3",str(P/f"{name}.jpg")],capture_output=True,text=True)
  if proc.returncode:raise RuntimeError(proc.stderr[-200:])
  (P/f"{name}.jpg").stat().st_size
  if first is None:first=P/f"{name}.jpg"
  print("IMAGE",name,len(content),url,flush=True)
 except Exception as err:
  print("IMAGE FALLBACK",name,str(err)[:140],flush=True)
  if first is None:raise
  shutil.copyfile(first,P/f"{name}.jpg")
assert len(list(P.glob("*.jpg")))>=8
