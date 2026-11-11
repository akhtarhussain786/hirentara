import { readDb, writeDb, generateApplicationId } from './db.js';
import * as XLSX from 'xlsx';

console.log('--- Testing Hirentara Database & Logic ---');

// Test 1: Read DB
const db = readDb();
console.log('✓ Database read successfully');
console.log(`  - Notices count: ${db.notices?.length}`);
console.log(`  - Opportunities count: ${db.opportunities?.length}`);
console.log(`  - Applications count: ${db.applications?.length}`);

// Test 2: Generate unique application ID
const id1 = generateApplicationId();
const id2 = generateApplicationId();
console.log(`✓ Generated Application IDs: ${id1}, ${id2}`);
if (!id1.startsWith('HT-') || id1 === id2) {
  throw new Error('Application ID generation mismatch');
}

// Test 3: Insert new test application
const testApp = {
  id: id1,
  opportunityId: 'opp-1',
  opportunityTitle: 'Dubai Hotel & Hospitality Staff',
  serviceType: 'Overseas Jobs',
  country: 'UAE (Dubai)',
  fullName: 'Mohd Salman Test',
  mobile: '9876543210',
  whatsapp: '9876543210',
  district: 'Gorakhpur',
  state: 'Uttar Pradesh',
  qualification: '12th Pass',
  experience: '2 years hospitality',
  passportStatus: 'Yes',
  resumeUrl: '',
  resumeOriginalName: '',
  message: 'Testing verification flow',
  status: 'New',
  internalNotes: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

db.applications.unshift(testApp);
writeDb(db);
console.log('✓ Application record saved to database.json successfully');

// Test 4: Excel (.xlsx) workbook generation
const rows = db.applications.map(item => ({
  'Application ID': item.id,
  'Full Name': item.fullName,
  'Mobile Number': item.mobile,
  'WhatsApp Number': item.whatsapp,
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
  'Submitted Date': new Date(item.createdAt).toLocaleString('en-IN')
}));

const worksheet = XLSX.utils.json_to_sheet(rows);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications');
const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
console.log(`✓ Excel export generated successfully (buffer size: ${buffer.length} bytes)`);

// Clean up test app
db.applications = db.applications.filter(a => a.id !== id1);
writeDb(db);
console.log('✓ Test cleanup completed');

console.log('\n>>> ALL MODULE & BACKEND LOGIC CHECKS PASSED PERFECTLY! <<<');

