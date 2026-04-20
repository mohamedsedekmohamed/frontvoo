import React from 'react';
import Pagination from '@mui/material/Pagination';

const ReusableTable = ({ 
  columns, 
  data, 
  currentPage, 
  pageCount, 
  onPageChange 
}) => {
  return (
    // الحاوية الخارجية: إضافة ظل (shadow) وإطار (border) ليعطي شكل Card أنيق
    <div className="w-full bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden flex flex-col">
      
      {/* حاوية السكرول الأفقي: تضمن عدم خروج الجدول عن الشاشة */}
      <div className="overflow-x-auto w-full">
        {/* استخدام min-w-max بدلاً من 1000px ليتمدد الجدول حسب المحتوى ولا ينضغط */}
        <table className="w-full min-w-max border-collapse text-start">
          {/* استبدلت bg-four بـ bg-gray-50، يمكنك إرجاعها إذا كانت لوناً مخصصاً في إعداداتك */}
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((col, index) => (
                <th 
                  key={index} 
                  className="py-4 px-6 font-semibold text-gray-700 whitespace-nowrap"
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
                  // تأثير الـ hover لسهولة تتبع الصفوف بالعين
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 h-[56px]"
                >
                  {columns.map((col, colIndex) => (
                    <td 
                      key={colIndex} 
                      className="py-3 px-6 align-middle text-sm text-gray-600"
                    >
                      {col.render ? col.render(row, rowIndex) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={columns.length} 
                  className="text-center py-8 text-gray-500 font-medium"
                >
                  لا توجد بيانات متاحة
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* حاوية الـ Pagination */}
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
    </div>
  );
};

export default ReusableTable;