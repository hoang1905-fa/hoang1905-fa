import { useState } from "react";
import { PRESET_COLORS, MOOD_OPTIONS } from "../../utils/constants";
import { S } from "../../utils/css";

export default function AddEditModal({initial, onSave, onClose}) {
  const blank = {
    title: "",
    author: "",
    year: new Date().getFullYear(),
    pages: 200,
    rating: 4.0,
    emoji: "📖",
    color: "#7C3AED",
    genres: "",
    themes: "",
    mood: "Truyền cảm hứng",
    description: ""
  };
  const [f, setF] = useState(initial ? {...initial, genres: initial.genres.join(", "), themes: initial.themes.join(", ")} : blank);
  const [err, setErr] = useState("");

  const set = (k, v) => setF(p => ({...p, [k]: v}));

  const save = () => {
    if(!f.title.trim() || !f.author.trim()) {
      setErr("Tên sách và tác giả là bắt buộc!");
      return;
    }
    onSave({
      ...f,
      title: f.title.trim(),
      author: f.author.trim(),
      year: Number(f.year) || 2024,
      pages: Number(f.pages) || 200,
      rating: Math.min(5, Math.max(0, Number(f.rating) || 4)),
      genres: f.genres.split(",").map(s => s.trim()).filter(Boolean),
      themes: f.themes.split(",").map(s => s.trim()).filter(Boolean),
      description: f.description || f.desc || ""  // ← Thêm fallback

    });
  };

  const inp = (label, key, type = "text", extra = {}) => (
    <div style={{flex:1,minWidth:140}}>
      <label style={{display:"block",color:S.textSecondary,fontSize:11,fontWeight:600,marginBottom:5,textTransform:"uppercase",letterSpacing:.5}}>{label}</label>
      <input 
        type={type} 
        value={f[key]} 
        onChange={e => set(key, e.target.value)} 
        {...extra}
        style={{
          width:"100%",
          background:S.surface,
          border:`1px solid ${S.border2}`,
          borderRadius:8,
          padding:"9px 12px",
          color:S.textPrimary,
          fontSize:13
        }}
      />
    </div>
  );

  return (
    <div 
      onClick={e => { if(e.target === e.currentTarget) onClose(); }} 
      style={{
        position:"fixed",
        inset:0,
        background:"rgba(0,0,0,.8)",
        backdropFilter:"blur(4px)",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        zIndex:400,
        padding:20,
        animation:"fadeIn .2s"
      }}
    >
      <div style={{
        background:S.card,
        border:`1px solid ${S.border2}`,
        borderRadius:18,
        maxWidth:560,
        width:"100%",
        maxHeight:"90vh",
        display:"flex",
        flexDirection:"column",
        animation:"slideUp .2s ease"
      }}>
        {/* Modal Header */}
        <div style={{
          padding:"18px 22px 16px",
          borderBottom:`1px solid ${S.border2}`,
          display:"flex",
          alignItems:"center",
          justifyContent:"space-between",
          flexShrink:0
        }}>
          <div style={{color:S.textPrimary,fontWeight:800,fontSize:16}}>
            {initial ? "✏️ Sửa sách" : "➕ Thêm sách mới"}
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:S.textMuted,fontSize:20,padding:"2px 6px",borderRadius:6}}>✕</button>
        </div>
        {/* Modal Body */}
        <div style={{flex:1,overflowY:"auto",padding:"18px 22px"}}>
          {/* Emoji + Color preview */}
          <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:18}}>
            <div style={{
              width:64,
              height:80,
              borderRadius:10,
              background:`linear-gradient(135deg,${f.color},${f.color}88)`,
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              fontSize:30,
              flexShrink:0
            }}>
              {f.emoji || "📖"}
            </div>
            <div style={{flex:1}}>
              <label style={{display:"block",color:S.textSecondary,fontSize:11,fontWeight:600,marginBottom:5,textTransform:"uppercase",letterSpacing:.5}}>Emoji bìa</label>
              <input 
                value={f.emoji} 
                onChange={e => set("emoji", e.target.value)} 
                placeholder="📖" 
                maxLength={4}
                style={{
                  width:80,
                  background:S.surface,
                  border:`1px solid ${S.border2}`,
                  borderRadius:8,
                  padding:"8px 10px",
                  color:S.textPrimary,
                  fontSize:20,
                  textAlign:"center"
                }}
              />
            </div>
          </div>

          {/* Color grid */}
          <div style={{marginBottom:18}}>
            <label style={{display:"block",color:S.textSecondary,fontSize:11,fontWeight:600,marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>Màu gáy sách</label>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {PRESET_COLORS.map(c => (
                <div 
                  key={c} 
                  onClick={() => set("color", c)}
                  style={{
                    width:28,
                    height:28,
                    borderRadius:6,
                    background:c,
                    cursor:"pointer",
                    border:f.color === c ? `2px solid ${S.textPrimary}` : "2px solid transparent",
                    transform:f.color === c ? "scale(1.2)" : "scale(1)",
                    transition:"transform .15s",
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center"
                  }}
                >
                  {f.color === c && <span style={{color:"#fff",fontSize:14,textShadow:"0 1px 3px rgba(0,0,0,.7)"}}>✓</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Title + Author */}
          <div style={{display:"flex",gap:12,marginBottom:12,flexWrap:"wrap"}}>
            {inp("Tên sách *","title","text",{placeholder:"Nhập tên sách..."})}
            {inp("Tác giả *","author","text",{placeholder:"Nhập tên tác giả..."})}
          </div>
          {/* Year + Pages + Rating */}
          <div style={{display:"flex",gap:12,marginBottom:12,flexWrap:"wrap"}}>
            {inp("Năm xuất bản","year","number",{min:1,max:2099})}
            {inp("Số trang","pages","number",{min:1})}
            {inp("Đánh giá (0-5)","rating","number",{min:0,max:5,step:.1})}
          </div>

          {/* Description */}
          <div style={{marginBottom:12}}>
            <label style={{display:"block",color:S.textSecondary,fontSize:11,fontWeight:600,marginBottom:5,textTransform:"uppercase",letterSpacing:.5}}>Mô tả</label>
            <textarea 
              value={f.description} 
              onChange={e => set("description", e.target.value)} 
              placeholder="Mô tả ngắn về nội dung sách..." 
              rows={3}
              style={{
                width:"100%",
                background:S.surface,
                border:`1px solid ${S.border2}`,
                borderRadius:8,
                padding:"9px 12px",
                color:S.textPrimary,
                fontSize:13,
                resize:"vertical",
                lineHeight:1.5
              }}
            />
          </div>

          {/* Genres + Themes */}
          <div style={{display:"flex",gap:12,marginBottom:12,flexWrap:"wrap"}}>
            {inp("Thể loại (phân cách bằng dấu phẩy)","genres","text",{placeholder:"Fantasy, Phiêu lưu, ..."})}
            {inp("Chủ đề (phân cách bằng dấu phẩy)","themes","text",{placeholder:"Tình bạn, Phép thuật, ..."})}
          </div>

          {/* Mood */}
          <div style={{marginBottom:4}}>
            <label style={{display:"block",color:S.textSecondary,fontSize:11,fontWeight:600,marginBottom:5,textTransform:"uppercase",letterSpacing:.5}}>Tâm trạng khi đọc</label>
            <select 
              value={f.mood} 
              onChange={e => set("mood", e.target.value)}
              style={{
                width:"100%",
                background:S.surface,
                border:`1px solid ${S.border2}`,
                borderRadius:8,
                padding:"9px 12px",
                color:S.textPrimary,
                fontSize:13
              }}
            >
              {MOOD_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {err && <div style={{color:"#EF4444",fontSize:12,marginTop:10,padding:"8px 12px",background:"#EF444411",borderRadius:7}}>❌ {err}</div>}
        </div>
        {/* Modal Footer */}
        <div style={{padding:"14px 22px",borderTop:`1px solid ${S.border2}`,display:"flex",gap:10,flexShrink:0}}>
          <button onClick={onClose} style={{
            flex:1,
            background:S.surface,
            color:S.textSecondary,
            border:`1px solid ${S.border2}`,
            borderRadius:10,
            padding:12,
            fontSize:14,
            fontWeight:600
          }}>
            Hủy
          </button>
          <button onClick={save} style={{
            flex:2,
            background:`linear-gradient(135deg,${S.green},${S.greenDark})`,
            color:"#fff",
            border:"none",
            borderRadius:10,
            padding:12,
            fontSize:14,
            fontWeight:700,
            boxShadow:`0 4px 14px ${S.green}44`
          }}>
            {initial ? "💾 Lưu thay đổi" : "➕ Thêm vào kho"}
          </button>
        </div>
      </div>
    </div>
  );
}