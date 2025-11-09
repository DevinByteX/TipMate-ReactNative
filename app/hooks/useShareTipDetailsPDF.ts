import Share from 'react-native-share';
import { generatePDF } from 'react-native-html-to-pdf';
import { Platform } from 'react-native';

export type TipDetailsForPDF = {
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
};

/**
 * Generates and shares a PDF with tip details
 * Uses react-native-html-to-pdf to generate PDF and react-native-share to share it
 * Styling is based on the current app theme from Unistyles
 */
export const useShareTipDetailsPDF = async (details: TipDetailsForPDF) => {
    const { amount, tip, total, tipPercentage, numberOfPeople, perPerson, currencySymbol = '$' } =
        details;

    // Get current theme colors based on theme name
    const accentColor = '#009688';
    const cardColor = '#862121ff';
    const backgroundColor = '#472daeff';
    const cardTypography = '#edd311ff';
    const dividerColor = '#5586efff';

    // Generate HTML content for the PDF
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
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
            padding: 40px 20px;
            background-color: ${backgroundColor};
            color: ${cardTypography};
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid ${accentColor};
          }
          .header h1 {
            font-size: 28px;
            color: ${accentColor};
            margin-bottom: 8px;
            font-weight: bold;
          }
          .header p {
            font-size: 14px;
            color: ${cardTypography};
            opacity: 0.7;
          }
          .emoji {
            font-size: 24px;
          }
          .section {
            margin-bottom: 30px;
            padding: 20px;
            background-color: ${cardColor};
            border-radius: 8px;
            border-left: 4px solid ${accentColor};
          }
          .section-title {
            font-size: 18px;
            font-weight: bold;
            color: ${accentColor};
            margin-bottom: 15px;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid ${dividerColor};
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            font-size: 14px;
            color: ${cardTypography};
            opacity: 0.7;
          }
          .detail-value {
            font-size: 16px;
            font-weight: bold;
            color: ${cardTypography};
          }
          .highlight {
            background-color: ${accentColor};
            color: white;
            padding: 15px;
            border-radius: 8px;
            margin-top: 10px;
          }
          .highlight .detail-label {
            color: rgba(255, 255, 255, 0.9);
          }
          .highlight .detail-value {
            color: white;
            font-size: 20px;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid ${dividerColor};
            color: ${cardTypography};
            opacity: 0.6;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1><span class="emoji">💸</span> TipMate Summary</h1>
            <p>Smart Tips, Easy Living</p>
          </div>

          <!-- Bill Details Section -->
          <div class="section">
            <div class="section-title">📋 Bill Details</div>
            <div class="detail-row">
              <span class="detail-label">Bill Amount</span>
              <span class="detail-value">${currencySymbol}${amount.toFixed(2)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Tip Percentage</span>
              <span class="detail-value">${tipPercentage}%</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Tip Amount</span>
              <span class="detail-value">${currencySymbol}${tip.toFixed(2)}</span>
            </div>
            <div class="highlight">
              <div class="detail-row">
                <span class="detail-label">💰 Total Amount</span>
                <span class="detail-value">${currencySymbol}${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          ${numberOfPeople > 1 && perPerson
            ? `
          <!-- Split Details Section -->
          <div class="section">
            <div class="section-title">👥 Split Details</div>
            <div class="detail-row">
              <span class="detail-label">Number of People</span>
              <span class="detail-value">${numberOfPeople}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Subtotal per Person</span>
              <span class="detail-value">${currencySymbol}${perPerson.amount.toFixed(2)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Tip per Person</span>
              <span class="detail-value">${currencySymbol}${perPerson.tip.toFixed(2)}</span>
            </div>
            <div class="highlight">
              <div class="detail-row">
                <span class="detail-label">💵 Total per Person</span>
                <span class="detail-value">${currencySymbol}${perPerson.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          `
            : ''
        }

          <!-- Footer -->
          <div class="footer">
            <p>Generated by TipMate</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
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

        console.log('PDF generated at:', pdf.filePath);

        if (!pdf.filePath) {
            throw new Error('PDF generation failed: No file path returned');
        }

        // Share the generated PDF
        const shareOptions = {
            title: 'Share TipMate Summary',
            subject: 'TipMate Summary',
            url: Platform.OS === 'ios' ? `file://${pdf.filePath}` : `file://${pdf.filePath}`,
            type: 'application/pdf',
            failOnCancel: false,
            useInternalStorage: true,
        };

        console.log('Sharing PDF with options:', shareOptions.url);
        await Share.open(shareOptions);
    } catch (err: unknown) {
        const message =
            typeof err === 'object' && err && 'message' in err
                ? (err as { message?: string }).message
                : undefined;

        if (message !== 'User did not share') {
            console.error('PDF generation error:', err);
        }
        throw err;
    }
};
