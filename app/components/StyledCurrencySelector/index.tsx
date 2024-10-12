import React, { useState } from 'react';
import { View, Text, Modal, Pressable, ScrollView } from 'react-native';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { StyledIcons } from '@components';

const currencies = [
  { currencyId: 'AED', currencyName: 'UAE Dirham', currencySign: 'AED' },
  { currencyId: 'ARS', currencyName: 'Argentine Peso', currencySign: 'ARS' },
  { currencyId: 'AUD', currencyName: 'Australian Dollar', currencySign: '$' },
  { currencyId: 'BDT', currencyName: 'Bangladeshi Taka', currencySign: '৳' },
  { currencyId: 'BHD', currencyName: 'Bahraini Dinar', currencySign: 'BHD' },
  { currencyId: 'BRL', currencyName: 'Brazilian Real', currencySign: 'R$' },
  { currencyId: 'CAD', currencyName: 'Canadian Dollar', currencySign: '$' },
  { currencyId: 'CHF', currencyName: 'Swiss Franc', currencySign: 'CHF' },
  { currencyId: 'CLP', currencyName: 'Chilean Peso', currencySign: 'CLP' },
  { currencyId: 'CNY', currencyName: 'Chinese Yuan', currencySign: '¥' },
  { currencyId: 'EGP', currencyName: 'Egyptian Pound', currencySign: '£' },
  { currencyId: 'EUR', currencyName: 'Euro', currencySign: '€' },
  { currencyId: 'GHS', currencyName: 'Ghanaian Cedi', currencySign: 'GHS' },
  { currencyId: 'GBP', currencyName: 'British Pound Sterling', currencySign: '£' },
  { currencyId: 'IDR', currencyName: 'Indonesian Rupiah', currencySign: 'Rp' },
  { currencyId: 'ILS', currencyName: 'Israeli New Shekel', currencySign: '₪' },
  { currencyId: 'INR', currencyName: 'Indian Rupee', currencySign: '₹' },
  { currencyId: 'JOD', currencyName: 'Jordanian Dinar', currencySign: 'JOD' },
  { currencyId: 'JPY', currencyName: 'Japanese Yen', currencySign: '¥' },
  { currencyId: 'KES', currencyName: 'Kenyan Shilling', currencySign: 'KES' },
  { currencyId: 'KRW', currencyName: 'South Korean Won', currencySign: '₩' },
  { currencyId: 'KWD', currencyName: 'Kuwaiti Dinar', currencySign: 'KWD' },
  { currencyId: 'LKR', currencyName: 'Sri Lankan Rupee', currencySign: 'LKR' },
  { currencyId: 'MXN', currencyName: 'Mexican Peso', currencySign: '$' },
  { currencyId: 'MYR', currencyName: 'Malaysian Ringgit', currencySign: 'RM' },
  { currencyId: 'NGN', currencyName: 'Nigerian Naira', currencySign: '₦' },
  { currencyId: 'NZD', currencyName: 'New Zealand Dollar', currencySign: '$' },
  { currencyId: 'OMR', currencyName: 'Omani Rial', currencySign: 'OMR' },
  { currencyId: 'PHP', currencyName: 'Philippine Peso', currencySign: '₱' },
  { currencyId: 'PKR', currencyName: 'Pakistani Rupee', currencySign: '₨' },
  { currencyId: 'QAR', currencyName: 'Qatari Riyal', currencySign: 'QAR' },
  { currencyId: 'RUB', currencyName: 'Russian Ruble', currencySign: '₽' },
  { currencyId: 'SAR', currencyName: 'Saudi Riyal', currencySign: 'SAR' },
  { currencyId: 'SGD', currencyName: 'Singapore Dollar', currencySign: '$' },
  { currencyId: 'THB', currencyName: 'Thai Baht', currencySign: '฿' },
  { currencyId: 'TRY', currencyName: 'Turkish Lira', currencySign: '₺' },
  { currencyId: 'TZS', currencyName: 'Tanzanian Shilling', currencySign: 'TZS' },
  { currencyId: 'UGX', currencyName: 'Ugandan Shilling', currencySign: 'UGX' },
  { currencyId: 'USD', currencyName: 'US Dollar', currencySign: '$' },
  { currencyId: 'VND', currencyName: 'Vietnamese Dong', currencySign: '₫' },
  { currencyId: 'ZAR', currencyName: 'South African Rand', currencySign: 'R' },
];

type CurrencyType = {
  currencyId: string;
  currencyName: string;
  currencySign: string;
};

const CurrencySelectiveScroll = ({ currencies }: { currencies: CurrencyType[] }) => {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <ScrollView
      contentContainerStyle={styles.currencyScrollContainerStyles}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}>
      {currencies.map(currency => (
        <View key={currency.currencyId} style={styles.modalContentCurrencyBarContainer}>
          <View style={styles.currencySelectiveName}>
            <Text style={styles.modalcurrencyText}>{currency.currencyName}</Text>
          </View>
          <View style={styles.currencySelectiveSign}>
            <Text style={styles.modalcurrencyText}>{currency.currencySign}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const CurrencyListModal = ({
  modalVisibility,
  closeButtonPress,
}: {
  modalVisibility?: boolean;
  closeButtonPress?: () => void;
}) => {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <Modal visible={modalVisibility} transparent={true} animationType={'slide'}>
      <View style={styles.modalMainContainer}>
        <View style={styles.modalTitleAndCloseButtonContainer}>
          <Text style={styles.modalTitle}>{`SELECT YOUR CURRENCY`}</Text>
          <Pressable onPress={closeButtonPress}>
            <StyledIcons
              type={'Ionicons'}
              name={'close'}
              size={24}
              color={theme.colors.card_typography}
            />
          </Pressable>
        </View>
        <View style={styles.modalContentContainer}>
          <CurrencySelectiveScroll currencies={currencies} />
        </View>
      </View>
    </Modal>
  );
};

export const StyledCurrencySelector = ({
  title,
  description,
  currencyChangeInstructionText,
  currencyText,
}: {
  title: string;
  description: string;
  currencyChangeInstructionText: string;
  currencyText: string;
}) => {
  const { styles } = useStyles(stylesheet);

  const [modalVisibility, setModalVisibility] = useState<boolean>(false);

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
          <Text style={styles.currencyText}>{`${currencyText}`}</Text>
        </Pressable>
      </View>
      <CurrencyListModal
        modalVisibility={modalVisibility}
        closeButtonPress={() => {
          setModalVisibility(prevState => !prevState);
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
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    paddingVertical: (UnistylesRuntime.screen.height * 2) / 100,
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
