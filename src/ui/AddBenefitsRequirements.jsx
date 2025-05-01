import React from 'react';
import { useTranslation } from 'react-i18next';

const AddBenefitsRequirements = ({ benfit, setbenfit, requirment, setrequirment }) => {
  const { t } = useTranslation();
  // const isArabic = i18n.language === 'ar';
  const handleAdd = (type) => {
    const newItem = { text: "", status: "active", error: "" }; // إضافة حالة للخطأ
    if (type === "benefit") {
      setbenfit([...benfit, newItem]);
    } else {
      setrequirment([...requirment, newItem]);
    }
  };

  const handleChange = (type, index, field, value) => {
    const updater = type === "benefit" ? [...benfit] : [...requirment];
    let error = "";
    if (field === "text" && !/^[^\d]*$/.test(value)) { // التحقق من عدم وجود أرقام
      error = "enter text";
    }
    updater[index][field] = value;
    updater[index].error = error; // تحديث حالة الخطأ
    type === "benefit" ? setbenfit(updater) : setrequirment(updater);
  };

  const handleRemove = (type, index) => {
    const updater = type === "benefit" ? [...benfit] : [...requirment];
    updater.splice(index, 1);
    type === "benefit" ? setbenfit(updater) : setrequirment(updater);
  };

  return (
    <div className="p-4 flex justify-evenly w-full">
      {/* Benefits Section */}
      <div>
        <h2 className="text-lg  text-one font-bold mb-2">{t("Benefits")}</h2>
        {benfit.map((item, idx) => (
          <div key={idx} className="flex gap-2 items-center mb-2">
            <input
              type="text"
              className={`border p-2 rounded w-full ${item.error && 'border-red-500'}`} // إضافة نمط للحدود عند وجود خطأ
              placeholder="Add Benefits"
              value={item.text}
              onChange={(e) => handleChange("benefit", idx, "text", e.target.value)}
            />
            {item.error && <p className="text-red-500 text-xs italic">{item.error}</p>} {/* عرض رسالة الخطأ */}
            <select
              className="border p-2 rounded"
              value={item.status}
              onChange={(e) => handleChange("benefit", idx, "status", e.target.value)}
            >
              <option value="active">{t("active")}</option>
              <option value="inactive">{t("inactive")}</option>
            </select>
            <button
              onClick={() => handleRemove("benefit", idx)}
              className="text-red-500 font-bold"
            >
              ❌
            </button>
          </div>
        ))}
        <button
          onClick={() => handleAdd("benefit")}
          className="border-one broder-2 bg-three text-white px-4 py-2 rounded"
        >
          ➕ {t("add")}
        </button>
      </div>

      {/* Requirements Section */}
      <div>
        <h2 className="text-lg font-bold text-one mb-2">{t("Requirements")}</h2>
        {requirment.map((item, idx) => (
          <div key={idx} className="flex gap-2 items-center mb-2">
            <input
              type="text"
              className={`border p-2 rounded w-full ${item.error && 'border-red-500'}`} // إضافة نمط للحدود عند وجود خطأ
              placeholder="Add Requirements  "
              value={item.text}
              onChange={(e) => handleChange("requirement", idx, "text", e.target.value)}
            />
            {item.error && <p className="text-red-500 text-xs italic">{item.error}</p>} {/* عرض رسالة الخطأ */}
            <select
              className="border p-2 rounded"
              value={item.status}
              onChange={(e) => handleChange("requirement", idx, "status", e.target.value)}
            >
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
            <button
              onClick={() => handleRemove("requirement", idx)}
              className="text-red-500 font-bold"
            >
              ❌
            </button>
          </div>
        ))}
        <button
          onClick={() => handleAdd("requirement")}
          className="border-one broder-2 bg-three text-white px-4 py-2 rounded"
        >
          ➕ {t("add")}
          </button>
      </div>
    </div>
  );
};
export default AddBenefitsRequirements;