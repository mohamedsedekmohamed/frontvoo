import api from "../Api/axios";
import { normalizeList, normalizeItem } from "./crudUtils";

export const useRead = (endpoint, key, { setData, setItem, setLoading, setError }) => {
  const getAll = async () => {
    try {
      setLoading(true);
      const res = await api.get(endpoint);
      setData(normalizeList(res, key));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`${endpoint}/${id}`);
      setItem(normalizeItem(res));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { getAll, getById };
};