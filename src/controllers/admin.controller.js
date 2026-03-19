const prisma = require('../config/db');

// GET /admin/complaints
exports.getAllComplaints = async (req, res) => {
  const { status, labId, urgency } = req.query;
  const where = {};
  if (status) where.status = status;
  if (labId)  where.labId  = labId;
  if (urgency) where.urgency = urgency;

  const complaints = await prisma.complaint.findMany({
    where,
    include: {
      student:    { select: { name: true, email: true } },
      lab:        { select: { name: true } },
      assignedTo: { select: { name: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.json({ complaints, total: complaints.length });
};

// PUT /admin/complaints/:id/assign
exports.assignTechnician = async (req, res) => {
  const { technicianId, note } = req.body;
  const complaintId = req.params.id;

  const complaint = await prisma.complaint.findUnique({ where: { id: complaintId } });
  if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
  if (complaint.status !== 'open') return res.status(400).json({ message: 'Only open complaints can be assigned' });

  const tech = await prisma.user.findUnique({ where: { id: technicianId } });
  if (!tech || tech.role !== 'technician') return res.status(400).json({ message: 'Invalid technician' });

  const updated = await prisma.complaint.update({
    where: { id: complaintId },
    data: {
      status:       'assigned',
      assignedToId: technicianId,
      assignedAt:   new Date(),
      adminNote:    note
    },
    include: { assignedTo: { select: { id: true, name: true } } }
  });

  await prisma.statusLog.create({
    data: {
      complaintId,
      changedById: req.user.id,
      oldStatus:   'open',
      newStatus:   'assigned',
      note
    }
  });

  res.json({
    complaintNo: complaint.complaintNo,
    status:      updated.status,
    assignedTo:  updated.assignedTo,
    assignedAt:  updated.assignedAt
  });
};

// PUT /admin/complaints/:id/reject
exports.rejectComplaint = async (req, res) => {
  const { note } = req.body;
  const complaintId = req.params.id;

  const complaint = await prisma.complaint.findUnique({ where: { id: complaintId } });
  if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
  if (complaint.status !== 'open') return res.status(400).json({ message: 'Only open complaints can be rejected' });

  await prisma.complaint.update({
    where: { id: complaintId },
    data: { status: 'rejected', adminNote: note }
  });

  await prisma.statusLog.create({
    data: {
      complaintId,
      changedById: req.user.id,
      oldStatus:   'open',
      newStatus:   'rejected',
      note
    }
  });

  res.json({ complaintNo: complaint.complaintNo, status: 'rejected' });
};

// GET /admin/technicians
exports.getTechnicians = async (req, res) => {
  const technicians = await prisma.user.findMany({
    where: { role: 'technician', isActive: true },
    select: {
      id: true, name: true, email: true,
      _count: {
        select: {
          assignedComplaints: {
            where: { status: { in: ['assigned', 'in_progress'] } }
          }
        }
      }
    }
  });

  const result = technicians.map(t => ({
    id:               t.id,
    name:             t.name,
    email:            t.email,
    activeComplaints: t._count.assignedComplaints
  }));

  res.json({ technicians: result });
};