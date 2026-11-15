const fs=require('fs');const sr=44100,d=40,n=sr*d,b=Buffer.alloc(44+n*2);let seed=72419;
const noise=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296*2-1};
const tempo=60/126;
for(let i=0;i<n;i++){
 const t=i/sr,k=t%tempo,hat=t%(tempo/2),s=(t+tempo)%(2*tempo);
 let x=Math.sin(2*Math.PI*(75*k-33*k*k))*.50*Math.exp(-k*21);
 if(s<.16)x+=noise()*.14*Math.exp(-s*29);
 x+=noise()*.047*Math.exp(-hat*62);
 const notes=[55,65.4,73.4,82.4,61.7,73.4,65.4,55];
 x+=Math.sin(2*Math.PI*notes[Math.floor(t/(tempo/2))%notes.length]*t)*.15;
 for(const hz of [220,261.6,329.6])x+=Math.sin(2*Math.PI*hz*t)*.018;
 // Scene change sound hits, every 4 seconds
 for(let k=0;k<10;k++){const v=t-k*4;if(v>=0&&v<.45)x+=noise()*.12*Math.exp(-v*16)+Math.sin(2*Math.PI*63*v)*.19*Math.exp(-v*14)}
 const fade=Math.max(0,Math.min(1,t*3,(d-t)*2));
 b.writeInt16LE(Math.round(Math.tanh(x)*fade*28500),44+2*i)
}
b.write('RIFF',0);b.writeUInt32LE(36+n*2,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(sr,24);b.writeUInt32LE(sr*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(n*2,40);fs.mkdirSync('public',{recursive:true});fs.writeFileSync('public/music.wav',b);
