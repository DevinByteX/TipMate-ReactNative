import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_WIDTH = 375; // iPhone SE / 8 reference width

/**
 * Scales a font size relative to the design reference width (375pt).
 * On an iPhone SE (375pt) values are unchanged; on larger/smaller screens
 * they scale proportionally.
 */
const scaleFont = (size: number): number =>
    Math.round(PixelRatio.roundToNearestPixel((size * SCREEN_WIDTH) / BASE_WIDTH));

/**
 * Display size is the largest typographic size used for prominent numeric
 * amounts (e.g. the main bill total). It scales proportionally with screen width.
 */
const displayFontSize = Math.round((SCREEN_WIDTH * 40) / BASE_WIDTH);
const displayLineHeight = Math.round(displayFontSize * 1.2);

/**
 * Centralised font-size scale for TipMate.
 *
 * Token naming follows T-shirt sizes (xxs → xxl) plus a special `display`
 * token for large numeric amounts. The scale is split into two property
 * namespaces so each property can be referenced independently:
 *
 * Usage patterns:
 *   fontSize: typography.fontSize.md          // size only (most common)
 *   lineHeight: typography.lineHeight.md      // line-height only
 *   fontSize: typography.fontSize.lg,
 *   lineHeight: typography.lineHeight.lg,     // paired (standard body text)
 *
 * Size mapping from legacy hardcoded values:
 *   8  → xxs   |  10, 11  → xs   |  12, 13 → sm
 *  14  → md    |  16, 18  → lg   |  20     → xl
 *  22, 24 → xxl |  40     → display (dynamic)
 */
export const typography = {
    fontSize: {
        /** 8px – tiny badges and version sub-labels */
        xxs: scaleFont(8),
        /** 10px – hints, instruction text, secondary captions */
        xs: scaleFont(10),
        /** 12px – secondary labels, breakdown rows, small metadata */
        sm: scaleFont(12),
        /** 14px – default body text: buttons, labels, card content (most common) */
        md: scaleFont(14),
        /** 16px – larger body text, descriptions, input fields */
        lg: scaleFont(16),
        /** 20px – emphasis text, amounts, section headings */
        xl: scaleFont(20),
        /** 22px – prominent titles, card headers, modal headings */
        xxl: scaleFont(22),
        /** Dynamic – large numeric display (bill total, input amount) */
        display: displayFontSize,
    },
    lineHeight: {
        xxs: scaleFont(12),
        xs: scaleFont(14),
        sm: scaleFont(16),
        md: scaleFont(20),
        lg: scaleFont(22),
        xl: scaleFont(28),
        xxl: scaleFont(30),
        display: displayLineHeight,
    },
} as const;

export type TypographyToken = keyof typeof typography.fontSize;
export type TypographyScale = typeof typography;
