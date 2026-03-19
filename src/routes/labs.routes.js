const router = require('express').Router();
const ctrl   = require('../controllers/labs.controller');
const auth   = require('../middleware/authenticate');

router.get('/', auth, ctrl.getLabs);

module.exports = router;