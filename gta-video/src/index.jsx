import React from "react";
import { registerRoot, Composition, AbsoluteFill, Sequence, Img, Audio, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
const white="#fff",pink="#e875bb",purple="#ae76ef",orange="#ffac66";
const CL={extrapolateLeft:"clamp",extrapolateRight:"clamp"};
const norm=(f,a,b)=>interpolate(f,[a,b],[0,1],CL);
const ease=(f,a,b)=>Easing.out(Easing.cubic)(norm(f,a,b));
const T=({children,frame,at=0,fontSize=80,color=white})=>{
 const a=ease(frame,at,at+22);return <div style={{fontFamily:"Pricedown",color,fontSize,lineHeight:1.03,letterSpacing:0,textAlign:"center",transform:`translateY(${(1-a)*100}px) scale(${0.88+0.12*a})`,opacity:a,textShadow:"0 7px 0 rgba(0,0,0,.3)"}}>{children}</div>
};
const Background=({frame})=><AbsoluteFill style={{overflow:"hidden",background:"#130c24"}}>
 <Img src={staticFile("gta6.jpg")} style={{width:"100%",height:"100%",objectFit:"cover",filter:"blur(8px) brightness(.45) saturate(1.3)",transform:`scale(${1.35+frame*.0002}) translateX(${Math.sin(frame/65)*2}%)`}}/>
 <AbsoluteFill style={{background:"linear-gradient(180deg,rgba(10,0,20,.12),rgba(15,2,23,.87))"}}/>
 <AbsoluteFill style={{background:`radial-gradient(ellipse at ${50+Math.sin(frame/50)*18}% 28%,rgba(174,90,242,.4),transparent 62%)`}}/>
 </AbsoluteFill>;
const Bar=({frame})=><div style={{height:7,borderRadius:50,width:`${75+Math.sin(frame/35)*10}%`,background:"linear-gradient(90deg,#f6a764,#f36ea5,#a982ef)",boxShadow:"0 0 24px #cf63fa",margin:"26px auto"}}/>;
const Surface=({children})=><div style={{padding:"28px 30px",background:"linear-gradient(140deg,rgba(16,10,34,.91),rgba(56,21,78,.76))",border:"2px solid rgba(255,255,255,.25)",borderRadius:26,boxShadow:"0 18px 45px #0008"}}>{children}</div>;
const Frame=({frame,children})=><AbsoluteFill style={{fontFamily:"Pricedown",color:white,background:"#170d24"}}><Background frame={frame}/>{children}<div style={{position:"absolute",bottom:42,left:36,right:36,display:"flex",justifyContent:"space-between",font:"bold 18px Arial",letterSpacing:2,color:"#ffd5ed"}}><span>GRAND THEFT AUTO VI</span><span>BRASIL / 2026</span></div></AbsoluteFill>;
const Title=({children})=><div style={{font:"bold 22px Arial",letterSpacing:5,color:orange,textAlign:"center",marginBottom:30}}>{children}</div>;
const Pulse=({children,frame})=><div style={{transform:`scale(${1+Math.sin(frame/18)*.025})`}}>{children}</div>;
const Console=({frame})=><div style={{margin:"0 auto",width:335,height:405,background:"linear-gradient(110deg,#fdfdfd,#c0c1c7)",borderRadius:25,boxShadow:"12px 22px 0 #4a4056,25px 35px 40px #0007",transform:`perspective(700px) rotateY(${-14+Math.sin(frame/28)*4}deg) translateY(${Math.sin(frame/18)*5}px)`,position:"relative"}}>
 <div style={{width:244,height:244,position:"absolute",left:43,top:32,borderRadius:"50%",background:"repeating-radial-gradient(circle,#13151b 0px,#171922 2px,#4b4c56 4px)"}}/>
 <div style={{width:22,height:22,position:"absolute",left:278,top:354,border:"2px solid #888",borderRadius:"50%"}}/>
 </div>;
const GameCase=({frame})=><div style={{height:450,width:325,margin:"0 auto",overflow:"hidden",borderRadius:18,border:"9px solid #191522",boxShadow:"25px 25px 40px #000a",transform:`perspective(720px) rotateY(${-12+Math.sin(frame/31)*4}deg) rotateZ(3deg) translateY(${Math.sin(frame/20)*6}px)`}}>
 <div style={{height:48,background:"#25814e",font:"bold 22px Arial",padding:"10px 16px"}}>XBOX SERIES X | S</div>
 <Img src={staticFile("gta6.jpg")} style={{height:"calc(100% - 48px)",width:"100%",objectFit:"cover"}} />
 </div>;
const Scene=({index})=>{const f=useCurrentFrame();
 const shell=(body)=><Frame frame={f}><div style={{position:"absolute",left:30,right:30,top:125}}>{body}</div></Frame>;
 if(index===0)return shell(<><Title>O MENOR INVESTIMENTO PARA JOGAR GTA VI</Title><div style={{marginTop:190}}><T frame={f} at={6} fontSize={105}>QUANTO CUSTA</T><T frame={f} at={24} fontSize={132} color={orange}>JOGAR GTA VI?</T><Bar frame={f}/><T frame={f} at={52} fontSize={60}>NO BRASIL</T></div></>);
 if(index===1)return shell(<><Title>01 / O CONSOLE</Title><T frame={f} at={5} fontSize={88}>XBOX SERIES S</T><div style={{margin:"70px auto"}}><Console frame={f}/></div><Surface><T frame={f} at={38} fontSize={90}>R$ 2.257,64</T><div style={{font:"bold 20px Arial",textAlign:"center",color:"#fbc7db",marginTop:22}}>OFERTA DE REFERÊNCIA • SUJEITA A ALTERAÇÕES</div></Surface></>);
 if(index===2)return shell(<><Title>02 / O JOGO</Title><T frame={f} at={7} fontSize={83}>GTA VI STANDARD</T><div style={{margin:"66px auto"}}><GameCase frame={f}/></div><Surface><T frame={f} at={40} fontSize={100}>R$ 449,90</T><div style={{font:"bold 20px Arial",textAlign:"center",color:"#fbc7db",marginTop:24}}>PREÇO DE REFERÊNCIA DO JOGO</div></Surface></>);
 if(index===3){const price=(2707.54*ease(f,34,110)).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});return shell(<><Title>03 / FAZENDO AS CONTAS</Title><T frame={f} at={5} fontSize={95}>O TOTAL FICA...</T><div style={{marginTop:120}}><Surface><div style={{font:"bold 30px Arial",display:"flex",justifyContent:"space-between"}}><span>SERIES S</span><span>R$ 2.257,64</span></div><Bar frame={f}/><div style={{font:"bold 30px Arial",display:"flex",justifyContent:"space-between"}}><span>GTA VI</span><span>R$ 449,90</span></div></Surface></div><div style={{marginTop:105}}><T frame={f} at={36} fontSize={58} color={orange}>A PARTIR DE</T><Pulse frame={f}><div style={{textAlign:"center",fontSize:122,whiteSpace:"nowrap",textShadow:"0 9px 0 #692d86"}}>{price}</div></Pulse><Bar frame={f}/></div></>)}
 if(index===4)return shell(<><Title>IMPORTANTE</Title><div style={{marginTop:170}}><T frame={f} at={5} fontSize={119} color={orange}>PREÇOS VARIAM!</T></div><div style={{marginTop:95}}><Surface><T frame={f} at={35} fontSize={61}>O CONSOLE PODE CUSTAR MAIS OU MENOS</T><Bar frame={f}/><div style={{font:"bold 25px Arial",lineHeight:1.4,textAlign:"center"}}>Frete, televisão e acessórios não estão incluídos.</div></Surface></div></>);
 return shell(<><Title>VOCÊ PAGARIA ISSO?</Title><div style={{marginTop:170}}><T frame={f} at={5} fontSize={112}>R$ 2.707?</T><T frame={f} at={35} fontSize={93} color={orange}>COMENTA AÍ!</T><Bar frame={f}/></div><div style={{marginTop:180,font:"bold 20px Arial",textAlign:"center",letterSpacing:1,color:"#f7d8ed"}}>VALORES DE REFERÊNCIA DE NOVEMBRO DE 2026</div></>);
};
const Video=()=> <AbsoluteFill style={{background:"#110b1b"}}><style>{`@font-face {font-family: Pricedown;src:url('${staticFile("pricedown.otf")}') format('opentype');}`}</style><Audio src={staticFile("beat.wav")} volume={.58}/>{[0,1,2,3,4,5].map((n)=><Sequence key={n} from={n*300} durationInFrames={300}><Scene index={n}/></Sequence>)}</AbsoluteFill>;
registerRoot(()=><Composition id="GTA6ValorMinimo" component={Video} width={720} height={1280} fps={60} durationInFrames={1800}/>);
