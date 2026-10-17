import {createContext, useContext} from 'react';
import {useCurrentFrame as useRemotionFrame} from 'remotion';

/** Skala waktu scene: animasi dirancang untuk 'base' frame, lalu direntangkan ke durasi scene sebenarnya. */
export const RateContext = createContext(1);
export const useCurrentFrame = () => useRemotionFrame() * useContext(RateContext);
