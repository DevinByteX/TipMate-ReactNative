import Share, { ShareOptions } from 'react-native-share';
import { generatePDF } from 'react-native-html-to-pdf';
import { Platform } from 'react-native';
import { Constants } from '@configs';
import { IndividualSplit } from '@/context/types';

// ─── Text sharing ─────────────────────────────────────────────────────────────

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
  taxAmount?: number;
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
  taxAmount: string;
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
  taxAmount: 'Tax Amount:',
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
  taxAmount,
  currencySymbol = '$',
  translations = defaultTranslations,
}: Omit<ShareTipDetailsParams, 'title' | 'subject'> & {
  translations?: ShareTranslations;
}): string => {
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
    splitSection = `\n👥 ${t.splitAmong} ${numberOfPeople} ${t.persons}\n  • ${
      t.subtotalPerPerson
    } ${currencySymbol}${perPerson.amount.toFixed(2)}\n  • ${
      t.tipPerPerson
    } ${currencySymbol}${perPerson.tip.toFixed(2)}\n  • ${
      t.totalPerPerson
    } ${currencySymbol}${perPerson.total.toFixed(2)}`;
  }

  const taxLine =
    taxAmount && taxAmount > 0
      ? `\n 🏷️ ${t.taxAmount} ${currencySymbol}${taxAmount.toFixed(2)}`
      : '';

  const message = `
💸 ${t.tipSummary}

🧾 ${t.billAmount} ${currencySymbol}${amount.toFixed(2)}${taxLine}
💰 ${t.tipPercentage} ${tipPercentage}%
💵 ${t.tipAmount} ${currencySymbol}${tip.toFixed(2)}
📊 ${t.totalAmount} ${currencySymbol}${total.toFixed(2)}
${splitSection}

${t.sharedVia}
    `.trim();

  return message;
};

export const shareTipText = async ({
  amount,
  tip,
  total,
  tipPercentage,
  numberOfPeople,
  splitType,
  perPerson,
  individualSplits,
  taxAmount,
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
    taxAmount,
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

// ─── PDF sharing ──────────────────────────────────────────────────────────────

export type TipDetailsForPDF = {
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
  taxAmount?: number;
  currencySymbol?: string;
};

export type PDFTranslations = {
  thankYou: string;
  tipSummaryDescription: string;
  receiptId: string;
  date: string;
  time: string;
  amount: string;
  billDetails: string;
  billAmount: string;
  tip: string;
  totalAmount: string;
  taxAmount: string;
  splitDetails: string;
  people: string;
  subtotalPerPerson: string;
  tipPerPerson: string;
  totalPerPerson: string;
  generatedBy: string;
  tagline: string;
  shareTitle: string;
  shareSubject: string;
};

const defaultPDFTranslations: PDFTranslations = {
  thankYou: 'Thank you',
  tipSummaryDescription: 'Your tip calculation summary',
  receiptId: 'Receipt ID',
  date: 'Date',
  time: 'Time',
  amount: 'Amount',
  billDetails: 'Bill Details',
  billAmount: 'Bill Amount',
  tip: 'Tip',
  totalAmount: 'Total Amount',
  taxAmount: 'Tax Amount',
  splitDetails: 'Split Details',
  people: 'People',
  subtotalPerPerson: 'Subtotal per Person',
  tipPerPerson: 'Tip per Person',
  totalPerPerson: 'Total per Person',
  generatedBy: 'Generated by',
  tagline: 'Smart Tips, Easy Living',
  shareTitle: 'Share TipMate Summary',
  shareSubject: 'TipMate Summary',
};

const escapeHtml = (text: string | null | undefined): string =>
  (text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

/**
 * Generates and shares a PDF with tip details
 * Uses react-native-html-to-pdf to generate PDF and react-native-share to share it
 * Styling is based on the current app theme from Unistyles
 */
export const shareTipPDF = async (
  details: TipDetailsForPDF,
  translations: PDFTranslations = defaultPDFTranslations,
  locale: string = 'en-US',
) => {
  const {
    amount,
    tip,
    total,
    tipPercentage,
    numberOfPeople,
    splitType,
    perPerson,
    individualSplits,
    taxAmount,
    currencySymbol = '$',
  } = details;
  const t = translations;

  // Gradient colors matching app theme
  const gradientStart = '#009688';
  const gradientEnd = '#00695C';

  // Platform-specific store link
  const storeLink =
    Platform.OS === 'ios' ? Constants.APP_LINKS.appStore : Constants.APP_LINKS.playStore;

  // Generate receipt ID based on timestamp
  const receiptId = new Date().getTime().toString();
  const formattedDate = new Date().toLocaleDateString(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = new Date().toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  // Extract tax row into its own template for better readability
  const taxRowHtml =
    taxAmount && taxAmount > 0
      ? `
              <div class="detail-row">
                <span class="detail-label">${t.taxAmount}</span>
                <span class="detail-value">${currencySymbol}${taxAmount.toFixed(2)}</span>
              </div>`
      : '';

  // Generate HTML content for the receipt-style PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            print-color-adjust:exact !important;
          }
          body {
            font-family: 'Courier New', monospace;
            background: linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%);
            padding: 20px 15px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .receipt-container {
            background: white;
            max-width: 800px;
            width: 50%;
            margin: 0 auto;
            border-radius: 16px;
            box-shadow: 0 16px 48px rgba(0,0,0,0.3);
            overflow: hidden;
          }
          .receipt-header {
            background: linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%);
            padding: 20px 20px 16px;
            text-align: center;
            position: relative;
          }
          .mascot {
            font-size: 48px;
            margin-bottom: 8px;
            animation: float 3s ease-in-out infinite;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          .receipt-title {
            font-size: 24px;
            font-weight: bold;
            color: white;
            margin-bottom: 4px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          .receipt-subtitle {
            font-size: 13px;
            color: rgba(255,255,255,0.9);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          .receipt-body {
            padding: 20px 24px;
            background: white;
          }
          .divider {
            border-top: 2px dashed #e0e0e0;
            margin: 16px 0;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            font-size: 14px;
            color: #666;
            gap: 18px;
          }
          .info-label {
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
            flex-shrink: 0;
          }
          .info-value {
            color: #333;
            font-weight: bold;
            text-align: right;
            word-break: break-word;
          }
          .amount-section {
            background: #f8f9fa;
            padding: 14px;
            border-radius: 12px;
            margin: 16px 0;
          }
          .amount-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
          }
          .amount-value {
            font-size: 32px;
            font-weight: bold;
            color: ${gradientStart};
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          .detail-section {
            margin: 16px 0;
          }
          .detail-title {
            font-size: 14px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 9px 0;
            border-bottom: 1px solid #f0f0f0;
            font-size: 15px;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            color: #666;
          }
          .detail-value {
            color: #333;
            font-weight: 600;
          }
          .footer {
            text-align: center;
            padding: 16px;
            background: #f8f9fa;
            border-top: 2px dashed #e0e0e0;
          }
          .footer-text {
            font-size: 12px;
            color: #999;
            line-height: 1.5;
          }
          .footer-link {
            color: ${gradientStart};
            text-decoration: none;
            font-weight: 600;
          }
          .receipt-edge-top {
            height: 12px;
            background: white;
            position: relative;
          }
          .receipt-edge-top::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 12px;
            background: radial-gradient(circle at 10px 0, transparent 10px, white 10px);
            background-size: 20px 12px;
            background-repeat: repeat-x;
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <!-- Receipt Header -->
          <div class="receipt-header">
            <div class="mascot">💸</div>
            <div class="receipt-title">${t.thankYou}</div>
            <div class="receipt-subtitle">${t.tipSummaryDescription}</div>
          </div>
          
          <!-- Receipt Edge -->
          <div class="receipt-edge-top"></div>
          
          <!-- Receipt Body -->
          <div class="receipt-body">
            <!-- Receipt Info -->
            <div class="info-row">
              <span class="info-label">${t.receiptId}</span>
              <span class="info-value">${receiptId}</span>
            </div>
            <div class="info-row">
              <span class="info-label">${t.date}</span>
              <span class="info-value">${formattedDate}</span>
            </div>
            <div class="info-row">
              <span class="info-label">${t.time}</span>
              <span class="info-value">${formattedTime}</span>
            </div>
            
            <div class="divider"></div>
            
            <!-- Amount Section -->
            <div class="amount-section">
              <div class="amount-label">${t.amount}</div>
              <div class="amount-value">${currencySymbol}${total.toFixed(2)}</div>
            </div>
            
            <!-- Bill Details -->
            <div class="detail-section">
              <div class="detail-title">${t.billDetails}</div>
              <div class="detail-row">
                <span class="detail-label">${t.billAmount}</span>
                <span class="detail-value">${currencySymbol}${amount.toFixed(2)}</span>
              </div>
              ${taxRowHtml}
              <div class="detail-row">
                <span class="detail-label">${t.tip} (${tipPercentage}%)</span>
                <span class="detail-value">${currencySymbol}${tip.toFixed(2)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">${t.totalAmount}</span>
                <span class="detail-value">${currencySymbol}${total.toFixed(2)}</span>
              </div>
            </div>
            
            ${
              numberOfPeople > 1 && perPerson && splitType !== 'custom'
                ? `
            <div class="divider"></div>
            
            <!-- Split Details -->
            <div class="detail-section">
              <div class="detail-title">${t.splitDetails} (${numberOfPeople} ${t.people})</div>
              <div class="detail-row">
                <span class="detail-label">${t.subtotalPerPerson}</span>
                <span class="detail-value">${currencySymbol}${perPerson.amount.toFixed(2)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">${t.tipPerPerson}</span>
                <span class="detail-value">${currencySymbol}${perPerson.tip.toFixed(2)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">${t.totalPerPerson}</span>
                <span class="detail-value">${currencySymbol}${perPerson.total.toFixed(2)}</span>
              </div>
            </div>
            `
                : ''
            }
            ${
              splitType === 'custom' && individualSplits && individualSplits.length > 0
                ? `
            <div class="divider"></div>
            
            <!-- Custom Split Details -->
            <div class="detail-section">
              <div class="detail-title">${t.splitDetails} (${individualSplits.length} ${
                    t.people
                  })</div>
              ${individualSplits
                .map(
                  split => `
              <div class="detail-row">
                <span class="detail-label">${escapeHtml(split.name)}</span>
                <span class="detail-value">${currencySymbol}${(split.calculatedAmount || 0).toFixed(
                    2,
                  )}</span>
              </div>
              `,
                )
                .join('')}
            </div>
            `
                : ''
            }
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <div class="footer-text">
              ${t.generatedBy} <a href="${storeLink}" class="footer-link">TipMate</a><br>
              ${t.tagline}
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    // Generate PDF from HTML
    const pdfOptions = {
      html: htmlContent,
      fileName: `TipMate_Summary_${new Date().getTime()}`,
      directory: 'Documents',
      base64: false,
    };

    const pdf = await generatePDF(pdfOptions);

    if (!pdf.filePath) {
      throw new Error('PDF generation failed: No file path returned');
    }

    // Share the generated PDF
    const shareOptions = {
      title: t.shareTitle,
      subject: t.shareSubject,
      url: `file://${pdf.filePath}`,
      type: 'application/pdf',
      failOnCancel: false,
      useInternalStorage: true,
    };

    await Share.open(shareOptions);
  } catch (error: unknown) {
    throw error;
  }
};
