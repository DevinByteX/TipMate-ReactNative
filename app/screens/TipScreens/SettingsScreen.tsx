import React from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import {
  StyledCurrencySelector,
  StyledLanguageSelector,
  StyledHeader,
  StyledSplitOptionsEditMode,
  StyledThemeBox,
  StyledTipOptionsEditMode,
  StyledDuplicatePreventionSelector,
} from '@components';

const SettingsScreen = () => {
  const { styles } = useStyles(stylesheet);
  const { t } = useTranslation();
  return (
    <>
      <StyledHeader
        headerTitle={t('screens.home.title')}
        headerSubTitle={t('screens.settings.title')}
        headerRightIconVisibilty={false}
      />
      <ScrollView
        style={styles.mainContainer}
        contentContainerStyle={styles.scrollContentContainer}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <StyledTipOptionsEditMode
          title={t('screens.settings.customiseTips')}
          description={t('components.tipOptionsEdit.description')}
          modalTitle={t('screens.settings.confirmReset')}
          modalSubtitle={t('components.tipOptionsEdit.resetConfirmMessage')}
          lineButtonText={t('common.cancel')}
          solidButtonText={t('common.reset')}
          resetSuccessToastText={t('components.tipOptionsEdit.resetSuccess')}
        />
        <StyledSplitOptionsEditMode
          title={t('screens.settings.customiseSplits')}
          description={t('components.splitOptionsEdit.description')}
          modalTitle={t('screens.settings.confirmReset')}
          modalSubtitle={t('components.splitOptionsEdit.resetConfirmMessage')}
          lineButtonText={t('common.cancel')}
          solidButtonText={t('common.reset')}
          resetSuccessToastText={t('components.splitOptionsEdit.resetSuccess')}
        />
        <StyledCurrencySelector
          title={t('screens.settings.customiseCurrency')}
          description={t('components.currencySelector.description')}
          modalTitle={t('components.currencySelector.selectCurrency')}
          modalDescription={t('components.currencySelector.modalDescription')}
          currencyChangeInstructionText={t('components.currencySelector.tapToSelect')}
          currencyChangeToastMessage={t('components.currencySelector.changeMessage')}
        />
        <StyledLanguageSelector
          title={t('screens.settings.customiseLanguage')}
          description={t('components.languageSelector.description')}
          modalTitle={t('components.languageSelector.selectLanguage')}
          modalDescription={t('components.languageSelector.modalDescription')}
        />
        <StyledDuplicatePreventionSelector
          title={t('screens.settings.duplicatePrevention')}
          description={t('components.duplicatePrevention.description')}
          selectionInstructionText={t('components.duplicatePrevention.timeWindow')}
          modalTitle={t('components.duplicatePrevention.modalTitle')}
          modalDescription={t('components.duplicatePrevention.modalDescription')}
          changeToastMessage={t('components.duplicatePrevention.changeMessage')}
        />
        <StyledThemeBox
          title={t('screens.settings.customiseTheme')}
          description={t('components.themeBox.description')}
          toggleDescription={t('components.themeBox.darkModeDescription')}
          toggleText={t('components.themeBox.darkModeLabel')}
        />
      </ScrollView>
    </>
  );
};

const stylesheet = createStyleSheet(({ colors }) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  scrollContentContainer: {
    paddingBottom: UnistylesRuntime.insets.bottom * 2,
  },
}));

export default SettingsScreen;
