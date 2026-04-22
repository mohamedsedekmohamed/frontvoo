import { useState } from "react";
import { useRead } from "./useRead";
import { useCreate } from "./useCreate";
import { useUpdate } from "./useUpdate";
import { useDelete } from "./useDelete";

function useCrud(endpoint, key = null) {
  const [data, setData] = useState([]);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const stateHelpers = { setData, setItem, setLoading, setError };

  const { getAll, getById } = useRead(endpoint, key, stateHelpers);
  const { create } = useCreate(endpoint, stateHelpers);
  const { Update } = useUpdate(endpoint, stateHelpers);
  const { remove } = useDelete(endpoint, stateHelpers);

  return {
    data,
    item,
    loading,
    error,
    read: getAll,
    readById: getById,
    create,
    update: Update,
    remove,
  };
}
export default useCrud;
