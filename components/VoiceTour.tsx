"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const TOUR_SCRIPT =
  "Welcome to Nathan Tutors. Whether you are a student struggling with maths, preparing for KCSE, or studying a university unit, we connect you with verified Kenyan tutors for one-on-one online sessions. Browse tutors by subject, book a free 15-minute intro session first, then attend your lesson by video call from anywhere. Better grades start with the right tutor. Find yours today.";

export function VoiceTour() {
  const [supported, setSupported] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const triggeredRef = useRef(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setSupported("speechSynthesis" in window);
  }, []);

  const stop = useCallback(() => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback(() => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(TOUR_SCRIPT);
    utterance.rate = 0.94;
    utterance.pitch = 1.1;
    utterance.lang = "en-KE";

    const voices = window.speechSynthesis.getVoices();
    const eastAfrican = voices.find((voice) =>
      voice.lang?.toLowerCase().startsWith("en-ke"),
    );
    const english = voices.find((voice) => voice.lang?.toLowerCase().startsWith("en"));
    if (eastAfrican) utterance.voice = eastAfrican;
    else if (english) utterance.voice = english;

    utterance.onstart = () => {
      setSpeaking(true);
      setStarted(true);
      setEnded(false);
    };
    utterance.onend = () => {
      setSpeaking(false);
      setEnded(true);
    };
    utterance.onerror = () => {
      setSpeaking(false);
      setEnded(true);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  // The tour waits for a real interaction and never autoplays on load.
  useEffect(() => {
    if (!supported) return;

    const trigger = () => {
      if (triggeredRef.current) return;
      triggeredRef.current = true;
      speak();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", onInteract);
      window.removeEventListener("keydown", onInteract);
    };

    const onScroll = () => {
      if (window.scrollY > 120) trigger();
    };
    const onInteract = () => trigger();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("click", onInteract, { once: true });
    window.addEventListener("keydown", onInteract, { once: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", onInteract);
      window.removeEventListener("keydown", onInteract);
    };
  }, [speak, supported]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!supported) return null;

  const label = speaking
    ? "Stop site voice tour"
    : ended
      ? "Replay site voice tour"
      : "Site voice tour, click to mute";

  return (
    <button
      type="button"
      className={`nt-float nt-float-voice${speaking ? " is-speaking" : ""}`}
      onClick={() => {
        triggeredRef.current = true;
        if (speaking) stop();
        else speak();
      }}
      aria-label={label}
      aria-pressed={speaking}
    >
      {speaking ? <span className="nt-voice-ring" aria-hidden="true" /> : null}
      <span className="nt-float-tooltip">{ended ? "Replay tour" : "Hear what this site is about"}</span>
      {speaking ? (
        <Volume2 size={24} aria-hidden="true" />
      ) : (
        <VolumeX size={24} aria-hidden="true" />
      )}
    </button>
  );
}
