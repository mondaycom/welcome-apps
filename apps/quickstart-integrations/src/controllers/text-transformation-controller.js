const mondayService = require('../services/monday-service');
const transformationService = require('../services/transformation-service');
const { TRANSFORMATION_TYPES } = require('../constants');
const API_TOKEN = process.env.API_TOKEN;

async function transformToMondayColumn(req, res) {
  const { payload } = req.body;
  const { inboundFieldValues } = payload;
  const { boardId, itemId, sourceColumnId, targetColumnId, transformationType } = inboundFieldValues;

  const token = API_TOKEN;
  const text = await mondayService.getColumnValue(token, itemId, sourceColumnId);
  if (!text) {
    return res.status(200).send({});
  }
  const transformedText = await transformationService.transformText(text, transformationType ? transformationType.value : 'TO_UPPER_CASE');

  await mondayService.changeColumnValue(token, boardId, itemId, targetColumnId, transformedText);

  return res.status(200).send({});
}

async function getTransformationTypes(req, res) {
  return res.status(200).send(TRANSFORMATION_TYPES);
}

module.exports = {
  transformToMondayColumn,
  getTransformationTypes
};
