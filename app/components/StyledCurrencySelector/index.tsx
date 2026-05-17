import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, Modal, Pressable, ScrollView, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { StyledIcons } from '@components';
import { Constants, type CurrencyType } from '@configs';
import { useUserSettings } from '@/context/AppContext';
import { getDeviceCurrency, useBottomSheetEntrance } from '@hooks';
import Toast from 'react-native-toast-message';
import { ActionTypes } from '@/context/actionTypes';

const CurrencySelectiveScroll = ({
  currencies,
  currencyObject,
  currencySelectiveBarPress,
  isUsingSystemDefault,
  onSystemDefaultPress,
  systemDefaultCurrency,
}: {
  currencies: CurrencyType[] | undefined;
  currencyObject?: CurrencyType;
  currencySelectiveBarPress?: (currency: CurrencyType) => void;
  isUsingSystemDefault: boolean;
  onSystemDefaultPress: () => void;
  systemDefaultCurrency: CurrencyType;
}) => {
  const { styles, theme } = useStyles(stylesheet);
  const { t } = useTranslation();

  return (
    <ScrollView
      contentContainerStyle={styles.currencyScrollContainerStyles}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      {/* System Default Option */}
      <Pressable
        onPress={onSystemDefaultPress}
        style={[
          styles.modalContentCurrencyBarContainer,
          {
            borderWidth: isUsingSystemDefault ? UnistylesRuntime.hairlineWidth * 5 : 0,
            borderColor: isUsingSystemDefault ? theme.colors.accent : theme.colors.backgroundColor,
          },
        ]}
      >
        <View style={styles.currencySelectiveName}>
          <Text style={styles.modalcurrencyText}>
            {t('components.currencySelector.useSystemDefault', {
              currency: t(`currencies.${systemDefaultCurrency.currencyId}`, {
                defaultValue: systemDefaultCurrency.currencyName,
              }),
            })}
          </Text>
        </View>
        <View style={styles.currencySelectiveSign}>
          <Text style={styles.modalcurrencyText}>{systemDefaultCurrency.currencySign}</Text>
        </View>
      </Pressable>

      {/* Currency List */}
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
                !isUsingSystemDefault && currency?.currencyId === currencyObject?.currencyId
                  ? UnistylesRuntime.hairlineWidth * 5
                  : 0,
              borderColor:
                !isUsingSystemDefault && currency?.currencyId === currencyObject?.currencyId
                  ? theme.colors.accent
                  : theme.colors.backgroundColor,
            },
          ]}
        >
          <View style={styles.currencySelectiveName}>
            <Text style={styles.modalcurrencyText}>
              {t(`currencies.${currency.currencyId}`, { defaultValue: currency.currencyName })}
            </Text>
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
  isUsingSystemDefault,
  onSystemDefaultPress,
  systemDefaultCurrency,
}: {
  modalTitle?: string;
  modalDescription?: string;
  modalVisibility?: boolean;
  currencies?: CurrencyType[];
  currencyObject?: CurrencyType;
  closeButtonPress?: () => void;
  currencySelectiveBarPress?: (currency: CurrencyType) => void;
  isUsingSystemDefault: boolean;
  onSystemDefaultPress: () => void;
  systemDefaultCurrency: CurrencyType;
}) => {
  const { styles, theme } = useStyles(stylesheet);
  const { animatedStyle: sheetStyle, backdropStyle } = useBottomSheetEntrance(
    modalVisibility ?? false,
  );

  return (
    <Modal
      visible={modalVisibility}
      transparent={true}
      animationType={'none'}
      statusBarTranslucent={true}
    >
      <Animated.View style={[styles.modalBackdrop, backdropStyle]} />
      <Animated.View style={[styles.modalMainContainer, sheetStyle]}>
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
            type={'FontAwesome6'}
            name={'circle-info'}
            size={styles.modalInstructionText?.fontSize}
            color={styles.modalInstructionText?.color}
          />
          {` ${modalDescription}`}
        </Text>
        <CurrencySelectiveScroll
          currencies={currencies}
          currencyObject={currencyObject}
          currencySelectiveBarPress={currencySelectiveBarPress}
          isUsingSystemDefault={isUsingSystemDefault}
          onSystemDefaultPress={onSystemDefaultPress}
          systemDefaultCurrency={systemDefaultCurrency}
        />
      </Animated.View>
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
  const { state, dispatch } = useUserSettings();
  const { styles } = useStyles(stylesheet);
  const { t } = useTranslation();

  const [modalVisibility, setModalVisibility] = useState<boolean>(false);

  const systemDefaultCurrency = useMemo(() => getDeviceCurrency(), []);

  const isUsingSystemDefault = useMemo(
    () => state.currencyConfig === undefined,
    [state.currencyConfig],
  );

  const CurrencyObject = useMemo(
    () => state.currencyConfig || systemDefaultCurrency,
    [state.currencyConfig, systemDefaultCurrency],
  );

  const handleSystemDefaultPress = () => {
    dispatch({ type: ActionTypes.RESET_CURRENCY_TO_SYSTEM });
    setModalVisibility(false);
    Toast.show({
      type: 'success',
      text1: t('components.currencySelector.systemDefaultMessage', {
        currency: t(`currencies.${systemDefaultCurrency.currencyId}`, {
          defaultValue: systemDefaultCurrency.currencyName,
        }),
      }),
      visibilityTime: 2000,
    });
  };

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
      <View style={styles.mainCurrencyChangeContainer}>
        <View style={styles.currencyChangeTextContainer}>
          <Text style={styles.currencyChangeText}>{`${currencyChangeInstructionText}`}</Text>
        </View>
        <View style={styles.currencyBoxContainer}>
          <Pressable
            style={styles.currencyBox}
            onPress={() => setModalVisibility(prevState => !prevState)}
          >
            <Text style={styles.currencyText}>{`${CurrencyObject.currencySign}`}</Text>
          </Pressable>
        </View>
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
        isUsingSystemDefault={isUsingSystemDefault}
        onSystemDefaultPress={handleSystemDefaultPress}
        systemDefaultCurrency={systemDefaultCurrency}
        currencySelectiveBarPress={currencyObj => {
          dispatch({ type: ActionTypes.UPDATE_CURRENCY_SIGN, payload: currencyObj });
          setModalVisibility(false);
          Toast.show({
            type: 'success',
            text1: `${currencyChangeToastMessage} ${t(`currencies.${currencyObj.currencyId}`, {
              defaultValue: currencyObj.currencyName,
            })} (${currencyObj.currencySign})`,
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: (UnistylesRuntime.screen.height * 0.5) / 100,
    marginHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  currencyChangeTextContainer: {
    flex: 3,
    justifyContent: 'center',
  },
  currencyChangeText: {
    color: colors.card_typography,
    fontSize: 14,
    fontFamily: fonts.Nunito_Black,
  },
  currencyBoxContainer: {
    flex: 2,
    alignItems: 'flex-end',
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
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: utils.hexToRGBA(colors.backgroundColor, 0.5),
  },
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
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    paddingBottom: UnistylesRuntime.insets.bottom * 2,
  },
}));
