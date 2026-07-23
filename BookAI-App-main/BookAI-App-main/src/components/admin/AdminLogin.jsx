import { useState } from "react";
import { ADMIN_PIN } from "../../utils/constants";
import { S, css } from "../../utils/css";

export default function AdminLogin({ onSuccess, onBack }) {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);
  const [shake, setShake] = useState(false);

  const submit = () => {
    if (pin === ADMIN_PIN) {
      onSuccess();
    } else {
      setErr(true);
      setPin("");
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: S.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "'Segoe UI',-apple-system,sans-serif",
      }}
    >
      <style>{css}</style>
      <div
        style={{
          background: S.card,
          border: `1px solid ${S.border2}`,
          borderRadius: 20,
          padding: "36px 32px",
          maxWidth: 360,
          width: "100%",
          textAlign: "center",
          animation: "slideUp .25s ease",
          transform: shake ? "translateX(0)" : "none",
        }}
      >
        <div style={{ fontSize: 44, marginBottom: 12 }}>🔐</div>
        <h2
          style={{
            color: S.textPrimary,
            margin: "0 0 6px",
            fontSize: 22,
            fontWeight: 800,
          }}
        >
          Khu vực quản trị
        </h2>
        <p style={{ color: S.textMuted, margin: "0 0 28px", fontSize: 13 }}>
          Nhập PIN để tiếp tục
        </p>
        <input
          value={pin}
          onChange={(e) => {
            setPin(e.target.value);
            setErr(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          type="password"
          maxLength={10}
          placeholder="Nhập PIN..."
          style={{
            width: "100%",
            background: S.surface,
            border: `1px solid ${err ? "#DC2626" : S.border2}`,
            borderRadius: 10,
            padding: "12px 16px",
            color: S.textPrimary,
            fontSize: 16,
            textAlign: "center",
            letterSpacing: 6,
            marginBottom: 8,
            transition: "border .2s",
          }}
        />
        {err && (
          <div style={{ color: "#EF4444", fontSize: 12, marginBottom: 12 }}>
            ❌ PIN không đúng, thử lại
          </div>
        )}
        <div
          style={{
            background: `${S.green}11`,
            border: `1px solid ${S.green}33`,
            borderRadius: 8,
            padding: "8px 12px",
            marginBottom: 20,
            fontSize: 12,
            color: S.textMuted,
          }}
        >
          💡 Demo PIN:{" "}
          <span style={{ color: S.green, fontWeight: 700, letterSpacing: 2 }}>
            {ADMIN_PIN}
          </span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onBack}
            style={{
              flex: 1,
              background: S.surface,
              color: S.textSecondary,
              border: `1px solid ${S.border2}`,
              borderRadius: 10,
              padding: 12,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            ← Quay lại
          </button>
          <button
            onClick={submit}
            style={{
              flex: 2,
              background: `linear-gradient(135deg,${S.green},${S.greenDark})`,
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: 12,
              fontSize: 14,
              fontWeight: 700,
              boxShadow: `0 4px 14px ${S.green}44`,
            }}
          >
            Đăng nhập ⚙️
          </button>
        </div>
      </div>
    </div>
  );
}