import React, { useState } from "react";
import { useAtom } from "jotai";
import { useMarker } from "../contexts";
import { useToast } from "../../../contexts/ToastContext";
import atoms from "../../../atoms";
import { AppLocales } from "../../../locales/app_locales";
import assets from "../../../assets";
import { DropdownPicker } from "../../../design";
import { Button, Input } from "../../../design/molecules";
import { useTranslation } from "react-i18next";

const MarkerPopup: React.FC = () => {
  const { showToast } = useToast();
  const { addMarker, cleanMarkers } = useMarker();
  const { t } = useTranslation();
  const [interval, setInterval] = useState(1);
  const [unit, setUnit] = useState<"minutes" | "hours">("minutes");
  const [startTime, setStartTime] = useAtom(atoms.startTimeAtom);
  const [endTime, setEndTime] = useAtom(atoms.endTimeAtom);

  const handleAddMarker = () => {
    const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    addMarker({ interval, unit, color });
    showToast("success", AppLocales.TimerStartMessage);
  };

  const playSound = () => {
    const audio = new Audio(assets.sounds.note.src);
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
    { value: "minutes", label: AppLocales.TimerMinutes },
    { value: "hours", label: AppLocales.TimerHours },
  ];

  return (
    <div className="w-80 mt-5 flex flex-col items-center justify-center">
      <div className="w-full flex items-center justify-between gap-2">
        <Button className="w-fit mt-2" variant="tertiary" onClick={playSound}>
          {t(AppLocales.TimerTestIntervalSound)}
        </Button>
        <Button
          className="w-fit mt-2"
          variant="tertiary"
          onClick={playEndSound}
        >
          {t(AppLocales.TimerTestEndingSound)}
        </Button>
      </div>
      <div className="w-full mt-2">
        <Input
          id="start-time"
          label={t(AppLocales.TimerStartTime)}
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>
      <div className="w-full mt-2">
        <Input
          id="end-time"
          label={t(AppLocales.TimerEndTime)}
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>
      <div className="w-full flex items-center justify-between gap-2">
        <div className="w-1/2">
          <Input
            id="interval"
            label={t(AppLocales.TimerInterval)}
            type="number"
            value={interval.toString()}
            onChange={(e) => setInterval(Number(e.target.value))}
            placeholder="Enter interval"
          />
        </div>
        <DropdownPicker
          className="w-1/2 mt-2"
          options={unitOptions}
          value={unit}
          onChange={(value) => setUnit(value as "minutes" | "hours")}
        />
      </div>
      <Button
        className="w-fit mt-2"
        variant="primary"
        onClick={handleAddMarker}
      >
        {t(AppLocales.TimerStart)}
      </Button>
      <Button className="w-fit mt-2" variant="tertiary" onClick={cleanMarkers}>
        {t(AppLocales.TimerReset)}
      </Button>
    </div>
  );
};

export default MarkerPopup;
