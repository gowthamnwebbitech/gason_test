import { TextStyle } from 'react-native';

import { colors } from './colors';

import { fontScale } from './responsive';

const families = {
  poppinsBold: 'Poppins-Bold',

  poppinsSemiBold:
    'Poppins-SemiBold',

  interRegular:
    'Inter_18pt-Regular',

  interMedium:
    'Inter_18pt-Medium',
};

type Typography = {
  screenTitle: TextStyle;

  sectionTitle: TextStyle;

  heading: TextStyle;

  bodyLarge: TextStyle;

  body: TextStyle;

  caption: TextStyle;

  buttonPrimary: TextStyle;

  buttonSecondary: TextStyle;

  link: TextStyle;
};

export const typography: Typography =
  {
    screenTitle: {
      fontFamily:
        families.poppinsBold,

      fontSize: fontScale(26),

      lineHeight:
        fontScale(34),

      color:
        colors.textPrimary,
    },

    sectionTitle: {
      fontFamily:
        families.poppinsBold,

      fontSize: fontScale(24),

      lineHeight:
        fontScale(32),

      color: colors.primary,
    },

    heading: {
      fontFamily:
        families.poppinsSemiBold,

      fontSize: fontScale(20),

      lineHeight:
        fontScale(28),

      color:
        colors.textPrimary,
    },

    bodyLarge: {
      fontFamily:
        families.interMedium,

      fontSize: fontScale(16),

      lineHeight:
        fontScale(24),

      color:
        colors.textPrimary,
    },

    body: {
      fontFamily:
        families.interRegular,

      fontSize: fontScale(14),

      lineHeight:
        fontScale(22),

      color:
        colors.textSecondary,
    },

    caption: {
      fontFamily:
        families.interRegular,

      fontSize: fontScale(12),

      lineHeight:
        fontScale(18),

      color:
        colors.textSecondary,
    },

    buttonPrimary: {
      fontFamily:
        families.poppinsSemiBold,

      fontSize: fontScale(18),

      color: colors.white,
    },

    buttonSecondary: {
      fontFamily:
        families.interMedium,

      fontSize: fontScale(16),

      color:
        colors.textPrimary,
    },

    link: {
      fontFamily:
        families.interMedium,

      fontSize: fontScale(14),

      color: colors.primary,
    },
  };