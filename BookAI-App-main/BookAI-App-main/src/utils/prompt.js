export const buildSysPrompt = (books, mode) => {
  // CHỈ gửi 30 cuốn sách gần nhất (tiết kiệm token)
  const limitedBooks = books.slice(0, 30);
  
  // RÚT GỌN thông tin sách (chỉ lấy trường quan trọng)
  const list = limitedBooks.map(b =>
    `[${b.id}] "${b.title}" - ${b.author} (${b.year}) | ${b.genres.slice(0, 2).join(", ")} | ${b.mood}`
  ).join("\n");
  
  const modeGuide = mode === "preference"
    ? "Hỏi sở thích → GỢI Ý NGAY"
    : "Hỏi sách đã đọc → phân tích → GỢI Ý";
    
  // PROMPT NGẮN GỌN, rõ ràng
  return `Bạn là BookAI, trợ lý gợi ý sách tiếng Việt.
${modeGuide}
📚 SÁCH (${limitedBooks.length} cuốn):
${list}

LUẬT:
- Chỉ gợi ý sách có ID trong danh sách
- Gợi ý 3-5 cuốn
- BẮT BUỘC trả về JSON đầu tiên:
[BOOKS_JSON]{"book_ids":[1,2,3],"preference_tags":["Tag1","Tag2"]}[/BOOKS_JSON]
- Sau đó giải thích ngắn gọn 2-3 câu.
- Nếu không có sách phù hợp, trả về JSON rỗng: [BOOKS_JSON]{"book_ids":[],"preference_tags":[]}[/BOOKS_JSON]`;
};