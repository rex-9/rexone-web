import React, { useState } from "react";
import { useAtom } from "jotai";
import { useMarker } from "../contexts";
import { useToast } from "../../../contexts/ToastContext";
import atoms from "../../../atoms";
import { AppLocales, useTranslate } from "../../../locales";
import { sounds } from "../../../assets";
import {
  Dropdown,
  Button,
  DateTimePicker,
  NumberInput,
} from "../../../design/components";
import {
  MARKER_TIME_UNITS,
  type TMarkerTimeUnit,
} from "../../../models";

export const MarkerPopup: React.FC = () => {
  const { showToast } = useToast();
  const { addMarker, cleanMarkers } = useMarker();
  const t = useTranslate();
  const [interval, setInterval] = useState(1);
  const [unit, setUnit] = useState<TMarkerTimeUnit>(MARKER_TIME_UNITS.MINUTES);
  const [startTime, setStartTime] = useAtom(atoms.startTimeAtom);
  const [endTime, setEndTime] = useAtom(atoms.endTimeAtom);

  const MARKER_PALETTE = [
    "var(--color-primary)",
    "var(--color-secondary)",
    "var(--color-accent)",
    "var(--color-info)",
    "var(--color-success)",
    "var(--color-warning)",
  ];

  const handleAddMarker = () => {
    const color = MARKER_PALETTE[Math.floor(Math.random() * MARKER_PALETTE.length)];
    addMarker({ interval, unit, color });
    showToast("success", AppLocales.Anapana.StartMessage);
  };

  const playSound = () => {
    const audio = new Audio(sounds.note.src);
    audio.play();
  };

  const playEndSound = () => {
    playSound();
    setTimeout(() => {
      playSound();
      setTimeout(() => {
        playSound();
      }, 1000);
    }, 1000);
  };

  const unitOptions = [
    {
      value: MARKER_TIME_UNITS.MINUTES,
      label: t(AppLocales.Anapana.Minutes),
    },
    {
      value: MARKER_TIME_UNITS.HOURS,
      label: t(AppLocales.Anapana.Hours),
    },
  ];

  const handleUnitChange = (value: string) => {
    setUnit(value as TMarkerTimeUnit);
  };

  return (
    <div className="w-80 mt-5 flex flex-col items-center justify-center">
      <div className="w-full flex items-center justify-between gap-2">
        <Button className="w-fit mt-2" variant="tertiary" onClick={playSound}>
          {t(AppLocales.Anapana.TestIntervalSound)}
        </Button>
        <Button
          className="w-fit mt-2"
          variant="tertiary"
          onClick={playEndSound}
        >
          {t(AppLocales.Anapana.TestEndingSound)}
        </Button>
      </div>

      <div className="w-full mt-2">
        <DateTimePicker
          id="start-time"
          type="time"
          label={t(AppLocales.Anapana.StartTime)}
          value={startTime}
          onChange={setStartTime}
        />
      </div>

      <div className="w-full mt-2">
        <DateTimePicker
          id="end-time"
          type="time"
          label={t(AppLocales.Anapana.EndTime)}
          value={endTime}
          onChange={setEndTime}
        />
      </div>

      <div className="w-full flex items-center justify-between gap-2">
        <div className="w-1/2">
          <NumberInput
            id="interval"
            label={t(AppLocales.Anapana.Interval)}
            min={1}
            step={1}
            allowDecimals={false}
            value={interval}
            onChange={(val) => setInterval(val ?? 1)}
            placeholder="Enter interval"
          />
        </div>
        <div className="w-1/2 mt-2">
          <Dropdown
            options={unitOptions}
            value={unit}
            onValueChange={handleUnitChange}
            label={t(AppLocales.Anapana.Unit)}
          />
        </div>
      </div>

      <Button
        className="w-fit mt-2"
        variant="primary"
        onClick={handleAddMarker}
      >
        {t(AppLocales.Anapana.Start)}
      </Button>

      <Button className="w-fit mt-2" variant="tertiary" onClick={cleanMarkers}>
        {t(AppLocales.Anapana.Reset)}
      </Button>
    </div>
  );
};
