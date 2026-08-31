import React from 'react';

import { iconsLib } from '../../../assets';
import { Button } from '../button';
import { LanguageDropdown } from '../settings/LanguageDropdown';
import { ThemeToggle } from '../settings/ThemeToggle';
import { cn } from '../../utils';
import ProfileAvatar from './ProfileAvatar';

export interface HeadNavbarProps {
  children?: React.ReactNode;
  className?: string;
  isAdmin?: boolean;
  leading?: React.ReactNode;
  actions?: React.ReactNode;
  showNotifications?: boolean;
}

interface IHeadNavbarBrandProps {
  className?: string;
}

export const HeadNavbarBrand: React.FC<IHeadNavbarBrandProps> = ({
  className,
}) => (
  <div className={cn('min-w-0 items-center gap-3', className)}>
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-body-l font-semibold text-navy-900">
      R
    </div>
    <div className="min-w-0">
      <div className="truncate text-body-m font-semibold text-base-content">
        Rexone
      </div>
      <div className="truncate text-body-s text-base-content opacity-60">
        Control Center
      </div>
    </div>
  </div>
);

export const HeadNavbar: React.FC<HeadNavbarProps> = ({
  actions,
  children,
  className,
  leading,
  showNotifications = true,
}) => (
  <header
    className={cn(
      'fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-base-300 bg-base-100 px-4 md:px-6',
      className,
    )}
  >
    {children ?? (
      <>
        <div className="flex min-w-0 items-center gap-3">{leading}</div>
        <div className="flex items-center gap-2">
          {showNotifications && (
            <Button
              type="button"
              variant="tertiary"
              className="hidden h-10 w-10 p-0 md:inline-flex"
              aria-label="Notifications"
            >
              <iconsLib.bell className="h-5 w-5" />
            </Button>
          )}
          <ThemeToggle />
          <div className="hidden sm:block">
            <LanguageDropdown />
          </div>
          {actions}
          <ProfileAvatar />
        </div>
      </>
    )}
  </header>
);

export default HeadNavbar;
