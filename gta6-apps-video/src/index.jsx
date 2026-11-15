import React from 'react';
import {registerRoot,Composition,AbsoluteFill,Img,Sequence,Audio,staticFile,useCurrentFrame,interpolate,Easing} from 'remotion';
import {Heart,KeyRound,Bike,Wallet,MessageCircle,ScanLine,CarFront,Camera,Dumbbell,ArrowUpRight,Smartphone,MapPin} from 'lucide-react';

const W=720,H=1280,FPS=60,TOTAL=2400;
const grad='linear-gradient(120deg,#FF98CC 0%,#F467B7 42%,#FFA56B 100%)';
const ease=(v,a,b)=>Easing.out(Easing.cubic)(interpolate(v,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}));
const settings=[
 {name:'PEEK HOLE',desc:'PARÓDIA DE UMA PLATAFORMA DE CONTEÚDO',short:'UMA REDE SOCIAL DIFERENTE',kind:'peek',bg:'linear-gradient(140deg,#FB4BAA,#B512DC,#4F1477)',accent:'#FF9AD2'},
 {name:'SCOOTER BROS',desc:'SERVIÇO DE ENTREGA DE VEÍCULOS',short:'UM APLICATIVO DE ENTREGAS',kind:'scooter',bg:'linear-gradient(135deg,#FF6B19,#EE2100,#AD0A10)',accent:'#FFB47A'},
 {name:'BUCK ME',desc:'APLICATIVO DE BANCO DIGITAL',short:'SEU BANCO NA PALMA DA MÃO',kind:'bank',bg:'linear-gradient(135deg,#20102D,#070A18,#7C1591)',accent:'#E57BFF'},
 {name:'WHATUP',desc:'APLICATIVO DE MENSAGENS',short:'MENSAGENS E CONVERSAS',kind:'messages',bg:'linear-gradient(140deg,#5BEC59,#04BD3F,#007A2C)',accent:'#8EFCAB'},
 {name:'WAINK',desc:'APLICATIVO DE ESCANEAMENTO',short:'IDENTIFICAÇÃO DE VEÍCULOS',kind:'scan',bg:'linear-gradient(135deg,#14091B,#03050E,#63108C)',accent:'#F36BFA'},
 {name:'SNAPMATIC',desc:'APLICATIVO DE REDE SOCIAL',short:'FOTOS E MOMENTOS',kind:'camera',bg:'linear-gradient(135deg,#17151F,#02030C,#30234C)',accent:'#AF9FFF'},
 {name:'RYDE ME',desc:'APLICATIVO DE TRANSPORTE',short:'CARONAS PELO MAPA',kind:'ryde',bg:'linear-gradient(150deg,#FFE05C,#F5BC00,#ED8B11)',accent:'#FFF4B0'},
 {name:'FITNESS',desc:'RASTREIA SONO E ATIVIDADES FÍSICAS',short:'SEU DIA EM NÚMEROS',kind:'fitness',bg:'linear-gradient(150deg,#175FEA,#3710DA,#9505D5)',accent:'#A1C5FF'}
];
const t=(f,a,b)=>interpolate(f,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const Font=({children,size=60,style={}})=><div style={{fontFamily:'Pricedown',fontSize:size,lineHeight:.96,...style}}>{children}</div>;
const AppIcon=({kind})=>{
 const base={size:162,color:'white',strokeWidth:kind==='scooter'?3:2.5};
 if(kind==='peek')return <div style={{position:'relative'}}><Heart size={184} color='white' strokeWidth={4} fill='#FFDBEF'/><KeyRound size={74} strokeWidth={5} color='#B10BAF' style={{position:'absolute',left:54,top:52,transform:'rotate(45deg)'}}/></div>;
 if(kind==='scooter')return <Bike size={194} strokeWidth={3.6} color='white'/>;
 if(kind==='bank')return <div style={{border:'15px solid #D255FC',width:194,height:194,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',background:'#150D20',boxShadow:'0 0 24px #DC6AFD77 inset'}}><span style={{font:'italic 900 130px Arial',color:'#CF5DFF'}}>b</span></div>;
 if(kind==='messages')return <MessageCircle {...base} size={192} strokeWidth={3.8}/>;
 if(kind==='scan')return <div style={{display:'grid',justifyItems:'center',position:'relative'}}><ScanLine size={218} color='#E353FF' strokeWidth={2.7}/><CarFront size={122} color='white' strokeWidth={2.9} style={{position:'absolute',top:51}}/></div>;
 if(kind==='camera')return <Camera size={192} color='#F7F6FF' strokeWidth={3.2}/>;
 if(kind==='ryde')return <span style={{font:'italic 1000 180px Arial Black,Arial',letterSpacing:-19,color:'#0B0A1A',paddingRight:20}}>R</span>;
 return <Dumbbell size={212} color='white' strokeWidth={4}/>;
};
const Back=({f,id})=><AbsoluteFill style={{background:'#130B27',overflow:'hidden'}}>
 <Img src={staticFile(id%2===0?'vice1.jpg':'vice2.jpg')} style={{width:'100%',height:'100%',objectFit:'cover',filter:'brightness(.64) saturate(1.18)',transform:`scale(${1.27+f*.0003}) translateX(${Math.sin(f/50+id)*2}%)`}}/>
 <AbsoluteFill style={{background:'linear-gradient(180deg,rgba(30,5,53,.21) 2%,rgba(10,6,27,.30) 36%,rgba(1,1,9,.94) 92%)'}}/>
 <AbsoluteFill style={{background:'linear-gradient(100deg,rgba(247,117,218,.18),transparent,rgba(110,41,207,.21))'}}/>
</AbsoluteFill>;
const Cover=()=>{const f=useCurrentFrame(),v=ease(f,7,27);return <AbsoluteFill style={{background:'#0A0715',color:'white'}}>
 <Back f={f} id={0}/>
 <div style={{position:'absolute',top:155,left:35,right:35,textAlign:'center',opacity:v,transform:`translateY(${(1-v)*90}px)`}}>
  <div style={{font:'900 27px Arial',letterSpacing:6,color:'#FFE5F7'}}>GUIA GTA VI</div>
  <div style={{marginTop:80}}><Font size={105}>OS APLICATIVOS</Font><Font size={115} style={{background:grad,backgroundClip:'text',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>DO CELULAR</Font><Font size={117}>DE GTA VI</Font></div>
  <div style={{font:'bold 28px Arial',color:'#F7D2EC',marginTop:65}}>8 APPS QUE APARECEM NA REFERÊNCIA</div>
 </div>
 <div style={{position:'absolute',left:135,right:135,bottom:175,opacity:ease(f,60,95),display:'flex',alignItems:'center',justifyContent:'center',gap:18}}><Smartphone size={48} color='#FFC1ED'/><div style={{font:'bold 20px Arial',letterSpacing:4}}>DESLIZE PARA CONHECER</div></div>
 </AbsoluteFill>};
const Scene=({idx})=>{const f=useCurrentFrame(),d=settings[idx],appear=ease(f,0,27),settle=ease(f,32,65),exit=t(f,215,240);return <AbsoluteFill style={{background:'#0D0717',color:'white'}}>
 <Back f={f} id={idx}/>
 <div style={{position:'absolute',top:90,left:38,right:38,display:'flex',alignItems:'center',justifyContent:'space-between',font:'800 18px Arial',letterSpacing:3,color:'#FFE6F4'}}>
  <span>CELULAR DO GTA VI</span><span style={{color:'#FFC285'}}>0{idx+1} / 08</span>
 </div>
 <div style={{position:'absolute',top:185,left:70,right:70,height:500,borderRadius:60,background:d.bg,border:'3px solid #ffffff52',boxShadow:'0 27px 65px #080312dd,0 0 0 12px #fff1',opacity:appear*(1-.7*exit),transform:`translateY(${(1-appear)*130}px) rotate(${(1-appear)*-7}deg) scale(${.74+.26*appear+Math.sin(f/34)*.014})`,display:'flex',alignItems:'center',justifyContent:'center'}}>
  <AppIcon kind={d.kind}/>
  <div style={{position:'absolute',top:18,right:35,width:120,height:120,borderRadius:'50%',background:'#ffffff24',filter:'blur(24px)'}}/>
 </div>
 <div style={{position:'absolute',top:760,left:26,right:26,opacity:settle,transform:`translateY(${(1-settle)*70}px)`,textAlign:'center'}}>
  <Font size={d.name.length>11?79:96} style={{background:grad,WebkitBackgroundClip:'text',backgroundClip:'text',WebkitTextFillColor:'transparent',textShadow:'none'}}>{d.name}</Font>
  <div style={{height:3,width:290,margin:'26px auto',background:'linear-gradient(90deg,transparent,#FF83D3,transparent)'}}/>
  <div style={{font:'bold 30px/1.26 Arial',color:'#F8EDF6'}}>{d.desc}</div>
 </div>
 <div style={{position:'absolute',bottom:112,left:90,right:90,opacity:ease(f,80,117),font:'800 17px Arial',textAlign:'center',letterSpacing:3,color:'#FBE0EB'}}>{d.short}</div>
 <div style={{position:'absolute',bottom:0,left:0,right:0,height:7,background:'#fff1'}}><div style={{width:`${f/240*100}%`,height:'100%',background:grad}}/></div>
 </AbsoluteFill>};
const End=()=>{const f=useCurrentFrame(),v=ease(f,6,30);return <AbsoluteFill style={{background:'#0A0617',color:'white'}}>
 <Back f={f} id={4}/>
 <div style={{position:'absolute',top:345,left:30,right:30,textAlign:'center',opacity:v,transform:`translateY(${(1-v)*75}px)`}}>
 <Font size={105}>QUAL DESSES</Font><Font size={112} style={{color:'#FF8BCD'}}>VOCÊ QUER</Font><Font size={122}>TESTAR?</Font>
 <div style={{marginTop:80,font:'900 33px Arial',color:'#FFB9E3'}}>COMENTA AÍ!</div>
 </div>
 <div style={{position:'absolute',bottom:120,left:30,right:30,textAlign:'center',font:'bold 16px Arial',color:'#FBC5DE',letterSpacing:1}}>NOMES CONFORME POST DE REFERÊNCIA · FUNÇÕES NÃO CONFIRMADAS</div>
 </AbsoluteFill>};
const Video=()=> <AbsoluteFill style={{background:'#10061c'}}>
 <style>{`@font-face{font-family:Pricedown;src:url('${staticFile('pricedown.otf')}') format('opentype');font-display:block}`}</style>
 <Audio src={staticFile('music.wav')} volume={.25}/><Audio src={staticFile('narration.wav')} volume={1.3}/>
 <Sequence from={0} durationInFrames={240}><Cover/></Sequence>
 {settings.map((_,i)=><Sequence key={i} from={240+240*i} durationInFrames={240}><Scene idx={i}/></Sequence>)}
 <Sequence from={2160} durationInFrames={240}><End/></Sequence>
 </AbsoluteFill>;
registerRoot(()=><Composition id='GTA6Apps' component={Video} fps={FPS} width={W} height={H} durationInFrames={TOTAL}/>);
