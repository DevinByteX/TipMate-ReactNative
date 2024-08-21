import { CustomisedTheme } from "@hooks";
import { UnistylesThemes } from "react-native-unistyles";

export interface ThemeBox {
    key: string;
    buttonColor: string;
    customisedTheme: CustomisedTheme[];
}

export const CustomThemesConfig = (themeColors: any): ThemeBox[] => [
    {
        key: 'theme_first',
        buttonColor: themeColors.accent_first,
        customisedTheme: [
            { themeName: 'light' as keyof UnistylesThemes, customColors: { accent: themeColors.primary_accent_light } },
            { themeName: 'dark' as keyof UnistylesThemes, customColors: { accent: themeColors.primary_accent_dark } },
        ],
    },
    {
        key: 'theme_second',
        buttonColor: themeColors.accent_second,
        customisedTheme: [
            { themeName: 'light' as keyof UnistylesThemes, customColors: { accent: themeColors.primary_accent_light_second } },
            { themeName: 'dark' as keyof UnistylesThemes, customColors: { accent: themeColors.primary_accent_dark_second } },
        ],
    },
    {
        key: 'theme_third',
        buttonColor: themeColors.accent_third,
        customisedTheme: [
            { themeName: 'light' as keyof UnistylesThemes, customColors: { accent: themeColors.primary_accent_light_third } },
            { themeName: 'dark' as keyof UnistylesThemes, customColors: { accent: themeColors.primary_accent_dark_third } },
        ],
    },
    {
        key: 'theme_fourth',
        buttonColor: themeColors.accent_forth,
        customisedTheme: [
            { themeName: 'light' as keyof UnistylesThemes, customColors: { accent: themeColors.primary_accent_light_fourth } },
            { themeName: 'dark' as keyof UnistylesThemes, customColors: { accent: themeColors.primary_accent_dark_fourth } },
        ],
    },
];
