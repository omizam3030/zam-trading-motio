import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Grain, Vignette} from './kit/Atmos';
import {AudioMix} from './kit/AudioMix';
import {Subtitles} from './kit/Type';
import {Scene01} from './scenes/Scene01';
import {Scene02} from './scenes/Scene02';
import {Scene03} from './scenes/Scene03';
import {Scene04} from './scenes/Scene04';
import {Scene05} from './scenes/Scene05';
import {scene} from './lib/timeline';
import {RateContext} from './lib/frame';

/** Aturan overlap: 0 frame; rate = base/durasi (animasi direntangkan mengikuti VO). Sequence berurutan persis; transisi (speed ramp, sapuan emas, garis perak) terjadi DI DALAM scene. */
export const Main: React.FC = () => {
  const s = (id: 's1' | 's2' | 's3' | 's4' | 's5', C: React.FC) => {
    const {from, dur, rate} = scene(id);
    return <Sequence from={from} durationInFrames={dur} name={id}><RateContext.Provider value={rate}><C /></RateContext.Provider></Sequence>;
  };
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {s('s1', Scene01)}{s('s2', Scene02)}{s('s3', Scene03)}{s('s4', Scene04)}{s('s5', Scene05)}
      <Vignette />
      <Grain />
      <Subtitles />
      <AudioMix />
    </AbsoluteFill>
  );
};
