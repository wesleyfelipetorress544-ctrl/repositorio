#!/usr/bin/env python3
import re,urllib.request,json
url='https://leonidabay.com/en/trailers/trailer-2'
req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
html=urllib.request.urlopen(req,timeout=25).read().decode('utf-8','replace')
print('HTML-LENGTH',len(html))
for key in ['0:08','Jason fixes','frame','thumbnail','_next','img','2:32']:
 print('KEY',key,'count',html.lower().count(key.lower()))
for m in list(re.finditer(r'.{0,300}(?:0:08|Jason fixes|2:32|frame-grab|frameGrab).{0,400}',html,re.I))[:7]:
 print('SNIPPET',m.group(0)[:500])
for x in re.findall(r'<img[^>]+>',html):
 if any(s in x.lower() for s in ('trailer','frame','scene','shot')):
  print('IMAGE',x[:900])
  if html.count('<img')>30:break
open('probe.html','w').write(html)
