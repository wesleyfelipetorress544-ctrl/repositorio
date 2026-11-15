import asyncio,subprocess
from pathlib import Path
import edge_tts
OUT=Path('voiceparts');OUT.mkdir(exist_ok=True)
moments=[
(0.10,"Dez easter eggs de GTA seis descobertos pela comunidade."),
(2.60,"Um: uma iguana com a camisa de Tommy."),
(5.10,"Dois: presidentes de Red Dead no dinheiro."),
(7.60,"Três: Phil Cassidy pode ter voltado."),
(10.10,"Quatro: a velha rádio V-Rock."),
(12.60,"Cinco: a piada com os vazamentos."),
(15.10,"Seis: a camisa de liberdade de Jason."),
(17.60,"Sete: o metrô escondido."),
(20.10,"Oito: o hotel de Tommy em Vice City."),
(22.60,"Nove: um procurado de Red Dead."),
(25.10,"Dez: uma possível homenagem a Tom Petty."),
(27.60,"Qual dessas referências você percebeu?")
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
