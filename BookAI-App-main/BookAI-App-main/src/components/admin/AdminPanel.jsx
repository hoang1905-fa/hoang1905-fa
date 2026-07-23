import { useState } from "react";
import { S, css } from "../../utils/css";
import AddEditModal from "./AddEditModal";
import { supabase } from "../../utils/supabase";

export default function AdminPanel({ books, onBooksChange, onBack }) {
  const [search, setSearch] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  // ============ HÀM THÊM SÁCH ============
  const handleAdd = async (data) => {
    try {
      // Tìm ID lớn nhất hiện có
      const maxId = books.reduce((max, b) => Math.max(max, b.id), 0);
      const newBook = { ...data, id: maxId + 1 };

      // Thêm vào Supabase
      const { error } = await supabase
        .from('books')
        .insert([newBook]);

      if (error) throw error;

      // Cập nhật state
      await onBooksChange([...books, newBook]);
      setAddModal(false);
      showToast(`✅ Đã thêm "${data.title}" vào kho sách!`);
    } catch (err) {
      console.error("❌ Lỗi thêm sách:", err);
      showToast(`❌ Lỗi: ${err.message}`, "error");
    }
  };

  // ============ HÀM SỬA SÁCH ============
  const handleEdit = async (data) => {
    try {
      const updatedBook = { ...data, id: editTarget.id };

      // Cập nhật trong Supabase
      const { error } = await supabase
        .from('books')
        .update(updatedBook)
        .eq('id', editTarget.id);

      if (error) throw error;

      // Cập nhật state
      await onBooksChange(books.map(b => b.id === editTarget.id ? updatedBook : b));
      setEditTarget(null);
      showToast(`✅ Đã cập nhật "${data.title}"!`);
    } catch (err) {
      console.error("❌ Lỗi sửa sách:", err);
      showToast(`❌ Lỗi: ${err.message}`, "error");
    }
  };

  // ============ HÀM XÓA SÁCH ============
  const handleDelete = async () => {
    try {
      const name = deleteTarget.title;
      const id = deleteTarget.id;

      // Xóa trong Supabase
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Cập nhật state
      await onBooksChange(books.filter(b => b.id !== id));
      setDeleteTarget(null);
      showToast(`🗑️ Đã xóa "${name}" khỏi kho!`, "delete");
    } catch (err) {
      console.error("❌ Lỗi xóa sách:", err);
      showToast(`❌ Lỗi: ${err.message}`, "error");
    }
  };

  // ============ LỌC SÁCH ============
  const filtered = books.filter(b =>
    (b.title + b.author).toLowerCase().includes(search.toLowerCase())
  );
  const uniqueGenres = new Set(books.flatMap(b => b.genres)).size;
  const vnCount = books.filter(b => b.genres.some(g => g.includes("VN"))).length;

  // ============ RENDER ============
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      background: S.bg,
      fontFamily: "'Segoe UI',-apple-system,sans-serif"
    }}>
      <style>{css}</style>

      {/* Top Navbar */}
      <div style={{
        background: S.surface,
        borderBottom: `1px solid ${S.border}`,
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        height: 58,
        flexShrink: 0
      }}>
        <button onClick={onBack} style={{
          background: "none",
          border: "none",
          color: S.textMuted,
          fontSize: 18,
          padding: "4px 8px",
          borderRadius: 7
        }}>
          ←
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>⚙️</span>
          <div>
            <span style={{ color: S.textPrimary, fontWeight: 800, fontSize: 15 }}>BookAI</span>
            <span style={{ color: S.green, fontWeight: 700, fontSize: 13, marginLeft: 6 }}>Admin</span>
          </div>
        </div>
        {/* Stats */}
        <div style={{ display: "flex", gap: 16, marginLeft: 24 }}>
          {[
            { label: "Tổng sách", value: books.length, icon: "📚" },
            { label: "Thể loại", value: uniqueGenres, icon: "🏷️" },
            { label: "Sách VN", value: vnCount, icon: "🇻🇳" },
          ].map(({ label, value, icon }) => (
            <div key={label} style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 12px",
              background: S.card,
              border: `1px solid ${S.border}`,
              borderRadius: 20
            }}>
              <span style={{ fontSize: 13 }}>{icon}</span>
              <span style={{ color: S.accent, fontWeight: 800, fontSize: 14 }}>{value}</span>
              <span style={{ color: S.textMuted, fontSize: 11 }}>{label}</span>
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <button onClick={() => setAddModal(true)} style={{
          background: `linear-gradient(135deg,${S.green},${S.greenDark})`,
          color: "#fff",
          border: "none",
          borderRadius: 10,
          padding: "9px 18px",
          fontSize: 13,
          fontWeight: 700,
          boxShadow: `0 4px 14px ${S.green}44`,
          whiteSpace: "nowrap"
        }}>
          + Thêm sách
        </button>
      </div>

      {/* Search bar */}
      <div style={{
        padding: "14px 24px",
        background: S.surface,
        borderBottom: `1px solid ${S.border}`,
        flexShrink: 0
      }}>
        <div style={{ position: "relative", maxWidth: 400 }}>
          <span style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 15,
            pointerEvents: "none"
          }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Tìm trong ${books.length} cuốn sách...`}
            style={{
              width: "100%",
              background: S.card,
              border: `1px solid ${S.border2}`,
              borderRadius: 10,
              padding: "9px 14px 9px 38px",
              color: S.textPrimary,
              fontSize: 14
            }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: S.textMuted,
              fontSize: 16,
              cursor: "pointer"
            }}>
              ✕
            </button>
          )}
        </div>
        {search && (
          <div style={{ color: S.textMuted, fontSize: 12, marginTop: 8 }}>
            Tìm thấy {filtered.length} kết quả cho "<span style={{ color: S.textPrimary }}>{search}</span>"
          </div>
        )}
      </div>

      {/* Book Grid */}
      <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: S.textMuted }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <div style={{ fontSize: 16, marginBottom: 8, color: S.textSecondary }}>Không tìm thấy sách nào</div>
            <div style={{ fontSize: 13 }}>
              Thử từ khóa khác hoặc <button onClick={() => setAddModal(true)} style={{
                background: "none",
                border: "none",
                color: S.green,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600
              }}>thêm sách mới</button>
            </div>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
            gap: 12
          }}>
            {filtered.map(book => (
              <div key={book.id} style={{
                background: S.card,
                border: `1px solid ${S.border2}`,
                borderRadius: 12,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "border .2s"
              }}
                onMouseEnter={e => e.currentTarget.style.border = `1px solid ${S.border}`}
                onMouseLeave={e => e.currentTarget.style.border = `1px solid ${S.border2}`}
              >
                {/* Card Top */}
                <div style={{ display: "flex", padding: 14, gap: 12, alignItems: "flex-start" }}>
                  <div style={{
                    width: 48,
                    height: 64,
                    borderRadius: 8,
                    background: `linear-gradient(135deg,${book.color},${book.color}88)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    flexShrink: 0
                  }}>
                    {book.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      color: S.textPrimary,
                      fontWeight: 700,
                      fontSize: 14,
                      marginBottom: 2,
                      lineHeight: 1.3,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}>
                      {book.title}
                    </div>
                    <div style={{ color: S.textSecondary, fontSize: 12, marginBottom: 6 }}>{book.author} · {book.year}</div>
                    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                      <span style={{ color: S.accent, fontSize: 12, fontWeight: 700 }}>★ {book.rating}</span>
                      <span style={{ color: S.textMuted, fontSize: 11 }}>· {book.pages}tr</span>
                    </div>
                  </div>
                </div>
                {/* Genres */}
                <div style={{ padding: "0 14px 10px", display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {book.genres.slice(0, 3).map(g => (
                    <span key={g} style={{
                      background: S.surface,
                      color: S.textSecondary,
                      borderRadius: 4,
                      padding: "2px 7px",
                      fontSize: 10,
                      border: `1px solid ${S.border2}`
                    }}>
                      {g}
                    </span>
                  ))}
                  {book.genres.length > 3 && (
                    <span style={{ color: S.textMuted, fontSize: 10, padding: "2px 5px" }}>+{book.genres.length - 3}</span>
                  )}
                </div>
                {/* Actions */}
                <div style={{ borderTop: `1px solid ${S.border}`, display: "flex" }}>
                  <button onClick={() => setEditTarget(book)} style={{
                    flex: 1,
                    background: "none",
                    border: "none",
                    color: S.textSecondary,
                    padding: "10px",
                    fontSize: 13,
                    fontWeight: 600,
                    borderRight: `1px solid ${S.border}`
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = S.surface; e.currentTarget.style.color = S.accent; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = S.textSecondary; }}
                  >
                    ✏️ Sửa
                  </button>
                  <button onClick={() => setDeleteTarget(book)} style={{
                    flex: 1,
                    background: "none",
                    border: "none",
                    color: S.textSecondary,
                    padding: "10px",
                    fontSize: 13,
                    fontWeight: 600
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#DC262611"; e.currentTarget.style.color = "#EF4444"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = S.textSecondary; }}
                  >
                    🗑️ Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {addModal && <AddEditModal onSave={handleAdd} onClose={() => setAddModal(false)} />}
      {editTarget && <AddEditModal initial={editTarget} onSave={handleEdit} onClose={() => setEditTarget(null)} />}
      {deleteTarget && (
        <div onClick={e => { if (e.target === e.currentTarget) setDeleteTarget(null); }} style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.75)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 400,
          padding: 24,
          animation: "fadeIn .2s"
        }}>
          <div style={{
            background: S.card,
            border: `1px solid ${S.border2}`,
            borderRadius: 16,
            padding: "28px 28px 24px",
            maxWidth: 380,
            width: "100%",
            animation: "slideUp .2s ease",
            textAlign: "center"
          }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ color: S.textPrimary, margin: "0 0 8px", fontWeight: 800 }}>Xóa sách này?</h3>
            <p style={{ color: S.textSecondary, margin: "0 0 6px", fontSize: 14 }}>
              <span style={{ color: S.accent, fontWeight: 700 }}>{deleteTarget.title}</span>
            </p>
            <p style={{ color: S.textMuted, margin: "0 0 24px", fontSize: 13 }}>Hành động này không thể hoàn tác.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setDeleteTarget(null)} style={{
                flex: 1,
                background: S.surface,
                color: S.textSecondary,
                border: `1px solid ${S.border2}`,
                borderRadius: 10,
                padding: 12,
                fontSize: 14,
                fontWeight: 600
              }}>
                Hủy
              </button>
              <button onClick={handleDelete} style={{
                flex: 1,
                background: "#DC2626",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: 12,
                fontSize: 14,
                fontWeight: 700
              }}>
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          background: toast.type === "delete" ? "#DC2626" : S.green,
          color: "#fff",
          padding: "12px 20px",
          borderRadius: 12,
          fontSize: 14,
          fontWeight: 600,
          boxShadow: "0 8px 24px rgba(0,0,0,.4)",
          zIndex: 500,
          animation: "slideUp .25s ease",
          whiteSpace: "nowrap"
        }}>
          {toast.type === "delete" ? "🗑️" : "✅"} {toast.msg}
        </div>
      )}
    </div>
  );
}