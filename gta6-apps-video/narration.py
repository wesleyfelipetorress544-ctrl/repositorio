import asyncio,subprocess
from pathlib import Path
import edge_tts

S=[
 (0.20,"Conheça os aplicativos mostrados no celular de GTA seis."),
 (4.18,"Peek Hole, uma paródia de uma plataforma de conteúdo exclusivo."),
 (8.18,"Scooter Bros, serviço de entrega de veículos."),
 (12.18,"Buck Me, o aplicativo de banco digital."),
 (16.18,"WhatUp, para mensagens e conversas."),
 (20.18,"Waink, um aplicativo de escaneamento de veículos."),
 (24.18,"Snapmatic, a rede social de fotografias."),
 (28.18,"Ryde Me, um aplicativo de transporte."),
 (32.18,"E também um app de fitness, com informações sobre atividades e sono."),
 (36.15,"Qual desses aplicativos você teria mais curiosidade de usar?")
]
OUT=Path("voiceparts");OUT.mkdir(exist_ok=True)
def call(*a):
 r=subprocess.run(a,text=True,capture_output=True)
 if r.returncode!=0:raise RuntimeError(" ".join(a)+"\n"+r.stderr[-2000:])
 return r.stdout
def dur(f):
 return float(call("ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",str(f)).strip())
async def main():
 for i,(start,text) in enumerate(S):
  p=OUT/f"{i:02}.mp3"
  await edge_tts.Communicate(text,voice="pt-BR-AntonioNeural",rate="+12%",pitch="-5Hz").save(str(p))
  limit=(S[i+1][0] if i<len(S)-1 else 39.72)-start-.15
  factor=max(1,dur(p)/limit+.012)
  call("ffmpeg","-y","-loglevel","error","-i",str(p),"-af",f"atempo={factor:.4f},highpass=f=75,lowpass=f=9000","-ar","48000",str(OUT/f"{i:02}.wav"))
  print(f"voice {i}: {dur(p):.2f} -> {dur(OUT/f'{i:02}.wav'):.2f} allowed {limit:.2f}",flush=True)
 args=["ffmpeg","-y","-loglevel","error"]
 for i in range(len(S)):args+=["-i",str(OUT/f"{i:02}.wav")]
 filters=[]
 for i,(start,_) in enumerate(S):
  ms=round(start*1000)
  filters.append(f"[{i}:a]aformat=channel_layouts=stereo,adelay={ms}|{ms}[v{i}]")
 filters.append("".join(f"[v{i}]" for i in range(len(S)))+f"amix=inputs={len(S)}:normalize=0,apad=whole_dur=40,atrim=duration=40,loudnorm=I=-16:TP=-2:LRA=8[out]")
 args+=["-filter_complex",";".join(filters),"-map","[out]","-c:a","pcm_s16le","-t","40","-ar","48000","public/narration.wav"]
 call(*args)
 print("NARRATION WAV",dur("public/narration.wav"),flush=True)
asyncio.run(main())
