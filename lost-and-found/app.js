/**
 * CampusFind – Main Controller & Application Logic
 * Integrates with CampusDatabase (db.js) for persistent state.
 */

import { db } from './db.js';

// Application State
let currentStatusFilter = 'all';
let currentSearchQuery = '';
let currentCategoryFilter = 'all';
let currentLocationFilter = 'all';
let uploadedImageBase64 = '';

// DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  updateUserUI();
  updateStatistics();
  renderFeedItems();
  updateNotificationBadge();
  setupEventListeners();

  // Set default report date to today
  const dateInput = document.getElementById('item-date');
  if (dateInput) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }
}

// ============================================================================
// 1. Navigation & View Routing
// ============================================================================
window.showView = function(viewName) {
  const views = ['feed', 'user-dashboard', 'admin-dashboard'];
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) el.style.display = v === viewName ? 'block' : 'none';
  });

  // Nav link states
  document.getElementById('nav-link-browse')?.classList.toggle('active', viewName === 'feed');
  document.getElementById('nav-link-user-dash')?.classList.toggle('active', viewName === 'user-dashboard');
  document.getElementById('nav-link-admin-dash')?.classList.toggle('active', viewName === 'admin-dashboard');

  if (viewName === 'feed') {
    renderFeedItems();
    updateStatistics();
  } else if (viewName === 'user-dashboard') {
    renderUserDashboard();
  } else if (viewName === 'admin-dashboard') {
    renderAdminDashboard();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ============================================================================
// 2. User & Role Switching
// ============================================================================
window.switchRole = function(role) {
  const user = db.switchUserRole(role);
  updateUserUI();

  // Highlight active role button
  document.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`role-btn-${role}`)?.classList.add('active');

  showToast(`Switched profile to ${user.name} (${user.role.toUpperCase()})`);

  // If in admin dashboard and switched away from admin, return to feed
  if (role !== 'admin' && document.getElementById('view-admin-dashboard')?.style.display === 'block') {
    showView('feed');
  } else if (role === 'admin') {
    showView('admin-dashboard');
  } else {
    // Refresh current view
    const currentView = document.getElementById('view-user-dashboard')?.style.display === 'block' ? 'user-dashboard' : 'feed';
    showView(currentView);
  }
};

function updateUserUI() {
  const user = db.getCurrentUser();
  if (!user) return;

  document.getElementById('user-name-display').textContent = user.name;
  document.getElementById('user-avatar-display').src = user.avatar;
  
  const roleDisplay = document.getElementById('user-role-display');
  roleDisplay.textContent = user.role.toUpperCase();
  roleDisplay.className = `role-pill ${user.role}`;

  // Show/Hide Admin Navigation
  const adminNav = document.getElementById('nav-link-admin-dash');
  if (adminNav) {
    adminNav.style.display = user.role === 'admin' ? 'inline-flex' : 'none';
  }

  updateNotificationBadge();
}

// ============================================================================
// 3. Statistics (Dynamic calculation)
// ============================================================================
function updateStatistics() {
  const stats = db.getStatistics();
  
  const totalEl = document.getElementById('stat-total');
  const reunitedEl = document.getElementById('stat-reunited');
  const pendingEl = document.getElementById('stat-pending');

  if (totalEl) totalEl.textContent = stats.totalReported;
  if (reunitedEl) reunitedEl.textContent = stats.totalReturned;
  if (pendingEl) pendingEl.textContent = stats.totalReported - stats.totalReturned;

  // Tab counts
  const items = db.getItems();
  document.getElementById('count-all').textContent = items.length;
  document.getElementById('count-lost').textContent = items.filter(i => i.type === 'lost' && i.status !== 'returned').length;
  document.getElementById('count-found').textContent = items.filter(i => i.type === 'found' && i.status !== 'returned').length;
  document.getElementById('count-claimed').textContent = items.filter(i => i.status === 'returned').length;

  // Admin pending badge
  const adminBadge = document.getElementById('admin-pending-badge');
  if (adminBadge) adminBadge.textContent = stats.pendingClaims;
}

// ============================================================================
// 4. Feed Items Rendering & Multi-Filter Search
// ============================================================================
window.setStatusTab = function(status) {
  currentStatusFilter = status;
  document.querySelectorAll('.status-tab').forEach(t => {
    t.classList.toggle('active', t.getAttribute('data-status') === status);
  });
  renderFeedItems();
};

window.handleSearchFilter = function() {
  currentSearchQuery = document.getElementById('search-input').value.trim().toLowerCase();
  currentCategoryFilter = document.getElementById('category-select').value;
  currentLocationFilter = document.getElementById('location-select').value;
  renderFeedItems();
};

window.resetFilters = function() {
  document.getElementById('search-input').value = '';
  document.getElementById('category-select').value = 'all';
  document.getElementById('location-select').value = 'all';
  currentSearchQuery = '';
  currentCategoryFilter = 'all';
  currentLocationFilter = 'all';
  currentStatusFilter = 'all';

  document.querySelectorAll('.status-tab').forEach(t => {
    t.classList.toggle('active', t.getAttribute('data-status') === 'all');
  });

  renderFeedItems();
};

function renderFeedItems() {
  const items = db.getItems();
  const grid = document.getElementById('items-grid');
  const emptyState = document.getElementById('empty-state');
  const filterIndicator = document.getElementById('filter-indicator');
  const filterText = document.getElementById('filter-text');

  if (!grid) return;

  // Filter Logic
  const filtered = items.filter(item => {
    // Status Filter
    if (currentStatusFilter === 'lost' && (item.type !== 'lost' || item.status === 'returned')) return false;
    if (currentStatusFilter === 'found' && (item.type !== 'found' || item.status === 'returned')) return false;
    if (currentStatusFilter === 'claimed' && item.status !== 'returned') return false;

    // Category Filter
    if (currentCategoryFilter !== 'all' && item.category !== currentCategoryFilter) return false;

    // Location Filter
    if (currentLocationFilter !== 'all' && item.campusLocation !== currentLocationFilter) return false;

    // Keyword Search
    if (currentSearchQuery) {
      const matchTitle = item.title.toLowerCase().includes(currentSearchQuery);
      const matchDesc = item.description.toLowerCase().includes(currentSearchQuery);
      const matchLoc = item.campusLocation.toLowerCase().includes(currentSearchQuery);
      if (!matchTitle && !matchDesc && !matchLoc) return false;
    }

    return true;
  });

  // Filter Indicator Bar
  const isFiltered = currentSearchQuery || currentCategoryFilter !== 'all' || currentLocationFilter !== 'all' || currentStatusFilter !== 'all';
  if (filterIndicator) {
    if (isFiltered) {
      filterIndicator.style.display = 'flex';
      filterText.textContent = `Showing ${filtered.length} item(s) matching your criteria`;
    } else {
      filterIndicator.style.display = 'none';
    }
  }

  // Empty State Toggle
  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  // Render Cards
  grid.innerHTML = filtered.map(item => {
    const isLost = item.type === 'lost';
    const isReturned = item.status === 'returned';
    const isUnderReview = item.status === 'under_review';

    let badgeClass = isReturned ? 'badge-returned' : (isUnderReview ? 'badge-under_review' : (isLost ? 'badge-lost' : 'badge-found'));
    let badgeLabel = isReturned ? '✓ Returned' : (isUnderReview ? '⏳ Claim Under Review' : (isLost ? '🔴 Lost' : '🟢 Found'));

    return `
      <article class="item-card">
        <div class="item-card-image-box">
          <img src="${item.photoUrl}" alt="${item.title}" class="item-card-image" loading="lazy" />
          <span class="card-badge ${badgeClass}">${badgeLabel}</span>
          <span class="category-pill-tag">${item.category}</span>
        </div>

        <div class="item-card-body">
          <h3 class="item-title">${item.title}</h3>
          
          <div class="item-meta-row">
            <span class="meta-item">📍 ${item.campusLocation}</span>
            <span class="meta-item">📅 ${item.date}</span>
          </div>

          <p class="item-description">${item.description}</p>

          ${item.type === 'found' && item.storageLocation ? `
            <div class="storage-location-box">
              <span class="storage-label">Safe Holding Location:</span>
              <span class="storage-value">${item.storageLocation}</span>
            </div>
          ` : ''}

          <div class="item-card-footer">
            <span class="reporter-label">Reported by ${item.reporterName}</span>
            
            ${item.type === 'found' && !isReturned ? `
              <button onclick="openClaimModal('${item.id}')" class="btn btn-sm btn-primary">
                <span>Claim Item</span>
                <span>🔒</span>
              </button>
            ` : `
              <button onclick="openItemDetailsModal('${item.id}')" class="btn btn-sm btn-outline">
                <span>View Details</span>
              </button>
            `}
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// ============================================================================
// 5. Reporting Modal & File Upload Handlers
// ============================================================================
window.openReportModal = function(type = 'lost') {
  const modal = document.getElementById('report-modal');
  if (!modal) return;

  document.getElementById(`type-${type}`).checked = true;
  updateReportTypeUI();

  modal.style.display = 'flex';
};

window.closeReportModal = function() {
  const modal = document.getElementById('report-modal');
  if (modal) modal.style.display = 'none';
  document.getElementById('report-form')?.reset();
  clearUploadedImage();
};

window.updateReportTypeUI = function() {
  const isFound = document.getElementById('type-found')?.checked;
  const storageField = document.getElementById('storage-location-field');
  const modalTitle = document.getElementById('report-modal-title');

  if (storageField) storageField.style.display = isFound ? 'block' : 'none';
  if (modalTitle) modalTitle.textContent = isFound ? 'Report Found Belonging' : 'Report Lost Belonging';
};

window.handleImagePreview = function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    uploadedImageBase64 = event.target.result;
    document.getElementById('upload-preview-img').src = uploadedImageBase64;
    document.getElementById('upload-prompt').style.display = 'none';
    document.getElementById('upload-preview-wrap').style.display = 'flex';
  };
  reader.readAsDataURL(file);
};

window.clearUploadedImage = function(e) {
  if (e) e.stopPropagation();
  uploadedImageBase64 = '';
  const fileInput = document.getElementById('item-photo-file');
  if (fileInput) fileInput.value = '';
  document.getElementById('upload-preview-wrap').style.display = 'none';
  document.getElementById('upload-prompt').style.display = 'flex';
};

window.handleReportSubmit = function(e) {
  e.preventDefault();

  const type = document.querySelector('input[name="reportType"]:checked').value;
  const title = document.getElementById('item-title').value.trim();
  const category = document.getElementById('item-category').value;
  const campusLocation = document.getElementById('item-location').value;
  const date = document.getElementById('item-date').value;
  const description = document.getElementById('item-desc').value.trim();
  const storageLocation = document.getElementById('item-storage')?.value.trim();

  if (!title || !description) {
    showToast('Please fill in all required fields.', '⚠️');
    return;
  }

  const newItem = db.addItem({
    type,
    title,
    category,
    campusLocation,
    date,
    description,
    storageLocation: type === 'found' ? (storageLocation || 'Main Security Desk Gate 1') : 'N/A',
    photoUrl: uploadedImageBase64 || ''
  });

  closeReportModal();
  updateStatistics();
  renderFeedItems();
  updateNotificationBadge();

  showToast(`"${newItem.title}" was published to the campus directory!`, '📢');
};

// ============================================================================
// 6. Ownership Verification Claim System (High Security)
// ============================================================================
window.openClaimModal = function(itemId) {
  const item = db.getItemById(itemId);
  if (!item) return;

  const modal = document.getElementById('claim-modal');
  const summaryBox = document.getElementById('claim-item-summary');
  const itemIdInput = document.getElementById('claim-item-id');

  if (itemIdInput) itemIdInput.value = item.id;

  if (summaryBox) {
    summaryBox.innerHTML = `
      <img src="${item.photoUrl}" alt="${item.title}" class="claim-thumb" />
      <div>
        <h4 class="claim-summary-title">${item.title}</h4>
        <span class="claim-summary-meta">📍 Found at ${item.campusLocation} • Holding at ${item.storageLocation || 'Security Desk'}</span>
      </div>
    `;
  }

  // Pre-fill phone if available from current user
  const user = db.getCurrentUser();
  if (user && document.getElementById('claim-phone')) {
    document.getElementById('claim-phone').value = user.phone;
  }

  modal.style.display = 'flex';
};

window.closeClaimModal = function() {
  const modal = document.getElementById('claim-modal');
  if (modal) modal.style.display = 'none';
  document.getElementById('claim-form')?.reset();
};

window.handleClaimSubmit = function(e) {
  e.preventDefault();

  const itemId = document.getElementById('claim-item-id').value;
  const proofText = document.getElementById('claim-proof').value.trim();
  const dateLost = document.getElementById('claim-date-lost').value;
  const locationLost = document.getElementById('claim-location-lost').value.trim();
  const phone = document.getElementById('claim-phone').value.trim();

  if (!proofText) {
    showToast('Please provide descriptive ownership evidence.', '⚠️');
    return;
  }

  const claim = db.submitClaim({
    itemId,
    proofText,
    dateLost,
    locationLost,
    phone
  });

  closeClaimModal();
  updateStatistics();
  renderFeedItems();
  updateNotificationBadge();

  showToast('Claim submitted securely! Campus Security will verify your evidence.', '🔒');
};

// ============================================================================
// 7. Admin Dashboard & Verification Desk
// ============================================================================
function renderAdminDashboard() {
  const user = db.getCurrentUser();
  if (user.role !== 'admin') {
    showToast('Admin privilege required.', '🚫');
    showView('feed');
    return;
  }

  const stats = db.getStatistics();
  document.getElementById('admin-stat-pending-claims').textContent = stats.pendingClaims;
  document.getElementById('admin-stat-total-items').textContent = stats.totalReported;
  document.getElementById('admin-stat-returned').textContent = stats.totalReturned;

  // Render Pending Claims Table
  const claims = db.getClaims().filter(c => c.status === 'pending');
  const claimsContainer = document.getElementById('admin-claims-container');

  if (claims.length === 0) {
    claimsContainer.innerHTML = `
      <div style="padding: 2.5rem; text-align: center; color: var(--text-light);">
        <span>✓ No pending ownership claims requiring review.</span>
      </div>
    `;
  } else {
    claimsContainer.innerHTML = claims.map(claim => `
      <div class="admin-claim-card">
        <div class="claim-card-top">
          <div>
            <span class="claim-badge-pending">Pending Review</span>
            <h4 class="claim-card-item-title">${claim.itemTitle}</h4>
            <span class="claim-card-user-info">Claimant: <strong>${claim.claimantName}</strong> (${claim.claimantDept}) • Contact: ${claim.claimantPhone}</span>
          </div>
          <button onclick="openAdminReviewModal('${claim.id}')" class="btn btn-sm btn-primary">
            <span>Review Private Evidence</span>
            <span>👁️</span>
          </button>
        </div>
      </div>
    `).join('');
  }

  // Render Items Management Table
  const items = db.getItems();
  const tbody = document.getElementById('admin-items-tbody');
  tbody.innerHTML = items.map(item => `
    <tr>
      <td>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <img src="${item.photoUrl}" style="width: 36px; height: 36px; border-radius: 6px; object-fit: cover;" />
          <span style="font-weight: 600;">${item.title}</span>
        </div>
      </td>
      <td><span class="role-pill ${item.type}">${item.type.toUpperCase()}</span></td>
      <td>${item.campusLocation}</td>
      <td>${item.date}</td>
      <td><span class="card-badge badge-${item.status}">${item.status.toUpperCase()}</span></td>
      <td>
        <div style="display: flex; gap: 0.4rem;">
          ${item.status !== 'returned' ? `
            <button onclick="markItemReturned('${item.id}')" class="btn btn-sm btn-success" title="Mark as Reunited">✓ Return</button>
          ` : ''}
          <button onclick="deleteCampusItem('${item.id}')" class="btn btn-sm btn-danger" title="Remove">✕</button>
        </div>
      </td>
    </tr>
  `).join('');
}

window.openAdminReviewModal = function(claimId) {
  const claim = db.getClaimById(claimId);
  const item = db.getItemById(claim.itemId);
  if (!claim) return;

  const modal = document.getElementById('admin-review-modal');
  const content = document.getElementById('admin-review-content');

  content.innerHTML = `
    <div class="admin-review-grid">
      <!-- Item in Custody -->
      <div class="review-box">
        <span class="review-section-header">Physical Item in Campus Custody</span>
        <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 0.75rem;">
          <img src="${item ? item.photoUrl : ''}" style="width: 70px; height: 70px; border-radius: 8px; object-fit: cover;" />
          <div>
            <h4 style="font-size: 1rem; font-weight: 700;">${claim.itemTitle}</h4>
            <span style="font-size: 0.8rem; color: var(--text-light);">Held at: ${claim.collectionLocation}</span>
          </div>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted);"><strong>Public description:</strong> ${item ? item.description : ''}</p>
      </div>

      <!-- Private Claimant Testimony -->
      <div class="review-box confidential-box">
        <span class="review-section-header" style="color: #b45309;">🔒 Strictly Private Ownership Testimony</span>
        <div style="font-size: 0.85rem; line-height: 1.6; margin-bottom: 1rem;">
          <p><strong>Claimant:</strong> ${claim.claimantName} (${claim.claimantEmail})</p>
          <p><strong>Department:</strong> ${claim.claimantDept}</p>
          <p><strong>Phone:</strong> ${claim.claimantPhone}</p>
          <p><strong>Lost On:</strong> ${claim.dateLost} at ${claim.locationLost}</p>
          <div style="background: #ffffff; padding: 0.85rem; border-radius: 8px; border: 1.5px solid #fde68a; margin-top: 0.5rem;">
            <strong style="display: block; color: #92400e; margin-bottom: 0.25rem;">Secret Identifiers &amp; Marks provided:</strong>
            ${claim.ownershipProofText}
          </div>
        </div>
      </div>
    </div>

    <!-- Collection Instructions & Notes -->
    <div style="margin-top: 1.5rem;">
      <label class="form-label">Security Collection Instruction / Verification Note</label>
      <input type="text" id="admin-collection-notes" value="Verified against student ID. Collect at ${claim.collectionLocation}." class="form-input" style="width: 100%; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border-subtle);" />
    </div>

    <div class="modal-footer" style="margin-top: 1.5rem;">
      <button onclick="handleRejectClaim('${claim.id}')" class="btn btn-danger">Reject Claim</button>
      <button onclick="handleApproveClaim('${claim.id}')" class="btn btn-primary">
        <span>Approve &amp; Send Collection Notice</span>
        <span>✓</span>
      </button>
    </div>
  `;

  modal.style.display = 'flex';
};

window.closeAdminReviewModal = function() {
  const modal = document.getElementById('admin-review-modal');
  if (modal) modal.style.display = 'none';
};

window.handleApproveClaim = function(claimId) {
  const notes = document.getElementById('admin-collection-notes')?.value;
  db.approveClaim(claimId, notes);
  closeAdminReviewModal();
  renderAdminDashboard();
  updateStatistics();
  showToast('Claim approved! Student notified with collection instructions.', '🎉');
};

window.handleRejectClaim = function(claimId) {
  const reason = prompt('Please enter reason for claim rejection (e.g. details mismatch):', 'Evidence does not match serial markings.');
  if (reason !== null) {
    db.rejectClaim(claimId, reason);
    closeAdminReviewModal();
    renderAdminDashboard();
    updateStatistics();
    showToast('Claim was rejected and item remains safe in directory.', 'ℹ️');
  }
};

window.markItemReturned = function(itemId) {
  db.updateItemStatus(itemId, 'returned');
  renderAdminDashboard();
  updateStatistics();
  showToast('Item marked as Reunited with owner!', '✅');
};

window.deleteCampusItem = function(itemId) {
  if (confirm('Are you sure you want to remove this item report?')) {
    db.deleteItem(itemId);
    renderAdminDashboard();
    updateStatistics();
    showToast('Item report removed.', '🗑️');
  }
};

// ============================================================================
// 8. User Dashboard
// ============================================================================
window.switchUserDashTab = function(tabName) {
  document.getElementById('dash-content-reports').style.display = tabName === 'reports' ? 'block' : 'none';
  document.getElementById('dash-content-claims').style.display = tabName === 'claims' ? 'block' : 'none';

  document.getElementById('tab-btn-reports').classList.toggle('active', tabName === 'reports');
  document.getElementById('tab-btn-claims').classList.toggle('active', tabName === 'claims');

  renderUserDashboard();
};

function renderUserDashboard() {
  const user = db.getCurrentUser();
  const items = db.getItems().filter(i => i.reporterUid === user.uid);
  const claims = db.getClaims().filter(c => c.claimantUid === user.uid);

  // Counts
  document.getElementById('user-reports-count').textContent = items.length;
  document.getElementById('user-claims-count').textContent = claims.length;

  // Render User Reports
  const reportsGrid = document.getElementById('user-reports-grid');
  if (items.length === 0) {
    reportsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 4rem 1rem; text-align: center; background: #ffffff; border-radius: 16px; border: 1px dashed var(--border-subtle);">
        <p style="color: var(--text-light); margin-bottom: 1rem;">You have not reported any lost or found items yet.</p>
        <button onclick="openReportModal('lost')" class="btn btn-sm btn-primary">File a Report</button>
      </div>
    `;
  } else {
    reportsGrid.innerHTML = items.map(item => `
      <article class="item-card">
        <div class="item-card-image-box">
          <img src="${item.photoUrl}" alt="${item.title}" class="item-card-image" />
          <span class="card-badge badge-${item.status}">${item.status.toUpperCase()}</span>
          <span class="category-pill-tag">${item.type.toUpperCase()}</span>
        </div>
        <div class="item-card-body">
          <h3 class="item-title">${item.title}</h3>
          <div class="item-meta-row">
            <span>📍 ${item.campusLocation}</span>
            <span>📅 ${item.date}</span>
          </div>
          <p class="item-description">${item.description}</p>
          <div class="item-card-footer">
            <span style="font-size: 0.75rem; color: var(--navy-600); font-weight: 600;">Status: ${item.status.toUpperCase()}</span>
            ${item.status !== 'returned' ? `
              <button onclick="markItemReturned('${item.id}')" class="btn btn-sm btn-outline">Mark Reunited</button>
            ` : '<span style="font-size: 0.8rem; color: #10b981; font-weight: 700;">✓ Completed</span>'}
          </div>
        </div>
      </article>
    `).join('');
  }

  // Render User Claims
  const claimsList = document.getElementById('user-claims-list');
  if (claims.length === 0) {
    claimsList.innerHTML = `
      <div style="padding: 3rem 1rem; text-align: center; background: #ffffff; border-radius: 16px; border: 1px dashed var(--border-subtle); color: var(--text-light);">
        <p>You have not submitted any ownership verification claims yet.</p>
      </div>
    `;
  } else {
    claimsList.innerHTML = claims.map(c => `
      <div class="user-claim-box">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
          <div>
            <h4 style="font-size: 1.1rem; font-weight: 700; color: var(--navy-950);">${c.itemTitle}</h4>
            <span style="font-size: 0.8rem; color: var(--text-light);">Submitted: ${new Date(c.submittedAt).toLocaleDateString()}</span>
          </div>
          <span class="card-badge badge-${c.status}">${c.status.toUpperCase()}</span>
        </div>

        <div style="background: var(--bg-body); padding: 0.85rem; border-radius: 8px; font-size: 0.85rem; margin-bottom: 0.75rem;">
          <p><strong>Your Submitted Proof:</strong> ${c.ownershipProofText}</p>
        </div>

        ${c.status === 'approved' ? `
          <div style="background: #ecfdf5; border: 1px solid #a7f3d0; padding: 0.85rem; border-radius: 8px; font-size: 0.85rem; color: #065f46;">
            <strong>🎉 Collection Instructions:</strong> ${c.adminNotes} (Collect at ${c.collectionLocation} with College ID).
          </div>
        ` : (c.status === 'rejected' ? `
          <div style="background: #fff1f2; border: 1px solid #fecdd3; padding: 0.85rem; border-radius: 8px; font-size: 0.85rem; color: #9f1239;">
            <strong>Notice:</strong> ${c.adminNotes}
          </div>
        ` : `
          <div style="font-size: 0.8rem; color: var(--text-light);">
            ⏳ Under review by Campus Security Desk. You will receive a notification once verified.
          </div>
        `)}
      </div>
    `).join('');
  }
}

// ============================================================================
// 9. Notifications System
// ============================================================================
window.toggleNotifications = function() {
  const dropdown = document.getElementById('notif-dropdown');
  if (!dropdown) return;
  const isHidden = dropdown.style.display === 'none';
  dropdown.style.display = isHidden ? 'block' : 'none';

  if (isHidden) {
    renderNotificationsList();
  }
};

function updateNotificationBadge() {
  const user = db.getCurrentUser();
  if (!user) return;
  const notifs = db.getNotificationsForUser(user.uid);
  const unreadCount = notifs.filter(n => !n.read).length;
  const badge = document.getElementById('notif-badge');
  if (badge) {
    badge.textContent = unreadCount;
    badge.style.display = unreadCount > 0 ? 'flex' : 'none';
  }
}

function renderNotificationsList() {
  const user = db.getCurrentUser();
  const notifs = db.getNotificationsForUser(user.uid);
  const list = document.getElementById('notif-list');
  if (!list) return;

  if (notifs.length === 0) {
    list.innerHTML = '<div style="padding: 1.5rem; text-align: center; color: var(--text-light); font-size: 0.85rem;">No new notifications</div>';
    return;
  }

  list.innerHTML = notifs.map(n => `
    <div class="notif-item ${n.read ? 'read' : 'unread'}">
      <div style="font-weight: 700; font-size: 0.85rem; color: var(--navy-950); margin-bottom: 0.2rem;">${n.title}</div>
      <div style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">${n.message}</div>
      <span style="font-size: 0.7rem; color: var(--text-light); margin-top: 0.35rem; display: block;">${new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
    </div>
  `).join('');
}

window.markAllNotificationsRead = function() {
  const user = db.getCurrentUser();
  if (!user) return;
  db.markNotificationsAsRead(user.uid);
  updateNotificationBadge();
  renderNotificationsList();
  showToast('Notifications marked as read.');
};

// ============================================================================
// 10. Item Details Modal
// ============================================================================
window.openItemDetailsModal = function(itemId) {
  const item = db.getItemById(itemId);
  if (!item) return;

  alert(`ITEM DETAILS:\n\nTitle: ${item.title}\nCategory: ${item.category}\nLocation: ${item.campusLocation}\nDate: ${item.date}\nStatus: ${item.status.toUpperCase()}\n\nDescription: ${item.description}\n\nReported by: ${item.reporterName}`);
};

// ============================================================================
// 11. Toast Notifications & Helpers
// ============================================================================
window.showToast = function(msg, icon = '✨') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toast.querySelector('.toast-icon').textContent = icon;
  toastMsg.textContent = msg;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
};

window.toggleFaq = function(trigger) {
  const item = trigger.closest('.accordion-item');
  if (item) item.classList.toggle('open');
};

window.openAuthModal = function() {
  document.getElementById('auth-modal').style.display = 'flex';
};

window.closeAuthModal = function() {
  document.getElementById('auth-modal').style.display = 'none';
};

window.handleAuthSubmit = function(e) {
  e.preventDefault();
  const email = document.getElementById('auth-email').value.trim();
  const role = document.getElementById('auth-role').value;

  if (!email.endsWith('@amaljyothi.ac.in') && !email.endsWith('@ajce.in')) {
    if (!confirm('Notice: Recommended to use your official @amaljyothi.ac.in college email. Continue anyway?')) {
      return;
    }
  }

  const user = db.loginUser(email);
  user.role = role;
  db.setCurrentUser(user);

  closeAuthModal();
  updateUserUI();
  showToast(`Welcome back, ${user.name}! Authenticated with AJCE Single Sign-On.`, '🎓');
};

function setupEventListeners() {
  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.notif-dropdown-wrapper')) {
      const dropdown = document.getElementById('notif-dropdown');
      if (dropdown) dropdown.style.display = 'none';
    }
  });
}

