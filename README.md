# Arathi's Personal Portfolio Website ✨

A modern, responsive, aesthetic portfolio website designed for **Arathi**, Computer Science student at **Amal Jyothi College of Engineering** (Batch of 2026) and aspiring Full-Stack Developer.

---

## 🎨 Theme & Design
- **Color Palette**: Pastel Pink (`#FDF2F8`, `#FCE7F3`), Lavender (`#F5F3FF`, `#EDE9FE`), and Soft Purple (`#DDD6FE`, `#8B5CF6`).
- **Style**: Modern Glassmorphism, rounded cards, ambient animated background gradient orbs, and soft pillowy shadows.
- **Typography**: Google Fonts: **Outfit** (headings) & **Plus Jakarta Sans** (body text).
- **Interactions**:
  - Typing animation in the hero section.
  - Scroll reveal animations with `IntersectionObserver`.
  - Active navigation spy on scroll.
  - Interactive contact form validation with animated toast alert.
  - Fully responsive mobile drawer navigation.

---

## 📁 File Structure

```
├── index.html        # Semantic HTML5 markup with all sections & clean comments
├── styles.css        # Pure CSS3 styling (variables, glassmorphism, responsive grid)
├── script.js         # Vanilla JavaScript (typing effect, scroll spy, form validation)
├── profile.jpg       # Arathi's profile photograph
└── README.md         # Documentation & customization guide
```

---

## 🛠️ How to Customize Your Portfolio

### 1. Change Profile Photo
In [index.html](file:///Users/arathi/Downloads/antigravity/index.html) around line 118, look for:
```html
<img 
  id="profile-img" 
  src="https://images.unsplash.com/..." 
  alt="Arathi - Profile Photo" 
/>
```
Replace the `src` with your own image file (e.g. `src="my-photo.jpg"` or an online image URL).

### 2. Update Contact & Social Media Links
In [index.html](file:///Users/arathi/Downloads/antigravity/index.html) around lines 450–490:
- Replace `your.email@example.com` with your actual email address.
- Replace `https://linkedin.com/in/your-profile` with your LinkedIn URL.
- Replace `https://github.com/your-username` with your GitHub URL.

### 3. Add or Modify Skills
In [index.html](file:///Users/arathi/Downloads/antigravity/index.html) inside `<section id="skills">`, duplicate any `<div class="skill-card glass-card">` block to add a new skill, or edit the tags and descriptions of existing skills.

### 4. Update Projects
In [index.html](file:///Users/arathi/Downloads/antigravity/index.html) inside `<section id="projects">`, each project has its own card with tags, a title, a description, and links to your GitHub repositories or live demos.

---

## 🚀 How to View the Website

You can view your website immediately:

1. **Option A (Instant View)**:
   Double-click [index.html](file:///Users/arathi/Downloads/antigravity/index.html) in macOS Finder to open it directly in Safari, Chrome, or any web browser.

2. **Option B (Local Web Server)**:
   In your Terminal:
   ```bash
   cd /Users/arathi/Downloads/antigravity
   python3 -m http.server 8000
   ```
   Then open `http://localhost:8000` in your browser.

