import { S } from "../../utils/css";

export default function ChatBubble({msg}) {
  const u = msg.role === "user";
  return (
    <div style={{display:"flex",justifyContent:u?"flex-end":"flex-start",marginBottom:14,alignItems:"flex-end",gap:8}}>
      {!u && (
        <div style={{width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${S.accent},${S.accentDark})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>
          📚
        </div>
      )}
      <div style={{maxWidth:"76%",background:u?`linear-gradient(135deg,${S.accent},${S.accentDark})`:S.card,color:u?S.bg:S.textPrimary,borderRadius:u?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"11px 16px",fontSize:14,lineHeight:1.6,whiteSpace:"pre-wrap",border:u?"none":`1px solid ${S.border2}`}}>
        {msg.content}
      </div>
    </div>
  );
}