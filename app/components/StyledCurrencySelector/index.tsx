import React, { useContext, useState } from 'react';
import { View, Text, Modal, Pressable, ScrollView } from 'react-native';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { StyledIcons } from '@components';
import { Constants, type CurrencyType } from '@configs';
import { AppContext } from '@/context/AppContext';
import Toast from 'react-native-toast-message';

const CurrencySelectiveScroll = ({
  currencies,
  currencyObject,
  currencySelectiveBarPress,
}: {
  currencies: CurrencyType[] | undefined;
  currencyObject?: CurrencyType;
  currencySelectiveBarPress?: (currency: CurrencyType) => void;
}) => {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <ScrollView
      contentContainerStyle={styles.currencyScrollContainerStyles}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}>
      {currencies?.map(currency => (
        <Pressable
          onPress={() => {
            if (currencySelectiveBarPress) {
              currencySelectiveBarPress(currency);
            }
          }}
          key={currency.currencyId}
          style={[
            styles.modalContentCurrencyBarContainer,
            {
              borderWidth:
                currency?.currencyId === currencyObject?.currencyId
                  ? UnistylesRuntime.hairlineWidth * 5
                  : 0,
              borderColor:
                currency?.currencyId === currencyObject?.currencyId
                  ? theme.colors.accent
                  : theme.colors.backgroundColor,
            },
          ]}>
          <View style={styles.currencySelectiveName}>
            <Text style={styles.modalcurrencyText}>{currency.currencyName}</Text>
          </View>
          <View style={styles.currencySelectiveSign}>
            <Text style={styles.modalcurrencyText}>{currency.currencySign}</Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
};

const CurrencyListModal = ({
  modalTitle,
  modalDescription,
  modalVisibility,
  currencies,
  currencyObject,
  closeButtonPress,
  currencySelectiveBarPress,
}: {
  modalTitle?: string;
  modalDescription?: string;
  modalVisibility?: boolean;
  currencies?: CurrencyType[];
  currencyObject?: CurrencyType;
  closeButtonPress?: () => void;
  currencySelectiveBarPress?: (currency: CurrencyType) => void;
}) => {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <Modal visible={modalVisibility} transparent={true} animationType={'slide'}>
      <View style={styles.modalMainContainer}>
        <View style={styles.modalTitleAndCloseButtonContainer}>
          <Text style={styles.modalTitle}>
            {modalTitle}
            {currencyObject?.currencySign ? (
              <Text>{` · ${currencyObject?.currencySign}`}</Text>
            ) : null}
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
            type={'FontAwesome5'}
            name={'info-circle'}
            size={styles.modalInstructionText?.fontSize}
          />
          {` ${modalDescription}`}
        </Text>
        <View style={styles.modalContentContainer}>
          <CurrencySelectiveScroll
            currencies={currencies}
            currencyObject={currencyObject}
            currencySelectiveBarPress={currencySelectiveBarPress}
          />
        </View>
      </View>
    </Modal>
  );
};

export const StyledCurrencySelector = ({
  title,
  description,
  currencyChangeInstructionText,
  modalTitle,
  modalDescription,
  currencyChangeToastMessage,
}: {
  title: string;
  description: string;
  currencyChangeInstructionText: string;
  modalTitle?: string;
  modalDescription?: string;
  currencyChangeToastMessage?: string;
}) => {
  const { state, dispatch } = useContext(AppContext);
  const { styles } = useStyles(stylesheet);

  const [modalVisibility, setModalVisibility] = useState<boolean>(false);

  const CurrencyObject = state.currencyConfig;

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.titleText}>{`${title}`}</Text>
      <Text style={styles.instructionText}>
        <StyledIcons
          type={'FontAwesome5'}
          name={'info-circle'}
          size={styles.instructionText?.fontSize}
        />
        {` ${description}`}
      </Text>
      <View style={styles.mainCurrencyChangeContainer}>
        <Text style={styles.currencyChangeText}>{`${currencyChangeInstructionText}`}</Text>
        <Pressable
          style={styles.currencyBox}
          onPress={() => setModalVisibility(prevState => !prevState)}>
          <Text style={styles.currencyText}>{`${CurrencyObject.currencySign}`}</Text>
        </Pressable>
      </View>
      <CurrencyListModal
        modalVisibility={modalVisibility}
        closeButtonPress={() => {
          setModalVisibility(prevState => !prevState);
        }}
        modalTitle={modalTitle}
        modalDescription={modalDescription}
        currencies={Constants.currencies}
        currencyObject={CurrencyObject}
        currencySelectiveBarPress={currencyObj => {
          dispatch({ type: 'UPDATE_CURRENCY_SIGN', payload: currencyObj });
          Toast.show({
            type: 'success',
            text1: `${currencyChangeToastMessage} ${currencyObj.currencyName} (${currencyObj.currencySign})`,
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
  mainCurrencyChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: (UnistylesRuntime.screen.height * 0.5) / 100,
    marginHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  currencyChangeText: {
    color: colors.card_typography,
    fontSize: 14,
    fontFamily: fonts.Nunito_Black,
  },
  currencyBox: {
    justifyContent: 'center',
    alignItems: 'center',
    width: (UnistylesRuntime.screen.width * 20) / 100,
    backgroundColor: colors.backgroundColor,
    height: (UnistylesRuntime.screen.height * 4) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
  },
  currencyText: {
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
    bottom: -(UnistylesRuntime.insets.bottom * 0.2), // Minus
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
  },
  modalContentContainer: {
    width: '100%',
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  modalContentCurrencyBarContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: (UnistylesRuntime.screen.height * 1.25) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    backgroundColor: colors.backgroundColor,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
  },
  modalcurrencyText: {
    fontSize: 14,
    fontFamily: fonts.Montserrat_Black,
    color: colors.card_typography,
  },
  currencySelectiveName: {
    flex: 4,
    justifyContent: 'center',
    paddingVertical: (UnistylesRuntime.screen.height * 0.5) / 100,
  },
  currencySelectiveSign: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: (UnistylesRuntime.screen.height * 0.5) / 100,
  },
  currencyScrollContainerStyles: {
    gap: (UnistylesRuntime.screen.height * 1) / 100,
    paddingBottom: UnistylesRuntime.insets.bottom * 3,
  },
}));
