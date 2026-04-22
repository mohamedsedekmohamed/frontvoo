export const normalizeList = (res, key) => {
  const r = res?.data;
  if (Array.isArray(r)) return r;
  if (key && Array.isArray(r?.[key])) return r[key];
  if (Array.isArray(r?.data)) return r.data;
  if (r && typeof r === "object") return [r];
  return [];
};

export const normalizeItem = (res) => {
  const r = res?.data;
  return r?.data || r;
};