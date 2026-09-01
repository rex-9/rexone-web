import React from "react";
import { IApiPagination } from "../../../models";
import { iconsLib } from "../../../assets";
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
    <div className="mt-4 flex flex-col gap-3 text-body-s text-base-content md:flex-row md:items-center md:justify-between">
      <span className="opacity-70">
        Page {pagination.current_page} of {pagination.total_pages} -{" "}
        {pagination.total_count} total
      </span>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="secondary"
          className="flex items-center gap-1"
          disabled={!pagination.prev_page}
          onClick={() => {
            if (pagination.prev_page) onPageChange(pagination.prev_page);
          }}
        >
          <iconsLib.chevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="flex items-center gap-1"
          disabled={!pagination.next_page}
          onClick={() => {
            if (pagination.next_page) onPageChange(pagination.next_page);
          }}
        >
          <span>Next</span>
          <iconsLib.chevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
