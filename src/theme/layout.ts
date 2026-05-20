// src/theme/layout.ts

import {
  useWindowDimensions,
} from 'react-native';

export const useResponsive =
  () => {
    const { width, height } =
      useWindowDimensions();

    const isPortrait =
      height > width;

    const isTablet =
      width >= 768;

    return {
      width,
      height,
      isPortrait,
      isTablet,
    };
  };