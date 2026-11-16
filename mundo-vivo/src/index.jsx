import React from "react";
import {registerRoot,Composition,AbsoluteFill,Sequence,Img,Audio,staticFile,useCurrentFrame,interpolate,Easing} from "remotion";

const C={pink:"#F05B65",purple:"#546CEB",orange:"#FF6D69",white:"#FFF9FC"};
const ease=(f,a,b)=>Easing.out(Easing.cubic)(interpolate(f,[a,b],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}));
const interp=(f,a,b,x,y)=>interpolate(f,[a,b],[x,y],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
const themes=[
 {file:"city.jpg",title:"POLÍCIA EM GTA VI",big:"MAIS INTENSA?",sub:"A ROCKSTAR MOSTROU CENAS DE GRANDE TENSÃO",eyebrow:"ROCKSTAR GAMES · ANÁLISE",pos:"center"},
 {file:"night.jpg",title:"VIATURAS",big:"NAS RUAS",sub:"A VCPD APARECE COM SUVS E PATRULHAS",eyebrow:"01 · VICE CITY POLICE",pos:"center"},
 {file:"beach.jpg",title:"HELICÓPTEROS",big:"E BARCOS",sub:"UM CERCO POLICIAL AO REDOR DE UMA MANSÃO",eyebrow:"02 · OPERAÇÃO POLICIAL",pos:"center"},
 {file:"birds.jpg",title:"FUGAS",big:"PERIGOSAS",sub:"LUCIA E UMA VIATURA EM UM TÚNEL",eyebrow:"03 · PERSEGUIÇÕES",pos:"center"},
 {file:"boats.jpg",title:"NO MAR",big:"TAMBÉM",sub:"JASON APARECE PERTO DE BARCOS POLICIAIS",eyebrow:"04 · PATRULHA AQUÁTICA",pos:"center"},
 {file:"characters.jpg",title:"ABORDAGENS",big:"MAIS FORTES?",sub:"HÁ UMA DETENÇÃO MOSTRADA NO VÍDEO OFICIAL",eyebrow:"05 · REAÇÃO POLICIAL",pos:"center"},
 {file:"swamp.jpg",title:"E A INTELIGÊNCIA",big:"ARTIFICIAL?",sub:"AINDA NÃO SABEMOS COMO FUNCIONARÁ JOGANDO",eyebrow:"O QUE AINDA É TEORIA",pos:"center"}
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
   <div style={{position:"absolute",top:20,left:20,padding:"8px 14px",border:"1px solid #fff8",borderRadius:7,background:"#150b1a88",font:"bold 15px Arial",letterSpacing:2}}>GTA VI · MATERIAL OFICIAL</div>
 </div>
 <div style={{position:"absolute",top:850,left:27,right:27,textAlign:"center",opacity:words,transform:`translateY(${(1-words)*70}px)`}}>
   {big(d.title,i===5?70:83,"white")}
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
