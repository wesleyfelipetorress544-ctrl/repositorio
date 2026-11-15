import asyncio,subprocess
from pathlib import Path
import edge_tts
OUT=Path('narr'); OUT.mkdir(exist_ok=True)
segments=[
 (0.20,"Já imaginou como vai ser quando GTA seis finalmente sair?"),
 (5.20,"Dia dezenove de novembro, à meia-noite, Vice City abre as portas."),
 (10.20,"Imagina as lives, os cortes e as reações tomando conta das redes."),
 (15.20,"Cada rua, cada carro e cada segredo pode virar assunto."),
 (20.20,"Será que GTA seis vai dominar a conversa sobre games?"),
 (25.20,"E você? Vai jogar no lançamento? Conta nos comentários.")
]
def execute(*args):
 r=subprocess.run(args,check=False,text=True,capture_output=True)
 if r.returncode: raise RuntimeError(' '.join(args)+'\n'+r.stderr[-3000:])
 return r.stdout
def duration(fn):return float(execute('ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(fn)).strip())
async def main():
 for i,(start,text) in enumerate(segments):
  file=OUT/f'part{i}.mp3'
  await edge_tts.Communicate(text,voice='pt-BR-AntonioNeural',rate='+17%',pitch='-6Hz').save(str(file))
  original=duration(file); available=(segments[i+1][0] if i<5 else 29.8)-start-.14
  tempo=max(1.0,original/available+.015)
  execute('ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(file),'-af',f'atempo={tempo:.4f},highpass=f=70,lowpass=f=9000','-ar','48000',str(OUT/f'part{i}.wav'))
  print(f'scene {i}: {original:.2f} -> {duration(OUT/f"part{i}.wav"):.2f}s target {available:.2f}',flush=True)
 args=['ffmpeg','-hide_banner','-loglevel','error','-y']
 for i in range(6):args+=['-i',str(OUT/f'part{i}.wav')]
 filters=[]
 for i,(start,_) in enumerate(segments):
  delay=round(start*1000);filters.append(f'[{i}:a]aformat=channel_layouts=stereo,adelay={delay}|{delay}[a{i}]')
 filters.append(''.join(f'[a{i}]' for i in range(6))+'amix=inputs=6:normalize=0,apad=whole_dur=30,atrim=duration=30,loudnorm=I=-16:TP=-2:LRA=8[out]')
 args+=['-filter_complex',';'.join(filters),'-map','[out]','-ar','48000','-c:a','pcm_s16le','-t','30','public/voice.wav']
 execute(*args)
 print('Voice created',duration('public/voice.wav'),flush=True)
asyncio.run(main())
