const mondayService = require('../services/monday-service');
const transformationService = require('../services/transformation-service');
const { TRANSFORMATION_TYPES } = require('../constants');

async function transformToMondayColumn(req, res) {
  const { payload } = req.body;
  const { shortLivedToken } = req.session;
  const { inboundFieldValues } = payload;
  const { boardId, itemId, sourceColumnId, targetColumnId, transformationType } = inboundFieldValues;

  const text = await mondayService.getColumnValue(shortLivedToken, itemId, sourceColumnId);
  if (!text) {
    return res.status(200).send({});
  }
  const transformedText = await transformationService.transformText(
    text,
    transformationType ? transformationType.value : 'TO_UPPER_CASE'
  );

  await mondayService.changeColumnValue(shortLivedToken, boardId, itemId, targetColumnId, transformedText);

  return res.status(200).send({});
}

async function getTransformationTypes(req, res) {
  return res.status(200).send(TRANSFORMATION_TYPES);
}

async function subscribe(req, res) {
  return res.status(200).send({
    webhookId: req.body.payload.subscriptionId,
    result: 'it was cool',
  });
}

async function unsubscribe(req, res) {
  return res.status(200).send({ result: 'it was cool' });
}

module.exports = {
  transformToMondayColumn,
  getTransformationTypes,
  subscribe,
  unsubscribe,
};
