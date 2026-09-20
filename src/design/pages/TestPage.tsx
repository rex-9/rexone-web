import React, { useState } from "react";
import { Button, Player, TextInput } from "../components";
import { ButtonVariants } from "../constants";
import { AssetController } from "../../modules/asset";
import type { IAssetPlaybackResponse } from "../../models";
import { DevTestButtons } from "../../modules/log/components/DevTestButtons";
import AppConfig from "../../AppConfig";

type PlaybackKind = "video" | "audio";

export const TestPage: React.FC = () => {
  const [videoAssetId, setVideoAssetId] = useState("");
  const [audioAssetId, setAudioAssetId] = useState("");
  const [videoPlayback, setVideoPlayback] =
    useState<IAssetPlaybackResponse | null>(null);
  const [audioPlayback, setAudioPlayback] =
    useState<IAssetPlaybackResponse | null>(null);
  const [loadingKind, setLoadingKind] = useState<PlaybackKind | null>(null);
  const [error, setError] = useState("");

  const loadPlayback = async (kind: PlaybackKind) => {
    const id = (kind === "video" ? videoAssetId : audioAssetId).trim();
    if (!id) {
      setError(`Enter a ${kind} asset ID first.`);
      return;
    }

    setLoadingKind(kind);
    setError("");
    const result = await AssetController.getPlayback(id);
    setLoadingKind(null);

    if (!result.success || !result.playback) {
      setError(result.error || `Failed to load ${kind} playback.`);
      return;
    }

    if (kind === "video") {
      setVideoPlayback(result.playback);
    } else {
      setAudioPlayback(result.playback);
    }
  };

  return (
    <div className="w-full max-w-5xl space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          RexOne Test Lab
        </p>
        <h1 className="text-heading-l font-bold text-base-content">
          Playback & diagnostics
        </h1>
        <p className="mt-2 text-base-content/70">
          Use this page for browser checks, client logging tests, and
          progressive audio/video playback against RexOne Core.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <h2 className="text-heading-s font-bold">Video streaming</h2>
          <p className="mt-1 text-sm text-base-content/70">
            Loads a short-lived progressive playback URL, then lets the browser
            play and seek directly from storage.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <TextInput
              label="Video asset ID"
              value={videoAssetId}
              onChange={(event) => setVideoAssetId(event.target.value)}
              placeholder="Paste video asset UUID"
            />
            <Button
              variant={ButtonVariants.PRIMARY}
              className="sm:mt-7 sm:w-44"
              isLoading={loadingKind === "video"}
              onClick={() => void loadPlayback("video")}
            >
              Load video
            </Button>
          </div>
          {videoPlayback && (
            <div className="mt-5 space-y-2">
              <Player
                view="video"
                src={videoPlayback.delivery.url}
                type={videoPlayback.media.content_type}
                alt="Test video playback"
                className="aspect-video w-full rounded-lg border border-base-300 bg-base-300 object-contain"
                // Subtitle tracks configuration:
                // 1. Fast Path (In-Memory): Uses `subtitle.content` directly to create a WebVTT Data URI.
                // 2. Fallback Path (HTTP): If `content` is ever omitted, routes to Core API server using `core_url`.
                tracks={videoPlayback.media.subtitles
                  .filter((subtitle) =>
                    Boolean(
                      subtitle.content || subtitle.core_url || subtitle.url,
                    ),
                  )
                  .map((subtitle, index) => {
                    const fallbackUrl = subtitle.core_url
                      ? subtitle.core_url.startsWith("http")
                        ? subtitle.core_url
                        : `${AppConfig.SERVER_BASE_URL}${subtitle.core_url}`
                      : subtitle.url;

                    return {
                      src: fallbackUrl,
                      content: subtitle.content,
                      kind: "subtitles" as const,
                      label:
                        subtitle.title || subtitle.name || `Subtitle ${index + 1}`,
                      default: index === 0,
                    };
                  })}
              />
              <p className="break-all text-xs text-base-content/60">
                Expires: {videoPlayback.delivery.expires_at}
              </p>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <h2 className="text-heading-s font-bold">Audio streaming</h2>
          <p className="mt-1 text-sm text-base-content/70">
            Uses the same playback endpoint for audio assets, without
            downloading the file through Axios.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <TextInput
              label="Audio asset ID"
              value={audioAssetId}
              onChange={(event) => setAudioAssetId(event.target.value)}
              placeholder="Paste audio asset UUID"
            />
            <Button
              variant={ButtonVariants.PRIMARY}
              className="sm:mt-7 sm:w-44"
              isLoading={loadingKind === "audio"}
              onClick={() => void loadPlayback("audio")}
            >
              Load audio
            </Button>
          </div>
          {audioPlayback && (
            <div className="mt-5 space-y-2">
              <Player
                view="audio"
                src={audioPlayback.delivery.url}
                type={audioPlayback.media.content_type}
                title="Test audio playback"
                className="w-full rounded-lg border border-base-300"
                tracks={audioPlayback.media.subtitles
                  .filter((s) => Boolean(s.url || s.content))
                  .map((s, i) => ({
                    src: s.url,
                    content: s.content,
                    kind: "subtitles",
                    label: s.title || s.name || "Subtitle",
                    default: i === 0,
                  }))}
              />
              <p className="break-all text-xs text-base-content/60">
                Expires: {audioPlayback.delivery.expires_at}
              </p>
            </div>
          )}
        </div>
      </section>

      <DevTestButtons />
    </div>
  );
};

export default TestPage;
