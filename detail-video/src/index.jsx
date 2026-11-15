import React from 'react';
import {registerRoot,Composition,AbsoluteFill,Img,Audio,Sequence,staticFile,useCurrentFrame,interpolate,Easing} from 'remotion';

const W=720,H=1280,WHITE='#fff8f5',ORANGE='#ffb86a',PINK='#fa81b5';
const CL={extrapolateLeft:'clamp',extrapolateRight:'clamp'};
const lerp=(f,start,end)=>interpolate(f,[start,end],[0,1],CL);
const ease=(f,a,b)=>Easing.out(Easing.cubic)(lerp(f,a,b));
const details=[
 {name:'A CAMISA DE TOMMY',short:'A IGUANA NA LOJA',label:'TRAILER 2  ·  0:33',desc:'Quando Jason bate no atendente, uma iguana decorativa aparece atrás do balcão. A estampa azul lembra a camisa de Tommy Vercetti, protagonista de Vice City.',status:'REFERÊNCIA SUGERIDA PELOS FÃS',focus:'73% 42%',position:'65% center'},
 {name:'RED DEAD NO DINHEIRO',short:'QUEM ESTÁ NAS NOTAS?',label:'TRAILER 2  ·  2:07',desc:'No dinheiro espalhado pela boate, fãs reconheceram Hardin e Waxman: presidentes fictícios mencionados em Red Dead Redemption 2. É um crossover visual, não prova de universo compartilhado.',status:'REFERÊNCIA VISUAL',focus:'50% 46%',position:'50% center'},
 {name:'PHIL CASSIDY?',short:'O COMERCIAL ESCONDIDO',label:'TRAILER 2  ·  2:14',desc:'Uma TV mostra a Phil’s Ammu-Nation. O nome remete ao traficante de armas Phil Cassidy, de Vice City, mas Rockstar não confirmou que o apresentador seja ele.',status:'IDENTIDADE NÃO CONFIRMADA',focus:'49% 49%',position:'50% center'},
 {name:'PETTY FOREVER',short:'HOMENAGEM NA PORTA',label:'TRAILER 1  ·  1:17',desc:'Na porta da loja assaltada por Lucia e Jason há um adesivo Petty Forever. Ele homenageia Tom Petty, artista da música usada no primeiro trailer.',status:'REFERÊNCIA MUSICAL',focus:'38% 44%',position:'47% center'},
 {name:'JUST FIXING SOME LEAKS',short:'A PIADA DA ROCKSTAR?',label:'TRAILER 2  ·  0:11',desc:'Jason diz que está consertando vazamentos no telhado. Fãs interpretam a frase como uma indireta ao enorme vazamento de GTA VI em 2022. É uma teoria.',status:'TEORIA DA COMUNIDADE',focus:'52% 40%',position:'50% center'}
];
const T=({children,size=63,color=WHITE,style={}})=><div style={{fontFamily:'Pricedown',fontSize:size,lineHeight:1.03,color,letterSpacing:0,textShadow:'0 5px 0 rgba(0,0,0,.48)',...style}}>{children}</div>;
const Fg=({image,frame,dim=.55})=><AbsoluteFill style={{background:'#080613',overflow:'hidden'}}>
  <Img src={staticFile(image)} style={{width:'100%',height:'100%',objectFit:'cover',filter:`blur(26px) brightness(${dim}) saturate(1.5)`,transform:`scale(${1.9+frame*.00014})`}}/>
  <AbsoluteFill style={{background:'linear-gradient(180deg,rgba(7,1,15,.66),rgba(7,1,15,.78) 56%,#080513)'}}/>
</AbsoluteFill>;
const Progress=({f,total})=><div style={{position:'absolute',bottom:0,left:0,right:0,height:8,background:'#ffffff26'}}><div style={{height:'100%',width:`${Math.min(100,100*f/total)}%`,background:'linear-gradient(90deg,#f9ab6d,#f570bd,#ac79fa)'}}/></div>;
const Intro=()=>{const f=useCurrentFrame();const k=ease(f,8,40);return <AbsoluteFill style={{color:WHITE}}><Fg image='poster.webp' frame={f} dim={.68}/>
 <div style={{position:'absolute',top:300,left:30,right:30,textAlign:'center',opacity:k,transform:`translateY(${(1-k)*60}px)`}}>
  <T size={103}>5 SEGREDOS</T><T size={126} color={ORANGE}>DE GTA VI</T><T size={63}>QUE O REDDIT ENCONTROU</T>
  <div style={{font:'bold 23px Arial',marginTop:55,color:'#f2cce2'}}>PAUSE O TRAILER E CONFIRA</div>
 </div><Progress f={f} total={300}/></AbsoluteFill>};

const HighlightBox=({f,focus})=>{
 const p=ease(f,255,310);
 return <div style={{opacity:p,position:'absolute',top:440,left:28,right:28,height:310,borderRadius:23,overflow:'hidden',border:'3px solid #ffb66d',background:'#100b1b',boxShadow:'0 15px 60px #000b'}}>
   <Img src={staticFile(focus)} style={{width:'100%',height:'100%',objectFit:'cover',transform:`scale(${1.68+Math.max(0,f-290)*.0005})`}}/>
   <div style={{position:'absolute',top:12,left:12,padding:'8px 16px',background:'#000a',font:'bold 17px Arial',color:ORANGE,letterSpacing:2}}>ZOOM DO TRAILER</div>
 </div>;
};

const Detail=({id})=>{
 const f=useCurrentFrame(),d=details[id],enter=ease(f,4,38),zoom=ease(f,190,285);
 const frame=`scene${id}.webp`;
 return <AbsoluteFill style={{color:WHITE}}><Fg frame={f} image={frame}/>
  <div style={{position:'absolute',top:74,left:35,right:35,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
    <div style={{font:'bold 20px Arial',letterSpacing:3,color:'#f8c6e5'}}>{d.label}</div>
    <div style={{fontFamily:'Pricedown',fontSize:41,color:ORANGE}}>{id+1} / 5</div>
  </div>
  <div style={{position:'absolute',top:159,left:30,right:30,textAlign:'center',opacity:enter,transform:`translateY(${(1-enter)*80}px)`}}>
   <T size={d.name.length>19?64:74}>{d.name}</T>
  </div>
  <div style={{position:'absolute',left:30,right:30,top:275,height:440,borderRadius:24,overflow:'hidden',boxShadow:'0 25px 65px #000d',border:'2px solid #f8a2db66'}}>
    <Img src={staticFile(frame)} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:d.position,transform:`scale(${1.03+f*.00015})`,filter:'contrast(1.12) saturate(1.2)'}}/>
    <div style={{position:'absolute',inset:0,opacity:ease(f,265,330),background:'#0d0916'}}>
      <Img src={staticFile(`close${id}.jpg`)} style={{width:'100%',height:'100%',objectFit:id===1||id===2?'contain':'cover',objectPosition:d.focus,transform:`scale(${id===1||id===2?1.12:1.95+Math.max(0,f-330)*.0002})`,filter:'contrast(1.16) saturate(1.16)'}}/>
    </div>
    <div style={{position:'absolute',bottom:12,left:12,background:'#09040dcf',padding:'10px 15px',borderRadius:7,font:'bold 16px Arial',letterSpacing:1}}>{f<310?'CENA ORIGINAL':'DETALHE AMPLIADO'}</div>
  </div>
  <div style={{position:'absolute',top:762,left:35,right:35,opacity:ease(f,55,88)}}>
    <div style={{color:ORANGE,textAlign:'center',fontFamily:'Pricedown',fontSize:43,marginBottom:15}}>{d.short}</div>
    <div style={{font:'500 27px/1.33 Arial',textAlign:'center',color:'#fff1f7'}}>{d.desc}</div>
  </div>
  <div style={{position:'absolute',bottom:110,left:35,right:35,textAlign:'center',font:'bold 19px Arial',letterSpacing:2,color:'#ffc988'}}>{d.status}</div>
  <div style={{position:'absolute',right:35,top:704,width:88,height:6,background:ORANGE,borderRadius:15,opacity:.9}}/>
  <Progress f={f} total={720}/>
 </AbsoluteFill>;
};
const Outro=()=>{const f=useCurrentFrame(),k=ease(f,10,47);return <AbsoluteFill style={{color:WHITE}}><Fg image='poster.webp' frame={f}/>
 <div style={{position:'absolute',top:310,left:31,right:31,textAlign:'center',opacity:k,transform:`translateY(${(1-k)*65}px)`}}>
  <T size={94}>QUAL SEGREDO</T><T size={108} color={ORANGE}>VOCÊ NÃO</T><T size={100}>CONHECIA?</T>
  <div style={{font:'bold 28px Arial',marginTop:65,letterSpacing:3,color:'#ffd3e8'}}>COMENTA AÍ!</div>
 </div><Progress f={f} total={300}/></AbsoluteFill>};
const Video=()=> <AbsoluteFill style={{background:'#070513'}}>
 <style>{`@font-face{font-family:Pricedown;src:url('${staticFile('pricedown.otf')}') format('opentype');font-display:block}`}</style>
 <Audio src={staticFile('music.wav')} volume={0.13}/>
 <Audio src={staticFile('voice.wav')} volume={1.0}/>
 <Sequence from={0} durationInFrames={300}><Intro/></Sequence>
 {details.map((d,i)=><Sequence key={i} from={300+i*720} durationInFrames={720}><Detail id={i}/></Sequence>)}
 <Sequence from={3900} durationInFrames={300}><Outro/></Sequence>
 </AbsoluteFill>;
registerRoot(()=><Composition id='GTA6Detalhes' component={Video} fps={60} width={720} height={1280} durationInFrames={4200}/>);
