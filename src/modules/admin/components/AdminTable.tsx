import React from "react";
import { cn } from "../../../design/helpers";

export interface IAdminTableColumn<T> {
  key: string;
  header: string;
  render: (record: T) => React.ReactNode;
  className?: string;
}

interface IAdminTableProps<T> {
  columns: IAdminTableColumn<T>[];
  records: T[];
  getRowKey: (record: T) => string;
}

const AdminTableHead: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <thead>{children}</thead>;

const AdminTableRow: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <tr className="border-base-300">{children}</tr>;

const AdminTableHeaderCell: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <th
    className={cn(
      "bg-base-200 text-body-s font-semibold text-base-content",
      className,
    )}
  >
    {children}
  </th>
);

const AdminTableCell: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => <td className={className}>{children}</td>;

export function AdminTable<T>({
  columns,
  records,
  getRowKey,
}: IAdminTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-md border border-base-300 bg-base-100">
      <div className="overflow-x-auto">
        <table className="table w-full">
          <AdminTableHead>
            <AdminTableRow>
              {columns.map((column) => (
                <AdminTableHeaderCell
                  key={column.key}
                  className={column.className}
                >
                  {column.header}
                </AdminTableHeaderCell>
              ))}
            </AdminTableRow>
          </AdminTableHead>
          <tbody>
            {records.map((record) => (
              <AdminTableRow key={getRowKey(record)}>
                {columns.map((column) => (
                  <AdminTableCell key={column.key} className={column.className}>
                    {column.render(record)}
                  </AdminTableCell>
                ))}
              </AdminTableRow>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
