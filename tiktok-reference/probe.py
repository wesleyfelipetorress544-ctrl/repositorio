import requests, subprocess,json,re
URL='https://www.tiktok.com/@dk.gameplay0/photo/7707808873649868053'
for link in [URL,'https://www.tiktok.com/oembed?url='+URL,'https://www.tiktok.com/embed/v2/7707808873649868053','https://www.tikwm.com/api/?url='+URL]:
 try:
  r=requests.get(link,timeout=18,headers={'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36','Referer':'https://www.google.com/'})
  print('HTTP',r.status_code,'URL',link,'length',len(r.content))
  txt=r.text
  for key in ['__UNIVERSAL_DATA_FOR_REHYDRATION__','imagePost','image_list','imagePostInfo','images','title','og:description']:
   if key in txt:print('contains',key)
  if 'tikwm.com/api/' in link:
   print('JSON',txt[:10000])
  elif 'oembed' in link:
   print('OEMBED',txt[:4000])
 except Exception as e:print('ERROR',str(e))
r=subprocess.run(['yt-dlp','--dump-single-json','--skip-download',URL],capture_output=True,text=True,timeout=65)
print('YTDLP STATUS',r.returncode,'OUT',r.stdout[:13000],'ERR',r.stderr[-1600:])
