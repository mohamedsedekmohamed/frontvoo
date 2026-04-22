import api from "../Api/axios";

export const useDelete = (endpoint, { setData, setLoading, setError }) => {
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

  return { remove };
};
