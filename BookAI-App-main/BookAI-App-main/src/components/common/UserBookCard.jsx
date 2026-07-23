import { useState } from "react";
import { S } from "../../utils/css";

export default function UserBookCard({book, onClick, index}) {
  const [hov, setHov] = useState(false);
  return (
    <div 
      onClick={() => onClick(book)} 
      onMouseEnter={() => setHov(true)} 
      onMouseLeave={() => setHov(false)}
      style={{
        display:"flex",
        background:hov?"#1e2438":S.card,
        borderRadius:10,
        overflow:"hidden",
        cursor:"pointer",
        border:`1px solid ${hov?S.accent+"55":S.border2}`,
        transition:"all .2s",
        transform:hov?"translateX(3px)":"none",
        animation:`slideInR .3s ease ${index*.08}s both`
      }}
    >
      <div style={{
        width:44,
        background:`linear-gradient(180deg,${book.color},${book.color}bb)`,
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"center",
        flexShrink:0,
        padding:"10px 0",
        gap:6
      }}>
        <span style={{fontSize:20}}>{book.emoji}</span>
        <div style={{width:2,height:20,background:"rgba(255,255,255,.2)",borderRadius:1}}/>
        <span style={{fontSize:9,color:"rgba(255,255,255,.6)",writingMode:"vertical-rl",letterSpacing:1,fontWeight:600,textTransform:"uppercase"}}>{book.year}</span>
      </div>
      <div style={{flex:1,padding:"10px 12px",minWidth:0}}>
        <div style={{color:S.textPrimary,fontWeight:700,fontSize:13,marginBottom:2,lineHeight:1.3}}>{book.title}</div>
        <div style={{color:S.textSecondary,fontSize:11,marginBottom:6}}>{book.author}</div>
        <div style={{color:"#a8a49d",fontSize:12,lineHeight:1.4,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",marginBottom:7}}>{book.desc}</div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          {book.genres.slice(0,2).map(g => (
            <span key={g} style={{background:S.border,color:S.textSecondary,borderRadius:4,padding:"2px 7px",fontSize:10}}>{g}</span>
          ))}
        </div>
      </div>
      <div style={{padding:"10px 10px 10px 0",display:"flex",flexDirection:"column",justifyContent:"flex-start",alignItems:"flex-end",gap:4,flexShrink:0}}>
        <span style={{color:S.accent,fontSize:11,fontWeight:700}}>★ {book.rating}</span>
        <span style={{color:S.textMuted,fontSize:9}}>{book.pages}tr</span>
      </div>
    </div>
  );
}