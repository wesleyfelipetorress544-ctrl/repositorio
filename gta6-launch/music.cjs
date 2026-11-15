const fs=require('fs');const rate=44100,dur=30,count=rate*dur,buf=Buffer.alloc(44+2*count);let seed=11;
const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296*2-1;};
const beat=60/123;
for(let i=0;i<count;i++){const t=i/rate,k=t%beat,h=t%(beat/2),sn=(t+beat)%(beat*2);let x=0;
x+=Math.sin(2*Math.PI*(80*k-35*k*k))*.46*Math.exp(-k*18);
if(sn<.12)x+=rand()*.14*Math.exp(-sn*23);
x+=rand()*.055*Math.exp(-h*72);
const notes=[55,65.406,73.416,82.407,73.416,61.735,65.406,73.416];
const freq=notes[Math.floor(t/(beat/2))%8];x+=Math.sin(2*Math.PI*freq*t)*.13;
const pad=[[220,261.6,329.6],[174.6,220,261.6],[196,246.9,293.7],[164.8,196,246.9]][Math.floor(t/(beat*4))%4];
for(const f of pad)x+=Math.sin(2*Math.PI*f*t)*.019;
const fade=Math.max(0,Math.min(1,t*2,(dur-t)*1.3));
buf.writeInt16LE(Math.round(Math.tanh(x)*fade*29000),44+2*i);
}
buf.write('RIFF',0);buf.writeUInt32LE(36+2*count,4);buf.write('WAVEfmt ',8);buf.writeUInt32LE(16,16);buf.writeUInt16LE(1,20);buf.writeUInt16LE(1,22);buf.writeUInt32LE(rate,24);buf.writeUInt32LE(rate*2,28);buf.writeUInt16LE(2,32);buf.writeUInt16LE(16,34);buf.write('data',36);buf.writeUInt32LE(2*count,40);
fs.mkdirSync('public',{recursive:true});fs.writeFileSync('public/music.wav',buf);
