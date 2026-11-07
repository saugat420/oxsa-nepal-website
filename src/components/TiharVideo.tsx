"use client";

import { Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type VimeoMessage = {
  event?: string;
  method?: string;
  value?: number | { duration?: number; seconds?: number };
};

export function TiharVideo() {
  const frame = useRef<HTMLIFrameElement>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const send = useCallback((method: string, value?: string | number) => {
    frame.current?.contentWindow?.postMessage(
      JSON.stringify(value === undefined ? { method } : { method, value }),
      "https://player.vimeo.com",
    );
  }, []);

  const connect = useCallback(() => {
    for (const event of ["play", "pause", "ended", "timeupdate", "durationchange"]) {
      send("addEventListener", event);
    }
    send("getDuration");
  }, [send]);

  useEffect(() => {
    function receive(event: MessageEvent) {
      if (event.origin !== "https://player.vimeo.com") return;
      let message: VimeoMessage;
      try {
        message = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      } catch {
        return;
      }

      if (message.event === "ready") connect();
      if (message.event === "play") setPlaying(true);
      if (message.event === "pause" || message.event === "ended") setPlaying(false);
      if (message.method === "getDuration" && typeof message.value === "number") {
        setDuration(message.value);
      }
      if (
        (message.event === "timeupdate" || message.event === "durationchange") &&
        typeof message.value === "object" &&
        message.value
      ) {
        if (typeof message.value.seconds === "number") setCurrentTime(message.value.seconds);
        if (typeof message.value.duration === "number") setDuration(message.value.duration);
      }
    }

    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [connect]);

  function seek(value: number) {
    setCurrentTime(value);
    send("setCurrentTime", value);
  }

  return (
    <div className="tihar-video-player">
      <div className="tihar-video-frame">
        <iframe
          ref={frame}
          src="https://player.vimeo.com/video/1244498032?controls=0&title=0&byline=0&portrait=0&dnt=1"
          title="How to reach the Oxsa Nepal shelter"
          allow="autoplay; fullscreen; picture-in-picture"
          onLoad={connect}
        />
      </div>
      <div className="tihar-video-controls" aria-label="Video controls">
        <button
          type="button"
          onClick={() => send(playing ? "pause" : "play")}
          aria-label={playing ? "Pause location video" : "Play location video"}
        >
          {playing ? <Pause /> : <Play />}
        </button>
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={Math.min(currentTime, duration || 0)}
          onChange={(event) => seek(Number(event.target.value))}
          aria-label="Video position"
        />
      </div>
    </div>
  );
}
