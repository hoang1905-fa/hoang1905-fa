import { useState, useEffect, useRef } from "react";
import "./index.css";
import { S } from "./utils/css";
import { DEFAULT_BOOKS, MOOD_OPTIONS } from "./utils/constants";
import { loadFromStorage, saveToStorage } from "./utils/storage";
import { buildSysPrompt } from "./utils/prompt";
import AdminLogin from "./components/admin/AdminLogin";
import AdminPanel from "./components/admin/AdminPanel";
import BookDetailModal from "./components/common/BookDetailModal";

// =================== MAIN APP ===================
export default function BookAIApp() {
  const [books, setBooks] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  
  useEffect(() => {
    loadFromStorage(DEFAULT_BOOKS).then(b => {
      setBooks(b);
      setLoaded(true);
    });
  }, []);

  const updateBooks = async (nb) => {
    setBooks(nb);
    await saveToStorage(nb);
  };

  const filteredBooks = books.filter(b => {
    const matchSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        b.genres.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchMood = selectedMood ? b.mood === selectedMood : true;
    return matchSearch && matchMood;
  });

  if (!loaded) {
    return (
      <div style={{
        minHeight: "100vh",
        background: S.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 32,
        color: S.textPrimary
      }}>
        📚 Đang tải thư viện...
      </div>
    );
  }

  if (showAdminLogin) {
    return <AdminLogin onSuccess={() => { setIsAdmin(true); setShowAdminLogin(false); }} onBack={() => setShowAdminLogin(false)} />;
  }

  if (isAdmin) {
    return <AdminPanel books={books} onBooksChange={updateBooks} onBack={() => setIsAdmin(false)} />;
  }

  if (showAIChat) {
    return (
      <AIChatPage
        books={books}
        onBack={() => setShowAIChat(false)}
        onSelectBook={setSelectedBook}
        selectedBook={selectedBook}
      />
    );
  }

  // =================== MAIN LIBRARY UI ===================
  return (
    <div style={{
      minHeight: "100vh",
      background: S.bg,
      fontFamily: "'Segoe UI',-apple-system,sans-serif",
      color: S.textPrimary
    }}>
      <header className="app-header">
        <div className="logo">
          <span className="icon">📚</span>
          <div>
            <span className="name">Book<span className="highlight">AI</span></span>
            <span className="sub">Thư viện thông minh</span>
          </div>
        </div>
        <div className="search">
          <span className="icon">🔍</span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm sách theo tên, tác giả, thể loại..."
          />
          {searchQuery && (
            <button className="clear" onClick={() => setSearchQuery("")}>✕</button>
          )}
        </div>
        <div className="actions">
          <button className="btn-ai" onClick={() => setShowAIChat(true)}>
            🤖 <span>AI Gợi ý</span>
          </button>
          <button className="btn-admin" onClick={() => setShowAdminLogin(true)}>
            ⚙️ Quản trị
          </button>
        </div>
      </header>

      <div className="mood-filter">
        <span className="label">🎭 Tâm trạng:</span>
        <button
          className={`btn ${selectedMood === null ? "active" : ""}`}
          onClick={() => setSelectedMood(null)}
        >
          📚 Tất cả
        </button>
        {MOOD_OPTIONS.map(mood => (
          <button
            key={mood}
            className={`btn ${selectedMood === mood ? "active" : ""}`}
            onClick={() => setSelectedMood(selectedMood === mood ? null : mood)}
          >
            {mood}
          </button>
        ))}
      </div>

      <div className="book-grid">
        <div className="stats">
          <div className="count">
            Hiển thị <span className="num">{filteredBooks.length}</span> /
            <span className="total"> {books.length}</span> cuốn sách
            {selectedMood && (
              <span className="mood-label">· Tâm trạng: {selectedMood}</span>
            )}
          </div>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="empty">
            <div className="icon">📭</div>
            <h2 className="title">Không tìm thấy sách</h2>
            <p className="desc">Hãy thử tìm kiếm với từ khóa khác hoặc chọn tâm trạng khác nhé!</p>
          </div>
        ) : (
          <div className="grid">
            {filteredBooks.map((book, index) => (
              <BookCard
                key={book.id}
                book={book}
                onClick={() => setSelectedBook(book)}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      <BookDetailModal book={selectedBook} onClose={() => setSelectedBook(null)} />
    </div>
  );
}

// =================== BOOK CARD COMPONENT ===================
function BookCard({ book, onClick, index }) {
  const [hover, setHover] = useState(false);
  
  return (
    <div
      className="book-card fade-in"
      onClick={() => onClick(book)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="cover" style={{ background: `linear-gradient(135deg, ${book.color}, ${book.color}99)` }}>
        <span className="emoji">{book.emoji}</span>
        {book.rating >= 4.8 && (
          <span className="badge">BEST</span>
        )}
      </div>
      
      <div className="info">
        <h3 className="title">{book.title}</h3>
        <p className="author">{book.author} · {book.year}</p>
        <div className="genres">
          {book.genres.slice(0, 2).map(g => (
            <span key={g} className="tag">{g}</span>
          ))}
          {book.genres.length > 2 && (
            <span className="more">+{book.genres.length - 2}</span>
          )}
        </div>
        <div className="meta">
          <span className="rating">★ {book.rating}</span>
          <span className="pages">📄 {book.pages}tr</span>
        </div>
        <div className="footer">
          <span className="mood" style={{ background: `${book.color}22`, borderColor: `${book.color}33` }}>
            {book.mood}
          </span>
          <span className="detail-link">📖 Chi tiết →</span>
        </div>
      </div>
    </div>
  );
}

// =================== AI CHAT PAGE ===================
function AIChatPage({ books, onBack, onSelectBook, selectedBook }) {
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [prefTags, setPrefTags] = useState([]);
  const [chatMode, setChatMode] = useState("preference");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setMessages([{
      role: "assistant",
      content: "Xin chào! 📚 Tôi là BookAI - trợ lý gợi ý sách thông minh!\n\nHãy cho tôi biết bạn đang muốn đọc sách về chủ đề gì, thể loại nào, hay tâm trạng ra sao? Tôi sẽ gợi ý những cuốn sách phù hợp nhất từ thư viện của chúng tôi! 😊"
    }]);
    setTimeout(() => inputRef.current?.focus(), 200);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!inputVal.trim() || loading) return;
    const text = inputVal.trim();
    setInputVal("");
    const newMsgs = [...messages, { role: "user", content: text }];
    setMessages(newMsgs);
    setLoading(true);
    
    try {
      const GKEY = import.meta.env.VITE_GEMINI_API_KEY;
      const GURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GKEY}`;
      const geminiContents = newMsgs.map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }));
      
      const res = await fetch(GURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: buildSysPrompt(books, chatMode) }] },
          contents: geminiContents,
          generationConfig: { maxOutputTokens: 1500 }
        })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "Xin lỗi, tôi chưa hiểu. Bạn có thể kỹ hơn được không? 🙏";
      const jm = raw.match(/\[BOOKS_JSON\]([\s\S]*?)\[\/BOOKS_JSON\]/);
      
      if (jm) {
        try {
          const p = JSON.parse(jm[1].trim());
          const r = (p.book_ids || []).map(id => books.find(b => b.id === id)).filter(Boolean);
          if (r.length > 0) setRecommendations(r);
          if (p.preference_tags?.length) setPrefTags(p.preference_tags);
        } catch (_) {}
      }
      
      setMessages(p => [...p, {
        role: "assistant",
        content: raw.replace(/\[BOOKS_JSON\][\s\S]*?\[\/BOOKS_JSON\]/g, "").trim()
      }]);
    } catch (_) {
      setMessages(p => [...p, {
        role: "assistant",
        content: "❌ Có lỗi xảy ra. Vui lòng kiểm tra API key hoặc thử lại sau."
      }]);
    }
    setLoading(false);
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      background: S.bg,
      fontFamily: "'Segoe UI',-apple-system,sans-serif",
      color: S.textPrimary,
      overflow: "hidden"
    }}>
      {/* ===== HEADER ===== */}
      <header className="app-header" style={{ flexShrink: 0 }}>
        <div className="logo" style={{ cursor: "pointer" }} onClick={onBack}>
          <span className="icon">←</span>
          <div>
            <span className="name">Book<span className="highlight">AI</span></span>
            <span className="sub">Quay lại thư viện</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20 }}>🤖</span>
          <span style={{ fontWeight: 700, color: S.textPrimary }}>Trợ lý gợi ý sách</span>
          {prefTags.length > 0 && (
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {prefTags.map(tag => (
                <span key={tag} style={{
                  background: `${S.accent}18`,
                  color: S.accent,
                  border: `1px solid ${S.accent}33`,
                  borderRadius: 20,
                  padding: "2px 10px",
                  fontSize: 10,
                  fontWeight: 600
                }}>
                  ✨ {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onBack}
          style={{
            padding: "8px 20px",
            borderRadius: 10,
            border: `1px solid ${S.border2}`,
            background: "transparent",
            color: S.textSecondary,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all .2s"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = S.accent; e.currentTarget.style.color = S.accent; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = S.border2; e.currentTarget.style.color = S.textSecondary; }}
        >
          ✕ Đóng
        </button>
      </header>

      {/* ===== BODY ===== */}
      <div style={{
        flex: 1,
        display: "flex",
        overflow: "hidden",
        minHeight: 0 // ← QUAN TRỌNG: Cho phép flex shrink
      }}>
        {/* Chat Area */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          padding: "0 24px",
          overflow: "hidden"
        }}>
          {/* Messages - CHỈ PHẦN NÀY CUỘN */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 0",
            scrollBehavior: "smooth"
          }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                  marginBottom: 12
                }}
              >
                <div style={{
                  maxWidth: "75%",
                  background: m.role === "user"
                    ? `linear-gradient(135deg, ${S.accent}, ${S.accentDark})`
                    : S.surface,
                  color: m.role === "user" ? S.bg : S.textPrimary,
                  padding: "12px 18px",
                  borderRadius: m.role === "user"
                    ? "18px 18px 4px 18px"
                    : "18px 18px 18px 4px",
                  fontSize: 14,
                  lineHeight: 1.6,
                  border: m.role === "user" ? "none" : `1px solid ${S.border2}`,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word"
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 6, padding: "8px 0", marginLeft: 8 }}>
                <div className="bounce-dots">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: "16px 0 24px",
            borderTop: `1px solid ${S.border2}`,
            display: "flex",
            gap: 12,
            flexShrink: 0,
            background: S.bg
          }}>
            <input
              ref={inputRef}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Nhập sở thích của bạn... (VD: Tôi thích sách hài hước)"
              disabled={loading}
              style={{
                flex: 1,
                padding: "12px 18px",
                borderRadius: 12,
                border: `1px solid ${S.border2}`,
                background: S.card,
                color: S.textPrimary,
                fontSize: 14,
                outline: "none",
                transition: "border .2s"
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = S.accent}
              onBlur={(e) => e.currentTarget.style.borderColor = S.border2}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !inputVal.trim()}
              style={{
                padding: "12px 28px",
                borderRadius: 12,
                border: "none",
                background: inputVal.trim() && !loading
                  ? `linear-gradient(135deg, ${S.accent}, ${S.accentDark})`
                  : S.border2,
                color: inputVal.trim() && !loading ? S.bg : S.textMuted,
                fontWeight: 700,
                fontSize: 14,
                cursor: inputVal.trim() && !loading ? "pointer" : "default",
                transition: "all .2s",
                minWidth: 100
              }}
            >
              {loading ? "⏳" : "Gửi →"}
            </button>
          </div>
        </div>

        {/* Recommendations Panel */}
        <div style={{
          width: 320,
          borderLeft: `1px solid ${S.border2}`,
          display: "flex",
          flexDirection: "column",
          background: S.surface,
          flexShrink: 0,
          overflow: "hidden"
        }}>
          {/* Title - CỐ ĐỊNH */}
          <div style={{
            padding: "20px 16px 12px",
            borderBottom: `1px solid ${S.border2}`,
            flexShrink: 0,
            background: S.surface
          }}>
            <div style={{
              color: S.accent,
              fontWeight: 700,
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              gap: 8
            }}>
              ✨ Gợi ý dành cho bạn
              <span style={{
                fontSize: 12,
                color: S.textMuted,
                fontWeight: 400
              }}>
                ({recommendations.length} cuốn)
              </span>
            </div>
          </div>

          {/* Recommendations List - CHỈ PHẦN NÀY CUỘN */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "12px 16px",
            scrollBehavior: "smooth"
          }}>
            {recommendations.length === 0 ? (
              <div style={{
                color: S.textMuted,
                fontSize: 13,
                textAlign: "center",
                padding: "40px 0",
                lineHeight: 1.6
              }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔮</div>
                <p>Chưa có gợi ý nào.</p>
                <p style={{ fontSize: 12 }}>Hãy chat với AI để nhận gợi ý sách!</p>
              </div>
            ) : (
              <>
                {recommendations.map((book, i) => (
                  <div
                    key={book.id}
                    onClick={() => onSelectBook(book)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 14px",
                      borderRadius: 10,
                      background: S.card,
                      border: `1px solid ${S.border2}`,
                      marginBottom: 10,
                      cursor: "pointer",
                      transition: "all .2s",
                      animation: `slideInR .3s ease ${i * 0.08}s both`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = S.accent;
                      e.currentTarget.style.background = S.border;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = S.border2;
                      e.currentTarget.style.background = S.card;
                    }}
                  >
                    <div style={{
                      width: 40,
                      height: 56,
                      borderRadius: 6,
                      background: `linear-gradient(135deg, ${book.color}, ${book.color}88)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      flexShrink: 0
                    }}>
                      {book.emoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        color: S.textPrimary,
                        fontSize: 13,
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}>
                        {book.title}
                      </div>
                      <div style={{ color: S.textMuted, fontSize: 11 }}>
                        {book.author} · {book.year}
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 2 }}>
                        <span style={{ color: S.accent, fontSize: 11, fontWeight: 600 }}>
                          ★ {book.rating}
                        </span>
                        <span style={{ color: S.textMuted, fontSize: 10 }}>
                          {book.pages}tr
                        </span>
                      </div>
                    </div>
                    <span style={{ color: S.textMuted, fontSize: 16 }}>→</span>
                  </div>
                ))}

                <div style={{
                  color: S.textMuted,
                  fontSize: 12,
                  textAlign: "center",
                  marginTop: 12,
                  padding: "8px",
                  background: `${S.accent}08`,
                  borderRadius: 8,
                  border: `1px dashed ${S.border2}`
                }}>
                  👆 Nhấn vào sách để xem chi tiết
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <BookDetailModal book={selectedBook} onClose={() => onSelectBook(null)} />
    </div>
  );
}