import { describe, expect, it } from "vitest";
import {
  ASSET_FORMATS,
  isAudioAsset,
  isImageAsset,
  isVideoAsset,
} from "./constants";

describe("Asset format detectors", () => {
  describe("isVideoAsset", () => {
    it("returns true when format is video", () => {
      expect(isVideoAsset({ format: ASSET_FORMATS.VIDEO })).toBe(true);
      expect(isVideoAsset({ format: "video" })).toBe(true);
    });

    it("returns true for video extensions", () => {
      expect(isVideoAsset({ extension: "mp4" })).toBe(true);
      expect(isVideoAsset({ extension: ".webm" })).toBe(true);
      expect(isVideoAsset({ extension: "mov" })).toBe(true);
      expect(isVideoAsset({ extension: "mkv" })).toBe(true);
      expect(isVideoAsset({ extension: "m4v" })).toBe(true);
    });

    it("returns true for video URLs", () => {
      expect(isVideoAsset({ url: "https://storage.example.com/clip.mp4" })).toBe(true);
      expect(isVideoAsset({ url: "https://storage.example.com/clip.mov?token=123" })).toBe(true);
    });

    it("returns false for non-video assets", () => {
      expect(isVideoAsset(null)).toBe(false);
      expect(isVideoAsset({ format: "image", extension: "png" })).toBe(false);
      expect(isVideoAsset({ format: "audio", extension: "mp3" })).toBe(false);
    });
  });

  describe("isAudioAsset", () => {
    it("returns true when format is audio", () => {
      expect(isAudioAsset({ format: ASSET_FORMATS.AUDIO })).toBe(true);
      expect(isAudioAsset({ format: "audio" })).toBe(true);
    });

    it("returns true for audio extensions", () => {
      expect(isAudioAsset({ extension: "mp3" })).toBe(true);
      expect(isAudioAsset({ extension: ".wav" })).toBe(true);
      expect(isAudioAsset({ extension: "m4a" })).toBe(true);
      expect(isAudioAsset({ extension: "aac" })).toBe(true);
      expect(isAudioAsset({ extension: "ogg" })).toBe(true);
      expect(isAudioAsset({ extension: "flac" })).toBe(true);
    });

    it("returns true for audio URLs", () => {
      expect(isAudioAsset({ url: "https://storage.example.com/audio.mp3" })).toBe(true);
      expect(isAudioAsset({ url: "https://storage.example.com/audio.wav?token=abc" })).toBe(true);
    });

    it("returns false for non-audio assets", () => {
      expect(isAudioAsset(null)).toBe(false);
      expect(isAudioAsset({ format: "video", extension: "mp4" })).toBe(false);
      expect(isAudioAsset({ format: "image", extension: "jpg" })).toBe(false);
    });
  });

  describe("isImageAsset", () => {
    it("returns true when format is image", () => {
      expect(isImageAsset({ format: ASSET_FORMATS.IMAGE })).toBe(true);
    });

    it("returns true for avatar or thumbnail types", () => {
      expect(isImageAsset({ type: "avatar" })).toBe(true);
      expect(isImageAsset({ type: "thumbnail" })).toBe(true);
    });

    it("returns true for image extensions", () => {
      expect(isImageAsset({ extension: "png" })).toBe(true);
      expect(isImageAsset({ extension: ".jpg" })).toBe(true);
      expect(isImageAsset({ extension: "webp" })).toBe(true);
    });

    it("returns true for image URLs", () => {
      expect(isImageAsset({ url: "https://lh3.googleusercontent.com/a/abc" })).toBe(true);
      expect(isImageAsset({ url: "https://storage.example.com/photo.png?alt=media" })).toBe(true);
    });

    it("returns false for non-image assets", () => {
      expect(isImageAsset(null)).toBe(false);
      expect(isImageAsset({ format: "audio", extension: "mp3" })).toBe(false);
    });
  });
});
