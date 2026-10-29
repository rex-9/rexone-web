// src/design/components/common/NetworkBanner.tsx
import React, { useState, useEffect } from "react";
import { cn } from "../../helpers";
import { iconsLib } from "../../../assets";

export interface INetworkBannerProps {
  children?: React.ReactNode;
  className?: string;
}

export const NetworkBanner: React.FC<INetworkBannerProps> = ({
  children,
  className,
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [showRestored, setShowRestored] = useState<boolean>(false);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | null = null;

    const handleOnline = () => {
      setIsOnline(true);
      setShowRestored(true);
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        setShowRestored(false);
      }, 3000);
    };

    const handleOffline = () => {
      if (hideTimer) clearTimeout(hideTimer);
      setIsOnline(false);
      setShowRestored(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      if (hideTimer) clearTimeout(hideTimer);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const isVisible = !isOnline || showRestored;
  const WifiIcon = iconsLib.wifi;
  const WifiOffIcon = iconsLib.wifiOff;

  return (
    <div className={cn("relative w-full", className)}>
      {/* Floating Network Indicator Banner */}
      <div
        className={cn(
          "fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 pointer-events-none",
          isVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-8 opacity-0 pointer-events-none"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2.5 px-4 py-2 rounded-full shadow-lg backdrop-blur-md border text-xs font-medium tracking-wide",
            showRestored
              ? "bg-success/20 border-success/40 text-success"
              : "bg-error/20 border-error/40 text-error"
          )}
        >
          {showRestored ? (
            <>
              <WifiIcon className="w-4 h-4 text-success shrink-0" />
              <span>Connection restored</span>
            </>
          ) : (
            <>
              <WifiOffIcon className="w-4 h-4 text-error shrink-0" />
              <span>Offline mode &mdash; Check your connection</span>
            </>
          )}
        </div>
      </div>

      {children}
    </div>
  );
};
