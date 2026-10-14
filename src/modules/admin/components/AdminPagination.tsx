import React from "react";
import type { IApiPagination } from "../../../models";
import { iconsLib } from "../../../assets";
import { Button } from "../../../design/components/button";
import {
  ButtonTypes,
  ButtonVariants,
  ComponentSizes,
} from "../../../design/constants";

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
          type={ButtonTypes.BUTTON}
          variant={ButtonVariants.GLASS}
          size={ComponentSizes.SM}
          disabled={!pagination.prev_page}
          onClick={() => {
            if (pagination.prev_page) onPageChange(pagination.prev_page);
          }}
          className="gap-1.5"
        >
          <iconsLib.chevronLeft className="h-4 w-4 shrink-0" />
          <span>Previous</span>
        </Button>
        <Button
          type={ButtonTypes.BUTTON}
          variant={ButtonVariants.GLASS}
          size={ComponentSizes.SM}
          disabled={!pagination.next_page}
          onClick={() => {
            if (pagination.next_page) onPageChange(pagination.next_page);
          }}
          className="gap-1.5"
        >
          <span>Next</span>
          <iconsLib.chevronRight className="h-4 w-4 shrink-0" />
        </Button>
      </div>
    </div>
  );
};
