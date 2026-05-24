import React from 'react';
import { View, Text } from 'react-native';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { StyledIcons, StyledToggle } from '@components';
import { useUserSettings } from '@/context/AppContext';
import { setShowTaxInput } from '@/context/actionCreators';

export const StyledTaxSettingsRow = ({
  title,
  description,
  toggleText,
}: {
  title: string;
  description: string;
  toggleText?: string;
}) => {
  const { styles } = useStyles(stylesheet);
  const { state, dispatch } = useUserSettings();

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.titleText}>{title}</Text>
      <Text style={styles.instructionText}>
        <StyledIcons
          type={'FontAwesome6'}
          name={'circle-info'}
          size={styles.instructionText?.fontSize}
          color={styles.instructionText?.color}
        />
        {` ${description}`}
      </Text>
      <View style={styles.toggleRow}>
        {toggleText ? (
          <View style={styles.toggleTextContainer}>
            <Text style={styles.toggleText}>{toggleText}</Text>
          </View>
        ) : null}
        <View style={styles.toggleButtonContainer}>
          <StyledToggle
            value={state.showTaxInput}
            onValueChange={value => dispatch(setShowTaxInput(value))}
          />
        </View>
      </View>
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts, typography }) => ({
  mainContainer: {
    marginTop: (UnistylesRuntime.screen.height * 2) / 100,
    width: '100%',
    backgroundColor: colors.card,
    paddingTop: (UnistylesRuntime.screen.height * 2) / 100,
    paddingBottom: (UnistylesRuntime.screen.height * 1) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
  },
  titleText: {
    color: colors.accent,
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
    fontFamily: fonts.Nunito_Black,
    marginHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  instructionText: {
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
    color: colors.card_typography,
    fontFamily: fonts.Montserrat_Medium,
    marginTop: (UnistylesRuntime.screen.height * 0.5) / 100,
    marginBottom: (UnistylesRuntime.screen.height * 0.5) / 100,
    marginHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: (UnistylesRuntime.screen.height * 0.5) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  toggleTextContainer: {
    flex: 1,
  },
  toggleText: {
    color: colors.card_typography,
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
    fontFamily: fonts.Nunito_Black,
  },
  toggleButtonContainer: {
    marginLeft: 'auto' as const,
  },
}));
