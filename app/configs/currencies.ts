export type CurrencyType = {
    currencyId: string;
    currencyName: string;
    currencySign: string;
};

export const currencies: CurrencyType[] = [
    // Main and Famous Currencies
    { currencyId: 'USD', currencyName: 'US Dollar', currencySign: '$' },
    { currencyId: 'EUR', currencyName: 'Euro', currencySign: '€' },
    { currencyId: 'GBP', currencyName: 'British Pound Sterling', currencySign: '£' },
    { currencyId: 'JPY', currencyName: 'Japanese Yen', currencySign: '¥' },
    { currencyId: 'AUD', currencyName: 'Australian Dollar', currencySign: '$' },
    { currencyId: 'CAD', currencyName: 'Canadian Dollar', currencySign: '$' },
    { currencyId: 'CHF', currencyName: 'Swiss Franc', currencySign: 'CHF' },
    { currencyId: 'CNY', currencyName: 'Chinese Yuan', currencySign: '¥' },
    { currencyId: 'INR', currencyName: 'Indian Rupee', currencySign: '₹' },

    // Other Currencies in Ascending Order
    { currencyId: 'AED', currencyName: 'UAE Dirham', currencySign: 'AED' },
    { currencyId: 'ARS', currencyName: 'Argentine Peso', currencySign: 'ARS' },
    { currencyId: 'BDT', currencyName: 'Bangladeshi Taka', currencySign: '৳' },
    { currencyId: 'BHD', currencyName: 'Bahraini Dinar', currencySign: 'BHD' },
    { currencyId: 'BRL', currencyName: 'Brazilian Real', currencySign: 'R$' },
    { currencyId: 'CLP', currencyName: 'Chilean Peso', currencySign: 'CLP' },
    { currencyId: 'EGP', currencyName: 'Egyptian Pound', currencySign: '£' },
    { currencyId: 'GHS', currencyName: 'Ghanaian Cedi', currencySign: 'GHS' },
    { currencyId: 'IDR', currencyName: 'Indonesian Rupiah', currencySign: 'Rp' },
    { currencyId: 'ILS', currencyName: 'Israeli New Shekel', currencySign: '₪' },
    { currencyId: 'JOD', currencyName: 'Jordanian Dinar', currencySign: 'JOD' },
    { currencyId: 'KES', currencyName: 'Kenyan Shilling', currencySign: 'KES' },
    { currencyId: 'KRW', currencyName: 'South Korean Won', currencySign: '₩' },
    { currencyId: 'KWD', currencyName: 'Kuwaiti Dinar', currencySign: 'KWD' },
    { currencyId: 'LKR', currencyName: 'Sri Lankan Rupee', currencySign: 'LKR' },
    { currencyId: 'MXN', currencyName: 'Mexican Peso', currencySign: '$' },
    { currencyId: 'MYR', currencyName: 'Malaysian Ringgit', currencySign: 'RM' },
    { currencyId: 'NGN', currencyName: 'Nigerian Naira', currencySign: '₦' },
    { currencyId: 'NZD', currencyName: 'New Zealand Dollar', currencySign: '$' },
    { currencyId: 'OMR', currencyName: 'Omani Rial', currencySign: 'OMR' },
    { currencyId: 'PHP', currencyName: 'Philippine Peso', currencySign: '₱' },
    { currencyId: 'PKR', currencyName: 'Pakistani Rupee', currencySign: '₨' },
    { currencyId: 'QAR', currencyName: 'Qatari Riyal', currencySign: 'QAR' },
    { currencyId: 'RUB', currencyName: 'Russian Ruble', currencySign: '₽' },
    { currencyId: 'SAR', currencyName: 'Saudi Riyal', currencySign: 'SAR' },
    { currencyId: 'SGD', currencyName: 'Singapore Dollar', currencySign: '$' },
    { currencyId: 'THB', currencyName: 'Thai Baht', currencySign: '฿' },
    { currencyId: 'TRY', currencyName: 'Turkish Lira', currencySign: '₺' },
    { currencyId: 'TZS', currencyName: 'Tanzanian Shilling', currencySign: 'TZS' },
    { currencyId: 'UGX', currencyName: 'Ugandan Shilling', currencySign: 'UGX' },
    { currencyId: 'VND', currencyName: 'Vietnamese Dong', currencySign: '₫' },
    { currencyId: 'ZAR', currencyName: 'South African Rand', currencySign: 'R' },
];

export const defaultCurrencyObject: CurrencyType = {
    currencyId: 'USD',
    currencyName: 'US Dollar',
    currencySign: '$',
};
