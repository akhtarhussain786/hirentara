import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import * as XLSX from 'xlsx';
import {
  connectDb,
  closeDb,
  readDb,
  writeDb,
  generateApplicationId,
  hashPassword,
  verifyPassword
} from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Setup Uploads directory
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const TESTIMONIAL_IMAGES_DIR = path.join(UPLOADS_DIR, 'testimonials');
if (!fs.existsSync(TESTIMONIAL_IMAGES_DIR)) {
  fs.mkdirSync(TESTIMONIAL_IMAGES_DIR, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'resume-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Only PDF, DOC, DOCX and Images are allowed.'));
    }
  }
});

const testimonialImageUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, TESTIMONIAL_IMAGES_DIR),
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'testimonial-' + uniqueSuffix + path.extname(file.originalname).toLowerCase());
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Simple in-memory session token tracker
const activeSessions = new Set();

// Admin auth middleware
function requireAdmin(req, res, next) {
  const token = req.headers['x-admin-token'] || req.query.token;
  if (token && activeSessions.has(token)) {
    return next();
  }
  return res.status(401).json({ success: false, message: 'Unauthorized. Please login as admin.' });
}

// Protected uploads endpoint - Applicant details aur uploads sirf authorised admin ko available hon
app.use('/uploads', (req, res, next) => {
  const token = req.headers['x-admin-token'] || req.query.token;
  if (token && activeSessions.has(token)) {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Uploads are restricted to authorized admin only.' });
}, express.static(UPLOADS_DIR));
app.use('/testimonial-images', express.static(TESTIMONIAL_IMAGES_DIR));

// ----------------- PUBLIC ENDPOINTS -----------------

// Get entire public site content (Settings, Services, Notices, Opportunities, Testimonials, FAQs)
app.get('/api/site-data', async (req, res) => {
  const db = await readDb();
  res.json({
    success: true,
    data: {
      settings: db.settings,
      adminConfig: db.adminConfig,
      siteContent: db.siteContent,
      services: db.services || [],
      notices: (db.notices || []).filter(n => n.active),
      opportunities: (db.opportunities || []).filter(o => o.status === 'open'),
      allOpportunities: db.opportunities || [],
      testimonials: db.testimonials || [],
      faqs: db.faqs || []
    }
  });
});

// Get all active notices
app.get('/api/notices', async (req, res) => {
  const db = await readDb();
  const notices = (db.notices || []).filter(n => n.active);
  res.json({ success: true, data: notices });
});

// Get all opportunities (public can filter by open status)
app.get('/api/opportunities', async (req, res) => {
  const db = await readDb();
  let list = db.opportunities || [];
  if (req.query.status) {
    list = list.filter(o => o.status === req.query.status);
  }
  if (req.query.service) {
    list = list.filter(o => o.serviceType === req.query.service);
  }
  res.json({ success: true, data: list });
});

// Get single opportunity detail
app.get('/api/opportunities/:id', async (req, res) => {
  const db = await readDb();
  const item = (db.opportunities || []).find(o => o.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Opportunity not found' });
  }
  res.json({ success: true, data: item });
});

// Submit Application (Public Common Form)
app.post('/api/applications', upload.single('resume'), async (req, res) => {
  try {
    const {
      opportunityId,
      opportunityTitle,
      serviceType,
      country,
      fullName,
      mobile,
      whatsapp,
      district,
      state,
      qualification,
      experience,
      passportStatus,
      message
    } = req.body;

    if (!fullName || !mobile || !district || !state) {
      return res.status(400).json({
        success: false,
        message: 'Kripya zaroori fields (Naam, Mobile, District, State) bharein.'
      });
    }

    const db = await readDb();

    if (opportunityId) {
      const targetOpp = (db.opportunities || []).find(o => o.id === opportunityId);
      if (targetOpp && targetOpp.status === 'closed') {
        return res.status(400).json({
          success: false,
          message: 'Yeh opportunity abhi closed hai. Is par application band hai.'
        });
      }
    }

    const newApplicationId = await generateApplicationId();

    const applicationRecord = {
      id: newApplicationId,
      opportunityId: opportunityId || '',
      opportunityTitle: opportunityTitle || 'General Overseas Enquiry',
      serviceType: serviceType || 'Overseas Consultation',
      country: country || 'Not specified',
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      whatsapp: (whatsapp && whatsapp.trim()) || mobile.trim(),
      district: district.trim(),
      state: state.trim(),
      qualification: qualification ? qualification.trim() : 'N/A',
      experience: experience ? experience.trim() : 'N/A',
      passportStatus: passportStatus || 'No',
      resumeUrl: req.file ? `/uploads/${req.file.filename}` : '',
      resumeOriginalName: req.file ? req.file.originalname : '',
      message: message ? message.trim() : '',
      status: 'New', // Default status: New -> Contacted -> Documents Pending -> Processing -> Completed/Closed
      internalNotes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.applications = db.applications || [];
    db.applications.unshift(applicationRecord);
    await writeDb(db);

    return res.json({
      success: true,
      message: 'Application receive ho gayi hai. Hamari team details check karke aapse contact karegi.',
      applicationId: newApplicationId,
      data: applicationRecord
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    return res.status(500).json({ success: false, message: 'Submission failed. Please try again.' });
  }
});

// ----------------- ADMIN ENDPOINTS -----------------

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  const db = await readDb();
  if (username === db.admin.username && verifyPassword(password, db.admin.password)) {
    if (!db.admin.password.startsWith('scrypt$')) {
      db.admin.password = hashPassword(password);
      await writeDb(db);
    }
    const token = 'token-' + Date.now() + '-' + Math.random().toString(36).substring(2);
    activeSessions.add(token);
    return res.json({ success: true, token, message: 'Admin login successful' });
  }
  return res.status(401).json({ success: false, message: 'Galat username ya password.' });
});

// Admin verify session
app.get('/api/admin/verify', requireAdmin, (req, res) => {
  res.json({ success: true, message: 'Session is valid' });
});

// Admin logout
app.post('/api/admin/logout', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (token) activeSessions.delete(token);
  res.json({ success: true, message: 'Logged out successfully' });
});

// Admin get all notices (including inactive)
app.get('/api/admin/notices', requireAdmin, async (req, res) => {
  const db = await readDb();
  res.json({ success: true, data: db.notices || [] });
});

// Admin create notice
app.post('/api/admin/notices', requireAdmin, async (req, res) => {
  const { text, linkedOpportunityId, active } = req.body;
  if (!text) {
    return res.status(400).json({ success: false, message: 'Notice text is required' });
  }
  const db = await readDb();
  const newNotice = {
    id: 'not-' + Date.now(),
    text,
    linkedOpportunityId: linkedOpportunityId || '',
    active: active !== undefined ? active : true,
    createdAt: new Date().toISOString()
  };
  db.notices = db.notices || [];
  db.notices.unshift(newNotice);
  await writeDb(db);
  res.json({ success: true, data: newNotice });
});

// Admin update notice
app.put('/api/admin/notices/:id', requireAdmin, async (req, res) => {
  const db = await readDb();
  const index = (db.notices || []).findIndex(n => n.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Notice not found' });
  }
  db.notices[index] = { ...db.notices[index], ...req.body, updatedAt: new Date().toISOString() };
  await writeDb(db);
  res.json({ success: true, data: db.notices[index] });
});

// Admin delete notice
app.delete('/api/admin/notices/:id', requireAdmin, async (req, res) => {
  const db = await readDb();
  db.notices = (db.notices || []).filter(n => n.id !== req.params.id);
  await writeDb(db);
  res.json({ success: true, message: 'Notice deleted successfully' });
});

// Admin create opportunity
app.post('/api/admin/opportunities', requireAdmin, async (req, res) => {
  const { title, serviceType, country, imageUrl, salary, facilities, eligibility, charges, documentsRequired, deadline, status, featured } = req.body;
  if (!title || !serviceType || !country) {
    return res.status(400).json({ success: false, message: 'Title, Service Type and Country are required' });
  }
  const db = await readDb();
  const newOpp = {
    id: 'opp-' + Date.now(),
    title,
    serviceType,
    country,
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    salary: salary || '',
    facilities: facilities || '',
    eligibility: eligibility || '',
    charges: charges || '',
    documentsRequired: documentsRequired || '',
    deadline: deadline || 'Open',
    status: status || 'open',
    featured: !!featured,
    createdAt: new Date().toISOString()
  };
  db.opportunities = db.opportunities || [];
  db.opportunities.unshift(newOpp);
  await writeDb(db);
  res.json({ success: true, data: newOpp });
});

// Admin update opportunity
app.put('/api/admin/opportunities/:id', requireAdmin, async (req, res) => {
  const db = await readDb();
  const index = (db.opportunities || []).findIndex(o => o.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Opportunity not found' });
  }
  db.opportunities[index] = { ...db.opportunities[index], ...req.body, updatedAt: new Date().toISOString() };
  await writeDb(db);
  res.json({ success: true, data: db.opportunities[index] });
});

// Admin delete opportunity
app.delete('/api/admin/opportunities/:id', requireAdmin, async (req, res) => {
  const db = await readDb();
  db.opportunities = (db.opportunities || []).filter(o => o.id !== req.params.id);
  await writeDb(db);
  res.json({ success: true, message: 'Opportunity deleted successfully' });
});

// Admin get applications with filters and search
app.get('/api/admin/applications', requireAdmin, async (req, res) => {
  const db = await readDb();
  let list = db.applications || [];

  const { search, status, service, country } = req.query;

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(a =>
      a.fullName.toLowerCase().includes(q) ||
      a.mobile.includes(q) ||
      a.id.toLowerCase().includes(q) ||
      (a.opportunityTitle && a.opportunityTitle.toLowerCase().includes(q))
    );
  }

  if (status && status !== 'All') {
    list = list.filter(a => a.status === status);
  }

  if (service && service !== 'All') {
    list = list.filter(a => a.serviceType === service);
  }

  if (country && country !== 'All') {
    list = list.filter(a => a.country.toLowerCase().includes(country.toLowerCase()));
  }

  res.json({ success: true, data: list });
});

// Admin update application status
app.put('/api/admin/applications/:id/status', requireAdmin, async (req, res) => {
  const { status, note } = req.body;
  const db = await readDb();
  const validStatuses = db.adminConfig?.statuses || ['New', 'Contacted', 'Documents Pending', 'Processing', 'Completed', 'Closed'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  const appItem = (db.applications || []).find(a => a.id === req.params.id);
  if (!appItem) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }

  appItem.status = status;
  appItem.updatedAt = new Date().toISOString();

  if (note && note.trim()) {
    appItem.internalNotes = appItem.internalNotes || [];
    appItem.internalNotes.push({
      note: note.trim(),
      date: new Date().toISOString(),
      author: 'Admin'
    });
  }

  await writeDb(db);
  res.json({ success: true, data: appItem });
});

// Admin add internal note to application
app.post('/api/admin/applications/:id/notes', requireAdmin, async (req, res) => {
  const { note } = req.body;
  if (!note || !note.trim()) {
    return res.status(400).json({ success: false, message: 'Note content cannot be empty' });
  }

  const db = await readDb();
  const appItem = (db.applications || []).find(a => a.id === req.params.id);
  if (!appItem) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }

  appItem.internalNotes = appItem.internalNotes || [];
  const newNote = {
    note: note.trim(),
    date: new Date().toISOString(),
    author: 'Admin'
  };
  appItem.internalNotes.push(newNote);
  appItem.updatedAt = new Date().toISOString();

  await writeDb(db);
  res.json({ success: true, data: appItem });
});

// Admin Export Applications to Excel (.xlsx)
app.get('/api/admin/export', requireAdmin, async (req, res) => {
  try {
    const db = await readDb();
    let list = db.applications || [];

    const { search, status, service } = req.query;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.fullName.toLowerCase().includes(q) ||
        a.mobile.includes(q) ||
        a.id.toLowerCase().includes(q)
      );
    }
    if (status && status !== 'All') {
      list = list.filter(a => a.status === status);
    }
    if (service && service !== 'All') {
      list = list.filter(a => a.serviceType === service);
    }

    // Format rows for Excel
    const rows = list.map(item => ({
      'Application ID': item.id,
      'Full Name': item.fullName,
      'Mobile Number': item.mobile,
      'WhatsApp Number': item.whatsapp || item.mobile,
      'Service Type': item.serviceType,
      'Opportunity / Job': item.opportunityTitle,
      'Target Country': item.country,
      'District': item.district,
      'State': item.state,
      'Qualification': item.qualification,
      'Experience': item.experience,
      'Passport Ready': item.passportStatus,
      'Status': item.status,
      'Resume Uploaded': item.resumeUrl ? 'Yes' : 'No',
      'Candidate Message': item.message || '',
      'Submitted Date': new Date(item.createdAt).toLocaleString('en-IN'),
      'Last Update': new Date(item.updatedAt || item.createdAt).toLocaleString('en-IN'),
      'Latest Internal Note': item.internalNotes && item.internalNotes.length > 0
        ? item.internalNotes[item.internalNotes.length - 1].note
        : ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', `attachment; filename=overseas_applications_${Date.now()}.xlsx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    console.error('Error generating Excel export:', error);
    res.status(500).json({ success: false, message: 'Excel export failed' });
  }
});

// Admin stats overview
app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  const db = await readDb();
  const apps = db.applications || [];
  const opps = db.opportunities || [];
  const notices = db.notices || [];

  const statuses = db.adminConfig?.statuses || ['New', 'Contacted', 'Documents Pending', 'Processing', 'Completed', 'Closed'];
  const statusCounts = Object.fromEntries(statuses.map(status => [
    status,
    apps.filter(application => application.status === status).length
  ]));

  const stats = {
    totalApplications: apps.length,
    statusCounts,
    totalOpportunities: opps.length,
    activeNotices: notices.filter(n => n.active).length
  };

  res.json({ success: true, data: stats });
});

// Admin get complete site content for editing
app.get('/api/admin/site-data', requireAdmin, async (req, res) => {
  const db = await readDb();
  res.json({
    success: true,
    data: {
      settings: db.settings,
      adminConfig: db.adminConfig,
      siteContent: db.siteContent,
      services: db.services || [],
      notices: db.notices || [],
      opportunities: db.opportunities || [],
      testimonials: db.testimonials || [],
      faqs: db.faqs || []
    }
  });
});

// Admin update website general settings & branding
app.put('/api/admin/settings', requireAdmin, async (req, res) => {
  const db = await readDb();
  db.settings = { ...db.settings, ...req.body };
  await writeDb(db);
  res.json({ success: true, message: 'Website settings updated successfully', data: db.settings });
});

// Admin Services CRUD
app.post('/api/admin/services', requireAdmin, async (req, res) => {
  const db = await readDb();
  const newService = {
    id: 'srv-' + Date.now(),
    title: req.body.title || 'New Service',
    serviceType: req.body.serviceType || 'Overseas Service',
    badge: req.body.badge || 'Verified',
    imageUrl: req.body.imageUrl || 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80',
    description: req.body.description || '',
    features: req.body.features || []
  };
  db.services = db.services || [];
  db.services.push(newService);
  await writeDb(db);
  res.json({ success: true, data: newService });
});

app.put('/api/admin/services/:id', requireAdmin, async (req, res) => {
  const db = await readDb();
  const index = (db.services || []).findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Service not found' });
  db.services[index] = { ...db.services[index], ...req.body };
  await writeDb(db);
  res.json({ success: true, data: db.services[index] });
});

app.delete('/api/admin/services/:id', requireAdmin, async (req, res) => {
  const db = await readDb();
  db.services = (db.services || []).filter(s => s.id !== req.params.id);
  await writeDb(db);
  res.json({ success: true, message: 'Service deleted successfully' });
});

// Admin Testimonials CRUD
app.post('/api/admin/testimonials', requireAdmin, testimonialImageUpload.single('photoFile'), async (req, res) => {
  const db = await readDb();
  const newTestimonial = {
    id: 'test-' + Date.now(),
    name: req.body.name || 'Candidate Name',
    role: req.body.role || 'Overseas Role',
    country: req.body.country || 'Destination',
    photo: req.file ? `/testimonial-images/${req.file.filename}` : (req.body.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'),
    quote: req.body.quote || '',
    placedDate: req.body.placedDate || 'Placed Recently',
    salary: req.body.salary || ''
  };
  db.testimonials = db.testimonials || [];
  db.testimonials.push(newTestimonial);
  await writeDb(db);
  res.json({ success: true, data: newTestimonial });
});

app.put('/api/admin/testimonials/:id', requireAdmin, testimonialImageUpload.single('photoFile'), async (req, res) => {
  const db = await readDb();
  const index = (db.testimonials || []).findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Testimonial not found' });
  db.testimonials[index] = {
    ...db.testimonials[index],
    ...req.body,
    ...(req.file ? { photo: `/testimonial-images/${req.file.filename}` } : {})
  };
  await writeDb(db);
  res.json({ success: true, data: db.testimonials[index] });
});

app.delete('/api/admin/testimonials/:id', requireAdmin, async (req, res) => {
  const db = await readDb();
  db.testimonials = (db.testimonials || []).filter(t => t.id !== req.params.id);
  await writeDb(db);
  res.json({ success: true, message: 'Testimonial deleted successfully' });
});

// Admin FAQ CRUD
app.post('/api/admin/faqs', requireAdmin, async (req, res) => {
  const db = await readDb();
  const newFaq = {
    id: 'faq-' + Date.now(),
    q: req.body.q || 'New Question',
    a: req.body.a || 'Answer'
  };
  db.faqs = db.faqs || [];
  db.faqs.push(newFaq);
  await writeDb(db);
  res.json({ success: true, data: newFaq });
});

app.put('/api/admin/faqs/:id', requireAdmin, async (req, res) => {
  const db = await readDb();
  const index = (db.faqs || []).findIndex(f => f.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'FAQ not found' });
  db.faqs[index] = { ...db.faqs[index], ...req.body };
  await writeDb(db);
  res.json({ success: true, data: db.faqs[index] });
});

app.delete('/api/admin/faqs/:id', requireAdmin, async (req, res) => {
  const db = await readDb();
  db.faqs = (db.faqs || []).filter(f => f.id !== req.params.id);
  await writeDb(db);
  res.json({ success: true, message: 'FAQ deleted successfully' });
});

// Admin Security Update (Username & Password)
app.put('/api/admin/security', requireAdmin, async (req, res) => {
  const { newUsername, newPassword } = req.body;
  if (!newPassword || newPassword.length < 4) {
    return res.status(400).json({ success: false, message: 'Password kam se kam 4 characters ka hona chahiye.' });
  }
  const db = await readDb();
  db.admin.username = newUsername || db.admin.username;
  db.admin.password = hashPassword(newPassword);
  await writeDb(db);
  res.json({ success: true, message: 'Admin username aur password safaltapoorvak badal gaya.' });
});

// Serve frontend in production build if dist directory exists
const DIST_DIR = path.join(__dirname, '..', 'dist');
if (fs.existsSync(DIST_DIR)) {
  // Static assets from dist
  app.use(express.static(DIST_DIR, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    }
  }));

  // Handle cached requests for main.tsx / main.jsx by serving the built bundle as JS
  app.get(['/src/main.tsx', '/src/main.jsx', '/main.tsx', '/main.jsx', '/@fs/*'], (req, res) => {
    try {
      const assetsDir = path.join(DIST_DIR, 'assets');
      if (fs.existsSync(assetsDir)) {
        const files = fs.readdirSync(assetsDir);
        const jsFile = files.find(f => f.endsWith('.js'));
        if (jsFile) {
          res.setHeader('Content-Type', 'application/javascript');
          return res.sendFile(path.join(assetsDir, jsFile));
        }
      }
    } catch (e) {}
    res.setHeader('Content-Type', 'application/javascript');
    res.send('// bundle alias\nwindow.location.reload();');
  });

  // SPA fallback for HTML pages
  app.get('*', (req, res) => {
    // If request has a file extension (e.g. .js, .css, .tsx, .png), do NOT send index.html (prevents MIME type errors)
    if (path.extname(req.path)) {
      return res.status(404).send('Asset not found');
    }
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

async function startServer() {
  try {
    await connectDb();
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Backend server running smoothly on http://127.0.0.1:${PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`[WARN] Port ${PORT} already active. Existing server instance is handling requests.`);
      } else {
        console.error('[ERROR] Server listen failed:', err);
      }
    });
  } catch (error) {
    console.error('[ERROR] MongoDB connection failed. Server not started:', error);
    await closeDb();
    process.exitCode = 1;
  }
}

startServer();
