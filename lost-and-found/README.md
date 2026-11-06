# CampusFind — Amal Jyothi College Lost & Found Portal 🔍

A modern, secure web portal built for **Amal Jyothi College of Engineering (AJCE)** to help students, faculty, and campus security report lost belongings, surrender found items, and safely claim misplaced essentials.

---

## 🎨 Design System
- **Theme**: Crisp White and Navy-Blue (`#0f1d40`, `#0a1128`, `#1e40af`) with subtle Light-Blue accents (`#38bdf8`, `#e0f2fe`).
- **Typography**: Google Fonts: **Outfit** (headings) & **Plus Jakarta Sans** (body text).
- **Design Highlights**: Clean rounded cards, soft drop shadows, status indicator pills, and responsive dashboard layouts for mobile, tablet, and desktop.

---

## 🚀 Key Functional Modules

### 1. Public Campus Directory (`#view-feed`)
- **Live Search & Multi-Criteria Filtering**: Filter by keyword, category (Electronics, ID Cards, Calculators, Keys, Bottles, etc.), campus location (Library, Canteen, CS St. Joseph Block, Bus Bay, etc.), and status.
- **Dynamic Real-Time Statistics**: Total reported items, reunited count, and pending items calculated dynamically from the database.
- **Card Badges**: Distinct color-coded pills for `Lost` (Crimson), `Found` (Emerald), `Claim Under Review` (Navy), and `Returned` (Indigo).

### 2. Private Ownership Verification System (Anti-Fraud)
- **Claim Submission**: When a student claims a found item, they are required to describe unique non-public identifiers (lock screen wallpapers, hidden scratches, engraved initials, sticker patterns, or serial numbers).
- **Confidentiality by Design**: Private proof is **never shown publicly**. No student registration numbers, phone numbers, or receipts are exposed to the public feed.
- **Administrator Review**: Only authorized campus security personnel can review evidence before approving a claim.
- **Safe Collection**: Once approved, the claimant receives a secure collection notification designating the campus security hub (e.g. Main Gate Security or Library Desk).

### 3. Student & Staff Dashboard (`#view-user-dashboard`)
- View and manage your reported lost items and surrendered found items.
- Track ownership claim statuses (`Pending`, `Approved`, `Rejected`, `Returned`).
- Mark items as "Reunited" once recovered.

### 4. Campus Security Admin Console (`#view-admin-dashboard`)
- Restricted to authorized administrators (`admin` role).
- **Pending Claims Verification Table**: Review claimant testimony against the physical item in custody.
- **Approve Claim**: Sends collection instructions to the student and automatically updates item status to `Returned`.
- **Reject Claim**: Record rejection reasons (e.g. markings mismatch) and notifies the student.
- **Catalog Management**: Remove inappropriate listings or manually mark items returned.

### 5. Campus Notifications & Real-Time Role Switcher
- In-app notification center with live unread badge count for claim updates, approvals, and report notices.
- **Top Demonstration Bar**: Switch instantly between **Student (Arathi R)**, **Staff (Prof. Thomas Mathew)**, and **Campus Security Admin** to test workflows with a single click.

---

## 📁 File Structure

```
lost-and-found/
├── index.html            # Main web application (Public Feed, Dashboards, Modals)
├── styles.css            # White & Navy-Blue stylesheet (Variables, Grid, Modals)
├── app.js                # Core controller (Search, filters, claim workflow, routing)
├── db.js                 # LocalStorage persistence engine with authentic AJCE seed data
├── firebase-config.js    # Production Firebase SDK configuration and schema
├── firestore.rules       # Security rules enforcing privacy of ownership evidence
├── storage.rules         # Storage rules for public photos vs private claim receipts
└── README.md             # Documentation & deployment guide
```

---

## 🔒 Firebase Production Integration

To deploy with live Firebase backend:
1. Create a project at [Firebase Console](https://console.firebase.google.com/): `campusfind-ajce`.
2. Enable **Authentication** (Email/Password & Google Sign-In with `@amaljyothi.ac.in` domain restriction).
3. Create **Cloud Firestore** and deploy the included [firestore.rules](file:///Users/arathi/Downloads/antigravity/lost-and-found/firestore.rules).
4. Create **Firebase Storage** and deploy the included [storage.rules](file:///Users/arathi/Downloads/antigravity/lost-and-found/storage.rules).
5. Update your credentials in [firebase-config.js](file:///Users/arathi/Downloads/antigravity/lost-and-found/firebase-config.js).

---

## 💻 How to Run the Website Right Now

You can open and test the application immediately:

### Option A: Direct Browser Open (100% Guaranteed)
1. Open **Google Chrome** or **Safari**.
2. Paste this exact path into the URL address bar:
   ```text
   file:///Users/arathi/Downloads/antigravity/lost-and-found/index.html
   ```
3. Press **Enter**. The application runs with persistent local storage and instant role switching!

### Option B: Local Web Server
In your Mac Terminal:
```bash
cd /Users/arathi/Downloads/antigravity/lost-and-found
python3 -m http.server 8080
```
Then visit [http://localhost:8080](http://localhost:8080) in your browser.

