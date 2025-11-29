import React, { useState } from 'react';
import { View, Text, Modal, Pressable, ScrollView } from 'react-native';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { StyledIcons } from '@components';
import { useAppContext } from '@/context/AppContext';
import Toast from 'react-native-toast-message';
import { Constants, DuplicatePreventionTimeOption } from '@configs';

const TimeOptionsList = ({
  timeOptions,
  selectedValue,
  onTimeOptionPress,
}: {
  timeOptions: DuplicatePreventionTimeOption[];
  selectedValue: number;
  onTimeOptionPress?: (option: DuplicatePreventionTimeOption) => void;
}) => {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <ScrollView
      contentContainerStyle={styles.timeOptionsScrollContainerStyles}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      {timeOptions.map(option => (
        <Pressable
          onPress={() => {
            if (onTimeOptionPress) {
              onTimeOptionPress(option);
            }
          }}
          key={option.value}
          style={[
            styles.modalContentTimeOptionBarContainer,
            {
              borderWidth: option.value === selectedValue ? UnistylesRuntime.hairlineWidth * 5 : 0,
              borderColor:
                option.value === selectedValue ? theme.colors.accent : theme.colors.backgroundColor,
            },
          ]}
        >
          <View style={styles.timeOptionLabelContainer}>
            <Text style={styles.modalTimeOptionText}>{option.label}</Text>
          </View>
          {option.value === selectedValue && (
            <StyledIcons
              type={'MaterialDesignIcons'}
              name={'check-circle'}
              size={styles.modalTimeOptionText.fontSize * 1.5}
              color={theme.colors.accent}
            />
          )}
        </Pressable>
      ))}
    </ScrollView>
  );
};

const TimeOptionsModal = ({
  modalTitle,
  modalDescription,
  modalVisibility,
  selectedValue,
  closeButtonPress,
  onTimeOptionPress,
}: {
  modalTitle?: string;
  modalDescription?: string;
  modalVisibility?: boolean;
  selectedValue: number;
  closeButtonPress?: () => void;
  onTimeOptionPress?: (option: DuplicatePreventionTimeOption) => void;
}) => {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <Modal
      visible={modalVisibility}
      transparent={true}
      animationType={'slide'}
      presentationStyle="fullScreen"
      statusBarTranslucent={true}
    >
      <View style={styles.modalMainContainer}>
        <View style={styles.modalTitleAndCloseButtonContainer}>
          <Text style={styles.modalTitle}>
            {modalTitle}
            <Text style={{ color: theme.colors.card_typography }}>
              {` · ${
                Constants.duplicatePreventionTimeOptions.find(opt => opt.value === selectedValue)
                  ?.label
              }`}
            </Text>
          </Text>
          <Pressable onPress={closeButtonPress}>
            <StyledIcons
              type={'Ionicons'}
              name={'close'}
              size={styles.modalTitle.fontSize * 1.5}
              color={theme.colors.card_typography}
            />
          </Pressable>
        </View>
        <Text style={styles.modalInstructionText}>
          <StyledIcons
            type={'FontAwesome6'}
            name={'circle-info'}
            size={styles.modalInstructionText?.fontSize}
            color={styles.modalInstructionText?.color}
          />
          {` ${modalDescription}`}
        </Text>
        <TimeOptionsList
          timeOptions={Constants.duplicatePreventionTimeOptions}
          selectedValue={selectedValue}
          onTimeOptionPress={onTimeOptionPress}
        />
      </View>
    </Modal>
  );
};

export const StyledDuplicatePreventionSelector = ({
  title,
  description,
  selectionInstructionText,
  modalTitle,
  modalDescription,
  changeToastMessage,
}: {
  title: string;
  description: string;
  selectionInstructionText: string;
  modalTitle?: string;
  modalDescription?: string;
  changeToastMessage?: string;
}) => {
  const { state, dispatch } = useAppContext();
  const { styles } = useStyles(stylesheet);

  const [modalVisibility, setModalVisibility] = useState<boolean>(false);

  const selectedValue = state.duplicatePreventionWindow;
  const selectedOption = Constants.duplicatePreventionTimeOptions.find(
    opt => opt.value === selectedValue,
  );

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.titleText}>{`${title}`}</Text>
      <Text style={styles.instructionText}>
        <StyledIcons
          type={'FontAwesome6'}
          name={'circle-info'}
          size={styles.instructionText?.fontSize}
          color={styles.instructionText?.color}
        />
        {` ${description}`}
      </Text>
      <View style={styles.mainSelectionChangeContainer}>
        <Text style={styles.selectionChangeText}>{`${selectionInstructionText}`}</Text>
        <Pressable
          style={styles.selectionBox}
          onPress={() => setModalVisibility(prevState => !prevState)}
        >
          <Text style={styles.selectionText}>{selectedOption?.label || '15 minutes'}</Text>
        </Pressable>
      </View>
      <TimeOptionsModal
        modalVisibility={modalVisibility}
        closeButtonPress={() => {
          setModalVisibility(prevState => !prevState);
        }}
        modalTitle={modalTitle}
        modalDescription={modalDescription}
        selectedValue={selectedValue}
        onTimeOptionPress={option => {
          dispatch({ type: 'UPDATE_DUPLICATE_PREVENTION_WINDOW', payload: option.value });
          Toast.show({
            type: 'success',
            text1: `${changeToastMessage} ${option.label}`,
            visibilityTime: 2000,
          });
        }}
      />
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts, utils }) => ({
  mainContainer: {
    marginTop: (UnistylesRuntime.screen.height * 2) / 100,
    width: '100%',
    backgroundColor: colors.card,
    paddingVertical: (UnistylesRuntime.screen.height * 2) / 100,
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
  modalInstructionText: {
    fontSize: 10,
    color: colors.card_typography,
    fontFamily: fonts.Montserrat_Medium,
    marginBottom: (UnistylesRuntime.screen.height * 2) / 100,
    marginHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  mainSelectionChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: (UnistylesRuntime.screen.height * 0.5) / 100,
    marginHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  selectionChangeText: {
    color: colors.card_typography,
    fontSize: 14,
    fontFamily: fonts.Nunito_Black,
    flex: 1,
  },
  selectionBox: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: (UnistylesRuntime.screen.width * 30) / 100,
    backgroundColor: colors.backgroundColor,
    paddingHorizontal: (UnistylesRuntime.screen.width * 3) / 100,
    height: (UnistylesRuntime.screen.height * 4) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
  },
  selectionText: {
    fontSize: 14,
    fontFamily: fonts.Montserrat_Black,
    color: colors.accent,
  },

  // Modal contents
  modalMainContainer: {
    height: (UnistylesRuntime.screen.height * 50) / 100,
    width: '100%',
    borderRadius: (UnistylesRuntime.screen.width * 5) / 100,
    borderWidth: UnistylesRuntime.hairlineWidth * 2,
    borderColor: colors.accent,
    backgroundColor: utils.hexToRGBA(colors.card, 0.95),
    bottom: 0,
    position: 'absolute',
  },
  modalTitleAndCloseButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    paddingTop: (UnistylesRuntime.screen.height * 2) / 100,
    paddingBottom: (UnistylesRuntime.screen.height * 0.5) / 100,
  },
  modalTitle: {
    color: colors.accent,
    fontSize: 14,
    fontFamily: fonts.Nunito_Black,
    flex: 1,
  },
  modalContentTimeOptionBarContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: (UnistylesRuntime.screen.height * 1.25) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    backgroundColor: colors.backgroundColor,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    alignItems: 'center',
  },
  modalTimeOptionText: {
    fontSize: 14,
    fontFamily: fonts.Montserrat_Black,
    color: colors.card_typography,
  },
  timeOptionLabelContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: (UnistylesRuntime.screen.height * 0.5) / 100,
  },
  timeOptionsScrollContainerStyles: {
    gap: (UnistylesRuntime.screen.height * 1) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    paddingBottom: UnistylesRuntime.insets.bottom * 2,
  },
}));
