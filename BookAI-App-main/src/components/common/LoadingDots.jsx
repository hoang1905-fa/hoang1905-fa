import { S } from "../../utils/css";

export default function LoadingDots() {
  return (
    <div style={{display:"flex",gap:"6px",padding:"10px 14px",background:S.card,borderRadius:"18px 18px 18px 4px",width:"fit-content"}}>
      {[0,1,2].map(i => (
        <div key={i} style={{width:7,height:7,borderRadius:"50%",background:S.accent,animation:`bounce 1.1s ease-in-out ${i*0.18}s infinite`}}/>
      ))}
    </div>
  );
}