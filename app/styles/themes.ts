const sharedColors = {
    barbie: '#ff9ff3',
    oak: '#1dd1a1',
    sky: '#48dbfb',
    fog: '#c8d6e5',
    aloes: '#00d2d3',
    blood: '#ff6b6b'
}

export const lightTheme = {
    colors: {
        ...sharedColors,
        backgroundColor: '#ffffff',
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