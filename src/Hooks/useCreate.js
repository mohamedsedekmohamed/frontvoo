import api from "../Api/axios";
import { normalizeItem } from "./crudUtils";

export const useCreate = (endpoint, { setData, setLoading, setError }) => {
  const create = async (payload) => {
    try {
      setLoading(true);
      const res = await api.post(endpoint, payload);
      const newItem = normalizeItem(res);
      setData((prev) => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { create };
};