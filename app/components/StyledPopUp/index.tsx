import React from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type StyledPopUpTypes = {
  popUpVisibility?: boolean;
  modalTitle?: string;
  modalSubtitle?: string;
  lineButtonText?: string;
  solidButtonText?: string;
  onLineButtonPress?: () => void;
  onSolidButtonPress?: () => void;
};

export const StyledPopUp = ({
  popUpVisibility = false,
  modalTitle,
  modalSubtitle,
  lineButtonText,
  solidButtonText,
  onLineButtonPress,
  onSolidButtonPress,
}: StyledPopUpTypes) => {
  return (
    <View style={styles.centeredView}>
      <Modal visible={popUpVisibility} transparent={true} animationType={'fade'}>
        <View style={styles.centeredView}>
          <View style={styles.modalContents}>
            <Text style={styles.modalTitle}>{`${modalTitle}`}</Text>
            <Text style={styles.modalSubtitle}>{`${modalSubtitle}`}</Text>
            <View style={styles.buttonContainer}>
              <Pressable
                style={styles.lineButton}
                onPress={() => {
                  onLineButtonPress && onLineButtonPress();
                }}
              >
                <Text style={styles.lineButtonText}>{`${lineButtonText}`}</Text>
              </Pressable>
              <Pressable
                style={styles.solidButton}
                onPress={() => {
                  onSolidButtonPress && onSolidButtonPress();
                }}
              >
                <Text style={styles.solidButtonText}>{`${solidButtonText}`}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create(({ colors, fonts, utils }, runtime) => ({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: utils.hexToRGBA(colors.backgroundColor, 0.85),
  },
  modalContents: {
    backgroundColor: colors.card,
    width: (runtime.screen.width * 90) / 100,
    paddingVertical: (runtime.screen.height * 2) / 100,
    borderRadius: (runtime.screen.width * 2) / 100,
    borderColor: colors.backgroundColor,
    borderWidth: StyleSheet.hairlineWidth,
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
    marginTop: (runtime.screen.height * 1) / 100,
    marginHorizontal: (runtime.screen.width * 5) / 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: (runtime.screen.height * 1.5) / 100,
    marginBottom: (runtime.screen.height * 0.5) / 100,
    marginHorizontal: (runtime.screen.width * 5) / 100,
    columnGap: (runtime.screen.width * 5) / 100,
  },
  lineButton: {
    flex: 1,
    height: (runtime.screen.height * 4) / 100,
    borderRadius: (runtime.screen.height * 1) / 100,
    borderColor: colors.card_typography,
    borderWidth: StyleSheet.hairlineWidth * 2,
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
    height: (runtime.screen.height * 4) / 100,
    borderRadius: (runtime.screen.height * 1) / 100,
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
