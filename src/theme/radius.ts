import {
  moderateScale,
} from './responsive';

export const radius = {
  none: 0,

  sm: moderateScale(6),

  md: moderateScale(12),

  lg: moderateScale(20),

  xl: moderateScale(30),

  full: 999,
};