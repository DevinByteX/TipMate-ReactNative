import React from 'react';
import { ScrollView } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import {
  StyledCurrencySelector,
  StyledHeader,
  StyledSplitOptionsEditMode,
  StyledThemeBox,
  StyledTipOptionsEditMode,
} from '@components';
import { Constants } from '@configs';

const SettingsScreen = () => {
  const { styles } = useStyles(stylesheet);
  return (
    <>
      <StyledHeader
        headerTitle={'TipMate'}
        headerSubTitle={'Settings & Preferences'}
        headerRightIconVisibilty={false}
      />
      <ScrollView
        style={styles.mainContainer}
        contentContainerStyle={styles.scrollContentContainer}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <StyledTipOptionsEditMode
          title={'CUSTOMISE YOUR TIPS'}
          description={
            'Personalise Your Tips: Adjust your default tips by typing in the fields. It’s quick and easy!'
          }
          modalTitle={`${'Confirm Reset'}`}
          modalSubtitle={`${`Are you sure you want to reset all your tip options? This change can't be undone!`}`}
          lineButtonText={`${'Cancel'}`}
          solidButtonText={`${'Reset'}`}
          resetSuccessToastText={`${`Tip options refreshed! You're all set with the default values`}`}
        />
        <StyledSplitOptionsEditMode
          title={'CUSTOMISE YOUR SPLITS'}
          description={
            'Set Your Splits: Enter your split preferences in the fields to customise how the bill is divided'
          }
          modalTitle={`${'Confirm Reset'}`}
          modalSubtitle={`${`Are you sure you want to reset all your split options? This change can't be undone!`}`}
          lineButtonText={`${'Cancel'}`}
          solidButtonText={`${'Reset'}`}
          resetSuccessToastText={`${`Split options refreshed! You're all set with the default values`}`}
        />
        <StyledThemeBox
          title={'CUSTOMISE YOUR THEME'}
          description={
            'Switch Up Your Style: Choose from our vibrant themes to make your app experience uniquely yours!'
          }
          toggleDescription={'Enjoy a sleek, comfortable view by enabling Dark Mode.'}
          toggleText={'Toggle Dark Mode'}
        />
        <StyledCurrencySelector
          title={'CUSTOMISE YOUR CURRENCY'}
          description={
            'Tailor Your Currency: Pick your preferred currency for a more seamless billing experience.'
          }
          modalTitle={'SELECT YOUR CURRENCY'}
          currencyChangeInstructionText={'Tap to select a currency'}
          currencyText={'$'}
          currencies={Constants.currencies}
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
