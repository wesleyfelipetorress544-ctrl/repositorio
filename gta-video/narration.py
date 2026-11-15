#!/usr/bin/env python3
"""Make an audible, scene-synced Brazilian Portuguese voiceover over the existing video.
No video re-encoding: original frames are preserved.
"""
import asyncio
import subprocess
from pathlib import Path
import edge_tts

OUT=Path("voice")
OUT.mkdir(exist_ok=True)
VOICE="pt-BR-AntonioNeural"
SCENES=[
 (0.20,"Quanto custa jogar GTA seis no Brasil? Xbox ou PlayStation?"),
 (5.16,"O Xbox Series S sai por dois mil quatrocentos e oitenta e seis reais."),
 (10.14,"O PlayStation cinco Slim Digital custa três mil oitocentos e noventa e nove reais."),
 (15.15,"Já o GTA seis custa quatrocentos e quarenta e nove reais e noventa centavos."),
 (20.12,"Com o jogo, dá dois mil novecentos e trinta e seis no Xbox, contra quatro mil trezentos e quarenta e oito no PlayStation."),
 (25.12,"São mais de mil e quatrocentos reais de diferença. Qual você escolheria?")
]

def run(*args):
    r=subprocess.run(args,text=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE,check=False)
    if r.returncode!=0:
        raise RuntimeError("Command failed: "+" ".join(map(str,args))+"\n"+r.stderr[-3000:])
    return r

def duration(p):
    return float(run("ffprobe","-v","error","-show_entries","format=duration","-of",
                     "default=noprint_wrappers=1:nokey=1",str(p)).stdout.strip())

async def main():
    for i,(start,script) in enumerate(SCENES):
        mp3=OUT/f"speech_{i}.mp3"
        await edge_tts.Communicate(script,voice=VOICE,rate="+18%",pitch="-5Hz").save(str(mp3))
        secs=duration(mp3)
        window=(SCENES[i+1][0] if i+1<len(SCENES) else 29.70)-start-.11
        factor=max(1.0,secs/window+0.018)
        # ffmpeg atempo supports 0.5-100.
        run("ffmpeg","-y","-hide_banner","-loglevel","error","-i",str(mp3),
            "-af",f"atempo={factor:.5f},highpass=f=70,lowpass=f=9000",
            "-ar","48000",str(OUT/f"part_{i}.wav"))
        print(f"Clip {i+1}: {secs:.2f}s -> {duration(OUT/f'part_{i}.wav'):.2f}s, scene {start:.2f}s",flush=True)

    voice_inputs=[str(OUT/f"part_{i}.wav") for i in range(len(SCENES))]
    command=["ffmpeg","-hide_banner","-y","-loglevel","error"]
    for inp in voice_inputs:
        command+=["-i",inp]
    stages=[]
    for i,(start,_) in enumerate(SCENES):
        ms=round(start*1000)
        stages.append(f"[{i}:a]aformat=channel_layouts=stereo,adelay={ms}|{ms}[v{i}]")
    all_tracks="".join(f"[v{i}]" for i in range(len(SCENES)))
    stages.append(f"{all_tracks}amix=inputs=6:duration=longest:normalize=0,atrim=duration=30,apad=pad_dur=30,atrim=duration=30[voice]")
    command+=["-filter_complex",";".join(stages),"-map","[voice]",
              "-c:a","libmp3lame","-b:a","192k","-t","30","voz_gta6_isolada.mp3"]
    run(*command)
    print("Isolated narration produced:",duration("voz_gta6_isolada.mp3"),flush=True)

    # Make vocals prominently audible. Original music is deliberately at 10%.
    # Copy video bit-for-bit and remix only the audio track.
    fc=("[0:a]volume=0.10,aformat=channel_layouts=stereo[music];"
        "[1:a]volume=2.0,aformat=channel_layouts=stereo[vocal];"
        "[music][vocal]amix=inputs=2:duration=first:normalize=0,"
        "alimiter=limit=0.92,atrim=duration=30[aout]")
    run("ffmpeg","-hide_banner","-y","-loglevel","error",
        "-i","source.mp4","-i","voz_gta6_isolada.mp3",
        "-filter_complex",fc,"-map","0:v:0","-map","[aout]",
        "-c:v","copy","-c:a","aac","-b:a","192k","-t","30",
        "-movflags","+faststart","gta6-valor-minimo-narrado.mp4")

    # Probe both audio streams and report levels as evidence narration is not silent.
    for fn in ["voz_gta6_isolada.mp3","gta6-valor-minimo-narrado.mp4"]:
        p=run("ffmpeg","-hide_banner","-i",fn,"-map","0:a:0","-af",
            "volumedetect","-f","null","-")
        volume=[x.strip() for x in p.stderr.splitlines()
                if "mean_volume:" in x or "max_volume:" in x]
        print(fn,":",", ".join(volume),flush=True)
    print("Completed video-with-voice; video stream copied unchanged.",flush=True)

if __name__=="__main__":
    asyncio.run(main())
