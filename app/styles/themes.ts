const sharedColors = {
    barbie: '#ff9ff3',
    blood: '#ff6b6b',
    sky: '#48dbfb',
    primary_light: '#efefef',
    primary_dark: '#333333',
    primary_accent: '#F4AB41',
    card_light: '#dcdcdc',
    card_dark: '#454545'
}

export const lightTheme = {
    colors: {
        ...sharedColors,
        backgroundColor: sharedColors.primary_light,
        headerBGColor: sharedColors.primary_light,
        accent: sharedColors.primary_accent,
        card_typography: '#292929',
        card: sharedColors.card_light
    },
    margins: {
        sm: 2,
        md: 4,
        lg: 8,
        xl: 12
    }
    // add any keys/functions/objects/arrays you want!
} as const

export const darkTheme = {
    colors: {
        ...sharedColors,
        backgroundColor: sharedColors.primary_dark,
        headerBGColor: sharedColors.primary_dark,
        accent: sharedColors.primary_accent,
        card_typography: '#f6f6f6',
        card: sharedColors.card_dark
    },
    margins: {
        sm: 2,
        md: 4,
        lg: 8,
        xl: 12
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
        card: sharedColors.blood
    },
    margins: {
        sm: 2,
        md: 4,
        lg: 8,
        xl: 12
    }
    // add any keys/functions/objects/arrays you want!
} as const