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
const displayFontSize = scaleFont(40);
// Line-height multipliers per size — tighter for large display text, more open
// for body text to aid readability.  All line heights are derived from the
// corresponding scaled font size so they stay in sync if the font scale changes.
const LINE_HEIGHT_RATIOS: Record<string, number> = {
    xxs: 1.5,    // 8  → 12  (generous for tiny text)
    xs: 1.4,     // 10 → 14
    sm: 1.333,   // 12 → 16
    md: 1.429,   // 14 → 20
    lg: 1.375,   // 16 → 22
    xl: 1.4,     // 20 → 28
    xxl: 1.364,  // 22 → 30
    display: 1.2, // large numeric amounts — compact
};

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
        xxs: Math.round(scaleFont(8) * LINE_HEIGHT_RATIOS.xxs),
        xs: Math.round(scaleFont(10) * LINE_HEIGHT_RATIOS.xs),
        sm: Math.round(scaleFont(12) * LINE_HEIGHT_RATIOS.sm),
        md: Math.round(scaleFont(14) * LINE_HEIGHT_RATIOS.md),
        lg: Math.round(scaleFont(16) * LINE_HEIGHT_RATIOS.lg),
        xl: Math.round(scaleFont(20) * LINE_HEIGHT_RATIOS.xl),
        xxl: Math.round(scaleFont(22) * LINE_HEIGHT_RATIOS.xxl),
        display: Math.round(displayFontSize * LINE_HEIGHT_RATIOS.display),
    },
} as const;

export type TypographyToken = keyof typeof typography.fontSize;
export type TypographyScale = typeof typography;

/** Paired fontSize + lineHeight values for a single token. */
export type TypographyMetrics = {
    fontSize: number;
    lineHeight: number;
};

/**
 * Returns the paired `fontSize` and `lineHeight` for a given token.
 * Prefer this over referencing `typography.fontSize` and `typography.lineHeight`
 * separately to ensure the two values always stay in sync.
 *
 * @example
 *   const { fontSize, lineHeight } = getTypographyPair('md');
 */
export function getTypographyPair(token: TypographyToken): TypographyMetrics {
    return {
        fontSize: typography.fontSize[token],
        lineHeight: typography.lineHeight[token],
    };
}
