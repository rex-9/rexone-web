import React from "react";
import { IApiPagination } from "../../../models";
import { Button } from "../../../design/components/button";

interface IAdminPaginationProps {
  pagination: IApiPagination | null;
  onPageChange: (page: number) => void;
}

export const AdminPagination: React.FC<IAdminPaginationProps> = ({
  pagination,
  onPageChange,
}) => {
  if (!pagination) return null;

  return (
    <div className="mt-16 flex flex-col gap-12 text-body-s text-base-content md:flex-row md:items-center md:justify-between">
      <span className="opacity-70">
        Page {pagination.current_page} of {pagination.total_pages} -{" "}
        {pagination.total_count} total
      </span>
      <div className="flex gap-8">
        <Button
          size="sm"
          variant="secondary"
          disabled={!pagination.prev_page}
          onClick={() => {
            if (pagination.prev_page) onPageChange(pagination.prev_page);
          }}
        >
          Previous
        </Button>
        <Button
          size="sm"
          variant="secondary"
          disabled={!pagination.next_page}
          onClick={() => {
            if (pagination.next_page) onPageChange(pagination.next_page);
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
