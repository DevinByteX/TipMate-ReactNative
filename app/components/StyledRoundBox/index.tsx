import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { RoundingMethod, RoundingMethodType, DisabledRoundingMethodsType } from '@hooks';
import { IconTypeMap, StyledIcons, StyledIconTypesKey } from '@components';

type RoundCapsuleProps = {
  active?: boolean;
  textValue: RoundingMethodType;
  iconType?: StyledIconTypesKey;
  iconName?: React.ComponentProps<IconTypeMap[StyledIconTypesKey]>['name'];
  disabled?: boolean;
  onRoundCapsulePress?: (value: RoundingMethodType) => void;
};

const RoundCapsule = ({
  active = false,
  textValue,
  iconType = 'FontAwesome6',
  iconName = 'circle',
  disabled = false,
  onRoundCapsulePress,
}: RoundCapsuleProps) => {
  const { styles, theme } = useStyles(styleSheet);

  const TextColor = disabled
    ? theme.colors.disable_text
    : active
    ? theme.colors.card
    : theme.colors.card_typography;

  return (
    <Pressable
      style={[
        styles.roundCapsuleStyle,
        {
          backgroundColor: disabled
            ? theme.colors.disable_button
            : active
            ? theme.colors.accent
            : theme.colors.backgroundColor,
        },
      ]}
      onPress={() => {
        onRoundCapsulePress && onRoundCapsulePress(textValue);
      }}
      disabled={disabled}
    >
      <Text
        style={[
          styles.roundCapsuleText,
          {
            color: TextColor,
          },
        ]}
      >
        {`${textValue} `}
        <StyledIcons
          type={iconType}
          name={iconName}
          size={styles.roundCapsuleText?.fontSize}
          color={TextColor}
        />
      </Text>
    </Pressable>
  );
};

export const StyledRoundBox = ({
  titleText = 'ROUND VALUE',
  description,
  roundMethod = RoundingMethod.NO,
  disablingRoundingMethod,
  onSelectedRound,
}: {
  titleText?: string;
  description: string;
  roundMethod?: RoundingMethodType;
  disablingRoundingMethod?: DisabledRoundingMethodsType;
  onSelectedRound?: (value: RoundingMethodType) => void;
}) => {
  const { styles } = useStyles(styleSheet);

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.titleText}>{`${titleText}`}</Text>
      <Text style={styles.instructionText}>
        <StyledIcons
          type={'FontAwesome6'}
          name={'circle-info'}
          size={styles.instructionText?.fontSize}
        />
        {` ${description}`}
      </Text>
      <View style={styles.mainInnerContainer}>
        <RoundCapsule
          textValue="NO"
          disabled={disablingRoundingMethod?.NO}
          active={roundMethod == RoundingMethod.NO}
          iconType="FontAwesome6"
          iconName={'circle-dot'}
          onRoundCapsulePress={value => {
            onSelectedRound && onSelectedRound(value);
          }}
        />
        <RoundCapsule
          textValue="UP"
          disabled={disablingRoundingMethod?.UP}
          active={roundMethod == RoundingMethod.UP}
          iconType="FontAwesome6"
          iconName={'circle-up'}
          onRoundCapsulePress={value => {
            onSelectedRound && onSelectedRound(value);
          }}
        />
        <RoundCapsule
          textValue="DOWN"
          disabled={disablingRoundingMethod?.DOWN}
          active={roundMethod == RoundingMethod.DOWN}
          iconType="FontAwesome6"
          iconName={'circle-down'}
          onRoundCapsulePress={value => {
            onSelectedRound && onSelectedRound(value);
          }}
        />
      </View>
    </View>
  );
};

const styleSheet = createStyleSheet(({ colors, fonts }) => ({
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
    fontSize: 14,
    fontFamily: fonts.Nunito_Black,
    marginHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  instructionText: {
    fontSize: 10,
    color: colors.card_typography,
    fontFamily: fonts.Montserrat_Medium,
    marginVertical: (UnistylesRuntime.screen.height * 0.5) / 100,
    marginHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  mainInnerContainer: {
    flexDirection: 'row',
    paddingVertical: (UnistylesRuntime.screen.height * 1) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    columnGap: (UnistylesRuntime.screen.width * 2) / 100,
  },
  roundCapsuleStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    height: (UnistylesRuntime.screen.height * 4) / 100,
  },
  roundCapsuleText: {
    fontSize: 14,
    fontFamily: fonts.Montserrat_Black,
    color: colors.card_typography,
  },
}));
