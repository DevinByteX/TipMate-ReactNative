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
    primary_accent_light: '#F3982C',
    primary_accent_dark: '#F4AB41',
    card_light: '#dcdcdc',
    card_dark: '#454545',
    devider_light: '#4b4b4b',
    devider_dark: '#4b4b4b',
    card_typography_light: '#292929',
    card_typography_dark: '#f6f6f6',
}

export const lightTheme = {
    colors: {
        ...sharedColors,
        backgroundColor: sharedColors.primary_light,
        headerBGColor: sharedColors.primary_light,
        accent: sharedColors.primary_accent_light,
        card_typography: sharedColors.card_typography_light,
        card: sharedColors.card_light,
        devider: sharedColors.devider_light,
    },
    margins: {
        sm: 2,
        md: 4,
        lg: 8,
        xl: 12
    },
    fonts: {
        ...sharedFonts,
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
    },
    margins: {
        sm: 2,
        md: 4,
        lg: 8,
        xl: 12
    },
    fonts: {
        ...sharedFonts,
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
    },
    margins: {
        sm: 2,
        md: 4,
        lg: 8,
        xl: 12
    },
    fonts: {
        ...sharedFonts,
    }
    // add any keys/functions/objects/arrays you want!
} as const