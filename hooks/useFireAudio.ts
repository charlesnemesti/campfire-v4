"use client";

import { useCallback, useEffect, useRef } from "react";

type FireAudioOptions = {
  health: number;
  enabled: boolean;
};

export function useFireAudio({ health, enabled }: FireAudioOptions) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const noiseGainRef = useRef<GainNode | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const crackleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopAudio = useCallback(() => {
    if (crackleIntervalRef.current) {
      clearInterval(crackleIntervalRef.current);
      crackleIntervalRef.current = null;
    }

    noiseSourceRef.current?.stop();
    noiseSourceRef.current = null;

    if (audioContextRef.current?.state !== "closed") {
      void audioContextRef.current?.close();
    }
    audioContextRef.current = null;
    masterGainRef.current = null;
    noiseGainRef.current = null;
  }, []);

  const startAudio = useCallback(async () => {
    if (audioContextRef.current) return;

    const ctx = new AudioContext();
    await ctx.resume();

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.value = 900;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.04;

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);
    noise.start();

    const crackle = () => {
      if (!audioContextRef.current || !masterGainRef.current) return;

      const osc = ctx.createOscillator();
      const popGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sawtooth";
      osc.frequency.value = 80 + Math.random() * 200;
      filter.type = "bandpass";
      filter.frequency.value = 200 + Math.random() * 600;
      filter.Q.value = 0.8;

      const now = ctx.currentTime;
      popGain.gain.setValueAtTime(0.0001, now);
      popGain.gain.exponentialRampToValueAtTime(0.015 + Math.random() * 0.02, now + 0.01);
      popGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04 + Math.random() * 0.06);

      osc.connect(filter);
      filter.connect(popGain);
      popGain.connect(master);
      osc.start(now);
      osc.stop(now + 0.12);
    };

    crackleIntervalRef.current = setInterval(crackle, 180);

    audioContextRef.current = ctx;
    masterGainRef.current = master;
    noiseGainRef.current = noiseGain;
    noiseSourceRef.current = noise;
  }, []);

  useEffect(() => {
    if (!enabled) {
      stopAudio();
      return;
    }

    void startAudio();
    return stopAudio;
  }, [enabled, startAudio, stopAudio]);

  useEffect(() => {
    if (!enabled || !masterGainRef.current || !noiseGainRef.current) return;

    const intensity = health / 100;
    const targetMaster = intensity * 0.35;
    const targetNoise = 0.02 + intensity * 0.06;

    masterGainRef.current.gain.linearRampToValueAtTime(
      targetMaster,
      (audioContextRef.current?.currentTime ?? 0) + 0.3,
    );
    noiseGainRef.current.gain.linearRampToValueAtTime(
      targetNoise,
      (audioContextRef.current?.currentTime ?? 0) + 0.3,
    );
  }, [health, enabled]);

  return { stopAudio };
}
