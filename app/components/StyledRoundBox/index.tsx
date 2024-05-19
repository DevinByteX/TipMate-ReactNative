import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { RoundingMethod, RoundingMethodType } from '@hooks';

const RoundCapsule = ({
  active = false,
  textValue,
  onRoundCapsulePress,
}: {
  active?: boolean;
  textValue: RoundingMethodType;
  onRoundCapsulePress?: (value: RoundingMethodType) => void;
}) => {
  const { styles, theme } = useStyles(styleSheet);
  return (
    <Pressable
      style={[
        styles.roundCapsuleStyle,
        {
          backgroundColor: active ? theme.colors.accent : theme.colors.backgroundColor,
        },
      ]}
      onPress={() => {
        onRoundCapsulePress && onRoundCapsulePress(textValue);
      }}>
      <Text
        style={[
          styles.roundCapsuleText,
          {
            color: active ? theme.colors.card : theme.colors.card_typography,
          },
        ]}>{`${textValue}`}</Text>
    </Pressable>
  );
};

export const StyledRoundBox = ({
  onSelectedRound,
}: {
  onSelectedRound?: (value: RoundingMethodType) => void;
}) => {
  const { styles, theme } = useStyles(styleSheet);

  const [roundValue, setRoundValue] = useState<RoundingMethodType>(RoundingMethod.NO);

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.titleText}>{`ROUND VALUE`}</Text>
      <View style={styles.mainInnerContainer}>
        <RoundCapsule
          textValue="NO"
          active={roundValue == RoundingMethod.NO}
          onRoundCapsulePress={value => {
            setRoundValue(value);
            onSelectedRound && onSelectedRound(value);
          }}
        />
        <RoundCapsule
          textValue="UP"
          active={roundValue == RoundingMethod.UP}
          onRoundCapsulePress={value => {
            setRoundValue(value);
            onSelectedRound && onSelectedRound(value);
          }}
        />
        <RoundCapsule
          textValue="DOWN"
          active={roundValue == RoundingMethod.DOWN}
          onRoundCapsulePress={value => {
            setRoundValue(value);
            onSelectedRound && onSelectedRound(value);
          }}
        />
      </View>
    </View>
  );
};

const styleSheet = createStyleSheet(({ colors }) => ({
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
    fontWeight: '800',
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
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
    fontWeight: '800',
    color: colors.card_typography,
  },
}));
