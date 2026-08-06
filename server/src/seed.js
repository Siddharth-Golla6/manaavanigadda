// Populates a fresh database with realistic sample data — mirrors what the
// frontend used to hardcode in src/data/mockData.js before the backend existed.
// Run with: npm run seed  (requires DATABASE_URL to point at a real database)

import "dotenv/config";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "./config/prisma.js";
import { MANDALS } from "./data/geography.js";
import { categoryImage } from "./data/categoryImage.js";

// Generated fresh on every run and never written to disk or git — a fixed,
// well-known seed password (this used to be the literal string
// "password123") is a real risk the moment this file is public, since these
// accounts include an Administrator with full platform access.
const DEMO_PASSWORD = crypto.randomBytes(9).toString("base64url");
const mandalName = (id) => MANDALS.find((m) => m.id === id)?.name;

async function seed() {
  console.log("Clearing existing data...");
  // Children-before-parents order — Problem's own child rows (photos,
  // comments, status history, progress photos, supporters) cascade-delete
  // automatically via their FK constraints when their Problem is deleted.
  await prisma.problem.deleteMany({});
  await prisma.volunteer.deleteMany({});
  await prisma.announcement.deleteMany({});
  await prisma.activityLog.deleteMany({});
  await prisma.otpCode.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  console.log("Seeding users...");
  const resident = await prisma.user.create({
    data: { name: "R. Narayana", phone: "9876500001", passwordHash, role: "Resident", mandalId: "avanigadda" },
  });
  const volunteerUser = await prisma.user.create({
    data: { name: "V. Ramesh", phone: "9876500002", passwordHash, role: "Volunteer", mandalId: "avanigadda" },
  });
  const volunteerUser2 = await prisma.user.create({
    data: { name: "S. Anil Kumar", phone: "9876500003", passwordHash, role: "Volunteer", mandalId: "koduru" },
  });
  const mandalAdmin = await prisma.user.create({
    data: { name: "Ch. Ravi Teja", phone: "9876500004", passwordHash, role: "Mandal Admin", mandalId: "challapalli" },
  });
  const administrator = await prisma.user.create({
    data: { name: "Administrator", phone: "9876500000", passwordHash, role: "Administrator", mandalId: null },
  });

  console.log("Seeding volunteers...");
  await prisma.volunteer.createMany({
    data: [
      { name: "V. Ramesh", mandalId: "avanigadda", resolved: 34, points: 890, userId: volunteerUser.id },
      { name: "K. Lakshmi", mandalId: "nagayalanka", resolved: 29, points: 760 },
      { name: "S. Anil Kumar", mandalId: "koduru", resolved: 41, points: 1020, userId: volunteerUser2.id },
      { name: "P. Sowjanya", mandalId: "challapalli", resolved: 25, points: 650 },
      { name: "M. Venkatesh", mandalId: "mopidevi", resolved: 18, points: 470 },
      { name: "T. Deepika", mandalId: "ghantasala", resolved: 22, points: 590 },
      { name: "N. Suresh Babu", mandalId: "avanigadda", resolved: 15, points: 410 },
      { name: "G. Padmavathi", mandalId: "challapalli", resolved: 30, points: 810 },
    ],
  });

  console.log("Seeding problems...");
  const daysAgo = (n) => new Date(Date.now() - n * 86400000);
  const problemDefs = [
    ["Large pothole on main road", "Roads & Transport", "avanigadda", "Avanigadda", "In Progress", "Critical", 6, 42],
    ["Drinking water pipeline leakage", "Water Supply", "avanigadda", "Vekanuru", "Verified", "Medium", 4, 21],
    ["Streetlights not working for a week", "Street Lighting", "avanigadda", "Modumudi", "New", "Low", 1, 8],
    ["Garbage not collected for 10 days", "Sanitation & Waste", "nagayalanka", "Nagayalanka", "In Progress", "Critical", 9, 55],
    ["Open drainage causing overflow", "Drainage", "nagayalanka", "Chodavaram", "Waiting for Funds", "Medium", 15, 33],
    ["Damaged approach road to village", "Roads & Transport", "nagayalanka", "Talagadadeevi", "Verified", "Medium", 5, 19],
    ["Irregular water supply", "Water Supply", "koduru", "Koduru", "New", "Medium", 2, 14],
    ["Primary health centre needs staff", "Public Health", "koduru", "Machavaram", "In Progress", "Medium", 20, 61],
    ["School building roof leaking", "Education", "koduru", "Salempalem", "Completed", "Medium", 12, 27],
    ["Broken road near market", "Roads & Transport", "challapalli", "Challapalli", "Completed", "Medium", 30, 88],
    ["Overflowing drainage near residential area", "Drainage", "challapalli", "Lakshmipuram", "In Progress", "Critical", 7, 47],
    ["Power cuts every evening", "Electricity", "challapalli", "Yarlagadda", "Verified", "Medium", 3, 24],
    ["No streetlights on village main road", "Street Lighting", "mopidevi", "Mopidevi", "New", "Low", 1, 6],
    ["Waste dumping near school", "Sanitation & Waste", "mopidevi", "Annavaram", "In Progress", "Critical", 8, 39],
    ["Drinking water contamination complaint", "Water Supply", "mopidevi", "Pedaprolu", "Verified", "Critical", 4, 52],
    ["Transformer sparking, safety hazard", "Electricity", "ghantasala", "Ghantasala", "In Progress", "Critical", 2, 63],
    ["Village road washed out in rains", "Roads & Transport", "ghantasala", "Kothapalle", "Waiting for Funds", "Medium", 18, 31],
    ["Community toilet needs repair", "Sanitation & Waste", "ghantasala", "Chilakalapudi", "Rejected", "Low", 25, 5],
  ];

  for (const [title, category, mId, village, status, priority, age, support] of problemDefs) {
    const reportedAt = daysAgo(age);
    const statusHistory = [{ status: "New", date: reportedAt }];
    if (status !== "New") statusHistory.push({ status: "Verified", date: daysAgo(age - 1) });
    if (["In Progress", "Waiting for Funds", "Completed"].includes(status)) {
      statusHistory.push({ status: "In Progress", date: daysAgo(age - 2) });
    }
    if (status === "Completed") statusHistory.push({ status: "Completed", date: daysAgo(1) });

    const photoUrl = categoryImage(category, village);

    await prisma.problem.create({
      data: {
        title,
        description: `${title} reported by a resident of ${village}, ${mandalName(mId)}. The issue is affecting daily life in the area and needs attention from the concerned department.`,
        category,
        photo: photoUrl,
        constituency: "Avanigadda Constituency",
        mandalId: mId,
        mandalName: mandalName(mId),
        village,
        status,
        priority,
        lat: 16.0 + Math.random() * 0.4,
        lng: 80.8 + Math.random() * 0.5,
        reportedById: resident.id,
        reportedByName: resident.name,
        supportCount: support,
        assignedVolunteer: status !== "New" ? "V. Ramesh" : null,
        createdAt: reportedAt,
        photos: { create: [{ url: photoUrl, position: 0 }] },
        statusHistory: { create: statusHistory },
        comments:
          status !== "New"
            ? { create: [{ author: mandalAdmin.name, text: "Team has been notified, inspection scheduled.", createdAt: daysAgo(age - 1) }] }
            : undefined,
        progressPhotos: status === "Completed" ? { create: [{ url: categoryImage(category, village) }] } : undefined,
      },
    });
  }

  console.log("Seeding announcements...");
  await prisma.announcement.createMany({
    data: [
      { title: "Mandal-level Grievance Camp — 10th August", body: "Residents can meet Mandal Admin officials in person to raise grievances at the Avanigadda Mandal office.", mandalId: "avanigadda", postedById: mandalAdmin.id, date: daysAgo(2) },
      { title: "Volunteer registration open for Ghantasala Mandal", body: "Residents interested in volunteering for civic issue verification can register through their profile.", mandalId: "ghantasala", postedById: administrator.id, date: daysAgo(9) },
    ],
  });

  console.log("Seeding activity log...");
  await prisma.activityLog.createMany({
    data: [
      { actor: "Administrator", action: "Platform initialized for Avanigadda Constituency", date: daysAgo(30) },
      { actor: mandalAdmin.name, action: "Verified complaint: School building roof leaking", date: daysAgo(20) },
    ],
  });

  console.log("\nDone. Demo accounts (password: %s):", DEMO_PASSWORD);
  console.log("  Resident      9876500001");
  console.log("  Volunteer     9876500002");
  console.log("  Mandal Admin  9876500004");
  console.log("  Administrator 9876500000");

  await prisma.$disconnect();
}

seed().catch(async (err) => {
  console.error("Seed failed:", err);
  await prisma.$disconnect();
  process.exit(1);
});
