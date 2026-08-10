import React from "react";
import { cn } from "../../utils";

export interface IAdminTableColumn<T> {
  key: string;
  header: string;
  render: (record: T) => React.ReactNode;
  className?: string;
}

interface AdminTableProps<T> {
  columns: IAdminTableColumn<T>[];
  records: T[];
  getRowKey: (record: T) => string;
}

export function AdminTable<T>({
  columns,
  records,
  getRowKey,
}: AdminTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-md border border-base-300 bg-base-100">
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="border-base-300">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "bg-base-200 text-body-s font-semibold text-base-content",
                    column.className,
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={getRowKey(record)} className="border-base-300">
                {columns.map((column) => (
                  <td key={column.key} className={column.className}>
                    {column.render(record)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
