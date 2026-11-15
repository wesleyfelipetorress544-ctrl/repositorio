import asyncio,subprocess
from pathlib import Path
import edge_tts
OUT=Path('voiceparts');OUT.mkdir(exist_ok=True)
moments=[
(0.10,"Dez detalhes escondidos no trailer de GTA seis."),
(2.60,"Um: Jason conserta o telhado."),
(5.10,"Dois: Brian chega numa picape."),
(7.60,"Três: placas indicam o aeroporto."),
(10.10,"Quatro: academia na praia."),
(12.60,"Cinco: uma blitz policial."),
(15.10,"Seis: Lucia sai da prisão."),
(17.60,"Sete: a marina do Brian."),
(20.10,"Oito: selfie dentro da boate."),
(22.60,"Nove: helicóptero no pântano."),
(25.10,"Dez: ondas invadem a avenida."),
(27.60,"Qual desses você nunca tinha visto?")
]
def run(*args):
 x=subprocess.run(args,check=False,capture_output=True,text=True)
 if x.returncode!=0:raise RuntimeError(' '.join(args)+'\n'+x.stderr[-2000:])
 return x.stdout
def dur(p):return float(run('ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(p)).strip())
async def main():
 for i,(start,script) in enumerate(moments):
  p=OUT/f'{i}.mp3'
  await edge_tts.Communicate(script,voice='pt-BR-AntonioNeural',rate='+26%',pitch='-5Hz').save(str(p))
  length=dur(p)
  limit=(moments[i+1][0] if i+1<len(moments) else 29.85)-start-.10
  tempo=max(1.0,length/limit+.025)
  run('ffmpeg','-hide_banner','-y','-loglevel','error','-i',str(p),'-af',f'atempo={tempo:.4f},highpass=f=75,lowpass=f=8800','-ar','48000',str(OUT/f'{i}.wav'))
  print(f'TTS part {i:02d} duration {length:.2f}s fitted to {dur(OUT/f"{i}.wav"):.2f}s window {limit:.2f}s',flush=True)
 args=['ffmpeg','-hide_banner','-y','-loglevel','error']
 for i in range(len(moments)):args+=['-i',str(OUT/f'{i}.wav')]
 filters=[]
 for i,(start,_) in enumerate(moments):
  delay=round(start*1000);filters.append(f'[{i}:a]aformat=channel_layouts=stereo,adelay={delay}|{delay}[v{i}]')
 filters.append(''.join(f'[v{i}]' for i in range(len(moments)))+f'amix=inputs={len(moments)}:duration=longest:normalize=0,apad=whole_dur=30,atrim=duration=30,loudnorm=I=-16:TP=-2:LRA=8[out]')
 args+=['-filter_complex',';'.join(filters),'-map','[out]','-c:a','pcm_s16le','-ar','48000','-t','30','public/voice.wav']
 run(*args);print('VOICE WAV COMPLETE',dur('public/voice.wav'),flush=True)
asyncio.run(main())
