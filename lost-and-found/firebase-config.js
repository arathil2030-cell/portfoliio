// ============================================================================
// CampusFind – College Lost & Found Portal
// Firebase Configuration & Security Setup for Amal Jyothi College of Engineering
// ============================================================================

/**
 * PRODUCTION FIREBASE CONFIGURATION
 * 
 * To connect your live Firebase project:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a project: "campusfind-ajce"
 * 3. Enable Authentication (Email/Password & Google Auth with @amaljyothi.ac.in domain restriction)
 * 4. Create Cloud Firestore in production mode
 * 5. Create Firebase Storage bucket
 * 6. Replace the placeholder values below with your project credentials:
 */

export const firebaseConfig = {
  apiKey: "AIzaSyDemoKey-CampusFindAJCE-2026",
  authDomain: "campusfind-ajce.firebaseapp.com",
  projectId: "campusfind-ajce",
  storageBucket: "campusfind-ajce.appspot.com",
  messagingSenderId: "109876543210",
  appId: "1:109876543210:web:abcdef1234567890"
};

/**
 * FIRESTORE DATA COLLECTIONS SCHEMA
 * 
 * 1. `users` collection:
 *    - uid: string (Primary Key)
 *    - name: string
 *    - email: string (e.g. arathi@amaljyothi.ac.in)
 *    - role: 'student' | 'staff' | 'admin'
 *    - department: string (e.g. 'Computer Science & Engineering')
 *    - rollNumber: string (e.g. 'AJCE22CS045')
 *    - phone: string (Private, masked)
 *    - createdAt: timestamp
 * 
 * 2. `items` collection (Lost and Found entries):
 *    - id: string
 *    - type: 'lost' | 'found'
 *    - title: string
 *    - category: 'Electronics' | 'Books & Calculators' | 'ID Cards & Wallets' | 'Keys & Vehicles' | 'Bottles & Umbrellas' | 'Clothing' | 'Others'
 *    - date: string (YYYY-MM-DD)
 *    - campusLocation: string (e.g. 'Central Library 2nd Floor')
 *    - storageLocation: string (e.g. 'Main Security Gate 1 Hub' for found items)
 *    - description: string
 *    - photoUrl: string (Public display image)
 *    - reporterUid: string
 *    - reporterName: string
 *    - reporterEmail: string (Masked for privacy)
 *    - status: 'approved' | 'pending' | 'under_review' | 'returned' | 'rejected'
 *    - createdAt: timestamp
 *    - updatedAt: timestamp
 * 
 * 3. `claims` collection (Ownership Verification System):
 *    - id: string
 *    - itemId: string (Foreign Key to items)
 *    - itemTitle: string
 *    - claimantUid: string
 *    - claimantName: string
 *    - claimantEmail: string
 *    - claimantDept: string
 *    - claimantPhone: string (Strictly private)
 *    - dateLost: string
 *    - locationLost: string
 *    - ownershipProofText: string (Private detailed answers)
 *    - evidencePhotoUrl: string (Private receipt / lock-screen / serial photo)
 *    - status: 'pending' | 'approved' | 'rejected'
 *    - adminNotes: string
 *    - collectionLocation: string (e.g. 'Central Security Desk')
 *    - submittedAt: timestamp
 *    - resolvedAt: timestamp
 * 
 * 4. `notifications` collection:
 *    - id: string
 *    - recipientUid: string
 *    - title: string
 *    - message: string
 *    - read: boolean
 *    - relatedItemId: string
 *    - type: 'claim_approved' | 'claim_rejected' | 'item_matched' | 'report_status'
 *    - createdAt: timestamp
 */

