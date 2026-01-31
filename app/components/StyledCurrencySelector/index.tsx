import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, Modal, Pressable, ScrollView } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { StyledIcons } from '@components';
import { Constants, type CurrencyType } from '@configs';
import { useAppContext } from '@/context/AppContext';
import { getDeviceCurrency } from '@hooks';
import Toast from 'react-native-toast-message';

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
  const { theme } = useUnistyles();
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
            borderWidth: isUsingSystemDefault ? StyleSheet.hairlineWidth * 5 : 0,
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
                  ? StyleSheet.hairlineWidth * 5
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
  const { theme } = useUnistyles();

  return (
    <Modal
      visible={modalVisibility}
      transparent={true}
      animationType={'slide'}
      statusBarTranslucent={true}
    >
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
  const { state, dispatch } = useAppContext();
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
    dispatch({ type: 'RESET_CURRENCY_TO_SYSTEM' });
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
        <Text style={styles.currencyChangeText}>{`${currencyChangeInstructionText}`}</Text>
        <Pressable
          style={styles.currencyBox}
          onPress={() => setModalVisibility(prevState => !prevState)}
        >
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
        isUsingSystemDefault={isUsingSystemDefault}
        onSystemDefaultPress={handleSystemDefaultPress}
        systemDefaultCurrency={systemDefaultCurrency}
        currencySelectiveBarPress={currencyObj => {
          dispatch({ type: 'UPDATE_CURRENCY_SIGN', payload: currencyObj });
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

const styles = StyleSheet.create(({ colors, fonts, utils }, rt) => ({
  mainContainer: {
    marginTop: (rt.screen.height * 2) / 100,
    width: '100%',
    backgroundColor: colors.card,
    paddingVertical: (rt.screen.height * 2) / 100,
    borderRadius: (rt.screen.height * 1) / 100,
  },
  titleText: {
    color: colors.accent,
    fontSize: 14,
    fontFamily: fonts.Nunito_Black,
    marginHorizontal: (rt.screen.width * 5) / 100,
  },
  instructionText: {
    fontSize: 10,
    color: colors.card_typography,
    fontFamily: fonts.Montserrat_Medium,
    marginVertical: (rt.screen.height * 0.5) / 100,
    marginHorizontal: (rt.screen.width * 5) / 100,
  },
  modalInstructionText: {
    fontSize: 10,
    color: colors.card_typography,
    fontFamily: fonts.Montserrat_Medium,
    marginBottom: (rt.screen.height * 2) / 100,
    marginHorizontal: (rt.screen.width * 5) / 100,
  },
  mainCurrencyChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: (rt.screen.height * 0.5) / 100,
    marginHorizontal: (rt.screen.width * 5) / 100,
  },
  currencyChangeText: {
    color: colors.card_typography,
    fontSize: 14,
    fontFamily: fonts.Nunito_Black,
  },
  currencyBox: {
    justifyContent: 'center',
    alignItems: 'center',
    width: (rt.screen.width * 20) / 100,
    backgroundColor: colors.backgroundColor,
    height: (rt.screen.height * 4) / 100,
    borderRadius: (rt.screen.height * 1) / 100,
  },
  currencyText: {
    fontSize: 14,
    fontFamily: fonts.Montserrat_Black,
    color: colors.accent,
  },

  // Modal contents
  modalMainContainer: {
    height: (rt.screen.height * 50) / 100,
    width: '100%',
    borderRadius: (rt.screen.width * 5) / 100,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.accent,
    backgroundColor: utils.hexToRGBA(colors.card, 0.95),
    bottom: 0,
    position: 'absolute',
  },
  modalTitleAndCloseButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: (rt.screen.width * 5) / 100,
    paddingTop: (rt.screen.height * 2) / 100,
    paddingBottom: (rt.screen.height * 0.5) / 100,
  },
  modalTitle: {
    color: colors.accent,
    fontSize: 14,
    fontFamily: fonts.Nunito_Black,
  },
  modalContentCurrencyBarContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: (rt.screen.height * 1.25) / 100,
    paddingHorizontal: (rt.screen.width * 5) / 100,
    backgroundColor: colors.backgroundColor,
    borderRadius: (rt.screen.height * 1) / 100,
  },
  modalcurrencyText: {
    fontSize: 14,
    fontFamily: fonts.Montserrat_Black,
    color: colors.card_typography,
  },
  currencySelectiveName: {
    flex: 4,
    justifyContent: 'center',
    paddingVertical: (rt.screen.height * 0.5) / 100,
  },
  currencySelectiveSign: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: (rt.screen.height * 0.5) / 100,
  },
  currencyScrollContainerStyles: {
    gap: (rt.screen.height * 1) / 100,
    paddingHorizontal: (rt.screen.width * 5) / 100,
    paddingBottom: rt.insets.bottom * 2,
  },
}));
