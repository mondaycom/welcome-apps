import * as  mondayService from'../services/monday-service.js';
import * as  currencyConverterService from '../services/currency-converter-service.js';
import { SUPPORTED_CURRENCIES } from '../constants/currency.js';

export async function executeAction(req, res) {
  const { shortLivedToken } = req.session;
  const { payload } = req.body;

  try {
    const { inputFields } = payload;
    const { boardId, itemId, sourceColumnId, targetColumnId, fromCurrency, toCurrency } = inputFields;

    const text = await mondayService.getColumnValue(shortLivedToken, itemId, sourceColumnId);
    if (!text) {
      return res.status(200).send({});
    }

    if (isNaN(+text)) {
      return res.status(400).send({});
    }

    const convertedCurrency = await currencyConverterService.convertCurrency(
      fromCurrency.value,
      toCurrency.value,
      +text
    );

    await mondayService.changeColumnValue(shortLivedToken, boardId, itemId, targetColumnId, convertedCurrency);

    return res.status(200).send({});
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

export async function getRemoteListOptions(req, res) {
  try {
    return res.status(200).send(SUPPORTED_CURRENCIES);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}
