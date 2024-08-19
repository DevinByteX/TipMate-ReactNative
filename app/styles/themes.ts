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
    primary_light: '#efefef',
    primary_dark: '#333333',
    primary_accent_light: '#009688',
    primary_accent_dark: '#10b981',
    // primary_accent_light: '#F3982C',
    // primary_accent_dark: '#F4AB41',
    card_light: '#dcdcdc',
    card_dark: '#454545',
    devider_light: '#4b4b4b',
    devider_dark: '#4b4b4b',
    card_typography_light: '#292929',
    card_typography_dark: '#f6f6f6',
    disable_text_light: '#dcdcdc',
    disable_text_dark: '#6d6d6d',
    disable_button_light: '#bdbdbd',
    disable_button_dark: '#4f4f4f',
    error_toast_light: '#e61854',
    error_toast_dark: '#f93a69',
}

const hexToRGBA = (hex: string, opacity: number) => {
    const rgb = hex
        .replace('#', '')
        .split(/(?=(?:..)*$)/)
        .map(x => parseInt(x, 16));
    return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
};

export const lightTheme = {
    colors: {
        ...sharedColors,
        backgroundColor: sharedColors.primary_light,
        headerBGColor: sharedColors.primary_light,
        accent: sharedColors.primary_accent_light,
        card_typography: sharedColors.card_typography_light,
        card: sharedColors.card_light,
        devider: sharedColors.devider_light,
        disable_text: sharedColors.disable_text_light,
        disable_button: sharedColors.disable_button_light,
        error_toast: sharedColors.error_toast_light,
    },
    margins: {
        sm: 2,
        md: 4,
        lg: 8,
        xl: 12
    },
    fonts: {
        ...sharedFonts,
    },
    utils: {
        hexToRGBA
    }
    // add any keys/functions/objects/arrays you want!
} as const

export const darkTheme = {
    colors: {
        ...sharedColors,
        backgroundColor: sharedColors.primary_dark,
        headerBGColor: sharedColors.primary_dark,
        accent: sharedColors.primary_accent_dark,
        card_typography: sharedColors.card_typography_dark,
        card: sharedColors.card_dark,
        devider: sharedColors.devider_dark,
        disable_text: sharedColors.disable_text_dark,
        disable_button: sharedColors.disable_button_dark,
        error_toast: sharedColors.error_toast_dark,
    },
    margins: {
        sm: 2,
        md: 4,
        lg: 8,
        xl: 12
    },
    fonts: {
        ...sharedFonts,
    },
    utils: {
        hexToRGBA
    }
    // add any keys/functions/objects/arrays you want!
} as const

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
    },
    margins: {
        sm: 2,
        md: 4,
        lg: 8,
        xl: 12
    },
    fonts: {
        ...sharedFonts,
    },
    utils: {
        hexToRGBA
    }
    // add any keys/functions/objects/arrays you want!
} as const