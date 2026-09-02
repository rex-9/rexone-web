import { useCallback, useEffect, useState } from "react";
import SpeechService from "../speech.service";
import type { ISpeechSnapshot, IStartListeningOptions } from "../types";
import type { TSpeechListenResult } from "../constants";

export const useLiveSpeech = () => {
  const [snapshot, setSnapshot] = useState<ISpeechSnapshot>(() =>
    SpeechService.getSnapshot(),
  );

  useEffect(() => {
    return SpeechService.subscribe(() => {
      setSnapshot(SpeechService.getSnapshot());
    });
  }, []);

  useEffect(() => {
    return () => {
      SpeechService.stopPlayback();
      void SpeechService.stopListening();
    };
  }, []);

  const startListening = useCallback(
    (options?: IStartListeningOptions): Promise<TSpeechListenResult> => {
      return SpeechService.startListening(options);
    },
    [],
  );

  const stopListening = useCallback((): Promise<void> => {
    return SpeechService.stopListening();
  }, []);

  const playUrl = useCallback((url: string): Promise<void> => {
    return SpeechService.playUrl(url);
  }, []);

  const stopPlayback = useCallback((): void => {
    SpeechService.stopPlayback();
  }, []);

  return {
    ...snapshot,
    startListening,
    stopListening,
    playUrl,
    stopPlayback,
  };
};
