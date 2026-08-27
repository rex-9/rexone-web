import { useCallback, useEffect, useMemo, useState } from "react";

interface IUseCountdownResult {
  secondsLeft: number;
  isActive: boolean;
  targetTimeMs: number;
  start: (seconds?: number) => void;
  startAt: (targetTimeMs: number) => void;
  clear: () => void;
}

export const useCountdown = (defaultSeconds = 0): IUseCountdownResult => {
  const [targetTimeMs, setTargetTimeMs] = useState(0);
  const [nowMs, setNowMs] = useState(() => Date.now());

  const secondsLeft = useMemo(
    () => Math.max(0, Math.ceil((targetTimeMs - nowMs) / 1000)),
    [targetTimeMs, nowMs],
  );

  const isActive = secondsLeft > 0;

  useEffect(() => {
    if (!isActive) return;

    const intervalId = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isActive]);

  const start = useCallback(
    (seconds = defaultSeconds) => {
      const normalizedSeconds = Math.max(0, Math.ceil(seconds));
      if (normalizedSeconds <= 0) {
        setTargetTimeMs(0);
        setNowMs(Date.now());
        return;
      }

      const now = Date.now();
      setNowMs(now);
      setTargetTimeMs(now + normalizedSeconds * 1000);
    },
    [defaultSeconds],
  );

  const startAt = useCallback((nextTargetTimeMs: number) => {
    const normalizedTarget = Number.isFinite(nextTargetTimeMs)
      ? Math.max(0, nextTargetTimeMs)
      : 0;
    setNowMs(Date.now());
    setTargetTimeMs(normalizedTarget);
  }, []);

  const clear = useCallback(() => {
    setTargetTimeMs(0);
    setNowMs(Date.now());
  }, []);

  return {
    secondsLeft,
    isActive,
    targetTimeMs,
    start,
    startAt,
    clear,
  };
};
