import { useState } from "react";
import { S } from "../../utils/css";
import { getReadLinks } from "../../utils/links";

export default function BookDetailModal({ book, onClose }) {
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [tab, setTab] = useState("info");

  if (!book) return null;

  const analyze = async () => {
    setAnalyzing(true);
    setTab("analysis");
    try {
      const GKEY = import.meta.env.VITE_GEMINI_API_KEY;
      const GURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GKEY}`;
      const prompt = `Phân tích cuốn sách "${book.title}" của ${book.author} (${book.year}), thể loại: ${book.genres.join(", ")}. Viết bằng tiếng Việt.`;
      const schema = {
        type: "OBJECT",
        properties: {
          tomtat: { type: "STRING", description: "Tóm tắt toàn bộ nội dung chính của sách trong 5-7 câu bao gồm cốt truyện và kết thúc" },
          nhan_vat: { type: "ARRAY", items: { type: "STRING" }, description: "Danh sách 2-4 nhân vật chính với tên và vai trò" },
          bai_hoc: { type: "ARRAY", items: { type: "STRING" }, description: "3-4 bài học hoặc thông điệp sâu sắc nhất" },
          trich_dan: { type: "STRING", description: "Một câu trích dẫn hay hoặc ý tưởng đáng nhớ nhất" },
          vi_sao_nen_doc: { type: "STRING", description: "2-3 câu lý do tại sao nên đọc cuốn sách này" }
        },
        required: ["tomtat", "nhan_vat", "bai_hoc", "trich_dan", "vi_sao_nen_doc"]
      };
      const res = await fetch(GURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 2000,
            responseMimeType: "application/json",
            responseSchema: schema
          }
        })
      });
      const data = await res.json();
      if (data.error) throw new Error("Lỗi API: " + data.error.message);
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      setAnalysis(JSON.parse(raw));
    } catch (e) {
      setAnalysis({ error: "❌ " + e.message });
    }
    setAnalyzing(false);
  };

  const links = getReadLinks(book);

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-content" style={{ maxWidth: 460 }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${book.color}33, ${book.color}11)`,
          borderBottom: `1px solid ${S.border2}`,
          padding: "16px 18px 14px",
          flexShrink: 0
        }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{
              width: 56,
              height: 78,
              borderRadius: 8,
              background: `linear-gradient(135deg, ${book.color}, ${book.color}88)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              flexShrink: 0,
              boxShadow: `0 6px 20px ${book.color}44`
            }}>
              {book.emoji}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{
                color: S.textPrimary,
                margin: "0 0 3px",
                fontSize: 16,
                fontWeight: 800,
                lineHeight: 1.3
              }}>
                {book.title}
              </h2>
              <p style={{ color: S.textSecondary, margin: "0 0 6px", fontSize: 12 }}>
                {book.author}
              </p>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ color: S.accent, fontWeight: 700, fontSize: 14 }}>
                  ★ {book.rating}
                </span>
                <span style={{ color: S.textMuted, fontSize: 11 }}>
                  {book.pages} trang
                </span>
                <span style={{ color: S.textMuted, fontSize: 11 }}>
                  {book.year}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                color: S.textMuted,
                fontSize: 18,
                cursor: "pointer",
                flexShrink: 0,
                padding: "0 4px"
              }}
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
            {[
              ["info", "📖 Thông tin"],
              ["buy", "🛒 Mua sách"],
              ["analysis", "🤖 Phân tích AI"]
            ].map(([t, label]) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  if (t === "analysis" && !analysis && !analyzing) analyze();
                }}
                style={{
                  flex: 1,
                  padding: "6px 8px",
                  borderRadius: 7,
                  border: `1px solid ${tab === t ? S.accent + 88 : S.border2}`,
                  background: tab === t ? S.accent + "22" : "none",
                  color: tab === t ? S.accent : S.textMuted,
                  fontSize: 12,
                  fontWeight: tab === t ? 700 : 400,
                  cursor: "pointer"
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px" }}>
          {/* TAB: INFO */}
          {tab === "info" && (
            <>
              <p style={{ color: "#c8c4bc", lineHeight: 1.65, fontSize: 13, margin: "0 0 14px" }}>
                {book.desc}
              </p>
              <div style={{ marginBottom: 10 }}>
                <div style={{
                  color: S.accent,
                  fontSize: 10,
                  fontWeight: 600,
                  marginBottom: 6,
                  letterSpacing: 0.5,
                  textTransform: "uppercase"
                }}>
                  Thể loại
                </div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {book.genres.map(g => (
                    <span key={g} style={{
                      background: S.surface,
                      color: "#a8a49d",
                      borderRadius: 5,
                      padding: "3px 8px",
                      fontSize: 11,
                      border: `1px solid ${S.border2}`
                    }}>
                      {g}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{
                  color: S.accent,
                  fontSize: 10,
                  fontWeight: 600,
                  marginBottom: 6,
                  letterSpacing: 0.5,
                  textTransform: "uppercase"
                }}>
                  Tâm trạng khi đọc
                </div>
                <span style={{
                  background: `${book.color}22`,
                  color: book.color,
                  border: `1px solid ${book.color}44`,
                  borderRadius: 5,
                  padding: "3px 9px",
                  fontSize: 12,
                  fontWeight: 600
                }}>
                  {book.mood}
                </span>
              </div>
            </>
          )}

          {/* TAB: MUA SÁCH */}
          {tab === "buy" && (
            <div>
              <div style={{
                color: S.accent,
                fontSize: 10,
                fontWeight: 600,
                marginBottom: 12,
                letterSpacing: 0.5,
                textTransform: "uppercase"
              }}>
                🛒 Mua sách tại các nền tảng
              </div>

              <p style={{
                color: S.textMuted,
                fontSize: 12,
                marginBottom: 16,
                lineHeight: 1.5
              }}>
                Chọn nền tảng để tìm mua cuốn <strong style={{ color: S.textPrimary }}>"{book.title}"</strong>
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {/* Shopee */}
                <a
                  href={links.shopee}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    background: "#EE4D2D",
                    borderRadius: 10,
                    textDecoration: "none",
                    transition: "transform .15s, box-shadow .15s",
                    boxShadow: "0 2px 8px rgba(238, 77, 45, 0.3)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(238, 77, 45, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(238, 77, 45, 0.3)";
                  }}
                >
                  <span style={{ fontSize: 28 }}>🛍️</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>
                      Mua trên Shopee
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>
                      Giá tốt, nhiều ưu đãi, giao hàng nhanh
                    </div>
                  </div>
                  <span style={{ color: "#fff", fontSize: 18 }}>→</span>
                </a>

                {/* TikTok Shop */}
                <a
                  href={links.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    background: "#000000",
                    borderRadius: 10,
                    textDecoration: "none",
                    transition: "transform .15s, box-shadow .15s",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
                    border: "1px solid #FE2C55"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(254, 44, 85, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.4)";
                  }}
                >
                  <span style={{ fontSize: 28 }}>🎵</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>
                      Mua trên TikTok Shop
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>
                      Xem review, săn sale, mua sắm giải trí
                    </div>
                  </div>
                  <span style={{ color: "#FE2C55", fontSize: 18 }}>→</span>
                </a>

                {/* Tiki */}
                <a
                  href={links.tiki}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    background: "#1A94FF",
                    borderRadius: 10,
                    textDecoration: "none",
                    transition: "transform .15s, box-shadow .15s",
                    boxShadow: "0 2px 8px rgba(26, 148, 255, 0.3)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(26, 148, 255, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(26, 148, 255, 0.3)";
                  }}
                >
                  <span style={{ fontSize: 28 }}>📦</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>
                      Mua trên Tiki
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>
                      Sách chính hãng, giao siêu tốc, nhiều khuyến mãi
                    </div>
                  </div>
                  <span style={{ color: "#fff", fontSize: 18 }}>→</span>
                </a>

                {/* Google Books */}
                <a
                  href={links.google}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    background: "#4285F4",
                    borderRadius: 10,
                    textDecoration: "none",
                    transition: "transform .15s, box-shadow .15s",
                    boxShadow: "0 2px 8px rgba(66, 133, 244, 0.3)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(66, 133, 244, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(66, 133, 244, 0.3)";
                  }}
                >
                  <span style={{ fontSize: 28 }}>📖</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>
                      Xem trên Google Books
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>
                      Đọc thử, xem trước, tìm bản PDF
                    </div>
                  </div>
                  <span style={{ color: "#fff", fontSize: 18 }}>→</span>
                </a>

                {/* Project Gutenberg */}
                <a
                  href={links.gutenberg}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    background: "#6C4B3E",
                    borderRadius: 10,
                    textDecoration: "none",
                    transition: "transform .15s, box-shadow .15s",
                    boxShadow: "0 2px 8px rgba(108, 75, 62, 0.3)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(108, 75, 62, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(108, 75, 62, 0.3)";
                  }}
                >
                  <span style={{ fontSize: 28 }}>📜</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>
                      Project Gutenberg
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>
                      Sách cổ điển miễn phí (bản tiếng Anh)
                    </div>
                  </div>
                  <span style={{ color: "#fff", fontSize: 18 }}>→</span>
                </a>
              </div>

              <div style={{
                marginTop: 16,
                padding: "12px 14px",
                background: `${S.accent}08`,
                borderRadius: 8,
                border: `1px dashed ${S.border2}`,
                textAlign: "center"
              }}>
                <span style={{ color: S.textMuted, fontSize: 11 }}>
                  💡 Nhấn vào nền tảng để tìm mua sách. Giá và tình trạng có thể thay đổi theo thời gian.
                </span>
              </div>
            </div>
          )}

          {/* TAB: ANALYSIS */}
          {tab === "analysis" && (
            <>
              {analyzing && (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>🤖</div>
                  <div style={{ color: S.textSecondary, fontSize: 13 }}>Đang phân tích sách...</div>
                  <div style={{ display: "flex", justifyContent: "center", gap: 5, marginTop: 10 }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: S.accent,
                        animation: `bounce 1.1s ease-in-out ${i * 0.18}s infinite`
                      }} />
                    ))}
                  </div>
                </div>
              )}
              {!analyzing && analysis && !analysis.error && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{
                    background: S.surface,
                    borderRadius: 10,
                    padding: "12px 14px",
                    border: `1px solid ${S.border2}`
                  }}>
                    <div style={{
                      color: S.accent,
                      fontSize: 10,
                      fontWeight: 600,
                      marginBottom: 6,
                      textTransform: "uppercase",
                      letterSpacing: 0.5
                    }}>
                      📋 Tóm tắt nội dung
                    </div>
                    <p style={{ color: "#c8c4bc", fontSize: 13, lineHeight: 1.65, margin: 0 }}>
                      {analysis.tomtat}
                    </p>
                  </div>
                  {analysis.nhan_vat?.length > 0 && (
                    <div style={{
                      background: S.surface,
                      borderRadius: 10,
                      padding: "12px 14px",
                      border: `1px solid ${S.border2}`
                    }}>
                      <div style={{
                        color: S.accent,
                        fontSize: 10,
                        fontWeight: 600,
                        marginBottom: 8,
                        textTransform: "uppercase",
                        letterSpacing: 0.5
                      }}>
                        👤 Nhân vật chính
                      </div>
                      {analysis.nhan_vat.map((n, i) => (
                        <div key={i} style={{
                          color: "#c8c4bc",
                          fontSize: 12,
                          lineHeight: 1.5,
                          marginBottom: 4,
                          paddingLeft: 8,
                          borderLeft: `2px solid ${S.accent}44`
                        }}>
                          {n}
                        </div>
                      ))}
                    </div>
                  )}
                  {analysis.bai_hoc?.length > 0 && (
                    <div style={{
                      background: S.surface,
                      borderRadius: 10,
                      padding: "12px 14px",
                      border: `1px solid ${S.border2}`
                    }}>
                      <div style={{
                        color: S.accent,
                        fontSize: 10,
                        fontWeight: 600,
                        marginBottom: 8,
                        textTransform: "uppercase",
                        letterSpacing: 0.5
                      }}>
                        💡 Bài học chính
                      </div>
                      {analysis.bai_hoc.map((b, i) => (
                        <div key={i} style={{
                          display: "flex",
                          gap: 8,
                          marginBottom: 5,
                          color: "#c8c4bc",
                          fontSize: 12,
                          lineHeight: 1.5
                        }}>
                          <span style={{ color: S.accent, fontWeight: 700, flexShrink: 0 }}>
                            {i + 1}.
                          </span>
                          {b}
                        </div>
                      ))}
                    </div>
                  )}
                  {analysis.trich_dan && (
                    <div style={{
                      background: `${S.accent}11`,
                      borderRadius: 10,
                      padding: "12px 14px",
                      border: `1px solid ${S.accent}33`
                    }}>
                      <div style={{
                        color: S.accent,
                        fontSize: 10,
                        fontWeight: 600,
                        marginBottom: 6,
                        textTransform: "uppercase",
                        letterSpacing: 0.5
                      }}>
                        ✍️ Trích dẫn đáng nhớ
                      </div>
                      <p style={{
                        color: S.accent,
                        fontSize: 13,
                        fontStyle: "italic",
                        lineHeight: 1.65,
                        margin: 0
                      }}>
                        "{analysis.trich_dan}"
                      </p>
                    </div>
                  )}
                  {analysis.vi_sao_nen_doc && (
                    <div style={{
                      background: S.surface,
                      borderRadius: 10,
                      padding: "12px 14px",
                      border: `1px solid ${S.border2}`
                    }}>
                      <div style={{
                        color: S.accent,
                        fontSize: 10,
                        fontWeight: 600,
                        marginBottom: 6,
                        textTransform: "uppercase",
                        letterSpacing: 0.5
                      }}>
                        🎯 Vì sao nên đọc?
                      </div>
                      <p style={{ color: "#c8c4bc", fontSize: 13, lineHeight: 1.65, margin: 0 }}>
                        {analysis.vi_sao_nen_doc}
                      </p>
                    </div>
                  )}
                  <button
                    onClick={analyze}
                    style={{
                      background: "none",
                      border: `1px solid ${S.border2}`,
                      borderRadius: 8,
                      padding: "8px",
                      color: S.textMuted,
                      fontSize: 12,
                      cursor: "pointer"
                    }}
                  >
                    🔄 Phân tích lại
                  </button>
                </div>
              )}
              {!analyzing && analysis?.error && (
                <div style={{ textAlign: "center", padding: "24px 0", color: S.textMuted }}>
                  <div style={{ marginBottom: 8 }}>⚠️ {analysis.error}</div>
                  <button
                    onClick={analyze}
                    style={{
                      background: S.surface,
                      border: `1px solid ${S.border2}`,
                      borderRadius: 8,
                      padding: "8px 16px",
                      color: S.textSecondary,
                      fontSize: 12,
                      cursor: "pointer"
                    }}
                  >
                    Thử lại
                  </button>
                </div>
              )}
              {!analyzing && !analysis && (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>🤖</div>
                  <button
                    onClick={analyze}
                    style={{
                      background: `linear-gradient(135deg, ${S.accent}, ${S.accentDark})`,
                      border: "none",
                      borderRadius: 10,
                      padding: "12px 24px",
                      color: S.bg,
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    Phân tích sách này
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: "12px 18px",
          borderTop: `1px solid ${S.border2}`,
          flexShrink: 0
        }}>
          <button
            onClick={onClose}
            style={{
              width: "100%",
              background: S.surface,
              color: S.textSecondary,
              border: `1px solid ${S.border2}`,
              borderRadius: 8,
              padding: 10,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer"
            }}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}