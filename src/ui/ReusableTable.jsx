import React, { useState } from "react";
import Pagination from "@mui/material/Pagination";
import { useTranslation } from "react-i18next";

const ReusableTable = ({
  columns,
  data,
  currentPage,
  pageCount,
  onPageChange,
  forceEnglishTitle = false,
}) => {
  // 🔹 State للـ Popup
  const [openPopup, setOpenPopup] = useState(false);
  const [popupText, setPopupText] = useState("");

  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  // 🔹 عند الضغط على النص
  const handleTextClick = (text) => {
    if (text && text.length > 15) {
      setPopupText(text);
      setOpenPopup(true);
    }
  };

  return (
    <div className="w-full bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden flex flex-col">
      {/* جدول */}
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-max border-collapse text-start">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="py-4 px-4 font-semibold text-start text-gray-700 whitespace-nowrap"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 h-[56px]"
                >
                  {columns.map((col, colIndex) => {
                    const value = col.render
                      ? col.render(row, rowIndex)
                      : row[col.accessor];

                    // 🔹 لو النص string
                    if (typeof value === "string") {
                      const isLong = value.length > 15;
                      const shortText = isLong
                        ? value.slice(0, 15) + "..."
                        : value;

                      return (
                        <td
                          key={colIndex}
                          className="py-3 px-4 align-middle text-sm text-gray-600"
                        >
                          <span
                            className={
                              isLong
                                ? "cursor-pointer text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                : ""
                            }
                            onClick={() => handleTextClick(value)}
                            title={isLong ? t("Click to read full text") : ""}
                          >
                            {shortText}
                          </span>
                        </td>
                      );
                    }

                    return (
                      <td
                        key={colIndex}
                        className="py-3 px-4 align-middle text-sm text-gray-600"
                      >
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-8 text-gray-500 font-medium"
                >
                  {forceEnglishTitle ? "No data available" : t("No data available")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pageCount > 0 && (
        <div className="flex justify-center items-center py-4 bg-white border-t border-gray-200">
          <Pagination
            count={pageCount}
            page={currentPage}
            onChange={(e, page) => onPageChange(page)}
            color="secondary"
            shape="rounded"
          />
        </div>
      )}

      {/* 🔥 Popup */}
      {openPopup && (
        <div
          className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4"
          dir={isArabic ? "rtl" : "ltr"} // 🔹 ضبط الاتجاه حسب اللغة
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] shadow-xl relative flex flex-col">
            {/* 🔹 زر الإغلاق: ضبط مكانه حسب اللغة */}
            <button
              className={`absolute top-4 ${isArabic ? "left-4" : "right-4"} text-gray-400 hover:text-red-500 text-xl font-bold transition-colors`}
              onClick={() => setOpenPopup(false)}
            >
              ✕
            </button>

            <h2 className="text-lg font-bold mb-4 text-gray-800 border-b border-gray-100 pb-3">
              {forceEnglishTitle ? "Full Text" : t("Full Text")}
            </h2>

            {/* 🔹 النص كامل مع scroll */}
            <div className="overflow-y-auto flex-1 pr-2">
              <p className="text-gray-700 break-words whitespace-pre-wrap leading-relaxed">
                {popupText}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReusableTable;
