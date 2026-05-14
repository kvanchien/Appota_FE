import { useState, useCallback, useMemo } from 'react'
import {
  getKnowledge,
  createKnowledge,
  updateKnowledge,
  deleteKnowledge,
  updateCategoryApi,
  deleteCategoryApi,
} from '../api/knowledgeApi'
import { message } from 'antd'

export function useKnowledge() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [addedCategories, setAddedCategories] = useState([]) // Lưu các danh mục vừa tạo nhưng chưa có Q&A

  // ── Fetch all ────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async ({ page = 1, limit = 10 } = {}) => {
    setLoading(true)
    try {
      const data = await getKnowledge({ page, limit })
      setItems(data?.entries ?? [])
      setPagination({
        current: data?.pagination?.page ?? page,
        pageSize: data?.pagination?.limit ?? limit,
        total: data?.pagination?.total ?? 0,
      })
    } catch (err) {
      message.error(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Q&A Actions ──────────────────────────────────────────────────────────
  const create = useCallback(async (payload) => {
    const newItem = await createKnowledge(payload)
    setItems((prev) => [newItem, ...prev])
    message.success('Đã thêm Q&A mới!')
    return newItem
  }, [])

  const update = useCallback(async (id, payload) => {
    const updated = await updateKnowledge(id, payload)
    setItems((prev) => prev.map((item) => (item._id === id ? updated : item)))
    message.success('Đã cập nhật Q&A!')
    return updated
  }, [])

  const remove = useCallback(async (id) => {
    await deleteKnowledge(id)
    setItems((prev) => prev.filter((item) => item._id !== id))
    message.success('Đã xóa Q&A!')
  }, [])

  // ── Category Actions ─────────────────────────────────────────────────────

  // Tổng hợp danh sách Category để truyền cho Modal và Select Filter
  const categories = useMemo(() => {
    const existingCats = items.map((i) => i.category).filter(Boolean)
    return [...new Set([...existingCats, ...addedCategories])]
  }, [items, addedCategories])

  const addCategory = useCallback((name) => {
    if (!name.trim()) return
    setAddedCategories((prev) => [...new Set([...prev, name.trim()])])
    message.success(`Đã thêm danh mục "${name}"`)
  }, [])

  const renameCategory = useCallback(async (oldName, newName) => {
    try {
      await updateCategoryApi(oldName, newName)
      // Cập nhật lại UI lập tức
      setItems((prev) =>
        prev.map((item) => (item.category === oldName ? { ...item, category: newName } : item))
      )
      setAddedCategories((prev) => prev.map((cat) => (cat === oldName ? newName : cat)))
      message.success(`Đã đổi tên danh mục thành "${newName}"`)
    } catch (err) {
      message.error('Lỗi cập nhật danh mục: ' + err.message)
    }
  }, [])

  const removeCategory = useCallback(async (categoryName) => {
    try {
      await deleteCategoryApi(categoryName)
      // Loại bỏ các Q&A thuộc danh mục này khỏi UI
      setItems((prev) => prev.filter((item) => item.category !== categoryName))
      setAddedCategories((prev) => prev.filter((cat) => cat !== categoryName))
      message.success(`Đã xóa danh mục "${categoryName}"`)
    } catch (err) {
      message.error('Lỗi xóa danh mục: ' + err.message)
    }
  }, [])

  return {
    items,
    pagination,
    categories,
    loading,
    fetchAll,
    create,
    update,
    remove,
    addCategory,
    renameCategory,
    removeCategory,
  }
}
