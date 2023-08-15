import axios from 'axios';
import { CURRENCY_CONVERTER_API_KEY } from '../constants/secret-keys.js';
import { getSecret } from '../helpers/secret-store.js';
import { SUPPORTED_CURRENCIES_MAP } from '../constants/currency.js';

export const convertCurrency = async (from, to, amount) => {
  if (SUPPORTED_CURRENCIES_MAP[from] === undefined || SUPPORTED_CURRENCIES_MAP[to] === undefined) {
    throw new Error('Unsupported currency');
  }

  const currencyConverterKey = getSecret('CURRENCY_CONVERTER_API_KEY');
  const options = {
    method: 'GET',
    url: `https://v6.exchangerate-api.com/v6/${currencyConverterKey}/latest/${from}`,
  };

  try {
    const response = await axios.request(options);
    const conversionRates = response.data.conversion_rates;
    const toConversionRate = conversionRates[to];
    const convertedAmount = amount * toConversionRate;
    return convertedAmount;
  } catch (error) {
    throw new Error('Error converting currency');
  }
}
