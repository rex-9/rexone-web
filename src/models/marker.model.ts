export const MARKER_TIME_UNITS = {
  SECONDS: "seconds",
  MINUTES: "minutes",
  HOURS: "hours",
} as const;

export type TMarkerTimeUnit =
  (typeof MARKER_TIME_UNITS)[keyof typeof MARKER_TIME_UNITS];

export interface IMarker {
  interval: number;
  unit: TMarkerTimeUnit;
  color: string;
}
