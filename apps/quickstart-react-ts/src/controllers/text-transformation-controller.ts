import mondayService from '../services/monday-service';
import transformationService from '../services/transformation-service';
import TRANSFORMATION_TYPES from '../constants';

export async function transformToMondayColumn(req, res) {
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

export async function getTransformationTypes(req, res) {
  return res.status(200).send(TRANSFORMATION_TYPES);
}

export async function subscribe(req, res) {
  return res.status(200).send({
    webhookId: req.body.payload.subscriptionId,
    result: 'it was cool',
  });
}

export async function unsubscribe(req, res) {
  return res.status(200).send({ result: 'it was cool' });
}
