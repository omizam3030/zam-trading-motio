import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import plan from '../lib/audio-plan.json';
import {AVAILABLE} from '../lib/assets.generated';
import {DURATION} from '../lib/timeline';
import {lerp, prog, ease} from '../lib/anim';

const has = (file: string) => AVAILABLE.includes(file);

/** 0..1: seberapa aktif narasi pada frame f (dipakai untuk ducking musik) */
export const voiceActivity = (f: number) =>
  Math.max(0, ...plan.voice.map((v) => Math.min(prog(f, v.from - 6, v.from + 6), 1 - prog(f, v.windowEnd - 6, v.windowEnd + 8))));

/** Timeline audio: musik (ducking otomatis) + VO (center, prioritas) + SFX bertanda waktu */
export const AudioMix: React.FC = () => {
  const m = plan.music;
  return (
    <>
      {has(m.file) ? (
        <Audio src={staticFile(m.file)} volume={(f) =>
          lerp(m.volume, m.duckTo, ease.soft(voiceActivity(f))) *
          prog(f, 0, m.fadeInFrames) * (1 - prog(f, DURATION - m.fadeOutFrames, DURATION - 1, ease.in))} />
      ) : null}
      {plan.voice.filter((v) => has(v.file)).map((v) => (
        <Sequence key={v.id} from={v.from} durationInFrames={v.windowEnd - v.from + 12}>
          <Audio src={staticFile(v.file)} volume={1} />
        </Sequence>
      ))}
      {plan.sfx.filter((s) => has(s.file)).map((s, i) => (
        <Sequence key={i} from={s.from} durationInFrames={s.dur}>
          <Audio src={staticFile(s.file)}
            volume={(f) => s.volume * prog(f, 0, 2) * (1 - prog(f, s.dur - 6, s.dur))} />
        </Sequence>
      ))}
    </>
  );
};
