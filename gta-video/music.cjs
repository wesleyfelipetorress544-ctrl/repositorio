const fs=require('node:fs');const SR=44100,D=30,N=SR*D;const out=Buffer.alloc(44+N*2);let seed=1;function noise(){seed=(1664525*seed+1013904223)>>>0;return seed/4294967296*2-1;}
const beat=60/130;
for(let i=0;i<N;i++){const t=i/SR,bar=Math.floor(t/beat),k=t%beat,hat=t%(beat/2),sn=(t+beat)%(2*beat);let z=0;
z+=Math.sin(2*Math.PI*(75*k-42*k*k))*.55*Math.exp(-k*20);
if(sn<.14) z+=noise()*.13*Math.exp(-sn*20);
z+=noise()*.04*Math.exp(-hat*65);
const bass=[55,65.41,73.42,82.4,65.4,73.42,61.74,73.42][Math.floor(t/(beat/2))%8];
z+=Math.sin(2*Math.PI*bass*t)*.17;
for(const hz of [220,261.6,329.6]) z+=Math.sin(2*Math.PI*hz*t)*.022;
const fade=Math.max(0,Math.min(1,t*2,(D-t)*1.8));
out.writeInt16LE(Math.round(Math.tanh(z)*fade*30000),44+i*2);
}
out.write("RIFF",0);out.writeUInt32LE(36+N*2,4);out.write("WAVEfmt ",8);out.writeUInt32LE(16,16);out.writeUInt16LE(1,20);out.writeUInt16LE(1,22);out.writeUInt32LE(SR,24);out.writeUInt32LE(SR*2,28);out.writeUInt16LE(2,32);out.writeUInt16LE(16,34);out.write("data",36);out.writeUInt32LE(N*2,40);
fs.mkdirSync("public",{recursive:true});fs.writeFileSync("public/beat.wav",out);
