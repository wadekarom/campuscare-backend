const router    = require('express').Router();
const ctrl      = require('../controllers/technician.controller');
const auth      = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.use(auth, authorize('technician'));

router.get('/complaints',            ctrl.getAssigned);
router.put('/complaints/:id/status', ctrl.updateStatus);

module.exports = router;