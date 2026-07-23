import { useState, useEffect } from "react"
import { getBooks, addBook, updateBook, deleteBook } from "../utils/supabase"
import { DEFAULT_BOOKS } from "../utils/constants"

export function useBooks() {
  const [books, setBooks] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const loadBooks = async () => {
      try {
        let data = await getBooks()
        if (data.length === 0) {
          // Seed dữ liệu mẫu nếu chưa có
          for (const book of DEFAULT_BOOKS) {
            await addBook(book)
          }
          data = await getBooks()
        }
        setBooks(data)
      } catch (err) {
        console.error("❌ Lỗi load sách:", err)
        // Fallback sang localStorage
        const localData = await loadFromStorage(DEFAULT_BOOKS)
        setBooks(localData)
      }
      setLoaded(true)
    }
    loadBooks()
  }, [])

  const updateBooks = async (newBooks) => {
    setBooks(newBooks)
    await saveToStorage(newBooks)
  }

  const addBookToDB = async (book) => {
    const newBook = await addBook(book)
    setBooks(prev => [...prev, newBook])
    return newBook
  }

  const updateBookInDB = async (id, updates) => {
    const updated = await updateBook(id, updates)
    setBooks(prev => prev.map(b => b.id === id ? updated : b))
    return updated
  }

  const deleteBookFromDB = async (id) => {
    await deleteBook(id)
    setBooks(prev => prev.filter(b => b.id !== id))
  }

  return { books, loaded, updateBooks, addBook: addBookToDB, updateBook: updateBookInDB, deleteBook: deleteBookFromDB }
}