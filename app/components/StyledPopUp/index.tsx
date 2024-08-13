import React from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';

export const StyledPopUp = () => {
  const { styles, theme } = useStyles(stylesheet);
  return (
    <View style={styles.centeredView}>
      <Modal visible={true} transparent={true} animationType={'slide'}>
        <View style={styles.centeredView}>
          <View style={styles.modalContents}>
            <Text style={styles.modalTitle}>{`${'Confirm Reset'}`}</Text>
            <Text style={styles.modalSubtitle}>
              {`${'Are you sure you want to reset all option values? This action cannot be undone.'}`}
            </Text>
            <View style={styles.buttonContainer}>
              <Pressable style={styles.lineButton}>
                <Text style={styles.lineButtonText}>{`${'Cancel'}`}</Text>
              </Pressable>
              <Pressable style={styles.solidButton}>
                <Text style={styles.solidButtonText}>{`${'Reset'}`}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts, utils }) => ({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: utils.hexToRGBA(colors.backgroundColor, 0.75),
  },
  modalContents: {
    backgroundColor: colors.card,
    width: (UnistylesRuntime.screen.width * 90) / 100,
    paddingVertical: (UnistylesRuntime.screen.height * 2) / 100,
    borderRadius: (UnistylesRuntime.screen.width * 2) / 100,
    borderColor: colors.backgroundColor,
    borderWidth: UnistylesRuntime.hairlineWidth,
  },
  modalTitle: {
    fontFamily: fonts.Nunito_Black,
    fontSize: 16,
    color: colors.accent,
    alignSelf: 'center',
  },
  modalSubtitle: {
    fontSize: 10,
    color: colors.card_typography,
    fontFamily: fonts.Montserrat_Medium,
    textAlign: 'center',
    marginTop: (UnistylesRuntime.screen.height * 1) / 100,
    marginHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: (UnistylesRuntime.screen.height * 1.5) / 100,
    marginBottom: (UnistylesRuntime.screen.height * 0.5) / 100,
    marginHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    columnGap: (UnistylesRuntime.screen.width * 5) / 100,
  },
  lineButton: {
    flex: 1,
    height: (UnistylesRuntime.screen.height * 4) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    borderColor: colors.card_typography,
    borderWidth: UnistylesRuntime.hairlineWidth * 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineButtonText: {
    fontSize: 14,
    fontFamily: fonts.Montserrat_Black,
    color: colors.card_typography,
  },
  solidButton: {
    flex: 1,
    height: (UnistylesRuntime.screen.height * 4) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  solidButtonText: {
    fontSize: 14,
    fontFamily: fonts.Montserrat_Black,
    color: colors.card,
  },
}));
