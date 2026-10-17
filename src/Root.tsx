import React from 'react';
import {Composition} from 'remotion';
import {Main} from './Main';
import {loadFonts} from './lib/fonts';

loadFonts();
import {DURATION, FPS, H, W} from './lib/timeline';

export const Root: React.FC = () => (
  <Composition id="TradingIntro" component={Main} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
);
