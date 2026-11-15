const fs=require('fs');const sr=44100,seconds=70,n=sr*seconds,b=Buffer.alloc(44+n*2);
const bpm=136,beat=60/bpm;let seed=837;
const noise=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return (seed/4294967296)*2-1;};
const bass=[55,55,65.406,73.416,55,65.406,82.407,73.416];
const pads=[[220,261.63,329.63],[174.61,220,261.63],[196,246.94,293.66],[164.81,196,246.94]];
for(let i=0;i<n;i++){
 const t=i/sr,k=t%beat,h=t%(beat/2),sn=(t+beat)%(beat*2);
 let x=0;
 x+=Math.sin(2*Math.PI*(74*k-35*k*k))*.42*Math.exp(-k*20);
 if(sn<.13)x+=noise()*.15*Math.exp(-sn*32);
 x+=noise()*.055*Math.exp(-h*78);
 const hz=bass[Math.floor(t/(beat/2))%bass.length];x+=Math.sin(2*Math.PI*hz*t)*.15;
 const chord=pads[Math.floor(t/(beat*4))%4];for(const f of chord)x+=Math.sin(2*Math.PI*f*t)*.015;
 if(t>2.5){const snap=t%2.5;x+=noise()*.11*Math.exp(-snap*70);}
 const envelope=Math.max(0,Math.min(1,t*3,(seconds-t)*2));
 b.writeInt16LE(Math.round(30000*Math.tanh(x)*envelope),44+2*i);
}
b.write('RIFF',0);b.writeUInt32LE(36+n*2,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(sr,24);b.writeUInt32LE(sr*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(n*2,40);
fs.mkdirSync('public',{recursive:true});fs.writeFileSync('public/music.wav',b);
console.log('Original 70s instrumental soundtrack generated.');
