import Share, { ShareOptions } from 'react-native-share';

export const shareTipDetails = async ({
  amount,
  tip,
  total,
  tipPercentage,
  numberOfPeople,
  perPerson,
  currencySymbol = '$',
  title = 'Share your tip summary',
  subject = 'TipMate Summary',
}: {
  amount: number;
  tip: number;
  total: number;
  tipPercentage: number;
  numberOfPeople: number;
  perPerson?: {
    amount: number;
    tip: number;
    total: number;
  };
  currencySymbol?: string;
  title?: string;
  subject?: string;
}) => {
  const message = `
💸 Tip Summary

🧾 Bill Amount: ${currencySymbol}${amount.toFixed(2)}
💰 Tip Percentage: ${tipPercentage}%
💵 Tip Amount: ${currencySymbol}${tip.toFixed(2)}
📊 Total Amount: ${currencySymbol}${total.toFixed(2)}

${
  numberOfPeople > 1
    ? `👥 Split Among: ${numberOfPeople} person(s)
  • Subtotal per person: ${currencySymbol}${perPerson?.amount.toFixed(2) ?? 'N/A'}
  • Tip per person: ${currencySymbol}${perPerson?.tip.toFixed(2) ?? 'N/A'}
  • Total per person: ${currencySymbol}${perPerson?.total.toFixed(2) ?? 'N/A'}`
    : ''
}

Shared via TipMate
    `.trim();

  const options: ShareOptions = {
    title,
    subject,
    message,
  };

  try {
    await Share.open(options);
  } catch (err: unknown) {
    const message =
      typeof err === 'object' && err && 'message' in err
        ? (err as { message?: string }).message
        : undefined;

    if (message !== 'User did not share') {
      console.log(err);
    }
  }
};
