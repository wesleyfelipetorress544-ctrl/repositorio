import React from 'react';
import {registerRoot,Composition,AbsoluteFill,Img,Audio,Sequence,staticFile,useCurrentFrame,interpolate,Easing} from 'remotion';

const F='Pricedown',ORANGE='#FFAF69',PINK='#F878B6',PURPLE='#B474EA',WHITE='#FFF7F7';
const options={extrapolateLeft:'clamp',extrapolateRight:'clamp'};
const lerp=(f,a,b)=>interpolate(f,[a,b],[0,1],options);
const ease=(f,a,b)=>Easing.out(Easing.cubic)(lerp(f,a,b));
const data=[
 {title:'TELHADO DE JASON',small:'Ele conserta a própria casa',time:'0:11',focus:49},
 {title:'PICAPE DE BRIAN',small:'Brian chega de caminhonete',time:'0:09',focus:50},
 {title:'PLACAS DO AEROPORTO',small:'Rumo a Vice City',time:'0:34',focus:49},
 {title:'ACADEMIA NA PRAIA',small:'Musculação ao ar livre',time:'0:38',focus:55},
 {title:'BLITZ POLICIAL',small:'Barreiras nas ruas',time:'0:45',focus:45},
 {title:'SAÍDA DA PRISÃO',small:'Lucia é libertada',time:'1:03',focus:53},
 {title:'MARINA DO BRIAN',small:'Placa na oficina de barcos',time:'1:25',focus:52},
 {title:'SELFIE NA BOATE',small:'Noite de Vice City',time:'2:04',focus:47},
 {title:'HELICÓPTERO NO PÂNTANO',small:'Perseguição em Grassrivers',time:'2:18',focus:50},
 {title:'ONDAS NA AVENIDA',small:'O mar invade a pista',time:'2:32',focus:50},
];

const Type=({children,size=84,color=WHITE,style={}})=><div style={{fontFamily:F,fontSize:size,color,lineHeight:1.01,textShadow:'0 5px 0 rgba(0,0,0,.52)',...style}}>{children}</div>;
const Bg=({img,f})=><AbsoluteFill style={{overflow:'hidden',background:'#08060F'}}>
 <Img src={staticFile(img)} style={{width:'100%',height:'100%',objectFit:'cover',filter:'blur(35px) brightness(.28) saturate(1.35)',transform:`scale(${1.7+f*.00012})`}}/>
 <AbsoluteFill style={{background:'linear-gradient(180deg,rgba(8,6,19,.42),rgba(8,5,19,.73) 54%,rgba(5,4,14,.98))'}}/>
 <AbsoluteFill style={{background:`radial-gradient(ellipse at ${60+Math.sin(f/40)*20}% 25%,rgba(247,114,185,.20),transparent 65%)`}}/>
</AbsoluteFill>;
const Bar=({frame,total})=><div style={{position:'absolute',bottom:0,left:0,right:0,height:9,background:'rgba(255,255,255,.13)'}}>
 <div style={{height:'100%',width:`${100*Math.min(1,frame/total)}%`,background:'linear-gradient(90deg,#FFB96C,#F574B7,#AF7FF8)',boxShadow:'0 0 25px #EF7ECF'}}/>
</div>;
const Label=({children})=><div style={{font:'800 20px Arial',letterSpacing:4,color:'#F4D5E7'}}>{children}</div>;
const Pulse=({f})=><div style={{position:'absolute',left:45,right:45,bottom:145,height:4,borderRadius:8,background:'linear-gradient(90deg,#ffb76a,#ed7fce,#9e80fa)',transform:`scaleX(${.82+Math.sin(f/22)*.14})`}}/>;
const Intro=()=>{const f=useCurrentFrame(),p=ease(f,6,34);return <AbsoluteFill style={{background:'#0c0717',color:WHITE}}>
 <Bg img='poster.webp' f={f}/>
 <div style={{position:'absolute',top:105,left:44,right:44}}><Label>ROCKSTAR GAMES · TRAILER 2</Label></div>
 <div style={{position:'absolute',top:330,left:32,right:32,textAlign:'center',transform:`translateY(${(1-p)*100}px) scale(${.85+.15*p})`,opacity:p}}>
 <Type size={110}>10 DETALHES</Type><Type size={128} color={ORANGE}>QUE VOCÊ</Type><Type size={113}>NÃO NOTOU</Type>
 <div style={{marginTop:35,font:'bold 29px Arial',letterSpacing:3}}>GTA VI</div>
 </div>
 <div style={{position:'absolute',top:920,left:40,right:40,font:'bold 22px Arial',textAlign:'center',letterSpacing:1,color:'#FFE7EF'}}>TODOS VISÍVEIS NO TRAILER OFICIAL</div>
 <Pulse f={f}/><Bar frame={f} total={150}/>
 </AbsoluteFill>};
const Detail=({id})=>{
 const f=useCurrentFrame(),it=data[id],reveal=ease(f,0,22),late=ease(f,21,42),photo=ease(f,0,18);
 const borderFade=interpolate(f,[0,4,12,136,149],[0,.85,1,1,.9],options);
 const movement=1.12+f*.00045;
 return <AbsoluteFill style={{background:'#0A0615',color:WHITE}}>
   <Bg img={`scene${id}.webp`} f={f}/>
   <div style={{position:'absolute',top:90,left:40,right:40,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
     <Label>TRAILER 2</Label><div style={{fontFamily:F,fontSize:37,color:'#FFC487'}}>{it.time}</div>
   </div>
   <div style={{position:'absolute',top:178,left:37,right:37,fontFamily:F,fontSize:130,lineHeight:1,color:'#FFAB6D',opacity:reveal,transform:`translateY(${(1-reveal)*50}px)`}}>
     {String(id+1).padStart(2,'0')} <span style={{fontSize:50,color:'rgba(255,255,255,.8)'}}>/ 10</span>
   </div>
   <div style={{position:'absolute',top:315,left:25,right:25,height:500,borderRadius:22,overflow:'hidden',border:`3px solid rgba(255,177,112,${borderFade})`,boxShadow:'0 24px 50px rgba(0,0,0,.75),0 0 42px rgba(244,92,167,.20)',opacity:photo,transform:`translateY(${(1-photo)*35}px)`}}>
      <Img src={staticFile(`scene${id}.webp`)} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:`${it.focus}% center`,filter:'contrast(1.1) saturate(1.17)',transform:`scale(${movement}) translateX(${Math.sin(f/30)*.4}%)`}}/>
      <div style={{position:'absolute',top:20,left:20,width:65,height:65,borderLeft:'5px solid #fff7',borderTop:'5px solid #fff7'}}/>
      <div style={{position:'absolute',right:20,bottom:20,width:65,height:65,borderRight:'5px solid #fff7',borderBottom:'5px solid #fff7'}}/>
      <div style={{position:'absolute',right:18,top:18,background:'#0009',padding:'7px 12px',font:'bold 16px Arial',letterSpacing:1,borderRadius:5}}>FRAME REAL</div>
   </div>
   <div style={{position:'absolute',top:866,left:34,right:34,opacity:late,transform:`translateY(${(1-late)*65}px)`}}>
      <Type size={id===8?61:id===2?65:72} color={WHITE} style={{textAlign:'center'}}>{it.title}</Type>
      <div style={{marginTop:24,textAlign:'center',font:'600 29px Arial',color:'#FBCBE3'}}>{it.small}</div>
   </div>
   <Pulse f={f}/>
   <div style={{position:'absolute',bottom:80,left:38,right:38,display:'flex',justifyContent:'space-between',font:'bold 15px Arial',letterSpacing:3,color:'#F8BFD9'}}>
    <span>GTA VI</span><span>ROCKSTAR GAMES</span>
   </div>
   <Bar frame={f} total={150}/>
   <AbsoluteFill style={{background:'#fff',opacity:interpolate(f,[0,2,9],[.22,.17,0],options),pointerEvents:'none'}}/>
 </AbsoluteFill>;
};
const Ending=()=>{const f=useCurrentFrame(),p=ease(f,6,28);return <AbsoluteFill style={{background:'#0B0616',color:WHITE}}>
 <Bg img='poster.webp' f={f}/>
 <div style={{position:'absolute',top:300,left:32,right:32,textAlign:'center',opacity:p,transform:`translateY(${(1-p)*70}px)`}}>
   <Type size={100}>QUAL DETALHE</Type>
   <Type size={130} color={ORANGE}>VOCÊ NÃO</Type>
   <Type size={118}>TINHA VISTO?</Type>
   <div style={{marginTop:80}}><Type size={61} color={PINK}>COMENTA AÍ!</Type></div>
 </div>
 <div style={{position:'absolute',bottom:100,left:30,right:30,font:'bold 18px Arial',letterSpacing:1,textAlign:'center',color:'#f1cedf'}}>FRAMES DO TRAILER 2 © ROCKSTAR GAMES</div>
 <Bar frame={f} total={150}/>
 </AbsoluteFill>};
const Video=()=> <AbsoluteFill style={{background:'#070511'}}>
 <style>{`@font-face{font-family:Pricedown;src:url('${staticFile('pricedown.otf')}') format('opentype');font-display:block}`}</style>
 <Audio src={staticFile('music.wav')} volume={.28}/>
 <Audio src={staticFile('voice.wav')} volume={1}/>
 <Sequence from={0} durationInFrames={150}><Intro/></Sequence>
 {data.map((_,i)=><Sequence key={i} from={150+i*150} durationInFrames={150}><Detail id={i}/></Sequence>)}
 <Sequence from={1650} durationInFrames={150}><Ending/></Sequence>
 </AbsoluteFill>;
registerRoot(()=><Composition id='GTA6Detalhes' component={Video} fps={60} width={720} height={1280} durationInFrames={1800}/>);
