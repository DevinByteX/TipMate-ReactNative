import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';

const RoundCapsule = ({
  active = false,
  textValue = 'Up',
  onRoundCapsulePress,
}: {
  active?: boolean;
  textValue: string;
  onRoundCapsulePress?: (value: string) => void;
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
  onSelectedRound?: (value: string) => void;
}) => {
  const { styles, theme } = useStyles(styleSheet);

  const [roundValue, setRoundValue] = useState<string>('NO');

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.titleText}>{`SET ROUND`}</Text>
      <View style={styles.mainInnerContainer}>
        <RoundCapsule
          textValue="NO"
          active={roundValue == 'NO'}
          onRoundCapsulePress={value => {
            setRoundValue(value);
          }}
        />
        <RoundCapsule
          textValue="UP"
          active={roundValue == 'UP'}
          onRoundCapsulePress={value => {
            setRoundValue(value);
          }}
        />
        <RoundCapsule
          textValue="DOWN"
          active={roundValue == 'DOWN'}
          onRoundCapsulePress={value => {
            setRoundValue(value);
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
