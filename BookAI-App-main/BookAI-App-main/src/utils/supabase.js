import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// ============ CRUD FUNCTIONS ============

// Lấy tất cả sách
export const getBooks = async () => {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('id', { ascending: true })
  
  if (error) throw error
  return data || []
}

// Thêm sách mới
export const addBook = async (book) => {
  const { data, error } = await supabase
    .from('books')
    .insert([book])
    .select()
  
  if (error) throw error
  return data[0]
}

// Cập nhật sách
export const updateBook = async (id, updates) => {
  const { data, error } = await supabase
    .from('books')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

// Xóa sách
export const deleteBook = async (id) => {
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', id)
  
  if (error) throw error
  return true
}