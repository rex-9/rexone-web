import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAtom } from "jotai";
import Clock from "react-clock";
import "react-clock/dist/Clock.css";
import atoms from "../../../atoms";
import { sounds } from "../../../assets";
import { useMarker } from "../contexts/MarkerContext";

const formatTime = (date: Date): string =>
  `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

const generateMarkerTimes = (
  startTime: string,
  endTime: string,
  interval: number,
  now: Date,
): string[] => {
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;
  const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();
  const times: string[] = [];

  for (
    let time = startTotalMinutes + interval;
    time <= endTotalMinutes;
    time += interval
  ) {
    if (time > currentTotalMinutes) {
      const hours = Math.floor(time / 60);
      const minutes = time % 60;
      times.push(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`,
      );
    }
  }

  return times;
};

const calculateMarkerPosition = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes;
  const angle = (totalMinutes / 60) * 360;
  const radius = 144;

  return {
    x: radius + radius * Math.cos((angle - 90) * (Math.PI / 180)),
    y: radius + radius * Math.sin((angle - 90) * (Math.PI / 180)),
  };
};

export const AnalogClock: React.FC = () => {
  const [value, setValue] = useState(() => new Date());
  const { markers } = useMarker();
  const [startTime] = useAtom(atoms.startTimeAtom);
  const [endTime] = useAtom(atoms.endTimeAtom);
  const audioAllowedRef = useRef(false);
  const playedMarkerTimesRef = useRef(new Set<string>());
  const endReachedRef = useRef(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const playSound = useCallback(() => {
    if (audioAllowedRef.current) {
      void new Audio(sounds.note.src).play();
    }
  }, []);

  const playEndSound = useCallback(() => {
    playSound();
    window.setTimeout(() => {
      playSound();
      window.setTimeout(playSound, 1000);
    }, 1000);
  }, [playSound]);

  const markerTimes = useMemo(() => {
    if (!markers.length) return [];

    const intervalMinutes =
      markers[0].unit === "hours"
        ? markers[0].interval * 60
        : markers[0].interval;

    return generateMarkerTimes(startTime, endTime, intervalMinutes, value);
  }, [endTime, markers, startTime, value]);

  useEffect(() => {
    const enableAudio = () => {
      audioAllowedRef.current = true;
      document.removeEventListener("click", enableAudio);
    };
    const intervalId = window.setInterval(() => setValue(new Date()), 1000);

    document.addEventListener("click", enableAudio);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("click", enableAudio);
    };
  }, []);

  useEffect(() => {
    if (!markers.length) return;

    const currentTime = formatTime(value);
    if (
      markerTimes.includes(currentTime) &&
      !playedMarkerTimesRef.current.has(currentTime)
    ) {
      playedMarkerTimesRef.current.add(currentTime);
      playSound();
      return;
    }

    if (currentTime === endTime && !endReachedRef.current) {
      endReachedRef.current = true;
      playEndSound();
    }
  }, [endTime, markerTimes, markers.length, playEndSound, playSound, value]);

  useEffect(() => {
    playedMarkerTimesRef.current.clear();
    endReachedRef.current = false;
  }, [endTime, markers, startTime]);

  useEffect(() => {
    let isMounted = true;

    const requestWakeLock = async () => {
      try {
        const sentinel = await navigator.wakeLock.request("screen");
        if (isMounted) {
          wakeLockRef.current = sentinel;
        } else {
          await sentinel.release();
        }
      } catch (error) {
        console.error("Wake Lock request failed", error);
      }
    };

    void requestWakeLock();
    const intervalId = window.setInterval(() => void requestWakeLock(), 300000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
      void wakeLockRef.current?.release();
      wakeLockRef.current = null;
    };
  }, []);

  return (
    <div className="relative h-72 w-72">
      <Clock size={288} value={value} className="rounded-full bg-white" />
      <div className="absolute inset-0 rounded-full border-2 border-base-content">
        {markers.map((marker, index) => (
          <React.Fragment key={`${marker.color}-${index}`}>
            <div
              className="absolute h-2 w-2 rounded-full"
              style={{
                backgroundColor: "pink",
                left: `${calculateMarkerPosition(startTime).x}px`,
                top: `${calculateMarkerPosition(startTime).y}px`,
                transform: "translate(-75%, -75%)",
              }}
            />
            {markerTimes.map((time) => {
              const { x, y } = calculateMarkerPosition(time);

              return (
                <div
                  key={`${marker.color}-${time}`}
                  className="absolute h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: marker.color,
                    left: `${x}px`,
                    top: `${y}px`,
                    transform: "translate(-75%, -75%)",
                  }}
                />
              );
            })}
            <div
              className="absolute h-2 w-2 rounded-full"
              style={{
                backgroundColor: "red",
                left: `${calculateMarkerPosition(endTime).x}px`,
                top: `${calculateMarkerPosition(endTime).y}px`,
                transform: "translate(-75%, -75%)",
              }}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
