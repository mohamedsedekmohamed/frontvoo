import api from "../Api/axios";
import { normalizeItem } from "./crudUtils";

export const useUpdate = (endpoint, { setData, setLoading, setError }) => {
  const Update = async (id, payload) => {
    try {
      setLoading(true);
      const res = await api.put(`${endpoint}/${id}`, payload);
      const updatedItem = normalizeItem(res);
      setData((prev) => prev.map((item) => (item.id === id ? updatedItem : item)));
      return updatedItem;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { Update };
};