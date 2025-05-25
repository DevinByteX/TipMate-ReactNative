import React from 'react';
import { Text, View, Alert, Linking } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { UnistylesRuntime } from 'react-native-unistyles';

interface LicenseDetailsProps {
    name: string;
    version: string;
    license: string;
    repository: string;
    licenseUrl: string;
}

export const StyledLicenseDetailsCard: React.FC<LicenseDetailsProps> = ({
    name,
    version,
    license,
    repository,
    licenseUrl,
}) => {
    const { styles } = useStyles(stylesheet);

    const handleLinkPress = (url: string) => {
        Alert.alert(
            'Open External Link',
            'You are about to open an external website. Do you want to continue?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Open',
                    onPress: () => Linking.openURL(url)
                }
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={styles.licenseMainContainer}>
            <Text style={styles.libraryNameText}>{name}</Text>
            <Text style={styles.versionText}>Version: {version}</Text>
            <Text style={styles.licenseText}>License: {license}</Text>
            <Text
                style={styles.repositoryText}
                onPress={() => handleLinkPress(repository)}
            >
                Repository: {repository}
            </Text>
            <Text
                style={styles.licenseUrlText}
                onPress={() => handleLinkPress(licenseUrl)}
            >
                License URL: {licenseUrl}
            </Text>
        </View>
    );
};

const stylesheet = createStyleSheet(({ colors, fonts }) => ({
    licenseMainContainer: {
        width: '100%',
        backgroundColor: colors.card,
        paddingVertical: (UnistylesRuntime.screen.height * 2) / 100,
        paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
        borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
        marginBottom: (UnistylesRuntime.screen.height * 2) / 100,
    },
    libraryNameText: {
        color: colors.accent,
        fontSize: 14,
        fontFamily: fonts.Nunito_Black,
        marginBottom: (UnistylesRuntime.screen.height * 0.5) / 100,
    },
    versionText: {
        fontSize: 10,
        color: colors.card_typography,
        fontFamily: fonts.Montserrat_Medium,
        marginBottom: (UnistylesRuntime.screen.height * 0.5) / 100,
    },
    licenseText: {
        fontSize: 10,
        color: colors.card_typography,
        fontFamily: fonts.Montserrat_Medium,
        marginBottom: (UnistylesRuntime.screen.height * 0.5) / 100,
    },
    repositoryText: {
        fontSize: 10,
        color: colors.accent,
        fontFamily: fonts.Montserrat_Medium,
        textDecorationLine: 'underline',
        marginBottom: (UnistylesRuntime.screen.height * 0.5) / 100,
    },
    licenseUrlText: {
        fontSize: 10,
        color: colors.accent,
        fontFamily: fonts.Montserrat_Medium,
        textDecorationLine: 'underline',
    },
}));