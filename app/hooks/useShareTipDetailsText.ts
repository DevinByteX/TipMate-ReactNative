import Share, { ShareOptions } from 'react-native-share';

export type ShareTipDetailsParams = {
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
};

export type ShareTranslations = {
  tipSummary: string;
  billAmount: string;
  tipPercentage: string;
  tipAmount: string;
  totalAmount: string;
  splitAmong: string;
  persons: string;
  subtotalPerPerson: string;
  tipPerPerson: string;
  totalPerPerson: string;
  sharedVia: string;
};

/**
 * Default English translations for backward compatibility
 */
const defaultTranslations: ShareTranslations = {
  tipSummary: 'Tip Summary',
  billAmount: 'Bill Amount:',
  tipPercentage: 'Tip Percentage:',
  tipAmount: 'Tip Amount:',
  totalAmount: 'Total Amount:',
  splitAmong: 'Split Among:',
  persons: 'person(s)',
  subtotalPerPerson: 'Subtotal per person:',
  tipPerPerson: 'Tip per person:',
  totalPerPerson: 'Total per person:',
  sharedVia: 'Shared via TipMate',
};

/**
 * Formats the tip details into a preview message string
 */
export const formatTipDetailsPreview = ({
  amount,
  tip,
  total,
  tipPercentage,
  numberOfPeople,
  perPerson,
  currencySymbol = '$',
  translations = defaultTranslations,
}: Omit<ShareTipDetailsParams, 'title' | 'subject'> & { translations?: ShareTranslations }): string => {
  const t = translations;
  const message = `
💸 ${t.tipSummary}

🧾 ${t.billAmount} ${currencySymbol}${amount.toFixed(2)}
💰 ${t.tipPercentage} ${tipPercentage}%
💵 ${t.tipAmount} ${currencySymbol}${tip.toFixed(2)}
📊 ${t.totalAmount} ${currencySymbol}${total.toFixed(2)}

${numberOfPeople > 1
      ? `👥 ${t.splitAmong} ${numberOfPeople} ${t.persons}
  • ${t.subtotalPerPerson} ${currencySymbol}${perPerson?.amount.toFixed(2) ?? 'N/A'}
  • ${t.tipPerPerson} ${currencySymbol}${perPerson?.tip.toFixed(2) ?? 'N/A'}
  • ${t.totalPerPerson} ${currencySymbol}${perPerson?.total.toFixed(2) ?? 'N/A'}`
      : ''
    }

${t.sharedVia}
    `.trim();

  return message;
};

export const useShareTipDetailsText = async ({
  amount,
  tip,
  total,
  tipPercentage,
  numberOfPeople,
  perPerson,
  currencySymbol = '$',
  title = 'Share your tip summary',
  subject = 'TipMate Summary',
}: ShareTipDetailsParams) => {
  const message = formatTipDetailsPreview({
    amount,
    tip,
    total,
    tipPercentage,
    numberOfPeople,
    perPerson,
    currencySymbol,
  });

  const shareOptions: ShareOptions = {
    title,
    subject,
    message,
    failOnCancel: false,
  };

  try {
    await Share.open(shareOptions);
  } catch (error: unknown) {
    throw error;
  }
};
