export const getReadLinks = (book) => ({
  google: `https://books.google.com/books?q=${encodeURIComponent(book.title + " " + book.author)}`,
  gutenberg: `https://www.gutenberg.org/ebooks/search/?query=${encodeURIComponent(book.title)}`,
  tiki: `https://tiki.vn/search?q=${encodeURIComponent(book.title)}`,
  shopee: `https://shopee.vn/search?keyword=${encodeURIComponent(book.title + " " + book.author)}`,
  tiktok: `https://www.tiktok.com/search?q=${encodeURIComponent(book.title + " " + book.author + " sách")}`,
});