const Ajv = require('ajv');
const { functionTypes } = require('../../consts/supported-function-types');

const ajv = new Ajv({ allErrors: true });

require('ajv-errors')(ajv);

ajv.addKeyword(({
  keyword: "isFunction",
  validate: (schema, data) => typeof data === 'function'
}));

const entitySchema = {
  type: 'object',
  properties: {
    route: { type: 'string' },
    type: {
      type: 'string',
      enum: Object.values(functionTypes)
    },
    func: {
      isFunction: true,
      errorMessage: 'func has to be a function'
    }
  },
  required: ['func', 'route', 'type'],
  additionalProperties: false
};
const schema = {
  type: 'array',
  items: entitySchema
};
const validate = ajv.compile(schema);

const validateFunctionalityMapping = obj => {
  const valid = validate(obj);
  if (!valid) {
    console.error(validate.errors);
    throw new Error('Invalid functionalityMapping structure');
  }
};

module.exports = {
  validateFunctionalityMapping
};
