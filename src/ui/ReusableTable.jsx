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
    // السر هنا في max-w-full مع overflow-hidden للحاوية الأساسية
    <div className="w-full max-w-full overflow-hidden">
      {/* هنا بنعمل السكرول الأفقي الداخلي للجدول */}
<div className="overflow-x-auto w-full max-w-full block rounded-[8px]">
            <table className="w-full min-w-[1000px] border-collapse text-left bg-white">
          <thead className="bg-four border-b border-black">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className="py-4 px-3 font-semibold text-gray-800 whitespace-nowrap">
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
                  className="border-b border-gray-200 hover:bg-four transition-colors h-[56px]"
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="py-2 px-3 align-middle text-sm text-gray-700">
                      {col.render ? col.render(row, rowIndex) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-6 text-gray-500 font-medium">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pageCount > 0 && (
        <div className="flex justify-center mt-6 mb-4">
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