const prisma = require('../config/db');

const ALLOWED_TRANSITIONS = {
  assigned:    ['in_progress'],
  in_progress: ['resolved']
};

// GET /technician/complaints
exports.getAssigned = async (req, res) => {
  const { status, urgency } = req.query;
  const where = { assignedToId: req.user.id };
  if (status)  where.status  = status;
  if (urgency) where.urgency = urgency;

  const complaints = await prisma.complaint.findMany({
    where,
    include: { lab: { select: { name: true } } },
    orderBy: [{ urgency: 'desc' }, { createdAt: 'asc' }]
  });

  res.json({ complaints, total: complaints.length });
};

// PUT /technician/complaints/:id/status
exports.updateStatus = async (req, res) => {
  const { status: newStatus, note } = req.body;
  const complaintId = req.params.id;

  const complaint = await prisma.complaint.findUnique({ where: { id: complaintId } });
  if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

  if (complaint.assignedToId !== req.user.id)
    return res.status(403).json({ message: 'This complaint is not assigned to you' });

  const allowed = ALLOWED_TRANSITIONS[complaint.status] || [];
  if (!allowed.includes(newStatus))
    return res.status(400).json({ message: `Invalid transition: ${complaint.status} → ${newStatus}` });

  const updateData = { status: newStatus };
  if (newStatus === 'resolved') updateData.resolvedAt = new Date();

  await prisma.complaint.update({ where: { id: complaintId }, data: updateData });

  await prisma.statusLog.create({
    data: {
      complaintId,
      changedById: req.user.id,
      oldStatus:   complaint.status,
      newStatus,
      note
    }
  });

  res.json({
    complaintNo: complaint.complaintNo,
    oldStatus:   complaint.status,
    newStatus,
    updatedAt:   new Date()
  });
};