const sharedFonts = {
  Montserrat_Black: 'Montserrat-Black',
  Montserrat_Bold: 'Montserrat-Bold',
  Montserrat_Medium: 'Montserrat-Medium',
  Montserrat_Regular: 'Montserrat-Regular',
  Montserrat_Semibold: 'Montserrat-Semibold',
  Nunito_Black: 'Nunito-Black',
  Nunito_Bold: 'Nunito-Bold',
  Nunito_SemiBold: 'Nunito-SemiBold',
  Nunito_Medium: 'Nunito-Medium',
  Nunito_Regular: 'Nunito-Regular',
};

const sharedColors = {
  barbie: '#ff9ff3',
  blood: '#ff6b6b',
  sky: '#48dbfb',
  background_light: '#efefef',
  background_dark: '#333333',
  primary_accent_light: '#009688',
  primary_accent_dark: '#10b981',
  card_light: '#dcdcdc',
  card_dark: '#454545',
  devider_light: '#4b4b4b',
  devider_dark: '#4b4b4b',
  card_typography_light: '#292929',
  card_typography_dark: '#f6f6f6',
  disable_text_light: '#707070',
  disable_text_dark: '#6d6d6d',
  disable_button_light: '#a0a0a0',
  disable_button_dark: '#4f4f4f',
  error_toast_light: '#e61854',
  error_toast_dark: '#f93a69',
  success_light: '#4CAF50',
  success_dark: '#66BB6A',
  warning_light: '#FF9800',
  warning_dark: '#FFB74D',
  white: '#ffffff',
  // Custom theming
  primary_accent_light_second: '#F3982C',
  primary_accent_dark_second: '#F4AB41',
  primary_accent_light_third: '#3D63DD',
  primary_accent_dark_third: '#7FA3FA',
  primary_accent_light_fourth: '#E94B7C',
  primary_accent_dark_fourth: '#FE68A6',
  // Sky theme palette (from provided CSS: --bg #e0f2fe / --fg #0369a1)
  sky_bg: '#e0f2fe',
  sky_fg: '#0369a1',
  sky_card_light: '#bae6fd',
  sky_card_dark: '#075985',
  sky_disable_text_light: '#3aa3d4',
  sky_disable_text_dark: '#7dd3fc',
  sky_disable_button_light: '#cfe8fb',
  sky_disable_button_dark: '#0c4a6e',
  // Rose theme palette (from provided CSS: --bg #f9fafb / --fg #db2777)
  rose_bg: '#f9fafb',
  rose_fg: '#db2777',
  rose_card_light: '#fce7f3',
  rose_card_dark: '#9d174d',
  rose_disable_text_light: '#ec6fb0',
  rose_disable_text_dark: '#f9a8d4',
  rose_disable_button_light: '#fbcfe8',
  rose_disable_button_dark: '#831843',
  // Electric theme palette (from provided CSS display-p3 -> sRGB: --bg #3c519b / --fg #dbfc00)
  electric_bg: '#3c519b',
  electric_fg: '#dbfc00',
  electric_card_light: '#4a61b5',
  electric_card_dark: '#c2e000',
  electric_disable_text_light: '#9fb0dd',
  electric_disable_text_dark: '#7a86b0',
  electric_disable_button_light: '#2f4080',
  electric_disable_button_dark: '#e8ff66',
};

const hexToRGBA = (hex: string, opacity: number) => {
  const rgb = hex
    .replace('#', '')
    .split(/(?=(?:..)*$)/)
    .map(x => parseInt(x, 16));
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
};

import { typography } from './typography';

export const lightTheme = {
  colors: {
    ...sharedColors,
    backgroundColor: sharedColors.background_light,
    headerBGColor: sharedColors.background_light,
    accent: sharedColors.primary_accent_light,
    card_typography: sharedColors.card_typography_light,
    card: sharedColors.card_light,
    devider: sharedColors.devider_light,
    disable_text: sharedColors.disable_text_light,
    disable_button: sharedColors.disable_button_light,
    error_toast: sharedColors.error_toast_light,
    success: sharedColors.success_light,
    warning: sharedColors.warning_light,
    // Custom theming
    accent_first: sharedColors.primary_accent_light,
    accent_second: sharedColors.primary_accent_light_second,
    accent_third: sharedColors.primary_accent_light_third,
    accent_forth: sharedColors.primary_accent_light_fourth,
  },
  margins: {
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12,
  },
  fonts: {
    ...sharedFonts,
  },
  utils: {
    hexToRGBA,
  },
  typography,
  // add any keys/functions/objects/arrays you want!
} as const;

export const darkTheme = {
  colors: {
    ...sharedColors,
    backgroundColor: sharedColors.background_dark,
    headerBGColor: sharedColors.background_dark,
    accent: sharedColors.primary_accent_dark,
    card_typography: sharedColors.card_typography_dark,
    card: sharedColors.card_dark,
    devider: sharedColors.devider_dark,
    disable_text: sharedColors.disable_text_dark,
    disable_button: sharedColors.disable_button_dark,
    error_toast: sharedColors.error_toast_dark,
    success: sharedColors.success_dark,
    warning: sharedColors.warning_dark,
    // Custom theming
    accent_first: sharedColors.primary_accent_dark,
    accent_second: sharedColors.primary_accent_dark_second,
    accent_third: sharedColors.primary_accent_dark_third,
    accent_forth: sharedColors.primary_accent_dark_fourth,
  },
  margins: {
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12,
  },
  fonts: {
    ...sharedFonts,
  },
  utils: {
    hexToRGBA,
  },
  typography,
  // add any keys/functions/objects/arrays you want!
} as const;

// Sky theme — combo-1 (deep blue foreground on light blue background)
export const skyTheme = {
  colors: {
    ...sharedColors,
    backgroundColor: sharedColors.sky_bg,
    headerBGColor: sharedColors.sky_bg,
    accent: sharedColors.sky_fg,
    card_typography: sharedColors.sky_fg,
    card: sharedColors.sky_card_light,
    devider: sharedColors.sky_fg,
    disable_text: sharedColors.sky_disable_text_light,
    disable_button: sharedColors.sky_disable_button_light,
    error_toast: sharedColors.error_toast_light,
    success: sharedColors.success_light,
    warning: sharedColors.warning_light,
    // Custom theming
    accent_first: sharedColors.sky_fg,
    accent_second: sharedColors.primary_accent_light_second,
    accent_third: sharedColors.primary_accent_light_third,
    accent_forth: sharedColors.primary_accent_light_fourth,
  },
  margins: {
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12,
  },
  fonts: {
    ...sharedFonts,
  },
  utils: {
    hexToRGBA,
  },
  typography,
  // add any keys/functions/objects/arrays you want!
} as const;

// Sky theme — combo-2 (light blue foreground on deep blue background)
export const skyDarkTheme = {
  colors: {
    ...sharedColors,
    backgroundColor: sharedColors.sky_fg,
    headerBGColor: sharedColors.sky_fg,
    accent: sharedColors.sky_bg,
    card_typography: sharedColors.sky_bg,
    card: sharedColors.sky_card_dark,
    devider: sharedColors.sky_bg,
    disable_text: sharedColors.sky_disable_text_dark,
    disable_button: sharedColors.sky_disable_button_dark,
    error_toast: sharedColors.error_toast_dark,
    success: sharedColors.success_dark,
    warning: sharedColors.warning_dark,
    // Custom theming
    accent_first: sharedColors.sky_bg,
    accent_second: sharedColors.primary_accent_dark_second,
    accent_third: sharedColors.primary_accent_dark_third,
    accent_forth: sharedColors.primary_accent_dark_fourth,
  },
  margins: {
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12,
  },
  fonts: {
    ...sharedFonts,
  },
  utils: {
    hexToRGBA,
  },
  typography,
  // add any keys/functions/objects/arrays you want!
} as const;

// Rose theme — combo-1 (pink foreground on near-white background)
export const roseTheme = {
  colors: {
    ...sharedColors,
    backgroundColor: sharedColors.rose_bg,
    headerBGColor: sharedColors.rose_bg,
    accent: sharedColors.rose_fg,
    card_typography: sharedColors.rose_fg,
    card: sharedColors.rose_card_light,
    devider: sharedColors.rose_fg,
    disable_text: sharedColors.rose_disable_text_light,
    disable_button: sharedColors.rose_disable_button_light,
    error_toast: sharedColors.error_toast_light,
    success: sharedColors.success_light,
    warning: sharedColors.warning_light,
    // Custom theming
    accent_first: sharedColors.rose_fg,
    accent_second: sharedColors.primary_accent_light_second,
    accent_third: sharedColors.primary_accent_light_third,
    accent_forth: sharedColors.primary_accent_light_fourth,
  },
  margins: {
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12,
  },
  fonts: {
    ...sharedFonts,
  },
  utils: {
    hexToRGBA,
  },
  typography,
  // add any keys/functions/objects/arrays you want!
} as const;

// Rose theme — combo-2 (near-white foreground on pink background)
export const roseDarkTheme = {
  colors: {
    ...sharedColors,
    backgroundColor: sharedColors.rose_fg,
    headerBGColor: sharedColors.rose_fg,
    accent: sharedColors.rose_bg,
    card_typography: sharedColors.rose_bg,
    card: sharedColors.rose_card_dark,
    devider: sharedColors.rose_bg,
    disable_text: sharedColors.rose_disable_text_dark,
    disable_button: sharedColors.rose_disable_button_dark,
    error_toast: sharedColors.error_toast_dark,
    success: sharedColors.success_dark,
    warning: sharedColors.warning_dark,
    // Custom theming
    accent_first: sharedColors.rose_bg,
    accent_second: sharedColors.primary_accent_dark_second,
    accent_third: sharedColors.primary_accent_dark_third,
    accent_forth: sharedColors.primary_accent_dark_fourth,
  },
  margins: {
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12,
  },
  fonts: {
    ...sharedFonts,
  },
  utils: {
    hexToRGBA,
  },
  typography,
  // add any keys/functions/objects/arrays you want!
} as const;

// Electric theme — combo-1 (lime foreground on indigo background)
export const electricTheme = {
  colors: {
    ...sharedColors,
    backgroundColor: sharedColors.electric_bg,
    headerBGColor: sharedColors.electric_bg,
    accent: sharedColors.electric_fg,
    card_typography: sharedColors.electric_fg,
    card: sharedColors.electric_card_light,
    devider: sharedColors.electric_fg,
    disable_text: sharedColors.electric_disable_text_light,
    disable_button: sharedColors.electric_disable_button_light,
    error_toast: sharedColors.error_toast_light,
    success: sharedColors.success_light,
    warning: sharedColors.warning_light,
    // Custom theming
    accent_first: sharedColors.electric_fg,
    accent_second: sharedColors.primary_accent_light_second,
    accent_third: sharedColors.primary_accent_light_third,
    accent_forth: sharedColors.primary_accent_light_fourth,
  },
  margins: {
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12,
  },
  fonts: {
    ...sharedFonts,
  },
  utils: {
    hexToRGBA,
  },
  typography,
  // add any keys/functions/objects/arrays you want!
} as const;

// Electric theme — combo-2 (indigo foreground on lime background)
export const electricDarkTheme = {
  colors: {
    ...sharedColors,
    backgroundColor: sharedColors.electric_fg,
    headerBGColor: sharedColors.electric_fg,
    accent: sharedColors.electric_bg,
    card_typography: sharedColors.electric_bg,
    card: sharedColors.electric_card_dark,
    devider: sharedColors.electric_bg,
    disable_text: sharedColors.electric_disable_text_dark,
    disable_button: sharedColors.electric_disable_button_dark,
    error_toast: sharedColors.error_toast_dark,
    success: sharedColors.success_dark,
    warning: sharedColors.warning_dark,
    // Custom theming
    accent_first: sharedColors.electric_bg,
    accent_second: sharedColors.primary_accent_dark_second,
    accent_third: sharedColors.primary_accent_dark_third,
    accent_forth: sharedColors.primary_accent_dark_fourth,
  },
  margins: {
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12,
  },
  fonts: {
    ...sharedFonts,
  },
  utils: {
    hexToRGBA,
  },
  typography,
  // add any keys/functions/objects/arrays you want!
} as const;

export const premiumTheme = {
  colors: {
    ...sharedColors,
    backgroundColor: sharedColors.sky,
    headerBGColor: sharedColors.sky,
    accent: sharedColors.barbie,
    card_typography: '#76278f',
    card: sharedColors.blood,
    devider: '#4b4b4b',
    disable_text: sharedColors.blood,
    disable_button: sharedColors.sky,
    error_toast: sharedColors.blood,
    success: sharedColors.success_light,
    warning: sharedColors.warning_light,
    // Custom theming
    accent_first: sharedColors.barbie,
    accent_second: sharedColors.blood,
    accent_third: sharedColors.sky,
    accent_forth: sharedColors.barbie,
  },
  margins: {
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12,
  },
  fonts: {
    ...sharedFonts,
  },
  utils: {
    hexToRGBA,
  },
  typography,
  // add any keys/functions/objects/arrays you want!
} as const;
