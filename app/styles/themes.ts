const sharedColors = {
    barbie: '#ff9ff3',
    blood: '#ff6b6b',
    sky: '#48dbfb',
    primary_light: '#E3E9EC',
    primary_dark: '#333333'
}

export const lightTheme = {
    colors: {
        ...sharedColors,
        backgroundColor: '#ffffff',
        headerBGColor: sharedColors.primary_light,
        typography: '#000000',
        accent: sharedColors.blood
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
        backgroundColor: '#000000',
        headerBGColor: sharedColors.primary_dark,
        typography: '#ffffff',
        accent: sharedColors.barbie
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
        backgroundColor: sharedColors.barbie,
        headerBGColor: sharedColors.sky,
        typography: '#76278f',
        accent: '#000000'
    },
    margins: {
        sm: 2,
        md: 4,
        lg: 8,
        xl: 12
    }
    // add any keys/functions/objects/arrays you want!
} as const