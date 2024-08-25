import { CustomisedTheme } from "@hooks";
import { UnistylesThemes, useStyles } from "react-native-unistyles";

export interface ThemeBox {
    label: string;
    buttonColor: string;
    customisedTheme: CustomisedTheme[];
}

export const CustomThemesConfig = (): ThemeBox[] => {
    const { theme } = useStyles()
    return [
        {
            label: 'theme_first',
            buttonColor: theme.colors.accent_first,
            customisedTheme: [
                { themeName: 'light' as keyof UnistylesThemes, customColors: { accent: theme.colors.primary_accent_light } },
                { themeName: 'dark' as keyof UnistylesThemes, customColors: { accent: theme.colors.primary_accent_dark } },
            ],
        },
        {
            label: 'theme_second',
            buttonColor: theme.colors.accent_second,
            customisedTheme: [
                { themeName: 'light' as keyof UnistylesThemes, customColors: { accent: theme.colors.primary_accent_light_second } },
                { themeName: 'dark' as keyof UnistylesThemes, customColors: { accent: theme.colors.primary_accent_dark_second } },
            ],
        },
        {
            label: 'theme_third',
            buttonColor: theme.colors.accent_third,
            customisedTheme: [
                { themeName: 'light' as keyof UnistylesThemes, customColors: { accent: theme.colors.primary_accent_light_third } },
                { themeName: 'dark' as keyof UnistylesThemes, customColors: { accent: theme.colors.primary_accent_dark_third } },
            ],
        },
        {
            label: 'theme_fourth',
            buttonColor: theme.colors.accent_forth,
            customisedTheme: [
                { themeName: 'light' as keyof UnistylesThemes, customColors: { accent: theme.colors.primary_accent_light_fourth } },
                { themeName: 'dark' as keyof UnistylesThemes, customColors: { accent: theme.colors.primary_accent_dark_fourth } },
            ],
        },
    ]
};
