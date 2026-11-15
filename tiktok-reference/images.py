import requests, pathlib, subprocess, io
from PIL import Image, ImageDraw, ImageFont
from concurrent.futures import ThreadPoolExecutor
URL="https://www.tiktok.com/@dk.gameplay0/photo/7707808873649868053"
data=requests.get("https://www.tikwm.com/api/",params={"url":URL},timeout=35).json()["data"]
images=data["images"]
print("IMAGES",len(images),"TITLE",data.get("title"),flush=True)
out=pathlib.Path("tiktok-reference");out.mkdir(exist_ok=True)
def download(item):
 i,url=item
 r=requests.get(url,timeout=35,headers={"User-Agent":"Mozilla/5.0","Referer":"https://www.tiktok.com/"})
 r.raise_for_status()
 f=out/f"original{i:02d}.jpg"
 f.write_bytes(r.content)
 img=Image.open(io.BytesIO(r.content)).convert("RGB")
 print("FILE",i,img.size,len(r.content),flush=True)
 return i,img
res=sorted(ThreadPoolExecutor(max_workers=5).map(download,enumerate(images)),key=lambda x:x[0])
size=(330,580);pad=10
sheet=Image.new("RGB",(3*(size[0]+pad)+pad,3*(size[1]+pad)+pad),(22,22,25))
for i,img in res:
 img.thumbnail(size)
 x=pad+(i%3)*(size[0]+pad)+(size[0]-img.width)//2
 y=pad+(i//3)*(size[1]+pad)+(size[1]-img.height)//2
 sheet.paste(img,(x,y))
 d=ImageDraw.Draw(sheet);d.rectangle([x,y,x+55,y+30],fill="black");d.text((x+10,y+5),str(i+1),fill="white")
sheet.save(out/"contact-sheet.jpg",quality=86)
print("SHEET",sheet.size,flush=True)
