import React from "react";
import {registerRoot,Composition,AbsoluteFill,Sequence,Img,Audio,staticFile,useCurrentFrame,interpolate,Easing} from "remotion";
const clamp={extrapolateLeft:"clamp",extrapolateRight:"clamp"};
const lerp=(f,a,b,x,y)=>interpolate(f,[a,b],[x,y],clamp);
const ease=(f,a,b)=>Easing.out(Easing.cubic)(lerp(f,a,b,0,1));
const palette={pink:"#FA5EB8",purple:"#7F15E1",orange:"#FF993B",white:"#fff8ff"};
const face="Pricedown";
const Type=({children,size=75,color="white",style={}})=><div style={{fontFamily:face,fontSize:size,lineHeight:.95,textShadow:"0 4px 0 #2b103f66",color,textAlign:"center",...style}}>{children}</div>;
const Graphic=({frame,index=0})=>{
 const zoom=1.25+frame*.0005;
 const bg=index===0?"art1.jpg":index===1?"art2.jpg":"art3.jpg";
 return <AbsoluteFill style={{overflow:"hidden",background:"#180d30"}}>
  <Img src={staticFile(bg)} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"52% center",filter:"saturate(1.16) brightness(.68)",transform:`scale(${zoom}) translateX(${Math.sin(frame/42)*2}%)`}}/>
  <AbsoluteFill style={{background:"linear-gradient(180deg,rgba(44,6,76,.50),rgba(117,9,93,.20) 40%,rgba(25,1,45,.86))"}}/>
  <AbsoluteFill style={{background:"linear-gradient(90deg,rgba(255,104,121,.12),rgba(128,24,216,.20))",mixBlendMode:"screen"}}/>
  <AbsoluteFill style={{background:`radial-gradient(circle at ${55+Math.cos(frame/31)*15}% 40%,rgba(255,100,204,.28),transparent 65%)`}}/>
 </AbsoluteFill>
};
const LightSweep=({frame})=><div style={{position:"absolute",top:-150,left:`${-70+frame*1.8}%`,height:"160%",width:95,background:"linear-gradient(90deg,transparent,#fff4,transparent)",transform:"rotate(23deg)",filter:"blur(16px)",opacity:.75}}/>;
const Label=({children})=><div style={{font:"900 16px Arial",letterSpacing:5,color:"#fff5f8",textAlign:"center",textShadow:"0 2px 18px #40105b"}}>{children}</div>;
const Progress=({frame})=><div style={{height:18,width:410,borderRadius:100,overflow:"hidden",background:"#190837dd",padding:3,border:"1px solid #ffffff44",boxShadow:"0 0 28px #9e31fb77"}}>
 <div style={{width:`${lerp(frame,0,660,81,99)}%`,height:"100%",borderRadius:100,background:"linear-gradient(90deg,#7912da,#c930ba,#ff8d42)",boxShadow:"0 0 13px #ffb36e"}}/>
 </div>;
const TitleMark=({f})=>{const p=ease(f,0,28);return <div style={{opacity:p,transform:`translateY(${(1-p)*-60}px) scale(${.78+p*.22})`,filter:"drop-shadow(0 8px 14px #20082eaa)"}}>
 <div style={{fontFamily:face,fontSize:50,lineHeight:.7,whiteSpace:"pre-line",textAlign:"center",color:"white",WebkitTextStroke:"2px #130c1c",paintOrder:"stroke",letterSpacing:-1}}>grand{"\n"}theft{"\n"}auto</div>
 <div style={{fontFamily:"Georgia,serif",fontWeight:900,fontStyle:"italic",fontSize:105,textAlign:"center",lineHeight:.66,background:"linear-gradient(180deg,#ffa748,#f951a5,#871dea)",backgroundClip:"text",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",WebkitTextStroke:"2px #30004c"}}>VI</div>
 </div>};
const Ribbon=({f})=>{const p=ease(f,7,34);return <div style={{position:"absolute",top:590,left:-45,width:810,transform:`rotate(-5deg) translateX(${(1-p)*-950}px)`,opacity:p,background:"linear-gradient(90deg,#6e06c9,#e242b9,#b22aef)",borderTop:"3px solid #fcd3fb",borderBottom:"3px solid #30015c",boxShadow:"0 15px 42px #090214aa",padding:"22px 0"}}>
  <Type size={80}>MISSÃO CUMPRIDA</Type>
 </div>};
const Scene=({index})=>{const f=useCurrentFrame();const t=f+index*220;const inA=ease(f,0,22);return <AbsoluteFill style={{color:"white"}}>
 <Graphic frame={t} index={index}/>
 {index===0&&<LightSweep frame={f}/>}
 <div style={{position:"absolute",top:145,left:80,right:80}}><TitleMark f={f+index*20}/></div>
 <div style={{position:"absolute",top:394,left:0,right:0}}><Label>CONTAGEM REGRESSIVA</Label></div>
 <div style={{position:"absolute",top:490,left:0,right:0,opacity:inA,transform:`translateY(${(1-inA)*70}px)`}}>
  <Type size={61}>FALTAM</Type><Type size={250}>4</Type><Type size={92}>DIAS</Type>
 </div>
 {index===1&&<Ribbon f={f}/>}
 <div style={{position:"absolute",top:905,left:0,right:0,display:"flex",flexDirection:"column",gap:10,alignItems:"center"}}>
  <Progress frame={t}/>
  <div style={{font:"900 12px Arial",letterSpacing:3,color:"#fff"}}>CARREGANDO 99%</div>
  <Label>CHEGA 19 DE NOVEMBRO</Label>
 </div>
 {index===2&&<div style={{position:"absolute",bottom:200,left:30,right:30,opacity:ease(f,25,60),transform:`translateY(${(1-ease(f,25,60))*60}px)`,textAlign:"center"}}>
  <Type size={47}>VOCÊ ESTÁ PRONTO?</Type>
 </div>}
 <div style={{position:"absolute",bottom:65,left:0,right:0,font:"bold 13px Arial",letterSpacing:2,color:"#ffffff99",textAlign:"center"}}>IMAGENS: ROCKSTAR GAMES</div>
 <AbsoluteFill style={{background:"#fff",opacity:lerp(f,0,9,.32,0),pointerEvents:"none"}}/>
 </AbsoluteFill>};
const App=()=> <AbsoluteFill style={{background:"#10021c"}}>
 <style>{`@font-face {font-family:Pricedown;src:url('${staticFile("pricedown.otf")}') format('opentype');font-display:block;}`}</style>
 <Audio src={staticFile("music.wav")} volume={.65}/>
 <Sequence from={0} durationInFrames={220}><Scene index={0}/></Sequence>
 <Sequence from={220} durationInFrames={220}><Scene index={1}/></Sequence>
 <Sequence from={440} durationInFrames={220}><Scene index={2}/></Sequence>
 </AbsoluteFill>;
registerRoot(()=><Composition id="GTAVI4Dias" fps={60} width={720} height={1280} durationInFrames={660} component={App}/>);
