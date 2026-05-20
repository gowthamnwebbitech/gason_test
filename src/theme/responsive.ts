// src/theme/responsive.ts

import {
  Dimensions,
} from 'react-native';

const guidelineBaseWidth = 375;

const guidelineBaseHeight = 812;

export const getScreenSize =
  () => {
    return Dimensions.get(
      'window',
    );
  };

export const scale = (
  size: number,
) => {
  const { width } =
    getScreenSize();

  return (
    (width /
      guidelineBaseWidth) *
    size
  );
};

export const verticalScale = (
  size: number,
) => {
  const { height } =
    getScreenSize();

  return (
    (height /
      guidelineBaseHeight) *
    size
  );
};

export const moderateScale = (
  size: number,
  factor = 0.5,
) => {
  return (
    size +
    (scale(size) - size) *
      factor
  );
};

export const fontScale = (
  size: number,
) => moderateScale(size);

export const screenWidth = () =>
  getScreenSize().width;

export const screenHeight = () =>
  getScreenSize().height;

export const isSmallDevice =
  () => screenWidth() < 375;

export const isTablet = () =>
  screenWidth() >= 768;