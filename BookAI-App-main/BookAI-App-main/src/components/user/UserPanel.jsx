import { useState, useRef, useEffect } from "react";
import { S, css } from "../../utils/css";
import { buildSysPrompt } from "../../utils/prompt";
import ChatBubble from "../common/ChatBubble";
import LoadingDots from "../common/LoadingDots";
import UserBookCard from "../common/UserBookCard";
import BookDetailModal from "../common/BookDetailModal";

export default function UserPanel({books, onBack}) {
  const [mode, setMode] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [prefTags, setPrefTags] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior:"smooth"});
  }, [messages, loading]);

  const startMode = (m) => {
    setMode(m);
    const greeting = m === "preference"
      ? "Xin chào! 📚 Tôi là BookAI!\n\nKho sách hiện có "+books.length+" cuốn. Bạn đang muốn đọc thể loại gì, hay tâm trạng nào? Cứ kể thoải mái nhé! 😊"
      : "Xin chào! 📚 Tôi là BookAI!\n\nTôi sẽ tìm hiểu sở thích qua sách bạn đã đọc. Hãy kể cho tôi một cuốn sách bạn thích nhất gần đây đi! 🔮";
    setMessages([{role:"assistant", content: greeting}]);
    setTimeout(() => inputRef.current?.focus(), 150);
  };

  const send = async () => {
    if(!inputVal.trim() || loading) return;
    const text = inputVal.trim();
    setInputVal("");
    const newMsgs = [...messages, {role:"user", content:text}];
    setMessages(newMsgs);
    setLoading(true);
    try {
      const GKEY = import.meta.env.VITE_GEMINI_API_KEY;
      const GURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GKEY}`;
      const geminiContents = newMsgs.map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{text: m.content}]
      }));
      const res = await fetch(GURL, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          system_instruction: {parts: [{text: buildSysPrompt(books, mode)}]},
          contents: geminiContents,
          generationConfig: {maxOutputTokens: 1500}
        })
      });
      const data = await res.json();
      if(data.error) { throw new Error("❌ "+data.error.message); }
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "Oops, có lỗi! Thử lại nhé 🙏";
      const jm = raw.match(/\[BOOKS_JSON\]([\s\S]*?)\[\/BOOKS_JSON\]/);
      if(jm) {
        try {
          const p = JSON.parse(jm[1].trim());
          const r = (p.book_ids || []).map(id => books.find(b => b.id === id)).filter(Boolean);
          if(r.length > 0) setRecommendations(r);
          if(p.preference_tags?.length) setPrefTags(p.preference_tags);
        } catch(_) {}
      }
      setMessages(p => [...p, {role:"assistant", content: raw.replace(/\[BOOKS_JSON\][\s\S]*?\[\/BOOKS_JSON\]/g,"").trim()}]);
    } catch(_) {
      setMessages(p => [...p, {role:"assistant", content: "❌ Lỗi: "+(_?.message||"Không thể kết nối API. Kiểm tra API key trong .env")}]);
    }
    setLoading(false);
  };

  // Mode selector
  if(!mode) {
    return (
      <div style={{
        minHeight:"100vh",
        background:S.bg,
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"center",
        padding:32,
        fontFamily:"'Segoe UI',-apple-system,sans-serif"
      }}>
        <style>{css}</style>
        <div style={{position:"absolute",top:16,left:16}}>
          <button onClick={onBack} style={{background:"none",border:"none",color:S.textMuted,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
            ← Trang chủ
          </button>
        </div>
        <div style={{fontSize:56,marginBottom:12,filter:`drop-shadow(0 0 20px ${S.accent}44)`}}>📚</div>
        <h1 style={{color:S.textPrimary,fontSize:36,fontWeight:900,margin:"0 0 6px",letterSpacing:-1}}>
          Book<span style={{color:S.accent}}>AI</span>
        </h1>
        <p style={{color:S.textMuted,fontSize:14,margin:"0 0 8px"}}>{books.length} cuốn sách đang chờ bạn</p>
        <div style={{display:"flex",gap:8,marginBottom:44}}>
          {["📖 Văn học VN","🔍 Trinh thám","🚀 Viễn tưởng","💡 Kỹ năng"].map(t => (
            <span key={t} style={{background:S.card,color:S.textMuted,border:`1px solid ${S.border}`,borderRadius:20,padding:"3px 10px",fontSize:11}}>{t}</span>
          ))}
        </div>
        <div style={{width:"100%",maxWidth:400,display:"flex",flexDirection:"column",gap:12}}>
          <button onClick={() => startMode("preference")} style={{
            background:`linear-gradient(135deg,${S.accent},${S.accentDark})`,
            color:S.bg,
            border:"none",
            borderRadius:14,
            padding:"18px 22px",
            fontSize:15,
            fontWeight:800,
            cursor:"pointer",
            textAlign:"left",
            boxShadow:`0 8px 24px ${S.accent}33`
          }}>
            <div>📝 Tôi biết mình muốn đọc gì</div>
            <div style={{fontSize:12,fontWeight:500,opacity:.7,marginTop:4}}>Nhập sở thích → nhận gợi ý ngay</div>
          </button>
          <button onClick={() => startMode("discover")} style={{
            background:S.card,
            color:S.textPrimary,
            border:`1px solid ${S.border2}`,
            borderRadius:14,
            padding:"18px 22px",
            fontSize:15,
            fontWeight:700,
            cursor:"pointer",
            textAlign:"left"
          }}>
            <div>🔮 Hãy giúp tôi khám phá sở thích</div>
            <div style={{fontSize:12,fontWeight:400,opacity:.5,marginTop:4}}>Trò chuyện về sách đã đọc → AI phân tích</div>
          </button>
        </div>
      </div>
    );
  }

  const hasRecs = recommendations.length > 0;
  return (
    <div style={{
      display:"flex",
      height:"100vh",
      background:S.bg,
      fontFamily:"'Segoe UI',-apple-system,sans-serif",
      overflow:"hidden"
    }}>
      <style>{css}</style>
      
      {/* Chat Panel */}
      <div style={{
        flex:1,
        display:"flex",
        flexDirection:"column",
        minWidth:0,
        borderRight: hasRecs ? `1px solid ${S.border}` : "none"
      }}>
        <div style={{
          padding:"12px 18px",
          background:S.surface,
          borderBottom:`1px solid ${S.border}`,
          display:"flex",
          alignItems:"center",
          gap:10,
          flexShrink:0
        }}>
          <button onClick={() => { setMode(null); setMessages([]); setRecommendations([]); setPrefTags([]); }} style={{background:"none",border:"none",color:S.textMuted,fontSize:18,padding:"2px 6px",borderRadius:6}}>
            ←
          </button>
          <div style={{
            width:30,
            height:30,
            borderRadius:"50%",
            background:`linear-gradient(135deg,${S.accent},${S.accentDark})`,
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            fontSize:14
          }}>
            📚
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{color:S.textPrimary,fontWeight:700,fontSize:14,lineHeight:1.2}}>BookAI</div>
            <div style={{color:S.textMuted,fontSize:11}}>
              {mode === "preference" ? "Chế độ: Nhập sở thích" : "Chế độ: Khám phá"}
            </div>
          </div>
          {prefTags.length > 0 && (
            <div style={{display:"flex",gap:5,flexWrap:"wrap",justifyContent:"flex-end",maxWidth:200}}>
              {prefTags.map(t => (
                <span key={t} style={{
                  background:`${S.accent}18`,
                  color:S.accent,
                  border:`1px solid ${S.accent}33`,
                  borderRadius:20,
                  padding:"2px 9px",
                  fontSize:10,
                  fontWeight:600,
                  whiteSpace:"nowrap"
                }}>
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"20px 18px"}}>
          {messages.map((m, i) => <ChatBubble key={i} msg={m} />)}
          {loading && (
            <div style={{display:"flex",alignItems:"flex-end",gap:8,marginBottom:14}}>
              <div style={{
                width:30,
                height:30,
                borderRadius:"50%",
                background:`linear-gradient(135deg,${S.accent},${S.accentDark})`,
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                fontSize:14
              }}>
                📚
              </div>
              <LoadingDots />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div style={{
          padding:"14px 18px",
          background:S.surface,
          borderTop:`1px solid ${S.border}`,
          display:"flex",
          gap:10,
          alignItems:"flex-end",
          flexShrink:0
        }}>
          <textarea 
            ref={inputRef}
            value={inputVal} 
            onChange={e => setInputVal(e.target.value)} 
            onKeyDown={e => { if(e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} 
            placeholder="Nhập tin nhắn... (Enter để gửi)" 
            disabled={loading} 
            rows={1}
            style={{
              flex:1,
              background:S.card,
              border:`1px solid ${S.border2}`,
              borderRadius:12,
              padding:"11px 15px",
              color:S.textPrimary,
              fontSize:14,
              resize:"none",
              lineHeight:1.5,
              maxHeight:100,
              overflowY:"auto"
            }}
          />
          <button 
            onClick={send} 
            disabled={loading || !inputVal.trim()} 
            style={{
              background: inputVal.trim() && !loading ? `linear-gradient(135deg,${S.accent},${S.accentDark})` : S.card,
              border:"none",
              borderRadius:12,
              width:42,
              height:42,
              fontSize:17,
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              flexShrink:0,
              transition:"all .2s",
              opacity: inputVal.trim() && !loading ? 1 : .5
            }}
          >
            {loading ? "⏳" : "➤"}
          </button>
        </div>
      </div>

      {/* Recommendations Panel */}
      {hasRecs && (
        <div style={{
          width:340,
          display:"flex",
          flexDirection:"column",
          background:S.surface,
          flexShrink:0
        }}>
          <div style={{
            padding:"13px 16px 12px",
            borderBottom:`1px solid ${S.border}`,
            display:"flex",
            alignItems:"center",
            gap:8,
            flexShrink:0
          }}>
            <span style={{fontSize:16}}>✨</span>
            <div>
              <div style={{color:S.textPrimary,fontWeight:700,fontSize:13}}>Gợi ý dành cho bạn</div>
              <div style={{color:S.textMuted,fontSize:11}}>{recommendations.length} cuốn phù hợp nhất</div>
            </div>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:12,display:"flex",flexDirection:"column",gap:8}}>
            {recommendations.map((b, i) => (
              <UserBookCard key={b.id} book={b} onClick={setSelectedBook} index={i} />
            ))}
            <div style={{padding:"10px 4px",textAlign:"center"}}>
              <span style={{color:S.textMuted,fontSize:11}}>Nhấn vào sách để xem chi tiết</span>
            </div>
          </div>
          <div style={{
            padding:"10px 14px",
            borderTop:`1px solid ${S.border}`,
            background:`${S.accent}0a`
          }}>
            <p style={{color:`${S.accent}88`,fontSize:11,margin:0,textAlign:"center"}}>
              💬 Nhắn để nhận thêm gợi ý hoặc điều chỉnh
            </p>
          </div>
        </div>
      )}

      <BookDetailModal book={selectedBook} onClose={() => setSelectedBook(null)} />
    </div>
  );
}