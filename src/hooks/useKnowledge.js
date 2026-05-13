import { useState, useCallback } from 'react'
import {
  getKnowledge,
  createKnowledge,
  updateKnowledge,
  deleteKnowledge,
} from '../api/knowledgeApi'
import { message } from 'antd'

/**
 * Knowledge Base CRUD hook.
 *
 * Usage:
 *   const { items, loading, fetchAll, create, update, remove } = useKnowledge()
 */
export function useKnowledge() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  // ── Fetch all ────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getKnowledge()
      setItems(data ?? [])
    } catch (err) {
      message.error(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Create ───────────────────────────────────────────────────────────────
  const create = useCallback(async (payload) => {
    const newItem = await createKnowledge(payload)
    setItems((prev) => [newItem, ...prev])
    message.success('Đã thêm Q&A mới!')
    return newItem
  }, [])

  // ── Update ───────────────────────────────────────────────────────────────
  const update = useCallback(async (id, payload) => {
    const updated = await updateKnowledge(id, payload)
    setItems((prev) => prev.map((item) => (item._id === id ? updated : item)))
    message.success('Đã cập nhật Q&A!')
    return updated
  }, [])

  // ── Delete ───────────────────────────────────────────────────────────────
  const remove = useCallback(async (id) => {
    await deleteKnowledge(id)
    setItems((prev) => prev.filter((item) => item._id !== id))
    message.success('Đã xóa Q&A!')
  }, [])

  return { items, loading, fetchAll, create, update, remove }
}
