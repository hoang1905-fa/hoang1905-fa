export const css = `
  @keyframes bounce{0%,100%{transform:translateY(0);opacity:.4}50%{transform:translateY(-5px);opacity:1}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes slideInR{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:translateX(0)}}
  
  /* Thêm animation mới */
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
  }
  
  *{box-sizing:border-box}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#252b3d;border-radius:2px}
  input,textarea,select{outline:none;font-family:inherit}
  button{font-family:inherit;cursor:pointer}
  
  body {
    margin: 0;
    font-family: 'Segoe UI', -apple-system, sans-serif;
    background: #080c12;
  }
`;

export const S = {
  bg: "#080c12",
  surface: "#0d1019",
  card: "#141828",
  border: "#1e2438",
  border2: "#252b3d",
  textPrimary: "#f2ede4",
  textSecondary: "#8891a8",
  textMuted: "#4a5168",
  accent: "#EDAB3A",
  accentDark: "#C17A1A",
  green: "#10B981",
  greenDark: "#059669"
};