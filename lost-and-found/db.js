/**
 * CampusFind – Local Client Database Engine & State Manager
 * Preloaded with authentic Amal Jyothi College of Engineering (AJCE) sample data.
 * Persists dynamically to localStorage with full CRUD operations for:
 *   - Items (Lost and Found)
 *   - Claims (Private Ownership Verification)
 *   - Users & Roles (Student, Staff, Admin)
 *   - Notifications
 */

const STORAGE_KEYS = {
  ITEMS: 'campusfind_items_v2',
  CLAIMS: 'campusfind_claims_v2',
  USERS: 'campusfind_users_v2',
  NOTIFICATIONS: 'campusfind_notifications_v2',
  CURRENT_USER: 'campusfind_auth_user_v2'
};

// Initial Seed Users
const SEED_USERS = [
  {
    uid: 'user-arathi',
    name: 'Arathi R',
    email: 'arathi@amaljyothi.ac.in',
    role: 'student',
    department: 'Computer Science & Engineering',
    rollNumber: 'AJCE22CS045',
    phone: '+91 98471 23456',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  },
  {
    uid: 'user-faculty',
    name: 'Prof. Thomas Mathew',
    email: 'thomas.mathew@amaljyothi.ac.in',
    role: 'staff',
    department: 'Electronics & Communication',
    rollNumber: 'FAC-ECE-12',
    phone: '+91 94470 54321',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  },
  {
    uid: 'user-admin',
    name: 'Campus Security Desk (Officer Joseph)',
    email: 'security.admin@amaljyothi.ac.in',
    role: 'admin',
    department: 'Campus Security & Student Welfare',
    rollNumber: 'SEC-CHIEF-01',
    phone: '04828 305555',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
  }
];

// Initial Seed Items
const SEED_ITEMS = [
  {
    id: 'item-101',
    type: 'found',
    title: 'Casio Scientific Calculator fx-991EX ClassWiz',
    category: 'Books & Notes',
    date: '2026-11-05',
    campusLocation: 'Central Library',
    storageLocation: 'Library Circulation Helpdesk (Counter 2)',
    description: 'Black scientific calculator with solar panel and white slide cover. Has a tiny blue circle sticker on the back of the cover.',
    photoUrl: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=600&q=80',
    reporterUid: 'user-faculty',
    reporterName: 'Prof. Thomas Mathew',
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'item-102',
    type: 'found',
    title: 'Amal Jyothi Student ID Card & Lanyard',
    category: 'ID Cards & Wallets',
    date: '2026-11-06',
    campusLocation: 'Main Canteen / Cafeteria',
    storageLocation: 'Main Security Gate 1 Control Room',
    description: 'Official blue AJCE college lanyard with student identity smartcard found on dining table 14 after lunch hour.',
    photoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    reporterUid: 'user-arathi',
    reporterName: 'Arathi R',
    status: 'approved',
    createdAt: new Date(Date.now() - 14400000).toISOString()
  },
  {
    id: 'item-103',
    type: 'lost',
    title: 'Apple AirPods Pro (2nd Gen) in White MagSafe Case',
    category: 'Electronics',
    date: '2026-11-04',
    campusLocation: 'CS Dept / St. Joseph Block',
    storageLocation: 'N/A (Looking for item)',
    description: 'Left behind in CS Lab 3 near Terminal 24 during afternoon lab session. The case has a faint scratch near the charging port.',
    photoUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80',
    reporterUid: 'user-arathi',
    reporterName: 'Arathi R',
    status: 'approved',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 'item-104',
    type: 'found',
    title: 'Honda Two-Wheeler Key with Leather Keychain',
    category: 'Keys & Remotes',
    date: '2026-11-05',
    campusLocation: 'College Bus Bay',
    storageLocation: 'Main Gate Security Office (Box #4)',
    description: 'Single ignition key attached to a brown leather keychain with a metallic AJCE emblem. Found near Bus #7 parking slot.',
    photoUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80',
    reporterUid: 'user-faculty',
    reporterName: 'Prof. Thomas Mathew',
    status: 'approved',
    createdAt: new Date(Date.now() - 72000000).toISOString()
  },
  {
    id: 'item-105',
    type: 'found',
    title: 'Matte Black Insulated Steel Water Bottle',
    category: 'Bottles & Umbrellas',
    date: '2026-11-06',
    campusLocation: 'Sports Complex & Ground',
    storageLocation: 'Physical Education Office Helpdesk',
    description: '750ml stainless steel flask with sip cap. Distinctive neon green silicone band around the lid.',
    photoUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
    reporterUid: 'user-arathi',
    reporterName: 'Arathi R',
    status: 'approved',
    createdAt: new Date(Date.now() - 28800000).toISOString()
  },
  {
    id: 'item-106',
    type: 'lost',
    title: 'Navy Blue Windproof Folding Umbrella',
    category: 'Bottles & Umbrellas',
    date: '2026-11-03',
    campusLocation: 'Auditorium & Seminar Halls',
    storageLocation: 'N/A (Looking for item)',
    description: 'Left on the 3rd row aisle seat during the college orientation symposium. Wooden curved handle.',
    photoUrl: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?auto=format&fit=crop&w=600&q=80',
    reporterUid: 'user-arathi',
    reporterName: 'Arathi R',
    status: 'returned',
    createdAt: new Date(Date.now() - 259200000).toISOString()
  }
];

// Initial Seed Claims (Demonstrating Ownership Verification)
const SEED_CLAIMS = [
  {
    id: 'claim-301',
    itemId: 'item-101',
    itemTitle: 'Casio Scientific Calculator fx-991EX ClassWiz',
    claimantUid: 'user-arathi',
    claimantName: 'Arathi R',
    claimantEmail: 'arathi@amaljyothi.ac.in',
    claimantDept: 'Computer Science & Engineering',
    claimantPhone: '+91 98471 23456',
    dateLost: '2026-11-05',
    locationLost: 'Central Library Desk #18',
    ownershipProofText: 'Inside the battery compartment there is my initial "A.R" written with a fine silver permanent marker. The QR code label on back has a small diagonal tape.',
    evidencePhotoUrl: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=400&q=80',
    status: 'pending',
    adminNotes: '',
    collectionLocation: 'Library Circulation Helpdesk',
    submittedAt: new Date(Date.now() - 36000000).toISOString()
  }
];

// Initial Seed Notifications
const SEED_NOTIFICATIONS = [
  {
    id: 'notif-1',
    recipientUid: 'user-arathi',
    title: 'Claim Received for Verification',
    message: 'Your claim request for "Casio Calculator fx-991EX" has been logged and sent to campus administration for security review.',
    read: false,
    type: 'claim_submission',
    timestamp: new Date(Date.now() - 35000000).toISOString()
  },
  {
    id: 'notif-2',
    recipientUid: 'user-arathi',
    title: 'Report Approved & Published',
    message: 'Your report for "Amal Jyothi Student ID Card" was approved by security and is now visible on the public campus board.',
    read: true,
    type: 'report_status',
    timestamp: new Date(Date.now() - 50000000).toISOString()
  }
];

class CampusDatabase {
  constructor() {
    this.initStorage();
  }

  initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.ITEMS)) {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(SEED_ITEMS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CLAIMS)) {
      localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(SEED_CLAIMS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(SEED_NOTIFICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      // Default to Student (Arathi)
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(SEED_USERS[0]));
    }
  }

  // --- Auth & Users ---
  getCurrentUser() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
  }

  setCurrentUser(user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }

  getUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  }

  switchUserRole(role) {
    const users = this.getUsers();
    const user = users.find(u => u.role === role) || users[0];
    this.setCurrentUser(user);
    return user;
  }

  registerUser(userData) {
    const users = this.getUsers();
    const newUser = {
      uid: 'user-' + Date.now(),
      name: userData.name,
      email: userData.email,
      role: userData.role || 'student',
      department: userData.department || 'General Engineering',
      rollNumber: userData.rollNumber || 'AJCE-2026',
      phone: userData.phone || '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.setCurrentUser(newUser);
    return newUser;
  }

  loginUser(email) {
    const users = this.getUsers();
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      // Auto-provision demo account with Amal Jyothi domain
      const isStaff = email.includes('faculty') || email.includes('staff');
      const isAdmin = email.includes('admin') || email.includes('security');
      user = {
        uid: 'user-' + Date.now(),
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email: email,
        role: isAdmin ? 'admin' : (isStaff ? 'staff' : 'student'),
        department: 'Amal Jyothi College of Engineering',
        rollNumber: 'AJCE-' + Math.floor(1000 + Math.random() * 9000),
        phone: '+91 94470 00000',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
      };
      users.push(user);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
    this.setCurrentUser(user);
    return user;
  }

  // --- Items Management ---
  getItems() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS) || '[]');
  }

  getItemById(id) {
    return this.getItems().find(item => item.id === id);
  }

  addItem(itemData) {
    const items = this.getItems();
    const user = this.getCurrentUser();
    const newItem = {
      id: 'item-' + Date.now(),
      type: itemData.type, // 'lost' | 'found'
      title: itemData.title,
      category: itemData.category,
      date: itemData.date,
      campusLocation: itemData.campusLocation,
      storageLocation: itemData.storageLocation || 'Awaiting Security Drop-off',
      description: itemData.description,
      photoUrl: itemData.photoUrl || (itemData.type === 'found' ? 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=600&q=80' : 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80'),
      reporterUid: user.uid,
      reporterName: user.name,
      reporterEmail: user.email,
      status: 'approved', // Auto-approved on demo so items appear immediately
      createdAt: new Date().toISOString()
    };
    items.unshift(newItem);
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));

    // Create Notification
    this.addNotification({
      recipientUid: user.uid,
      title: 'Report Published',
      message: `Your report for "${newItem.title}" is now active on the campus directory.`,
      type: 'report_status'
    });

    return newItem;
  }

  updateItemStatus(itemId, newStatus) {
    const items = this.getItems();
    const item = items.find(i => i.id === itemId);
    if (item) {
      item.status = newStatus;
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
    }
    return item;
  }

  deleteItem(itemId) {
    let items = this.getItems();
    items = items.filter(i => i.id !== itemId);
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  }

  // --- Claims & Ownership Verification System ---
  getClaims() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CLAIMS) || '[]');
  }

  getClaimById(claimId) {
    return this.getClaims().find(c => c.id === claimId);
  }

  submitClaim(claimData) {
    const claims = this.getClaims();
    const user = this.getCurrentUser();
    const item = this.getItemById(claimData.itemId);

    const newClaim = {
      id: 'claim-' + Date.now(),
      itemId: claimData.itemId,
      itemTitle: item ? item.title : 'Campus Belonging',
      claimantUid: user.uid,
      claimantName: user.name,
      claimantEmail: user.email,
      claimantDept: user.department,
      claimantPhone: claimData.phone || user.phone,
      dateLost: claimData.dateLost,
      locationLost: claimData.locationLost,
      ownershipProofText: claimData.proofText,
      evidencePhotoUrl: claimData.evidencePhotoUrl || '',
      status: 'pending',
      adminNotes: '',
      collectionLocation: item ? item.storageLocation : 'Central Security Office (Gate 1)',
      submittedAt: new Date().toISOString()
    };

    claims.unshift(newClaim);
    localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(claims));

    // Update item status to 'under_review'
    if (item) {
      this.updateItemStatus(item.id, 'under_review');
    }

    // Notify Claimant
    this.addNotification({
      recipientUid: user.uid,
      title: 'Claim Submitted for Review',
      message: `Your ownership claim for "${newClaim.itemTitle}" has been securely logged. The administration will verify your evidence shortly.`,
      type: 'claim_submission'
    });

    return newClaim;
  }

  approveClaim(claimId, collectionNotes = '') {
    const claims = this.getClaims();
    const claim = claims.find(c => c.id === claimId);
    if (!claim) return null;

    claim.status = 'approved';
    claim.adminNotes = collectionNotes || 'Ownership evidence successfully verified against campus records.';
    claim.resolvedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(claims));

    // Mark associated item as 'returned'
    this.updateItemStatus(claim.itemId, 'returned');

    // Notify Claimant with Collection Instructions
    this.addNotification({
      recipientUid: claim.claimantUid,
      title: '🎉 Claim Approved: Collect Your Item',
      message: `Your claim for "${claim.itemTitle}" was approved! Please visit ${claim.collectionLocation} with your College ID to collect your belonging. Security Note: ${claim.adminNotes}`,
      type: 'claim_approved'
    });

    return claim;
  }

  rejectClaim(claimId, reason = '') {
    const claims = this.getClaims();
    const claim = claims.find(c => c.id === claimId);
    if (!claim) return null;

    claim.status = 'rejected';
    claim.adminNotes = reason || 'Evidence provided did not sufficiently match the recovered item details.';
    claim.resolvedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(claims));

    // Revert item status back to 'approved' (available for genuine claims)
    this.updateItemStatus(claim.itemId, 'approved');

    // Notify Claimant
    this.addNotification({
      recipientUid: claim.claimantUid,
      title: 'Claim Status Update',
      message: `Your claim for "${claim.itemTitle}" could not be verified. Note: ${claim.adminNotes}. Please visit the security desk in person if you have additional proof.`,
      type: 'claim_rejected'
    });

    return claim;
  }

  // --- Notifications ---
  getNotificationsForUser(userUid) {
    const notifs = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
    return notifs.filter(n => n.recipientUid === userUid);
  }

  addNotification(notifData) {
    const notifs = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
    const newNotif = {
      id: 'notif-' + Date.now(),
      recipientUid: notifData.recipientUid,
      title: notifData.title,
      message: notifData.message,
      read: false,
      type: notifData.type,
      timestamp: new Date().toISOString()
    };
    notifs.unshift(newNotif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    return newNotif;
  }

  markNotificationsAsRead(userUid) {
    const notifs = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
    notifs.forEach(n => {
      if (n.recipientUid === userUid) n.read = true;
    });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  }

  // --- Statistics (Dynamically Computed, No Hardcoding) ---
  getStatistics() {
    const items = this.getItems();
    const claims = this.getClaims();

    const totalReported = items.length;
    const totalLost = items.filter(i => i.type === 'lost').length;
    const totalFound = items.filter(i => i.type === 'found').length;
    const totalReturned = items.filter(i => i.status === 'returned').length;
    const pendingClaims = claims.filter(c => c.status === 'pending').length;
    const pendingReports = items.filter(i => i.status === 'pending').length;

    return {
      totalReported,
      totalLost,
      totalFound,
      totalReturned,
      pendingClaims,
      pendingReports
    };
  }
}

// Global instance
export const db = new CampusDatabase();

