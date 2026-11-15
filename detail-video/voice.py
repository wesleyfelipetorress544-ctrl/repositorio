import asyncio,subprocess
from pathlib import Path
import edge_tts
OUT=Path('voiceparts');OUT.mkdir(exist_ok=True)
moments=[
(0.20,"Cinco easter eggs de GTA seis que a comunidade encontrou. Agora, presta atenção nos detalhes."),
(5.30,"Primeiro: quando Jason acerta o atendente, observe a parede atrás dele. Existe uma iguana com estampa azul, muito parecida com a famosa camisa de Tommy Vercetti. A referência ainda é uma teoria."),
(17.30,"Segundo: nas notas de dinheiro que voam pela boate, aparecem Hardin e Waxman. Os dois são presidentes fictícios do universo de Red Dead Redemption dois. A Rockstar deixou essa conexão escondida no dinheiro."),
(29.30,"Terceiro: olha a propaganda de Phil's Ammu-Nation passando na televisão. O nome lembra Phil Cassidy, vendedor de armas do Vice City clássico. Mas ninguém confirmou que seja realmente o mesmo personagem."),
(41.30,"Quarto: na porta da loja assaltada aparece um adesivo Petty Forever. É uma homenagem a Tom Petty, cantor de Love Is a Long Road, música que embalou o primeiro trailer de GTA seis."),
(53.30,"Quinto: Jason diz que está consertando vazamentos no telhado. Muita gente acha que a Rockstar está brincando com o vazamento gigantesco do jogo em dois mil e vinte e dois. Isso é uma teoria dos fãs."),
(65.20,"Qual dessas referências você nunca tinha percebido? Conta nos comentários.")
]
def run(*args):
 x=subprocess.run(args,check=False,capture_output=True,text=True)
 if x.returncode!=0:raise RuntimeError(' '.join(args)+'\n'+x.stderr[-2000:])
 return x.stdout
def dur(p):return float(run('ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(p)).strip())
async def main():
 for i,(start,script) in enumerate(moments):
  p=OUT/f'{i}.mp3'
  await edge_tts.Communicate(script,voice='pt-BR-AntonioNeural',rate='+0%',pitch='-5Hz').save(str(p))
  length=dur(p)
  limit=(moments[i+1][0] if i+1<len(moments) else 69.85)-start-.10
  tempo=max(1.0,length/limit+.025)
  run('ffmpeg','-hide_banner','-y','-loglevel','error','-i',str(p),'-af',f'atempo={tempo:.4f},highpass=f=75,lowpass=f=8800','-ar','48000',str(OUT/f'{i}.wav'))
  print(f'TTS part {i:02d} duration {length:.2f}s fitted to {dur(OUT/f"{i}.wav"):.2f}s window {limit:.2f}s',flush=True)
 args=['ffmpeg','-hide_banner','-y','-loglevel','error']
 for i in range(len(moments)):args+=['-i',str(OUT/f'{i}.wav')]
 filters=[]
 for i,(start,_) in enumerate(moments):
  delay=round(start*1000);filters.append(f'[{i}:a]aformat=channel_layouts=stereo,adelay={delay}|{delay}[v{i}]')
 filters.append(''.join(f'[v{i}]' for i in range(len(moments)))+f'amix=inputs={len(moments)}:duration=longest:normalize=0,apad=whole_dur=70,atrim=duration=70,loudnorm=I=-16:TP=-2:LRA=8[out]')
 args+=['-filter_complex',';'.join(filters),'-map','[out]','-c:a','pcm_s16le','-ar','48000','-t','70','public/voice.wav']
 run(*args);print('VOICE WAV COMPLETE',dur('public/voice.wav'),flush=True)
asyncio.run(main())
