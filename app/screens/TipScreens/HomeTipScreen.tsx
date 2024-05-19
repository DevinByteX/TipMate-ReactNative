import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
// custom component
import {
  StyledBillBox,
  StyledHeader,
  StyledTotalAmountInput,
  StyledTipOptions,
  StyledSpiltOptions,
} from '@/components';
import {
  UnistylesRuntime,
  createStyleSheet,
  useStyles,
} from 'react-native-unistyles';
import { BillCalculationType, calculateBillValues } from '@hooks';

const HomeTipScreen = () => {
  const { styles } = useStyles(stylesheet);
  const [billValues, setBillValues] = useState<BillCalculationType>();

  useEffect(() => {
    const billValuesResults = calculateBillValues(15, 100, 4);
    setBillValues(billValuesResults);

    return () => {};
  }, []);

  return (
    <>
      <StyledHeader />
      <ScrollView
        style={styles.mainContainer}
        contentContainerStyle={styles.scrollContentContainer}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        {/* Total Amount container */}
        <StyledTotalAmountInput
          returnKeyType={'done'}
          keyboardType={'number-pad'}
        />
        {/* Tip Percentage Options Container */}
        <StyledTipOptions onSelectedTipValue={text => {}} />
        {/* Slip Options Container */}
        <StyledSpiltOptions />
        {/* Per Person Bill Container */}
        <StyledBillBox
          titleVisibility
          titleText="PER PERSON"
          totalAmount={billValues?.perPerson?.total?.toFixed(2)}
          subTotalAmount={billValues?.perPerson?.subtotal?.toFixed(2)}
          totalTipAmount={billValues?.perPerson?.tip?.toFixed(2)}
        />
        {/* Total Bill Container */}
        <StyledBillBox
          titleVisibility
          titleText="TOTAL BILL"
          totalAmount={billValues?.overall?.total?.toFixed(2)}
          subTotalAmount={billValues?.overall?.subtotal?.toFixed(2)}
          totalTipAmount={billValues?.overall?.tip?.toFixed(2)}
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
    paddingBottom: (UnistylesRuntime.screen.height * 8) / 100,
  },
}));

export default HomeTipScreen;
