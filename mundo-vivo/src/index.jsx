import React from "react";
import {registerRoot,Composition,AbsoluteFill,Sequence,Img,Audio,staticFile,useCurrentFrame,interpolate,Easing} from "remotion";

const C={pink:"#F05B65",purple:"#546CEB",orange:"#FF6D69",white:"#FFF9FC"};
const ease=(f,a,b)=>Easing.out(Easing.cubic)(interpolate(f,[a,b],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}));
const interp=(f,a,b,x,y)=>interpolate(f,[a,b],[x,y],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
const themes=[
 {file:"city.jpg",title:"GTA VI TERÁ",big:"6 ESTRELAS!",sub:"A POLÍCIA VAI LEMBRAR QUEM VOCÊ É",eyebrow:"NOVO SISTEMA DE PROCURADO",pos:"center",stars:6},
 {file:"night.jpg",title:"GTA V TINHA 5",big:"AGORA SÃO 6",sub:"O MEDIDOR VOLTA ÀS SEIS ESTRELAS",eyebrow:"01 · O RETORNO DAS 6 ESTRELAS",pos:"center",stars:6},
 {file:"beach.jpg",title:"CRIME COM",big:"TESTEMUNHA",sub:"ALGUÉM PRECISA VER OU ACIONAR UM ALARME",eyebrow:"02 · COMO A POLÍCIA É CHAMADA",pos:"center",stars:2},
 {file:"birds.jpg",title:"RECONHECEM",big:"SUA ROUPA",sub:"O UNIFORME QUE VOCÊ USA VIRA UMA PISTA",eyebrow:"03 · DESCRIÇÃO DO SUSPEITO",pos:"center",identifier:"ROUPA"},
 {file:"boats.jpg",title:"IDENTIFICAM",big:"SEU CARRO",sub:"TROCAR DE VEÍCULO PODE DESPISTAR A VIATURA",eyebrow:"04 · VEÍCULO RECONHECIDO",pos:"center",identifier:"CARRO"},
 {file:"characters.jpg",title:"SEU ROSTO",big:"E SUA DUPLA",sub:"A POLÍCIA SABE SE JASON E LUCIA ESTÃO JUNTOS",eyebrow:"05 · ROSTO E COMPANHIA",pos:"center",identifier:"ROSTO · DUPLA"},
 {file:"swamp.jpg",title:"MUDAR DE ROUPA",big:"E SE SEPARAR",sub:"PODE AJUDAR A FUGIR. E VOCÊ, O QUE ACHOU?",eyebrow:"06 · FUGAS MAIS ESTRATÉGICAS",pos:"center",stars:6}
];
const big=(children,fontSize=84,color="white",style={})=><div style={{fontFamily:"Pricedown",fontSize,lineHeight:.98,color,letterSpacing:-1,textShadow:"0px 6px 18px rgba(4,2,12,.65)",...style}}>{children}</div>;
const Back=({f,file})=><AbsoluteFill style={{overflow:"hidden",background:"#0B0715"}}>
 <Img src={staticFile(file)} style={{width:"100%",height:"100%",objectFit:"cover",filter:"blur(30px) brightness(.46) saturate(1.22)",transform:`scale(${1.7+f*.0003})`}}/>
 <AbsoluteFill style={{background:"linear-gradient(180deg,rgba(3,8,28,.35),rgba(4,8,18,.49) 60%,#090C17)"}}/>
 </AbsoluteFill>;
const Frame=({i})=>{const f=useCurrentFrame(),d=themes[i],appear=ease(f,0,27),words=ease(f,27,70),fade=interp(f,277,299,1,0),scale=1.06+f*.00024;
 return <AbsoluteFill style={{background:"#06030c",color:"white",opacity:fade}}>
 <Back f={f} file={d.file}/>
 <div style={{position:"absolute",top:70,left:38,right:38,display:"flex",justifyContent:"space-between",alignItems:"center",color:"#FFE7FA",font:"900 18px Arial",letterSpacing:3}}>
   <span>{d.eyebrow}</span><span style={{color:C.orange}}>{String(i+1).padStart(2,"0")} / 07</span>
 </div>
 <div style={{position:"absolute",top:205,left:22,right:22,height:635,overflow:"hidden",borderRadius:25,border:"2px solid #ffffff50",boxShadow:"0 24px 70px #03000b99",transform:`translateY(${(1-appear)*105}px)`,opacity:appear}}>
   <Img src={staticFile(d.file)} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:d.pos,transform:`scale(${scale}) translateX(${Math.sin(f/61+i)*.6}%)`,filter:"contrast(1.03) saturate(1.05)"}}/>
   <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 56%,rgba(9,2,20,.74))"}}/>
   <div style={{position:"absolute",top:20,left:20,padding:"8px 14px",border:"1px solid #fff8",borderRadius:7,background:"#150b1a88",font:"bold 15px Arial",letterSpacing:2}}>GTA VI · IMAGEM DO JOGO</div>
   {d.stars&&<div style={{position:"absolute",top:79,left:19,right:19,display:"flex",justifyContent:"center",gap:5,filter:"drop-shadow(0 4px 6px #000c)"}}>
    {Array.from({length:6},(_,j)=><div key={j} style={{fontSize:72,color:j<d.stars?"#F54A61":"#fff7",WebkitTextStroke:"2px #190919",opacity:ease(f,10+j*6,30+j*6)}}>★</div>)}
   </div>}
   {d.identifier&&<div style={{position:"absolute",top:25,right:18,background:"#0D121FDE",border:"2px solid #FF5C7B",color:"white",padding:"11px 15px",borderRadius:12,font:"900 20px Arial",letterSpacing:2,boxShadow:"0 0 20px #E3386255"}}>IDENTIFICADO: {d.identifier}</div>}
 </div>
 <div style={{position:"absolute",top:850,left:27,right:27,textAlign:"center",opacity:words,transform:`translateY(${(1-words)*70}px)`}}>
   {big(d.title,d.title.length>15?69:83,"white")}
   {big(d.big,d.big.length>13?77:110,C.orange)}
   <div style={{width:290,height:4,background:"linear-gradient(90deg,#F94E64,#7074FF,#B2CBFA)",margin:"22px auto",borderRadius:8}}/>
   <div style={{font:"bold 26px/1.25 Arial",color:"#FBD9EA"}}>{d.sub}</div>
 </div>
 <div style={{position:"absolute",bottom:0,left:0,right:0,height:8,background:"#fff2"}}><div style={{width:`${f/300*100}%`,height:"100%",background:"linear-gradient(90deg,#F83D54,#597BF0,#A7C8FF)"}}/></div>
 <AbsoluteFill style={{pointerEvents:"none",background:"#fff",opacity:interp(f,0,12,.22,0)}}/>
 </AbsoluteFill>;
};
const Video=()=> <AbsoluteFill style={{background:"#080E20"}}>
 <style>{`@font-face{font-family:Pricedown;src:url('${staticFile("pricedown.otf")}') format("opentype");font-display:block;}`}</style>
 <Audio src={staticFile("music.wav")} volume={.22}/><Audio src={staticFile("voice.wav")} volume={1.1}/>
 {themes.map((_,i)=><Sequence from={i*300} durationInFrames={300} key={i}><Frame i={i}/></Sequence>)}
 </AbsoluteFill>;
registerRoot(()=><Composition id="GTAVIWorld" component={Video} width={720} height={1280} fps={60} durationInFrames={2100}/>);
