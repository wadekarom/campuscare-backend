const router = require('express').Router();
const ctrl   = require('../controllers/complaint.controller');
const auth   = require('../middleware/authenticate');

router.post('/',    auth, ctrl.submit);
router.get('/',     auth, ctrl.listMine);
router.get('/:id',  auth, ctrl.getDetail);

module.exports = router;