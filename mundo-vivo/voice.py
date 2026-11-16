import asyncio,subprocess
from pathlib import Path
import edge_tts
parts=Path("voice-parts");parts.mkdir(exist_ok=True)
scenes=[
 (0.18,"GTA seis trouxe de volta as seis estrelas, e a polícia agora consegue identificar você."),
 (5.18,"No GTA cinco, o máximo era cinco estrelas. Agora, o sistema volta a ter seis."),
 (10.18,"E o crime só chama a polícia se alguém presenciar ou se um alarme for acionado."),
 (15.18,"Os policiais podem saber qual roupa você está usando."),
 (20.18,"Eles também identificam seu carro. Trocar de veículo pode ajudar na fuga."),
 (25.18,"Seu rosto e até o fato de Jason e Lucia estarem juntos viram pistas."),
 (30.18,"Mudar de roupa ou se separar pode despistar a polícia. Você gostou dessa novidade?")
]
def run(*cmd):
 r=subprocess.run(cmd,text=True,capture_output=True)
 if r.returncode:raise RuntimeError(" ".join(cmd)+"\n"+r.stderr[-2300:])
 return r.stdout
def duration(f):return float(run("ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",str(f)).strip())
async def main():
 for i,(start,line) in enumerate(scenes):
  p=parts/f"{i}.mp3"
  await edge_tts.Communicate(line,voice="pt-BR-AntonioNeural",rate="+16%",pitch="-5Hz").save(str(p))
  window=(scenes[i+1][0] if i<6 else 34.83)-start-.1
  factor=max(1,duration(p)/window+.015)
  run("ffmpeg","-y","-hide_banner","-loglevel","error","-i",str(p),"-af",f"atempo={factor:.4f},highpass=f=70,lowpass=f=9000","-ar","48000",str(parts/f"{i}.wav"))
  print(f"SCENE {i} voice duration {duration(parts/f'{i}.wav'):.2f}s, window {window:.2f}",flush=True)
 inputs=["ffmpeg","-y","-hide_banner","-loglevel","error"]
 for i in range(len(scenes)):inputs+=["-i",str(parts/f"{i}.wav")]
 filters=[]
 for i,(start,_) in enumerate(scenes):
  delay=round(start*1000);filters.append(f"[{i}:a]aformat=channel_layouts=stereo,adelay={delay}|{delay}[v{i}]")
 filters.append("".join(f"[v{i}]" for i in range(len(scenes)))+"amix=inputs=7:normalize=0,apad=whole_dur=35,atrim=duration=35,loudnorm=I=-16:TP=-2:LRA=8[out]")
 run(*(inputs+["-filter_complex",";".join(filters),"-map","[out]","-t","35","-c:a","pcm_s16le","-ar","48000","public/voice.wav"]))
 print("VOICE_READY",duration("public/voice.wav"),flush=True)
asyncio.run(main())
