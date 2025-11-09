import Share from 'react-native-share';
import { generatePDF } from 'react-native-html-to-pdf';
import { Platform } from 'react-native';
import { APP_LINKS } from '@/configs/constants';

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

    // Gradient colors matching app theme
    const gradientStart = '#009688';
    const gradientEnd = '#00695C';

    // Platform-specific store link
    const storeLink = Platform.OS === 'ios' ? APP_LINKS.appStore : APP_LINKS.playStore;

    // Generate receipt ID based on timestamp
    const receiptId = new Date().getTime().toString();
    const formattedDate = new Date().toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
    const formattedTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });

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
          }
          body {
            font-family: 'Courier New', monospace;
            background: linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%);
            padding: 40px 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .receipt-container {
            background: white;
            max-width: 500px;
            margin: 0 auto;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
          }
          .receipt-header {
            background: linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%);
            padding: 30px 20px 20px;
            text-align: center;
            position: relative;
          }
          .mascot {
            font-size: 60px;
            margin-bottom: 15px;
            animation: float 3s ease-in-out infinite;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          .receipt-title {
            font-size: 26px;
            font-weight: bold;
            color: white;
            margin-bottom: 5px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          .receipt-subtitle {
            font-size: 13px;
            color: rgba(255,255,255,0.9);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          .receipt-body {
            padding: 30px 25px;
            background: white;
          }
          .divider {
            border-top: 2px dashed #e0e0e0;
            margin: 20px 0;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            font-size: 13px;
            color: #666;
            gap: 15px;
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
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
          }
          .amount-label {
            font-size: 11px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
          }
          .amount-value {
            font-size: 32px;
            font-weight: bold;
            color: ${gradientStart};
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          .detail-section {
            margin: 20px 0;
          }
          .detail-title {
            font-size: 13px;
            font-weight: bold;
            color: #333;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #f0f0f0;
            font-size: 14px;
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
            padding: 20px;
            background: #f8f9fa;
            border-top: 2px dashed #e0e0e0;
          }
          .footer-text {
            font-size: 11px;
            color: #999;
            line-height: 1.6;
          }
          .footer-link {
            color: ${gradientStart};
            text-decoration: none;
            font-weight: 600;
          }
          .receipt-edge-top {
            height: 15px;
            background: white;
            position: relative;
          }
          .receipt-edge-top::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 15px;
            background: radial-gradient(circle at 10px 0, transparent 10px, white 10px);
            background-size: 20px 15px;
            background-repeat: repeat-x;
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <!-- Receipt Header -->
          <div class="receipt-header">
            <div class="mascot">💸</div>
            <div class="receipt-title">Thank you</div>
            <div class="receipt-subtitle">Your tip calculation summary</div>
          </div>
          
          <!-- Receipt Edge -->
          <div class="receipt-edge-top"></div>
          
          <!-- Receipt Body -->
          <div class="receipt-body">
            <!-- Receipt Info -->
            <div class="info-row">
              <span class="info-label">Receipt ID</span>
              <span class="info-value">${receiptId}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Date</span>
              <span class="info-value">${formattedDate}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Time</span>
              <span class="info-value">${formattedTime}</span>
            </div>
            
            <div class="divider"></div>
            
            <!-- Amount Section -->
            <div class="amount-section">
              <div class="amount-label">Amount</div>
              <div class="amount-value">${currencySymbol}${total.toFixed(2)}</div>
            </div>
            
            <!-- Bill Details -->
            <div class="detail-section">
              <div class="detail-title">Bill Details</div>
              <div class="detail-row">
                <span class="detail-label">Bill Amount</span>
                <span class="detail-value">${currencySymbol}${amount.toFixed(2)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Tip (${tipPercentage}%)</span>
                <span class="detail-value">${currencySymbol}${tip.toFixed(2)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Total Amount</span>
                <span class="detail-value">${currencySymbol}${total.toFixed(2)}</span>
              </div>
            </div>
            
            ${numberOfPeople > 1 && perPerson
            ? `
            <div class="divider"></div>
            
            <!-- Split Details -->
            <div class="detail-section">
              <div class="detail-title">Split Details (${numberOfPeople} People)</div>
              <div class="detail-row">
                <span class="detail-label">Subtotal per Person</span>
                <span class="detail-value">${currencySymbol}${perPerson.amount.toFixed(2)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Tip per Person</span>
                <span class="detail-value">${currencySymbol}${perPerson.tip.toFixed(2)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Total per Person</span>
                <span class="detail-value">${currencySymbol}${perPerson.total.toFixed(2)}</span>
              </div>
            </div>
            `
            : ''
        }
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <div class="footer-text">
              Generated by <a href="${storeLink}" class="footer-link">TipMate</a><br>
              Smart Tips, Easy Living
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
