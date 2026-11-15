#!/usr/bin/env python3
"""Create PT-BR narration timed to existing GTA VI Remotion video without altering video frames."""
import asyncio
import os
import subprocess
from pathlib import Path

import edge_tts

OUT = Path("voice")
OUT.mkdir(exist_ok=True)
VOICE = "pt-BR-AntonioNeural"
# All timings below use the six existing five-second scenes.
SCENES = [
    (0.20, "Qual o valor mínimo pra jogar GTA seis? Xbox ou PlayStation?"),
    (5.18, "O Xbox Series S custa aproximadamente dois mil quatrocentos e oitenta e seis reais."),
    (10.16, "O PlayStation cinco Slim Digital custa cerca de três mil oitocentos e noventa e nove reais."),
    (15.16, "E o jogo, GTA seis, custa quatrocentos e quarenta e nove reais e noventa centavos."),
    (20.15, "Com GTA seis: dois mil novecentos e trinta e seis reais no Xbox, ou quatro mil trezentos e quarenta e oito no PlayStation."),
    (25.13, "Economia de mais de mil e quatrocentos reais. E você, qual escolheria?"),
]

def run(*args):
    return subprocess.run(args,check=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True)

def length(src):
    r=run("ffprobe","-v","error","-show_entries","format=duration","-of","default=noprint_wrappers=1:nokey=1",str(src))
    return float(r.stdout.strip())

async def main():
    for i,(start,script) in enumerate(SCENES):
        path=OUT/f"speech_{i}.mp3"
        tts=edge_tts.Communicate(script,voice=VOICE,rate="+22%",pitch="-8Hz")
        await tts.save(str(path))
        dur=length(path)
        available=(SCENES[i+1][0] if i<5 else 29.65)-start-.10
        print(f"scene {i+1}: {dur:.2f}s allowed {available:.2f}s",flush=True)
        if dur>available:
            # modest speed-up guarantees voices will never overlap or run into another scene
            run("ffmpeg","-y","-loglevel","error","-i",str(path),
                "-af",f"atempo={min(1.45,dur/available+0.01):.4f}",
                "-ar","48000",str(OUT/f"speech_{i}_sped.wav"))
        else:
            run("ffmpeg","-y","-loglevel","error","-i",str(path),
                "-ar","48000",str(OUT/f"speech_{i}_sped.wav"))

    voice_inputs=[str(OUT/f"speech_{i}_sped.wav") for i in range(6)]
    cmd=["ffmpeg","-hide_banner","-y","-loglevel","error","-i","source.mp4"]
    for p in voice_inputs:
        cmd.extend(["-i",p])
    # Delay each short narration into its original scene.
    filters=[]
    for i,(start,_) in enumerate(SCENES,1):
        ms=round(start*1000)
        filters.append(f"[{i}:a]adelay={ms}|{ms},aformat=channel_layouts=stereo[voice{i}]")
    voices="".join(f"[voice{i}]" for i in range(1,7))
    filters.append(f"{voices}amix=inputs=6:normalize=0,volume=1.5[voice]")
    # Sidechain music ducking during narration. Keep the original music and every visual frame.
    filters.append("[0:a]aformat=channel_layouts=stereo[music]")
    filters.append("[music][voice]sidechaincompress=threshold=0.015:ratio=7:attack=35:release=450[ducked]")
    filters.append("[ducked][voice]amix=inputs=2:normalize=0,alimiter=limit=0.92,atrim=duration=30[aout]")
    cmd.extend(["-filter_complex",";".join(filters),"-map","0:v:0","-map","[aout]","-c:v","copy",
                "-c:a","aac","-b:a","192k","-t","30","-movflags","+faststart",
                "gta6-valor-minimo-narrado.mp4"])
    run(*cmd)
    print("Narrated MP4 created. Video stream copied unchanged.",flush=True)

if __name__=="__main__":
    asyncio.run(main())
