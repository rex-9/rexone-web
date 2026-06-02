import React, { useEffect, useState } from "react";
import { useMarker } from "../contexts/MarkerContext";
import { useAtom } from "jotai";
import "react-clock/dist/Clock.css";
import Clock from "react-clock";
import atoms from "../../../atoms";
import assets from "../../../assets";

const AnalogClock: React.FC = () => {
  const [value, setValue] = useState(new Date());
  const { markers } = useMarker();
  const [startTime] = useAtom(atoms.startTimeAtom);
  const [endTime] = useAtom(atoms.endTimeAtom);
  const [audioAllowed, setAudioAllowed] = useState(false);
  const [markerTimes, setMarkerTimes] = useState<string[]>([]);
  const [endReached, setEndReached] = useState(false);
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

  useEffect(() => {
    const handleUserInteraction = () => {
      setAudioAllowed(true);
      document.removeEventListener("click", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction);

    const interval = setInterval(() => setValue(new Date()), 1000);
    return () => {
      clearInterval(interval);
      document.removeEventListener("click", handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    if (!markers.length) {
      return;
    }
    const intervalMinutes =
      markers[0].unit === "hours"
        ? markers[0].interval * 60
        : markers[0].interval;
    let markerTimes = generateMarkerTimes(startTime, endTime, intervalMinutes);
    setMarkerTimes(markerTimes);
    setEndReached(false);
  }, [markers, startTime, endTime]);

  useEffect(() => {
    if (!markers.length) {
      return;
    }
    if (endReached) return;

    const currentTime = `${value.getHours().toString().padStart(2, "0")}:${value
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    console.log(
      "marker time ===>",
      markerTimes,
      " | ",
      "current time ===>",
      currentTime
    );
    if (markerTimes.includes(currentTime)) {
      playSound();
      setMarkerTimes(markerTimes.filter((time) => time !== currentTime)); // Remove the played time
    } else if (currentTime === endTime) {
      playEndSound();
      setEndReached(true);
    }
  }, [value, markers, startTime, endTime, markerTimes, endReached]);

  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        const wakeLockSentinel = await navigator.wakeLock.request("screen");
        setWakeLock(wakeLockSentinel);
        wakeLockSentinel.addEventListener("release", () => {
          console.log("Wake Lock was released");
        });
        console.log("Wake Lock is active");
      } catch (err) {
        if (err instanceof Error) {
          console.error(`${err.name}, ${err.message}`);
        } else {
          console.error(err);
        }
      }
    };

    requestWakeLock();

    const wakeLockInterval = setInterval(() => {
      requestWakeLock();
    }, 5 * 60 * 1000); // 5 minutes

    return () => {
      clearInterval(wakeLockInterval);
      if (wakeLock) {
        wakeLock.release();
      }
    };
  }, [wakeLock]);

  const playSound = () => {
    if (audioAllowed) {
      const audio = new Audio(assets.sounds.note.src);
      audio.play();
    }
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

  const calculateMarkerPosition = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;
    const angle = (totalMinutes / 60) * 360; // 720 minutes in 12 hours
    const radius = 144; // Half of the clock size (72 * 2)
    const x = radius + radius * Math.cos((angle - 90) * (Math.PI / 180));
    const y = radius + radius * Math.sin((angle - 90) * (Math.PI / 180));
    return { x, y };
  };

  const generateMarkerTimes = (
    startTime: string,
    endTime: string,
    interval: number
  ) => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    const currentTotalMinutes = value.getHours() * 60 + value.getMinutes();

    const times = [];
    for (
      let time = startTotalMinutes + interval;
      time <= endTotalMinutes;
      time += interval
    ) {
      if (time > currentTotalMinutes) {
        const hours = Math.floor(time / 60);
        const minutes = Math.floor(time % 60);
        times.push(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}`
        );
      }
    }
    return times;
  };

  return (
    <div className="relative w-72 h-72">
      <Clock size={288} value={value} className="bg-white rounded-full" />
      <div className="absolute inset-0 border-2 border-base-content rounded-full">
        {/* Render clock face */}
        {markers.map((marker, index) => {
          return (
            <React.Fragment key={index}>
              {/* Render start time marker */}
              <div
                key={`start-${index}`}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: "pink", // or any color you want for the start marker
                  left: `${calculateMarkerPosition(startTime).x}px`,
                  top: `${calculateMarkerPosition(startTime).y}px`,
                  transform: "translate(-75%, -75%)",
                }}
              />
              {markerTimes.map((time, idx) => {
                const { x, y } = calculateMarkerPosition(time);
                return (
                  <div
                    key={`${index}-${idx}`}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: marker.color,
                      left: `${x}px`,
                      top: `${y}px`,
                      transform: "translate(-75%, -75%)",
                    }}
                  />
                );
              })}
              {/* Render end time marker */}
              <div
                key={`end-${index}`}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: "red", // or any color you want for the end marker
                  left: `${calculateMarkerPosition(endTime).x}px`,
                  top: `${calculateMarkerPosition(endTime).y}px`,
                  transform: "translate(-75%, -75%)",
                }}
              />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default AnalogClock;
