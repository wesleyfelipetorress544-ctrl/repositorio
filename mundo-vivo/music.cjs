const fs=require("fs");const rate=44100,dur=35,num=rate*dur,out=Buffer.alloc(44+2*num);let seed=1887;
const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296*2-1;};
const beat=60/122;
for(let i=0;i<num;i++){
 const t=i/rate,k=t%beat,hat=t%(beat/2),sn=(t+beat)%(2*beat);
 let s=Math.sin(2*Math.PI*(74*k-34*k*k))*.45*Math.exp(-k*20);
 if(sn<.13)s+=rnd()*.13*Math.exp(-sn*33);
 s+=rnd()*.046*Math.exp(-hat*75);
 const bass=[55,55,65.406,73.416,61.735,65.406,82.407,73.416];
 s+=Math.sin(2*Math.PI*bass[Math.floor(t/(beat/2))%8]*t)*.125;
 const chords=[[220,261.63,329.6],[174.6,220,261.63],[196,246.94,293.66],[164.8,196,246.94]];
 for(const f of chords[Math.floor(t/(beat*4))%4])s+=Math.sin(2*Math.PI*f*t)*.018;
 for(let n=0;n<7;n++){const z=t-5*n;if(z>=0&&z<.38)s+=rnd()*.10*Math.exp(-z*21);}
 const fade=Math.max(0,Math.min(1,t*3,(dur-t)*2.1));
 out.writeInt16LE(Math.round(Math.tanh(s)*fade*29500),44+2*i);
}
out.write("RIFF",0);out.writeUInt32LE(36+2*num,4);out.write("WAVEfmt ",8);out.writeUInt32LE(16,16);out.writeUInt16LE(1,20);out.writeUInt16LE(1,22);out.writeUInt32LE(rate,24);out.writeUInt32LE(rate*2,28);out.writeUInt16LE(2,32);out.writeUInt16LE(16,34);out.write("data",36);out.writeUInt32LE(2*num,40);
fs.mkdirSync("public",{recursive:true});fs.writeFileSync("public/music.wav",out);
