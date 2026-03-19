const router    = require('express').Router();
const ctrl      = require('../controllers/admin.controller');
const auth      = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.use(auth, authorize('admin'));

router.get('/complaints',              ctrl.getAllComplaints);
router.put('/complaints/:id/assign',   ctrl.assignTechnician);
router.put('/complaints/:id/reject',   ctrl.rejectComplaint);
router.get('/technicians',             ctrl.getTechnicians);

module.exports = router;