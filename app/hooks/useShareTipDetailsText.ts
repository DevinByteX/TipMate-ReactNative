import Share, { ShareOptions } from 'react-native-share';
import { IndividualSplit } from '@/context/types';

export type ShareTipDetailsParams = {
  amount: number;
  tip: number;
  total: number;
  tipPercentage: number;
  numberOfPeople: number;
  splitType?: 'equal' | 'custom';
  perPerson?: {
    amount: number;
    tip: number;
    total: number;
  };
  individualSplits?: IndividualSplit[];
  currencySymbol?: string;
  title?: string;
  subject?: string;
  translations?: ShareTranslations;
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
  customSplitLabel: string;
  individualSplit: string;
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
  customSplitLabel: 'Custom Split:',
  individualSplit: '{{name}}: {{currency}}{{amount}}',
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
  splitType,
  perPerson,
  individualSplits,
  currencySymbol = '$',
  translations = defaultTranslations,
}: Omit<ShareTipDetailsParams, 'title' | 'subject'> & { translations?: ShareTranslations }): string => {
  const t = translations;

  let splitSection = '';
  if (splitType === 'custom' && individualSplits && individualSplits.length > 0) {
    const splitLines = individualSplits
      .map(split => {
        // Replace amount and currency first, then name last, because name is
        // user input and could contain template placeholders like {{currency}}.
        const line = t.individualSplit
          .replace('{{amount}}', (split.calculatedAmount || 0).toFixed(2))
          .replace('{{currency}}', currencySymbol)
          .replace('{{name}}', split.name);
        return `  • ${line}`;
      })
      .join('\n');
    splitSection = `\n👥 ${t.customSplitLabel} (${individualSplits.length} ${t.persons})\n${splitLines}`;
  } else if (numberOfPeople > 1 && perPerson) {
    splitSection = `\n👥 ${t.splitAmong} ${numberOfPeople} ${t.persons}\n  • ${t.subtotalPerPerson} ${currencySymbol}${perPerson.amount.toFixed(2)}\n  • ${t.tipPerPerson} ${currencySymbol}${perPerson.tip.toFixed(2)}\n  • ${t.totalPerPerson} ${currencySymbol}${perPerson.total.toFixed(2)}`;
  }

  const message = `
💸 ${t.tipSummary}

🧾 ${t.billAmount} ${currencySymbol}${amount.toFixed(2)}
💰 ${t.tipPercentage} ${tipPercentage}%
💵 ${t.tipAmount} ${currencySymbol}${tip.toFixed(2)}
📊 ${t.totalAmount} ${currencySymbol}${total.toFixed(2)}
${splitSection}

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
  splitType,
  perPerson,
  individualSplits,
  currencySymbol = '$',
  title = 'Share your tip summary',
  subject = 'TipMate Summary',
  translations,
}: ShareTipDetailsParams) => {
  const message = formatTipDetailsPreview({
    amount,
    tip,
    total,
    tipPercentage,
    numberOfPeople,
    splitType,
    perPerson,
    individualSplits,
    currencySymbol,
    translations,
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
