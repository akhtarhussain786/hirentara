import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const defaultData = {
  admin: {
    username: "admin",
    password: "admin123"
  },
  settings: {
    siteName: "OverseasServices",
    siteSubtitle: "Videsh Jobs, Visa & Attestation Portal",
    heroTitle: "Videsh Jane Ka Sapna,",
    heroHighlight: "Sahi, Surakshit & Legal",
    heroSuffix: "Tarike Se.",
    heroDescription: "Dubai, Gulf aur European deshon me verified jobs, fast-track visa processing aur legal MEA document attestation. Hamari team aapke sath shuruat se visa milne tak khadi rehti hai.",
    heroImageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80",
    placedCount: "5,400+",
    visaSuccessRate: "98.4%",
    genuineContracts: "100%",
    phone: "+919876543210",
    whatsapp: "919876543210",
    email: "contact@overseas-services.com",
    officeAddress: "SCF 24, 2nd Floor, Overseas Hub Commercial Complex, Near Bus Stand, Gorakhpur, UP - 273001",
    workingHours: "Monday - Saturday: 9:30 AM to 6:30 PM (Sunday Closed)"
  },
  services: [
    {
      id: "srv-1",
      serviceType: "Overseas Jobs",
      title: "Overseas Jobs (Videsh Rozgar)",
      badge: "Urgent Hiring",
      imageUrl: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80",
      description: "Dubai, Gulf, Poland aur European countries me verified employers ke saath hotel, warehouse, technician, driver aur logistics jobs.",
      features: [
        "Direct Employer Contracts & Offer Letters",
        "Company Stay, Food & Health Insurance",
        "Transparent Process & Fair Salary",
        "Pre-departure orientation & airport pickup"
      ]
    },
    {
      id: "srv-2",
      serviceType: "Visa Assistance",
      title: "Visa Assistance Services",
      badge: "98% Approval",
      imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
      description: "Employment Visa, Tourist Visa, Business Visa aur Student Visa ke liye complete file preparation, appointment booking aur counseling.",
      features: [
        "VFS & Embassy Appointment Booking",
        "Cover Letter, SOP & Financial Checklist",
        "Embassy Mock Interview Guidance",
        "Fast-track Visa filing & live status track"
      ]
    },
    {
      id: "srv-3",
      serviceType: "Documents Assistance",
      title: "MEA Apostille & Attestation",
      badge: "Govt Certified",
      imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
      description: "MEA Apostille, State HRD, Notary, SDM aur foreign embassies (UAE, Saudi, Kuwait, Qatar) se legal degree aur certificate attestation.",
      features: [
        "MEA (Ministry of External Affairs) Apostille",
        "Degree, Marksheet & Diploma Stamping",
        "Birth, Marriage & Commercial Certificate",
        "Safe doorstep pickup & speed courier service"
      ]
    }
  ],
  notices: [
    {
      id: "not-1",
      text: "Dubai job applications open - Urgent vacancy for Hotel & Facility Staff! Details dekhein.",
      linkedOpportunityId: "opp-1",
      active: true,
      createdAt: "2026-11-10T10:00:00.000Z"
    },
    {
      id: "not-2",
      text: "Poland Warehouse & Logistics Worker requirements open - Free accommodation provided.",
      linkedOpportunityId: "opp-2",
      active: true,
      createdAt: "2026-11-10T10:05:00.000Z"
    },
    {
      id: "not-3",
      text: "Gulf & European Country Visa Processing & Document Attestation Express Service.",
      linkedOpportunityId: "opp-4",
      active: true,
      createdAt: "2026-11-10T10:10:00.000Z"
    }
  ],
  opportunities: [
    {
      id: "opp-1",
      title: "Dubai Hotel & Hospitality Staff",
      serviceType: "Overseas Jobs",
      country: "UAE (Dubai)",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      salary: "2,400 - 3,200 AED / Month (~ ₹55,000 - ₹72,000 INR)",
      facilities: "Free Accommodation, Transport, Food allowance, Medical Insurance & 2 Years Contract with Visa",
      eligibility: "Age: 21-38 years. Minimum 10th/12th Pass. Basic English ya Hindi communication. Freshers & experienced both eligible.",
      charges: "Government visa fees + medical & documentation charges. Detailed breakdown given after selection.",
      documentsRequired: "Passport copy (Minimum 1 year validity), 4 Passport-size photos (white background), Education certificates, Updated Resume (if available)",
      deadline: "2026-12-15",
      status: "open",
      featured: true,
      createdAt: "2026-11-10T09:00:00.000Z"
    },
    {
      id: "opp-2",
      title: "Poland Warehouse Packing & Logistics Assistant",
      serviceType: "Overseas Jobs",
      country: "Poland (Europe)",
      imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
      salary: "4,200 - 5,200 PLN / Month (~ ₹85,000 - ₹1,05,000 INR) + Overtime",
      facilities: "Company provided stay/hostel, subsidized food, European Work Permit (TRC support eligible), Overtime bonus",
      eligibility: "Age: 20-45 years. Physically fit. No prior IELTS required. Hardworking attitude.",
      charges: "Official Polish Work Permit approval charges, VFS appointment & flight ticket costs. Transparent structure.",
      documentsRequired: "Valid Passport, PCC (Police Clearance Certificate), Education proofs, Medical fitness certificate",
      deadline: "2026-12-30",
      status: "open",
      featured: true,
      createdAt: "2026-11-10T09:15:00.000Z"
    },
    {
      id: "opp-3",
      title: "Saudi Arabia Electrician & AC Technician",
      serviceType: "Overseas Jobs",
      country: "Saudi Arabia",
      imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
      salary: "2,600 - 3,400 SAR / Month (~ ₹58,000 - ₹75,000 INR)",
      facilities: "Sharing accommodation, Iqama provided, Medical insurance, 42 days paid leave after 2 years",
      eligibility: "Age: 22-42 years. ITI / Diploma / Technical trade certificate or minimum 2 years field experience.",
      charges: "Visa stamping + Gamca Medical + Emigration charges as per government guidelines.",
      documentsRequired: "Original Passport, Trade/Skill Certificate, Experience Certificate, White background photos",
      deadline: "2026-12-20",
      status: "open",
      featured: false,
      createdAt: "2026-11-10T09:30:00.000Z"
    },
    {
      id: "opp-4",
      title: "Gulf & European Work/Tourist Visa Assistance",
      serviceType: "Visa Assistance",
      country: "Dubai, Qatar, Poland, Croatia",
      imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
      salary: "N/A - Visa Consultation & Processing",
      facilities: "Complete file preparation, Embassy appointment booking, Interview guidance & Visa tracking",
      eligibility: "Valid passport holders seeking genuine employment or travel visas.",
      charges: "Consultation & file preparation fee. Embassy visa fees as per country tariffs.",
      documentsRequired: "Passport, Bank statement/financial proof, Photographs, Purpose statement",
      deadline: "Open All Year",
      status: "open",
      featured: true,
      createdAt: "2026-11-10T09:45:00.000Z"
    },
    {
      id: "opp-5",
      title: "MEA Apostille & Embassy Document Attestation",
      serviceType: "Documents Assistance",
      country: "All Overseas Destinations",
      imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
      salary: "N/A - Documentation Support",
      facilities: "Notary, SDM, State HRD, MEA Apostille & Embassy stamping door-to-door delivery assistance",
      eligibility: "Anyone planning for overseas job, higher studies or immigration.",
      charges: "Standard government attestation fee per certificate + nominal processing charges.",
      documentsRequired: "Original Degree / Marksheet / Marriage / Birth Certificate + Passport copy",
      deadline: "Open All Year",
      status: "open",
      featured: false,
      createdAt: "2026-11-10T09:50:00.000Z"
    }
  ],
  testimonials: [
    {
      id: "test-1",
      name: "Rameshwar Yadav",
      role: "Hotel Facilities & Steward",
      country: "Dubai, UAE",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      quote: "Overseas Services ke through mera Dubai hotel me selection hua. Visa 25 din me aa gaya aur company ne free room aur khana diya hai. Bahut honest team hai.",
      placedDate: "Placed Oct 2026",
      salary: "2,600 AED / Month"
    },
    {
      id: "test-2",
      name: "Praveen Sharma",
      role: "Logistics Warehouse Assistant",
      country: "Warsaw, Poland (Europe)",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      quote: "Europe jane ka sapna tha. Sirf basic 12th thi, lekin inhone work permit aur VFS appointment me poora guide kiya. Aaj Poland me achhi earning kar raha hu.",
      placedDate: "Placed Sep 2026",
      salary: "4,600 PLN / Month"
    },
    {
      id: "test-3",
      name: "Mohammad Irfan",
      role: "Certified Industrial Electrician",
      country: "Riyadh, Saudi Arabia",
      photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
      quote: "ITI ke baad job dhoondh raha tha. Inke pass aane ke baad trade test hua aur direct company ka offer letter mila. Iqama aur medical sab smoothly ho gaya.",
      placedDate: "Placed Aug 2026",
      salary: "3,000 SAR / Month"
    }
  ],
  faqs: [
    {
      id: "faq-1",
      q: "Videsh jane ke liye kya passport pehle se hona zaroori hai?",
      a: "Nahi, shuruat me agar aapke paas passport nahi bhi hai, tab bhi aap enquiry form bhar sakte hain. Hamari team aapko Tatkal ya Normal passport banwane ka poora process samjha degi. Lekin visa stamping ke samay valid passport zaroori hota hai."
    },
    {
      id: "faq-2",
      q: "Visa aur processing me lagbhag kitna samay lagta hai?",
      a: "Gulf deshon (Dubai, Saudi Arabia, Qatar) ke liye employment visa aamtaur par 20 se 35 din me process ho jata hai. European deshon (Poland, Croatia) ke liye official Work Permit aane me 60 se 90 din ka samay lagta hai."
    },
    {
      id: "faq-3",
      q: "Kya rehna (Accommodation) aur khana company ki taraf se milta hai?",
      a: "Haan, hamari zyadatar overseas job vacancies me company sharing accommodation, transportation aur food allowance ya subsidized mess provide karti hai. Har vacancy ke Details page par iski poori jankari di gayi hai."
    },
    {
      id: "faq-4",
      q: "Kya koi hidden charges ya fraud ka risk hai?",
      a: "Bilkul nahi. Hamari consultancy 100% genuine aur government registered standards follow karti hai. Document verification aur selection ke baad transparent fee breakdown diya jata hai aur proper receipt di jati hai."
    },
    {
      id: "faq-5",
      q: "Medical fitness test (GAMCA) kaise aur kahan hota hai?",
      a: "Gulf deshon ke liye GAMCA approved centers par medical test hota hai. Hamari team aapke shahar ke sabse kareebi approved medical center ka appointment book karwane me madad karti hai."
    }
  ],
  applications: [
    {
      id: "OS-2026-1001",
      opportunityId: "opp-1",
      opportunityTitle: "Dubai Hotel & Hospitality Staff",
      serviceType: "Overseas Jobs",
      country: "UAE (Dubai)",
      fullName: "Rahul Kumar Verma",
      mobile: "9876543210",
      whatsapp: "9876543210",
      district: "Gorakhpur",
      state: "Uttar Pradesh",
      qualification: "12th Pass + Hotel Management Diploma",
      experience: "2 years experience in local restaurant",
      passportStatus: "Yes",
      resumeUrl: "",
      resumeOriginalName: "",
      message: "Dubai me waiter ya front desk job ke liye interested hu. Passport ready hai.",
      status: "Contacted",
      internalNotes: [
        {
          note: "Candidate se call par baat hui. Fluent Hindi aur basic English bol leta hai. Passport valid till 2030.",
          date: "2026-11-10T11:20:00.000Z",
          author: "Admin"
        }
      ],
      createdAt: "2026-11-10T10:15:00.000Z",
      updatedAt: "2026-11-10T11:20:00.000Z"
    },
    {
      id: "OS-2026-1002",
      opportunityId: "opp-2",
      opportunityTitle: "Poland Warehouse Packing & Logistics Assistant",
      serviceType: "Overseas Jobs",
      country: "Poland (Europe)",
      fullName: "Amit Singh",
      mobile: "9812345678",
      whatsapp: "9812345678",
      district: "Patna",
      state: "Bihar",
      qualification: "Graduate (BA)",
      experience: "1 year warehouse packaging experience",
      passportStatus: "Yes",
      resumeUrl: "",
      resumeOriginalName: "",
      message: "Europe warehouse job ke liye apply karna chahta hu. Family support ke liye jaldi jana hai.",
      status: "New",
      internalNotes: [],
      createdAt: "2026-11-10T11:45:00.000Z",
      updatedAt: "2026-11-10T11:45:00.000Z"
    },
    {
      id: "OS-2026-1003",
      opportunityId: "opp-5",
      opportunityTitle: "MEA Apostille & Embassy Document Attestation",
      serviceType: "Documents Assistance",
      country: "All Overseas Destinations",
      fullName: "Mohammad Arif",
      mobile: "9798765432",
      whatsapp: "9798765432",
      district: "Lucknow",
      state: "Uttar Pradesh",
      qualification: "B.Tech Mechanical",
      experience: "Degree attestation required for Kuwait Visa",
      passportStatus: "Yes",
      resumeUrl: "",
      resumeOriginalName: "",
      message: "Kuwait employment visa ke liye B.Tech degree MEA aur Kuwait Embassy se attest karwani hai.",
      status: "Documents Pending",
      internalNotes: [
        {
          note: "Candidate ko original degree aur marksheet courier karne ki checklist WhatsApp par bhej di hai.",
          date: "2026-11-10T12:00:00.000Z",
          author: "Admin"
        }
      ],
      createdAt: "2026-11-10T11:50:00.000Z",
      updatedAt: "2026-11-10T12:00:00.000Z"
    }
  ]
};

// Initialize DB file
fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');

export function readDb() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    // Ensure all keys exist
    return {
      admin: parsed.admin || defaultData.admin,
      settings: parsed.settings || defaultData.settings,
      services: parsed.services || defaultData.services,
      notices: parsed.notices || defaultData.notices,
      opportunities: parsed.opportunities || defaultData.opportunities,
      testimonials: parsed.testimonials || defaultData.testimonials,
      faqs: parsed.faqs || defaultData.faqs,
      applications: parsed.applications || defaultData.applications
    };
  } catch (err) {
    console.error("Error reading database, restoring defaults:", err);
    return defaultData;
  }
}

export function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error("Error writing to database:", err);
    return false;
  }
}

export function generateApplicationId() {
  const db = readDb();
  const count = (db.applications?.length || 0) + 1;
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `OS-${new Date().getFullYear()}-${count}${randomSuffix.toString().slice(-2)}`;
}
