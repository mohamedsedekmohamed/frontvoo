import { useState } from "react";
import api from "../Api/axios";

function useCrud(endpoint, key = null) {
  const [data, setData] = useState([]);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const extractList = (res) => {
    const r = res?.data;

    if (Array.isArray(r)) return r;
    if (key && Array.isArray(r?.[key])) return r[key];
    if (Array.isArray(r?.data)) return r.data;

    return [];
  };

  const extractItem = (res) => {
    const r = res?.data;

    if (r?.data) return r.data;
    return r;
  };

  // ================= GET ALL =================
  const getAll = async () => {
    try {
      setLoading(true);
      const res = await api.get(endpoint);

      const list = extractList(res);
      setData(list);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= GET BY ID =================
  const getById = async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`${endpoint}/${id}`);

      const itemData = extractItem(res);
      setItem(itemData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= CREATE =================
  const create = async (payload) => {
    try {
      setLoading(true);
      const res = await api.post(endpoint, payload);

      const newItem = extractItem(res);

      setData((prev) => [newItem, ...prev]);

      return newItem;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE =================
  const update = async (id, payload) => {
    try {
      setLoading(true);
      const res = await api.put(`${endpoint}/${id}`, payload);

      const updatedItem = extractItem(res);

      setData((prev) =>
        prev.map((item) => (item.id === id ? updatedItem : item)),
      );

      return updatedItem;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const remove = async (id) => {
    try {
      setLoading(true);
      await api.delete(`${endpoint}/${id}`);

      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    item,
    loading,
    error,
    getAll,
    getById,
    create,
    update,
    remove,
  };
}
export default useCrud;
