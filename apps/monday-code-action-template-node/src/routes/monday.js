const router = require('express').Router();
const { mappedControllerFunctions } = require('../controllers/monday-controller');
const { authenticationMiddleware } = require('../middlewares/authentication');
const { functionalityMapping } = require("../services/monday-code-service")
const { validateFunctionalityMapping } = require("../helpers/validators/validate-functionality-mapping")

validateFunctionalityMapping(functionalityMapping);

functionalityMapping.forEach(({ route, type, func }) => {
  router.post(route, authenticationMiddleware, (req, res) => mappedControllerFunctions[type](req, res, func))
})

module.exports = router;
