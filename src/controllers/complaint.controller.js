const prisma = require('../config/db');
const { generateComplaintNo } = require('../utils/complaintNumber');

// POST /complaints
exports.submit = async (req, res) => {
  const { labId, issueType, title, description, urgency } = req.body;
  const studentId = req.user.id;

  const complaintNo = await generateComplaintNo();

  const complaint = await prisma.complaint.create({
    data: { complaintNo, studentId, labId, issueType, title, description, urgency: urgency || 'medium' },
    include: { lab: { select: { name: true } } }
  });

  res.status(201).json({
    id:          complaint.id,
    complaintNo: complaint.complaintNo,
    status:      complaint.status,
    lab:         complaint.lab.name,
    issueType:   complaint.issueType,
    title:       complaint.title,
    urgency:     complaint.urgency,
    createdAt:   complaint.createdAt
  });
};

// GET /complaints
exports.listMine = async (req, res) => {
  const { status } = req.query;
  const where = { studentId: req.user.id };
  if (status) where.status = status;

  const complaints = await prisma.complaint.findMany({
    where,
    include: { lab: { select: { name: true } } },
    orderBy: { createdAt: 'desc' }
  });

  res.json({ complaints, total: complaints.length });
};

// GET /complaints/:id
exports.getDetail = async (req, res) => {
  const complaint = await prisma.complaint.findUnique({
    where: { id: req.params.id },
    include: {
      lab:        { select: { id: true, name: true, location: true } },
      assignedTo: { select: { id: true, name: true } },
      statusLogs: {
        include: { changedBy: { select: { name: true } } },
        orderBy: { changedAt: 'asc' }
      }
    }
  });

  if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

  if (req.user.role === 'student' && complaint.studentId !== req.user.id)
    return res.status(403).json({ message: 'Access denied' });

  res.json(complaint);
};