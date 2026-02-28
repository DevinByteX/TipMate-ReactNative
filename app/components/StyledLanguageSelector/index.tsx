import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, Modal, Pressable, ScrollView, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { useTranslation } from 'react-i18next';
import { StyledIcons, StyledAlert } from '@components';
import { useAppContext } from '@/context/AppContext';
import Toast from 'react-native-toast-message';
import { useBottomSheetEntrance } from '@hooks';
import {
  SUPPORTED_LANGUAGES,
  changeLanguage,
  isRTLLanguage,
  useRTL,
  i18n,
  getCurrentLanguage,
  getDeviceLanguage,
  getLanguageConfig,
  type LanguageConfig,
} from '@/localization';

const LanguageSelectiveScroll = ({
  languages,
  currentLanguage,
  onLanguageSelect,
  isUsingSystemDefault,
  onSystemDefaultPress,
  systemDefaultLanguage,
}: {
  languages: LanguageConfig[];
  currentLanguage: string;
  onLanguageSelect: (language: LanguageConfig) => void;
  isUsingSystemDefault: boolean;
  onSystemDefaultPress: () => void;
  systemDefaultLanguage: LanguageConfig | undefined;
}) => {
  const { styles, theme } = useStyles(stylesheet);
  const { t } = useTranslation();

  return (
    <ScrollView
      contentContainerStyle={styles.languageScrollContainerStyles}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      {systemDefaultLanguage && (
        <Pressable
          onPress={onSystemDefaultPress}
          style={[
            styles.modalContentLanguageBarContainer,
            {
              borderWidth: isUsingSystemDefault ? UnistylesRuntime.hairlineWidth * 5 : 0,
              borderColor: isUsingSystemDefault
                ? theme.colors.accent
                : theme.colors.backgroundColor,
            },
          ]}
        >
          <View style={styles.languageSelectiveNativeName}>
            <Text style={styles.modalLanguageText}>
              {t('components.languageSelector.useSystemDefault', {
                language: systemDefaultLanguage.nativeName,
              })}
            </Text>
          </View>
        </Pressable>
      )}
      {languages.map(language => (
        <Pressable
          onPress={() => onLanguageSelect(language)}
          key={language.code}
          style={[
            styles.modalContentLanguageBarContainer,
            {
              borderWidth:
                !isUsingSystemDefault && language.code === currentLanguage
                  ? UnistylesRuntime.hairlineWidth * 5
                  : 0,
              borderColor:
                !isUsingSystemDefault && language.code === currentLanguage
                  ? theme.colors.accent
                  : theme.colors.backgroundColor,
            },
          ]}
        >
          <View style={styles.languageSelectiveNativeName}>
            <Text style={styles.modalLanguageText}>{language.nativeName}</Text>
          </View>
          <View style={styles.languageSelectiveName}>
            <Text style={styles.modalLanguageSubText}>{language.name}</Text>
          </View>
          {language.isRTL && (
            <View style={styles.rtlBadge}>
              <Text style={styles.rtlBadgeText}>RTL</Text>
            </View>
          )}
        </Pressable>
      ))}
    </ScrollView>
  );
};

const LanguageListModal = ({
  modalTitle,
  modalDescription,
  modalVisibility,
  currentLanguage,
  closeButtonPress,
  onLanguageSelect,
  isUsingSystemDefault,
  onSystemDefaultPress,
  systemDefaultLanguage,
}: {
  modalTitle?: string;
  modalDescription?: string;
  modalVisibility?: boolean;
  currentLanguage: string;
  closeButtonPress?: () => void;
  onLanguageSelect: (language: LanguageConfig) => void;
  isUsingSystemDefault: boolean;
  onSystemDefaultPress: () => void;
  systemDefaultLanguage: LanguageConfig | undefined;
}) => {
  const { styles, theme } = useStyles(stylesheet);
  const currentLangConfig = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage);
  const { animatedStyle: sheetStyle, backdropStyle } = useBottomSheetEntrance(modalVisibility ?? false);

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
            {currentLangConfig ? <Text>{` · ${currentLangConfig.nativeName}`}</Text> : null}
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
        <LanguageSelectiveScroll
          languages={SUPPORTED_LANGUAGES}
          currentLanguage={currentLanguage}
          onLanguageSelect={onLanguageSelect}
          isUsingSystemDefault={isUsingSystemDefault}
          onSystemDefaultPress={onSystemDefaultPress}
          systemDefaultLanguage={systemDefaultLanguage}
        />
      </Animated.View>
    </Modal>
  );
};

export const StyledLanguageSelector = ({
  title,
  description,
  modalTitle,
  modalDescription,
}: {
  title: string;
  description: string;
  modalTitle?: string;
  modalDescription?: string;
}) => {
  const { t } = useTranslation();
  const { state, dispatch } = useAppContext();
  const { styles } = useStyles(stylesheet);
  const { shouldRestartForRTL, applyRTL } = useRTL();

  const [modalVisibility, setModalVisibility] = useState<boolean>(false);
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [pendingLanguage, setPendingLanguage] = useState<LanguageConfig | null>(null);
  const [isResettingToSystem, setIsResettingToSystem] = useState<boolean>(false);

  const systemDefaultLanguageCode = useMemo(() => getDeviceLanguage(), []);
  const systemDefaultLanguage = useMemo(
    () => getLanguageConfig(systemDefaultLanguageCode),
    [systemDefaultLanguageCode],
  );
  const isUsingSystemDefault = useMemo(() => state.language === undefined, [state.language]);

  // Use state.language if available, otherwise fallback to i18n's current language
  const currentLanguage = state.language || getCurrentLanguage();
  const currentLangConfig = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage);

  const handleRTLLanguageConfirm = useCallback(async () => {
    if (isResettingToSystem) {
      // Reset to system default
      if (!systemDefaultLanguage) return;

      // Apply RTL settings for system default
      applyRTL(systemDefaultLanguage.code);

      // Change i18n language to system default
      await changeLanguage(systemDefaultLanguage.code);

      // Update app state to reset language (undefined)
      dispatch({
        type: 'RESET_LANGUAGE_TO_SYSTEM',
      });

      setAlertVisible(false);
      setIsResettingToSystem(false);
      setModalVisibility(false);

      Toast.show({
        type: 'info',
        text1: i18n.t('messages.restartRequired'),
        visibilityTime: 4000,
      });
    } else {
      if (!pendingLanguage) return;

      // Apply RTL settings
      applyRTL(pendingLanguage.code);

      // Change i18n language
      await changeLanguage(pendingLanguage.code);

      // Update app state
      dispatch({
        type: 'SET_LANGUAGE',
        payload: {
          language: pendingLanguage.code,
          isRTL: isRTLLanguage(pendingLanguage.code),
        },
      });

      setAlertVisible(false);
      setPendingLanguage(null);
      setModalVisibility(false);

      Toast.show({
        type: 'info',
        text1: i18n.t('messages.restartRequired'),
        visibilityTime: 4000,
      });
    }

    setIsResettingToSystem(false);
  }, [pendingLanguage, isResettingToSystem, systemDefaultLanguage, applyRTL, dispatch]);

  const handleLanguageChange = useCallback(
    async (language: LanguageConfig) => {
      const needsRestart = shouldRestartForRTL(language.code);

      if (needsRestart) {
        // Close modal first, then show alert for RTL change
        setModalVisibility(false);
        // Small delay to ensure modal closes first
        setTimeout(() => {
          setPendingLanguage(language);
          setAlertVisible(true);
        }, 300);
      } else {
        // Close modal
        setModalVisibility(false);

        // No restart needed, just change language
        await changeLanguage(language.code);

        // Update app state
        dispatch({
          type: 'SET_LANGUAGE',
          payload: {
            language: language.code,
            isRTL: isRTLLanguage(language.code),
          },
        });

        Toast.show({
          type: 'success',
          text1: `${i18n.t('messages.languageChanged')}: ${language.nativeName}`,
          visibilityTime: 2000,
        });
      }
    },
    [dispatch, shouldRestartForRTL],
  );

  const handleSystemDefaultPress = useCallback(async () => {
    if (!systemDefaultLanguage) return;

    const needsRestart = shouldRestartForRTL(systemDefaultLanguage.code);

    if (needsRestart) {
      // Close modal first, then show alert for RTL change
      setModalVisibility(false);
      // Small delay to ensure modal closes first
      setTimeout(() => {
        setIsResettingToSystem(true);
        setAlertVisible(true);
      }, 300);
    } else {
      // Close modal
      setModalVisibility(false);

      // No restart needed, just reset to system language
      await changeLanguage(systemDefaultLanguage.code);

      // Update app state to reset language (undefined)
      dispatch({
        type: 'RESET_LANGUAGE_TO_SYSTEM',
      });

      Toast.show({
        type: 'success',
        text1: `${i18n.t('messages.languageChanged')}: ${systemDefaultLanguage.nativeName}`,
        visibilityTime: 2000,
      });
    }
  }, [systemDefaultLanguage, shouldRestartForRTL, dispatch]);

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.titleText}>{title}</Text>
      <Text style={styles.instructionText}>
        <StyledIcons
          type={'FontAwesome6'}
          name={'circle-info'}
          size={styles.instructionText?.fontSize}
          color={styles.instructionText?.color}
        />
        {` ${description}`}
      </Text>
      <View style={styles.mainLanguageChangeContainer}>
        <View style={styles.languageChangeTextContainer}>
          <Text style={styles.languageChangeText}>
            {t('components.languageSelector.selectLanguage')}
          </Text>
        </View>
        <View style={styles.languageBoxContainer}>
          <Pressable
            style={styles.languageBox}
            onPress={() => setModalVisibility(prevState => !prevState)}
          >
            <Text style={styles.languageText}>
              {currentLangConfig?.nativeName || currentLanguage}
            </Text>
          </Pressable>
        </View>
      </View>
      <LanguageListModal
        modalVisibility={modalVisibility}
        closeButtonPress={() => {
          setModalVisibility(prevState => !prevState);
        }}
        modalTitle={modalTitle}
        modalDescription={modalDescription}
        currentLanguage={currentLanguage}
        onLanguageSelect={handleLanguageChange}
        isUsingSystemDefault={isUsingSystemDefault}
        onSystemDefaultPress={handleSystemDefaultPress}
        systemDefaultLanguage={systemDefaultLanguage}
      />
      <StyledAlert
        visible={alertVisible}
        title={t('messages.restartTitle')}
        message={t('messages.languageChangeRTL')}
        type="confirm"
        buttons={[
          {
            text: t('common.cancel'),
            style: 'cancel',
            onPress: () => {
              setAlertVisible(false);
              setPendingLanguage(null);
              setIsResettingToSystem(false);
            },
          },
          {
            text: t('common.ok'),
            style: 'default',
            onPress: handleRTLLanguageConfirm,
          },
        ]}
        onDismiss={() => {
          setAlertVisible(false);
          setPendingLanguage(null);
          setIsResettingToSystem(false);
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
  mainLanguageChangeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: (UnistylesRuntime.screen.height * 0.5) / 100,
    marginHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  languageChangeTextContainer: {
    flex: 3,
    justifyContent: 'center',
  },
  languageChangeText: {
    color: colors.card_typography,
    fontSize: 14,
    fontFamily: fonts.Nunito_Black,
  },
  languageBoxContainer: {
    flex: 2,
    alignItems: 'flex-end',
  },
  languageBox: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: (UnistylesRuntime.screen.width * 4) / 100,
    backgroundColor: colors.backgroundColor,
    height: (UnistylesRuntime.screen.height * 4) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
  },
  languageText: {
    fontSize: 12,
    fontFamily: fonts.Montserrat_Black,
    color: colors.accent,
  },

  // Modal contents
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: utils.hexToRGBA(colors.backgroundColor, 0.5),
  },
  modalMainContainer: {
    height: (UnistylesRuntime.screen.height * 60) / 100,
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
  modalContentLanguageBarContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: (UnistylesRuntime.screen.height * 1.25) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    backgroundColor: colors.backgroundColor,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    alignItems: 'center',
  },
  modalLanguageText: {
    fontSize: 16,
    fontFamily: fonts.Montserrat_Black,
    color: colors.card_typography,
  },
  modalLanguageSubText: {
    fontSize: 12,
    fontFamily: fonts.Montserrat_Medium,
    color: colors.card_typography,
  },
  languageSelectiveNativeName: {
    flex: 2,
    justifyContent: 'center',
    paddingVertical: (UnistylesRuntime.screen.height * 0.5) / 100,
  },
  languageSelectiveName: {
    flex: 2,
    justifyContent: 'center',
    paddingVertical: (UnistylesRuntime.screen.height * 0.5) / 100,
  },
  rtlBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: (UnistylesRuntime.screen.width * 2) / 100,
    paddingVertical: (UnistylesRuntime.screen.height * 0.3) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 0.5) / 100,
  },
  rtlBadgeText: {
    fontSize: 10,
    fontFamily: fonts.Montserrat_Bold,
    color: colors.card,
  },
  languageScrollContainerStyles: {
    gap: (UnistylesRuntime.screen.height * 1) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    paddingBottom: UnistylesRuntime.insets.bottom * 2,
  },
}));

export default StyledLanguageSelector;
