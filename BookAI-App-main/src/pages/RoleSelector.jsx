import { S, css } from "../utils/css";

export default function RoleSelector({onSelect}) {
  return (
    <div style={{
      minHeight:"100vh",
      background:S.bg,
      display:"flex",
      flexDirection:"column",
      alignItems:"center",
      justifyContent:"center",
      padding:32,
      fontFamily:"'Segoe UI',-apple-system,sans-serif",
      position:"relative",
      overflow:"hidden"
    }}>
      <style>{css}</style>
      
      <div style={{position:"absolute",top:"8%",left:"4%",fontSize:90,opacity:.03,transform:"rotate(-15deg)",userSelect:"none"}}>📖</div>
      <div style={{position:"absolute",bottom:"12%",right:"6%",fontSize:80,opacity:.03,transform:"rotate(12deg)",userSelect:"none"}}>📚</div>
      <div style={{position:"absolute",top:"40%",right:"3%",fontSize:60,opacity:.03,transform:"rotate(-8deg)",userSelect:"none"}}>🔖</div>

      <div style={{fontSize:56,marginBottom:12,filter:`drop-shadow(0 0 20px ${S.accent}44)`}}>📚</div>
      <h1 style={{color:S.textPrimary,fontSize:40,fontWeight:900,margin:"0 0 6px",letterSpacing:-1}}>
        Book<span style={{color:S.accent}}>AI</span>
      </h1>
      <p style={{color:S.textMuted,fontSize:15,margin:"0 0 52px"}}>Nền tảng gợi ý sách thông minh</p>

      <div style={{display:"flex",gap:20,width:"100%",maxWidth:560,flexWrap:"wrap",justifyContent:"center"}}>
        {/* Admin Card */}
        <div 
          onClick={() => onSelect("admin-login")} 
          style={{
            flex:1,
            minWidth:220,
            background:S.card,
            border:`1px solid ${S.border}`,
            borderRadius:16,
            padding:"28px 24px",
            cursor:"pointer",
            transition:"all .2s",
            position:"relative",
            overflow:"hidden"
          }}
          onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${S.green}66`; e.currentTarget.style.transform = "translateY(-3px)"; }}
          onMouseLeave={e => { e.currentTarget.style.border = `1px solid ${S.border}`; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <div style={{
            width:48,
            height:48,
            borderRadius:12,
            background:`${S.green}22`,
            border:`1px solid ${S.green}44`,
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            fontSize:22,
            marginBottom:14
          }}>
            ⚙️
          </div>
          <div style={{color:S.textPrimary,fontWeight:800,fontSize:17,marginBottom:6}}>Quản Trị Viên</div>
          <div style={{color:S.textMuted,fontSize:13,lineHeight:1.5}}>Quản lý kho sách, thêm & xóa sách, theo dõi thống kê</div>
          <div style={{marginTop:16,display:"flex",gap:8,flexWrap:"wrap"}}>
            {["+ Thêm sách","✏️ Sửa","🗑️ Xóa"].map(t => (
              <span key={t} style={{
                background:`${S.green}18`,
                color:S.green,
                border:`1px solid ${S.green}33`,
                borderRadius:20,
                padding:"3px 10px",
                fontSize:11,
                fontWeight:600
              }}>
                {t}
              </span>
            ))}
          </div>
        </div>
        {/* User Card */}
        <div 
          onClick={() => onSelect("user")} 
          style={{
            flex:1,
            minWidth:220,
            background:S.card,
            border:`1px solid ${S.border}`,
            borderRadius:16,
            padding:"28px 24px",
            cursor:"pointer",
            transition:"all .2s",
            position:"relative",
            overflow:"hidden"
          }}
          onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${S.accent}66`; e.currentTarget.style.transform = "translateY(-3px)"; }}
          onMouseLeave={e => { e.currentTarget.style.border = `1px solid ${S.border}`; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <div style={{
            width:48,
            height:48,
            borderRadius:12,
            background:`${S.accent}22`,
            border:`1px solid ${S.accent}44`,
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            fontSize:22,
            marginBottom:14
          }}>
            📖
          </div>
          <div style={{color:S.textPrimary,fontWeight:800,fontSize:17,marginBottom:6}}>Độc Giả</div>
          <div style={{color:S.textMuted,fontSize:13,lineHeight:1.5}}>Khám phá sách phù hợp với sở thích qua AI gợi ý thông minh</div>
          <div style={{marginTop:16,display:"flex",gap:8,flexWrap:"wrap"}}>
            {["🤖 AI gợi ý","💬 Chat","✨ Cá nhân hóa"].map(t => (
              <span key={t} style={{
                background:`${S.accent}18`,
                color:S.accent,
                border:`1px solid ${S.accent}33`,
                borderRadius:20,
                padding:"3px 10px",
                fontSize:11,
                fontWeight:600
              }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}