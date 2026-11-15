const fs=require('node:fs');
const rate=44100,duration=11,total=rate*duration,b=Buffer.alloc(44+total*2);let state=95;
const noise=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296*2-1};
const bpm=138,beat=60/bpm;
for(let i=0;i<total;i++){
 const t=i/rate,k=t%beat,hat=t%(beat/4),sn=(t+beat)%(2*beat);
 const notes=[55,55,73.42,65.4,82.4,73.42,65.4,61.7];
 let x=0;
 x+=Math.sin(2*Math.PI*(90*k-65*k*k))*.59*Math.exp(-k*23);
 if(sn<.13)x+=noise()*.18*Math.exp(-sn*24);
 x+=noise()*.042*Math.exp(-hat*83);
 x+=Math.sin(2*Math.PI*notes[Math.floor(t/(beat/2))%8]*t)*.16;
 for(const f of [220,261.6,329.6])x+=Math.sin(2*Math.PI*f*t)*.023;
 // cinematic scene change impacts
 for(const mark of [0,220/60,440/60]){const z=t-mark;if(z>=0&&z<.7)x+=noise()*.14*Math.exp(-z*14)+Math.sin(2*Math.PI*49*z)*.22*Math.exp(-z*9);}
 const fade=Math.max(0,Math.min(1,t*4,(duration-t)*2));
 b.writeInt16LE(Math.round(30500*Math.tanh(x)*fade),44+2*i);
}
b.write('RIFF',0);b.writeUInt32LE(36+total*2,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(rate,24);b.writeUInt32LE(rate*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(total*2,40);
fs.mkdirSync('public',{recursive:true});fs.writeFileSync('public/music.wav',b);
