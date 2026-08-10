/* ==========================================================================
   CampusGig Advanced Engine - Multi-Assignment Linear Workflow Pipeline
   ========================================================================== */

// Configured Seed Data matching interface attributes
const defaultGigs = [
    { id: "gig-1", title: "Build a Python Data Scraper", desc: "Extract key products from e-commerce sites.", category: "Coding", skills: ["Python", "Data"], budget: 40, postedBy: "admin.desk@cit.edu.in", totalAssignments: 2 },
    { id: "gig-2", title: "Campus Event Logo Design", desc: "Creative minimalist logo for TechFest.", category: "Design", skills: ["Logo Design", "Figma"], budget: 25, postedBy: "admin.desk@cit.edu.in", totalAssignments: 1 },
    { id: "gig-3", title: "UI/UX Profile Designer", desc: "Create responsive modern layout view prototypes.", category: "Design", skills: ["UI/UX", "Figma"], budget: 100, postedBy: "admin.desk@cit.edu.in", totalAssignments: 3 }
];

// Structural State Evaluation - Always pull from LocalStorage first to preserve submissions
let gigs = JSON.parse(localStorage.getItem('campus_gigs'));
if (!gigs || gigs.length === 0) {
    gigs = defaultGigs;
    localStorage.setItem('campus_gigs', JSON.stringify(defaultGigs));
}

let applications = JSON.parse(localStorage.getItem('campus_applications')) || [];
let notifications = JSON.parse(localStorage.getItem('campus_notifications')) || [];

// Session Workspace Configuration Tracking
let currentUser = JSON.parse(sessionStorage.getItem('active_user')) || { 
    email: "student.yuva@cit.edu.in", 
    role: "applicant", 
    name: "YUVASREE I" 
};

/* ==========================================================================
   Global Bootup Operations Pipeline
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    // Synchronize current user session across all page scopes
    const activeSessionState = sessionStorage.getItem('active_user');
    if (activeSessionState) {
        currentUser = JSON.parse(activeSessionState);
    } else {
        sessionStorage.setItem('active_user', JSON.stringify(currentUser));
    }

    // Refresh memory models from disk to capture newly posted forms safely
    gigs = JSON.parse(localStorage.getItem('campus_gigs')) || defaultGigs;
    applications = JSON.parse(localStorage.getItem('campus_applications')) || [];
    notifications = JSON.parse(localStorage.getItem('campus_notifications')) || [];

    injectSimulationControls();
    injectApplicationModalHTML();
    injectNotificationDashboardHTML();
    patchJobPostingInterface();
    
    // UI Rendering Execution Trees with Safety Buffers
    initializeRoleView();
    updateUserInterfaceCounters(currentUser.role === 'admin' ? 'Admin' : 'Applicant');
    setupGigSearchAndFilterBar();
    renderJobFeed();
    renderAdminDashboard();
    renderApplicantMyGigsPortfolio(); 
    renderNotifications();
    setupProfileDataBinding();
    setupDragAndDropEnvironment();
    updateAppliedGigsCounterBadge();

    // Hydrate form fields and editable biography area from localStorage cache
    loadSavedProfileData();

    // Fire up the real-time dynamic engines
    startLiveClock();
    if (typeof initializeAsynchronousCounters === "function") {
        initializeAsynchronousCounters();
    }
    initializeScrollInterceptor();

    /* ==== NEW EVENT-DRIVEN FEATURES MODULE BOOTUP ==== */
    setupMediaPlayerEngine();          // Client Brief Pitch / Video Player
    setupAuthFormEngine();             // Registration / Job Posting form validation
    setupSkillAssessmentEngine();      // Skill Assessment / Coding Verification quiz
    setupGigDiscussionEngine();        // Gig Discussion & Inquiry section
    renderFreelancerDashboard();       // Freelancer Dashboard & Earnings Tracker
});

function syncToLocalStorage() {
    localStorage.setItem('campus_gigs', JSON.stringify(gigs));
    localStorage.setItem('campus_applications', JSON.stringify(applications));
    localStorage.setItem('campus_notifications', JSON.stringify(notifications));
}

/* --- ROLE SWITCH MATRIX CONTROLLER --- */
function switchUserRole(role) {
    if (role === 'admin') {
        currentUser = { email: "admin.desk@cit.edu.in", role: "admin", name: "Professor Project Administrator" };
    } else {
        currentUser = { email: "student.yuva@cit.edu.in", role: "applicant", name: "YUVASREE I" };
    }
    sessionStorage.setItem('active_user', JSON.stringify(currentUser));
    window.location.reload();
}

function initializeRoleView() {
    const adminPanel = document.getElementById("dynamicAdminSectionWorksheet");
    const postJobLink = document.getElementById("navPost");
    const myGigsLink = document.getElementById("navMyGigs");

    if (currentUser.role === 'admin') {
        if (adminPanel) adminPanel.style.display = "block";
        if (postJobLink) postJobLink.style.display = "inline-block";
        if (myGigsLink) myGigsLink.style.display = "none";
    } else {
        if (adminPanel) adminPanel.style.display = "none";
        if (postJobLink) postJobLink.style.display = "none";
        if (myGigsLink) myGigsLink.style.display = "inline-block";
    }
}

// --- ROLE ADAPTIVE DISPLAY CONTROLLER ---
function updateUserInterfaceCounters(activeRoleString) {
    const earningsTileElement = document.getElementById("earningsCard");
    if (!earningsTileElement) return;

    if (activeRoleString === "Admin") {
        earningsTileElement.classList.add("hidden");
    } else {
        earningsTileElement.classList.remove("hidden");
    }
}

/* --- INJECT INTERFACE UTILITIES --- */
function injectSimulationControls() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks && !document.getElementById('roleSimulationWidget')) {
        const toggleWrapper = document.createElement('div');
        toggleWrapper.id = "roleSimulationWidget";
        toggleWrapper.style.cssText = "display: flex; gap: 0.3rem; background: var(--input-bg); padding: 0.2rem; border-radius: 6px; margin-right: 1rem; border: 1px solid var(--border-color); align-items: center;";
        toggleWrapper.innerHTML = `
            <span style="font-size:0.7rem; color:var(--text-muted); padding:0 0.2rem;">Role Control:</span>
            <button onclick="switchUserRole('applicant')" style="background: ${currentUser.role === 'applicant' ? 'var(--highlight-blue)' : 'transparent'}; color: ${currentUser.role === 'applicant' ? '#000' : 'var(--text-secondary)'}; border:none; padding:0.2rem 0.4rem; font-size:0.72rem; border-radius:4px; cursor:pointer; font-weight:bold;">Applicant</button>
            <button onclick="switchUserRole('admin')" style="background: ${currentUser.role === 'admin' ? 'var(--highlight-purple)' : 'transparent'}; color: ${currentUser.role === 'admin' ? '#fff' : 'var(--text-secondary)'}; border:none; padding:0.2rem 0.4rem; font-size:0.72rem; border-radius:4px; cursor:pointer; font-weight:bold;">Admin</button>
        `;
        navLinks.insertBefore(toggleWrapper, navLinks.firstChild);
    }
}

function injectApplicationModalHTML() {
    if (document.getElementById('appModalWrapper')) return;
    const modal = document.createElement('div');
    modal.id = "appModalWrapper";
    modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: none; align-items: center; justify-content: center;";
    modal.innerHTML = `
        <div style="background: var(--card-bg); border: 1px solid var(--border-color); padding: 2rem; border-radius: 12px; width: 95%; max-width: 500px;">
            <h3 style="color: var(--text-primary); margin-bottom: 0.2rem;">📝 Job Application Proposal Form</h3>
            <p id="modalTargetJobTitle" style="color: var(--highlight-blue); font-size: 0.88rem; margin-bottom: 1.2rem; font-weight: bold;"></p>
            <form onsubmit="processModalFormSubmission(event)">
                <input type="text" id="popName" value="${currentUser.name}" hidden>
                <input type="email" id="popEmail" value="${currentUser.email}" hidden>
                
                <div class="form_group" style="margin-bottom: 1rem;">
                    <label style="display:block; margin-bottom:0.3rem; color:var(--text-secondary); font-size:0.82rem;">Select Core Technical Domain</label>
                    <select id="popDomain" required style="width:100%; background:var(--input-bg); border:1px solid var(--border-color); color:var(--text-primary); padding:0.5rem; border-radius:6px; font-family:inherit;">
                        <option value="Coding">Coding / Development</option>
                        <option value="Design">UI/UX Graphic Design</option>
                        <option value="Writing">Technical Writing & Documentation</option>
                    </select>
                </div>

                <div class="form_group" style="margin-bottom: 1rem;">
                    <label style="display:block; margin-bottom:0.3rem; color:var(--text-secondary); font-size:0.82rem;">Cover Note Proposal Statement</label>
                    <textarea id="popCover" rows="4" placeholder="Why are you suited for this technical assignment?" required style="width:100%; background:var(--input-bg); border:1px solid var(--border-color); color:var(--text-primary); padding:0.5rem; border-radius:6px; font-family:inherit;"></textarea>
                </div>
                <div style="display: flex; gap: 1rem;">
                    <button type="submit" class="apply_btn" style="flex: 1; padding: 0.6rem;">Verify and Apply</button>
                    <button type="button" class="apply_btn" onclick="closeApplicationModal()" style="flex: 1; background: #ef4444; padding: 0.6rem;">Dismiss</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

function injectNotificationDashboardHTML() {
    const mainContainer = document.querySelector('main.container');
    if (!mainContainer) return;

    if (!document.getElementById('systemSignalAlertDashboard')) {
        const alertSection = document.createElement('section');
        alertSection.id = "systemSignalAlertDashboard";
        alertSection.style.cssText = "background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 1rem; margin-bottom: 2rem;";
        alertSection.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 0.4rem; margin-bottom: 0.6rem;">
                <h4 style="margin: 0; color: var(--text-primary); font-size: 0.9rem;">🔔 Real-Time Action Signals & Notification Tracking Hub</h4>
                <button onclick="clearNotifications()" style="background: transparent; border: none; color: var(--highlight-blue); cursor: pointer; font-size: 0.78rem; font-weight:bold;">Flush Feed Logs</button>
            </div>
            <div id="runtimeNotificationList" style="max-height: 120px; overflow-y: auto; font-size: 0.82rem;"></div>
        `;
        mainContainer.insertBefore(alertSection, mainContainer.firstChild);
    }

    if (!document.getElementById("dynamicAdminSectionWorksheet") && document.querySelector('.main_content_area')) {
        const adminSection = document.createElement('section');
        adminSection.id = "dynamicAdminSectionWorksheet";
        adminSection.style.cssText = "margin-bottom: 2.5rem; display: none; width: 100%; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem;";
        adminSection.innerHTML = `
            <h2 style="color: var(--text-primary); font-size: 1.25rem; margin-bottom: 0.2rem;">⚙️ Administrative Management Worksheet</h2>
            <p style="color: var(--text-muted); font-size: 0.8rem; margin-bottom: 1rem;">Review applicant submissions, track assignment progress milestones, and issue task approvals.</p>
            <div id="adminAppTrackingContainer"></div>
        `;
        mainContainer.insertBefore(adminSection, document.querySelector('.main_content_area'));
    }
}

/* --- AUTOMATED FIELD INJECTION FOR JOB POSTING (ASSIGNMENTS COUNT) --- */
function patchJobPostingInterface() {
    const postForm = document.getElementById("postGigForm");
    if (postForm && !document.getElementById("gigTotalAssignments")) {
        const targetDiv = document.querySelector(".form_group:nth-child(2)") || postForm.firstChild;
        const assignmentGroup = document.createElement("div");
        assignmentGroup.className = "form_group";
        assignmentGroup.style.marginBottom = "1rem";
        assignmentGroup.innerHTML = `
            <label for="gigTotalAssignments">Total Targeted Assignments Count</label>
            <input type="number" id="gigTotalAssignments" min="1" max="10" value="1" required style="width:100%; background:var(--input-bg); border:1px solid var(--border-color); color:var(--text-primary); padding:0.5rem; border-radius:6px;">
        `;
        targetDiv.parentNode.insertBefore(assignmentGroup, targetDiv.nextSibling);
    }
    setupPostingFormBinding();
}

function setupPostingFormBinding() {
    const originalPostForm = document.getElementById("postGigForm");
    if (!originalPostForm) return;

    originalPostForm.removeAttribute("onsubmit");
    originalPostForm.onclick = null;
    
    originalPostForm.addEventListener("submit", (event) => {
        event.preventDefault();
        
        const titleEl = document.getElementById("gigTitle");
        const budgetEl = document.getElementById("gigBudget");
        const catEl = document.getElementById("gigCategory");
        const descEl = document.getElementById("gigDescription");
        const assignEl = document.getElementById("gigTotalAssignments");

        const compiledAsset = {
            id: "gig-" + Date.now(),
            title: titleEl ? titleEl.value : "Untitled Assignment",
            budget: budgetEl ? parseInt(budgetEl.value) : 0,
            category: catEl ? catEl.value : "Coding",
            desc: descEl ? descEl.value : "No technical layout details provided.",
            postedBy: "admin.desk@cit.edu.in",
            skills: [catEl ? catEl.value : "General"],
            totalAssignments: assignEl ? parseInt(assignEl.value) : 1
        };

        let currentDiskGigs = JSON.parse(localStorage.getItem('campus_gigs')) || defaultGigs;
        currentDiskGigs.push(compiledAsset);
        localStorage.setItem('campus_gigs', JSON.stringify(currentDiskGigs));
        gigs = currentDiskGigs;

        alert("Active vacancy parameters written successfully into Database Layers!");
        window.location.href = "index.html"; 
    });
}

/* --- MAIN WORK FEED BROWSE SYSTEM (WITH DOMAIN BADGES) --- */
/* Search / Filter state used by the Gig Search & Category Filter Bar */
let gigSearchQuery = "";
let gigSelectedCategory = "All";
let gigSelectedBudgetRange = "All";
let bookmarkedGigIds = JSON.parse(localStorage.getItem('campus_bookmarks')) || [];

function matchesBudgetRange(budget, range) {
    if (range === "under50") return budget < 50;
    if (range === "50to150") return budget >= 50 && budget <= 150;
    if (range === "over150") return budget > 150;
    return true; // "All"
}

function getFilteredGigList() {
    const query = gigSearchQuery.trim().toLowerCase();
    return gigs.filter(job => {
        const matchesCategory = gigSelectedCategory === "All" || (job.category || "General") === gigSelectedCategory;
        const matchesBudget = matchesBudgetRange(job.budget || 0, gigSelectedBudgetRange);
        const haystack = `${job.title} ${job.desc || ""} ${(job.skills || []).join(" ")}`.toLowerCase();
        const matchesQuery = query === "" || haystack.includes(query);
        return matchesCategory && matchesBudget && matchesQuery;
    });
}

function renderJobFeed() {
    const feed = document.getElementById("liveFeedContainer");
    if (!feed) return; 
    feed.innerHTML = "";

    gigs = JSON.parse(localStorage.getItem('campus_gigs')) || defaultGigs;
    bookmarkedGigIds = JSON.parse(localStorage.getItem('campus_bookmarks')) || [];

    const visibleGigs = getFilteredGigList();

    const resultCountEl = document.getElementById("gigSearchResultCount");
    if (resultCountEl) {
        resultCountEl.textContent = `Showing ${visibleGigs.length} of ${gigs.length} gig${gigs.length === 1 ? "" : "s"}`;
    }

    if (visibleGigs.length === 0) {
        feed.innerHTML = `<p style="color:var(--text-muted); font-style:italic; grid-column: 1 / -1; text-align:center; padding:2rem;">No gigs match your current search & filter criteria.</p>`;
        return;
    }

    visibleGigs.forEach(job => {
        const hasApplied = applications.some(app => app.jobId === job.id && app.applicantEmail === currentUser.email);
        let buttonMarkup = "";

        if (currentUser.role === 'admin') {
            buttonMarkup = `<button class="apply_btn" style="background:#475569; cursor:not-allowed;" disabled>Admin Mode</button>`;
        } else {
            buttonMarkup = hasApplied 
                ? `<button class="apply_btn" style="background:var(--highlight-green)!important; color:#000!important; cursor:not-allowed;" disabled>✓ Applied</button>`
                : `<button class="apply_btn gig-apply-now-btn" data-job-id="${job.id}">Apply Now</button>`;
        }

        const isBookmarked = bookmarkedGigIds.includes(job.id);

        const card = document.createElement("div");
        card.className = "gig_card card_animation_on_hover";
        card.dataset.jobId = job.id;
        card.innerHTML = `
            <span class="gig-bookmark-star${isBookmarked ? ' bookmarked' : ''}" data-job-id="${job.id}" data-tooltip="${isBookmarked ? 'Remove bookmark' : 'Bookmark this gig'}" role="button" aria-label="Toggle bookmark">${isBookmarked ? '★' : '☆'}</span>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; padding-right: 1.6rem;">
                <h3 style="margin: 0;">${job.title}</h3>
                <span style="background: rgba(56, 189, 248, 0.15); color: var(--highlight-blue); font-size: 0.7rem; padding: 0.2rem 0.6rem; border-radius: 4px; font-weight: bold; border: 1px solid rgba(56, 189, 248, 0.3); text-transform: uppercase;">
                    ${job.category || 'General'}
                </span>
            </div>
            <p class="gig_desc">${job.desc || "No layout description provided."}</p>
            <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:0.5rem;">Target Scope: <strong>${job.totalAssignments || 1} sequential tasks</strong></div>
            <div class="gig_footer">
                <span class="budget">$${job.budget}</span>
                ${buttonMarkup}
            </div>
            <div class="gig-hover-overlay">
                <h4>📋 Full Project Requirements</h4>
                <p>${job.desc || "No detailed description was provided by the client for this listing."}</p>
                <p style="margin-top:0.4rem;"><strong>Skills:</strong> ${(job.skills && job.skills.length) ? job.skills.join(", ") : "General"}</p>
                <p><strong>Deliverable Timeline:</strong> ${job.totalAssignments || 1} sequential milestone${(job.totalAssignments || 1) > 1 ? "s" : ""}, submitted one at a time for review.</p>
                <span class="overlay-tag">Budget: $${job.budget}</span>
            </div>
        `;
        feed.appendChild(card);

        // mouseover / mouseout -> show/hide full requirement preview overlay
        const overlayEl = card.querySelector(".gig-hover-overlay");
        card.addEventListener("mouseover", () => {
            if (overlayEl) overlayEl.classList.add("force-visible");
        });
        card.addEventListener("mouseout", () => {
            if (overlayEl) overlayEl.classList.remove("force-visible");
        });

        // click on bookmark star -> toggle filled/empty + persist
        const starEl = card.querySelector(".gig-bookmark-star");
        if (starEl) {
            starEl.addEventListener("click", (event) => {
                event.stopPropagation();
                toggleGigBookmark(job.id, starEl);
            });
        }

        // click on Apply Now -> adds to applied list & updates header counter badge
        const applyBtn = card.querySelector(".gig-apply-now-btn");
        if (applyBtn) {
            applyBtn.addEventListener("click", () => openApplicationModal(job.id));
        }
    });

    updateAppliedGigsCounterBadge();
}

/* click on bookmark star icon -> toggles between empty (☆) and filled (★) states */
function toggleGigBookmark(jobId, starElement) {
    bookmarkedGigIds = JSON.parse(localStorage.getItem('campus_bookmarks')) || [];
    const index = bookmarkedGigIds.indexOf(jobId);
    if (index === -1) {
        bookmarkedGigIds.push(jobId);
    } else {
        bookmarkedGigIds.splice(index, 1);
    }
    localStorage.setItem('campus_bookmarks', JSON.stringify(bookmarkedGigIds));

    const nowBookmarked = bookmarkedGigIds.includes(jobId);
    if (starElement) {
        starElement.textContent = nowBookmarked ? "★" : "☆";
        starElement.classList.toggle("bookmarked", nowBookmarked);
        starElement.setAttribute("data-tooltip", nowBookmarked ? "Remove bookmark" : "Bookmark this gig");
    }
}

/* Updates the "Browse Gigs" header counter badge with the applicant's applied-gig count */
function updateAppliedGigsCounterBadge() {
    const badge = document.getElementById("appliedGigsCounterBadge");
    if (!badge) return;
    const liveApps = JSON.parse(localStorage.getItem('campus_applications')) || [];
    const myAppliedCount = liveApps.filter(app => app.applicantEmail === currentUser.email).length;
    if (myAppliedCount > 0) {
        badge.textContent = myAppliedCount;
        badge.style.display = "inline-flex";
    } else {
        badge.style.display = "none";
    }
}

/* --- GIG SEARCH & CATEGORY FILTER BAR WIRING --- */
function setupGigSearchAndFilterBar() {
    const searchInput = document.getElementById("gigSearchInput");
    const categorySelect = document.getElementById("gigCategorySelect");
    const budgetSelect = document.getElementById("gigBudgetSelect");
    if (!searchInput && !categorySelect && !budgetSelect) return; // not on this page

    // input on the search box -> filters listed gigs in real time as the user types
    if (searchInput) {
        searchInput.addEventListener("input", (event) => {
            gigSearchQuery = event.target.value;
            renderJobFeed();
        });

        // keydown (Enter key) inside the search box -> triggers an explicit search execution
        searchInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                gigSearchQuery = searchInput.value;
                renderJobFeed();
                const resultCountEl = document.getElementById("gigSearchResultCount");
                if (resultCountEl) {
                    resultCountEl.style.color = "var(--highlight-blue)";
                    setTimeout(() => { resultCountEl.style.color = "var(--text-muted)"; }, 600);
                }
            }
        });
    }

    // change on category <select> dropdown -> filters gig cards accordingly
    if (categorySelect) {
        categorySelect.addEventListener("change", (event) => {
            gigSelectedCategory = event.target.value;
            // Keep the legacy sidebar filter buttons visually in sync when present
            document.querySelectorAll(".filter_btn").forEach(btn => btn.classList.remove("active_filter"));
            renderJobFeed();
        });
    }

    // change on budget <select> dropdown -> filters gig cards accordingly
    if (budgetSelect) {
        budgetSelect.addEventListener("change", (event) => {
            gigSelectedBudgetRange = event.target.value;
            renderJobFeed();
        });
    }
}

/* Legacy sidebar category buttons (already referenced via onclick in the markup) */
function filterCategory(category) {
    gigSelectedCategory = category;
    document.querySelectorAll(".filter_btn").forEach(btn => btn.classList.remove("active_filter"));
    const matchedBtn = Array.from(document.querySelectorAll(".filter_btn")).find(btn => btn.textContent.trim().toLowerCase().startsWith(category.toLowerCase()) || (category === "All" && btn.textContent.includes("All")));
    if (matchedBtn) matchedBtn.classList.add("active_filter");
    const categorySelect = document.getElementById("gigCategorySelect");
    if (categorySelect) categorySelect.value = category;
    renderJobFeed();
}

/* --- APPLICATION MODAL INTERACTION CORE --- */
let activeSelectedJobIdContext = null;
function openApplicationModal(jobId) {
    activeSelectedJobIdContext = jobId;
    const targetJob = gigs.find(g => g.id === jobId);
    if (!targetJob) return;

    const modal = document.getElementById("appModalWrapper");
    const modalTitle = document.getElementById("modalTargetJobTitle");
    if (modal && modalTitle) {
        modalTitle.innerText = `Target Requirement Node: ${targetJob.title}`;
        modal.style.display = "flex";
    }
}

function closeApplicationModal() {
    const modal = document.getElementById("appModalWrapper");
    if (modal) modal.style.display = "none";
}

function processModalFormSubmission(event) {
    event.preventDefault();
    const targetJob = gigs.find(g => g.id === activeSelectedJobIdContext);
    
    const newApplication = {
        id: "app-" + Date.now(),
        jobId: targetJob.id,
        jobTitle: targetJob.title,
        applicantEmail: currentUser.email,
        applicantName: currentUser.name,
        domain: document.getElementById("popDomain").value,
        coverNote: document.getElementById("popCover").value,
        status: "Pending", 
        totalAssignments: targetJob.totalAssignments || 1,
        currentAssignmentNum: 1, 
        assignmentStatus: "Assigned", 
        submittedPayload: null,
        payoutIssued: false
    };

    applications.push(newApplication);
    notifications.push({
        id: "notif-" + Date.now(),
        recipient: "admin.desk@cit.edu.in",
        message: `📥 Candidate Request: ${currentUser.name} applied for "${targetJob.title}" under [${newApplication.domain}]`,
        timestamp: new Date().toLocaleTimeString()
    });

    syncToLocalStorage();
    alert("Application logged successfully!");
    closeApplicationModal();
    window.location.reload();
}

/* --- DYNAMIC APPLICANT WORKSPACE RENDER ENGINE --- */
function renderApplicantMyGigsPortfolio() {
    const dynamicTracker = document.getElementById("dynamicApplicantJobsTracker");
    if (!dynamicTracker) return; 

    dynamicTracker.innerHTML = "";
    const myActiveTracks = applications.filter(app => app.applicantEmail === currentUser.email);

    if (myActiveTracks.length === 0) {
        dynamicTracker.innerHTML = `<p style="color:var(--text-muted); padding:2rem; font-style:italic; text-align:center; width:100%;">You have no active contract tracks assigned currently.</p>`;
        return;
    }

    myActiveTracks.forEach(app => {
        const outerCard = document.createElement("div");
        outerCard.style.cssText = "background: var(--card-bg); border:1px solid var(--border-color); padding:1.5rem; border-radius:12px; margin-bottom:1.5rem; width:100%; box-shadow:var(--card-shadow); text-align:left;";
        
        let statusColor = app.status === "Accepted" ? "var(--highlight-green)" : (app.status === "Rejected" ? "#ef4444" : "#f59e0b");
        let contractWorkstationMarkup = "";

        if (app.status === "Accepted") {
            if (app.assignmentStatus === "Completed" || app.payoutIssued) {
                contractWorkstationMarkup = `
                    <div style="background:rgba(16,185,129,0.1); border:1px dashed var(--highlight-green); padding:1rem; border-radius:8px; margin-top:1rem; text-align:center;">
                        <h4 style="color:var(--highlight-green); margin:0 0 0.2rem 0;">🎉 All Assignments Completed & Verified!</h4>
                        <p style="color:var(--text-secondary); font-size:0.85rem; margin:0;">The structural execution phase is closed. Contract value reward has been wired to your profile account balance.</p>
                    </div>
                `;
            } else if (app.assignmentStatus === "Submitted") {
                contractWorkstationMarkup = `
                    <div style="background:rgba(245,158,11,0.1); border:1px dashed #f59e0b; padding:1.5rem; border-radius:8px; margin-top:1rem; text-align:center;">
                        <h4 style="color:#f59e0b; margin:0 0 0.3rem 0;">⏳ Assignment ${app.currentAssignmentNum} Package Pending Administrative Verification</h4>
                        <p style="color:var(--text-muted); font-size:0.8rem; margin:0;">The drop-box will reactivate once the project coordinator validates your submitted files.</p>
                    </div>
                `;
            } else {
                contractWorkstationMarkup = `
                    <div style="margin-top: 1.2rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                        <span class="role-badge-pill" style="background:var(--highlight-blue); color:#000; padding:0.2rem 0.5rem; font-size:0.68rem; text-transform:uppercase; font-weight:bold; border-radius:4px;">ACTIVE EXECUTION CONTRACT</span>
                        <p style="color:var(--text-muted); font-size:0.85rem; margin:0.5rem 0 1rem 0;">
                            Task Target: <strong style="color:var(--highlight-blue);">Assignment ${app.currentAssignmentNum} of ${app.totalAssignments}</strong>. Complete production elements matching standard sequences.
                        </p>
                        
                        <div style="border: 2px dashed var(--highlight-blue); border-radius: 8px; padding: 2rem; text-align: center; background: var(--input-bg); margin-bottom: 1rem; cursor: pointer;" onclick="simulateFileAssetDrop('${app.id}')">
                            <span style="font-size: 2rem; display: block; margin-bottom: 0.5rem;">📁</span>
                            <span style="color: var(--text-secondary); font-size: 0.85rem; display: block;" id="uploadLabel-${app.id}">
                                Click or drag and drop compressed source modules (.zip) or asset files here to finalize assignment submission structures
                            </span>
                        </div>
                        
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1rem;">
                            <span style="color:var(--highlight-green); font-weight:bold; font-size:1.2rem;">Value: $${gigs.find(g => g.id === app.jobId)?.budget || 40}</span>
                            <button class="apply_btn" onclick="submitFinalDeliveryPackage('${app.id}')" id="deliverBtn-${app.id}" style="padding:0.6rem 1.2rem;">Verify and Deliver Package</button>
                        </div>
                    </div>
                `;
            }
        } else {
            contractWorkstationMarkup = `
                <p style="color:var(--text-muted); font-style:italic; font-size:0.82rem; margin-top:0.8rem;">
                    Contract deployment parameters will release here once administrative operations change status to ACCEPTED.
                </p>
            `;
        }

        outerCard.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:0.5rem;">
                <div>
                    <h2 style="margin:0; font-size:1.15rem; color:var(--text-primary);">${app.jobTitle}</h2>
                    <span style="font-size:0.75rem; color:var(--text-muted);">Domain Track: <strong>${app.domain || 'Coding'}</strong></span>
                </div>
                <span style="color:${statusColor}; font-weight:bold; font-size:0.85rem; letter-spacing:0.5px; border:1px solid ${statusColor}40; padding:0.3rem 0.6rem; border-radius:4px; background:${statusColor}10;">
                    ${app.status.toUpperCase()}
                </span>
            </div>
            ${contractWorkstationMarkup}
        `;
        dynamicTracker.appendChild(outerCard);
    });
}

/* --- DRAG DROP SIMULATOR INTERACTION LOGIC --- */
let structuralMockUploadedFileCache = {};

function simulateFileAssetDrop(appId) {
    structuralMockUploadedFileCache[appId] = `package_payload_assignment_rev_${Date.now()}.zip`;
    const label = document.getElementById(`uploadLabel-${appId}`);
    if (label) {
        label.innerHTML = `🟢 Loaded: <strong style="color:var(--highlight-green);">${structuralMockUploadedFileCache[appId]}</strong> ready for secure infrastructure packaging.`;
    }
}

function submitFinalDeliveryPackage(appId) {
    const app = applications.find(a => a.id === appId);
    if (!structuralMockUploadedFileCache[appId]) {
        alert("Action Denied: Please map an execution file entry node package inside the dropzone container first.");
        return;
    }

    app.assignmentStatus = "Submitted";
    app.submittedPayload = structuralMockUploadedFileCache[appId];

    notifications.push({
        id: "notif-" + Date.now(),
        recipient: "admin.desk@cit.edu.in",
        message: `📦 Asset Inbound: ${app.applicantName} delivered file targets for Assignment [${app.currentAssignmentNum}/${app.totalAssignments}] of "${app.jobTitle}"`,
        timestamp: new Date().toLocaleTimeString()
    });

    syncToLocalStorage();
    alert(`Assignment ${app.currentAssignmentNum} package successfully submitted into review pipelines!`);
    renderApplicantMyGigsPortfolio();
}

/* --- ADMIN MANAGEMENT WORKSPACE HUB --- */
function renderAdminDashboard() {
    const container = document.getElementById("adminAppTrackingContainer");
    if (!container) return; 
    container.innerHTML = "";

    if (applications.length === 0) {
        container.innerHTML = `<p style="color:var(--text-muted); font-style:italic; font-size:0.85rem;">No candidate entries loaded inside application layers.</p>`;
        return;
    }

    applications.forEach(app => {
        const item = document.createElement("div");
        item.style.cssText = "background: var(--input-bg); border:1px solid var(--border-color); padding:1rem; border-radius:8px; margin-bottom:1rem; color:var(--text-secondary); text-align:left;";
        
        let controlActions = "";

        if (app.status === "Pending") {
            controlActions = `
                <div style="margin-top:0.6rem; display:flex; gap:0.5rem;">
                    <button onclick="updateFilingState('${app.id}', 'Accepted')" style="background:var(--highlight-green); color:#000; border:none; padding:0.3rem 0.6rem; border-radius:4px; font-weight:bold; cursor:pointer; font-size:0.75rem;">Accept & Onboard</button>
                    <button onclick="updateFilingState('${app.id}', 'Rejected')" style="background:#ef4444; color:white; border:none; padding:0.3rem 0.6rem; border-radius:4px; cursor:pointer; font-size:0.75rem;">Reject Entry</button>
                </div>
            `;
        } else if (app.status === "Accepted") {
            if (app.assignmentStatus === "Submitted") {
                controlActions = `
                    <div style="background:rgba(59,130,246,0.1); padding:0.8rem; border-radius:6px; border:1px dashed var(--highlight-blue); margin-top:0.6rem;">
                        <span style="font-size:0.8rem; display:block; color:var(--text-primary); margin-bottom:0.4rem;">📥 <strong>Review Package:</strong> Found file artifact: <code>${app.submittedPayload}</code></span>
                        <button onclick="approveCurrentAssignmentStep('${app.id}')" style="background:var(--highlight-blue); color:#000; font-weight:bold; border:none; padding:0.3rem 0.6rem; border-radius:4px; cursor:pointer; font-size:0.75rem;">
                            Approve Assignment ${app.currentAssignmentNum} & Progress Workflow
                        </button>
                    </div>
                `;
            } else if (app.assignmentStatus === "Completed" || app.payoutIssued) {
                controlActions = `<span style="color:var(--highlight-green); display:block; font-size:0.8rem; margin-top:0.5rem; font-weight:bold;">✓ Fully Audited & Total Payout Dispatched</span>`;
            } else {
                controlActions = `<span style="color:var(--text-muted); display:block; font-size:0.78rem; margin-top:0.5rem; font-style:italic;">⏳ Waiting for applicant to submit Assignment ${app.currentAssignmentNum} asset package file parameters...</span>`;
            }
        } else {
            controlActions = `<span style="color:#ef4444; font-size:0.78rem; font-weight:bold;">Contract Track Closed [REJECTED]</span>`;
        }

        item.innerHTML = `
            <div style="display:flex; justify-content:between; width:100%; font-size:0.85rem;">
                <div style="flex:1;">
                    <strong>Requirement Title:</strong> <span style="color:var(--text-primary); font-weight:bold;">${app.jobTitle}</span><br>
                    <strong>Applicant Profile:</strong> ${app.applicantName} (${app.applicantEmail})<br>
                    <strong>Selected Track Domain:</strong> <span style="color:var(--highlight-blue);">${app.domain || 'Coding'}</span><br>
                    <strong>Linear Milestones Track:</strong> Assignment <strong>${app.currentAssignmentNum}</strong> of <strong>${app.totalAssignments}</strong> total tasks.<br>
                    <strong>Filing Pipeline Phase:</strong> <span style="color:var(--highlight-blue); font-weight:bold;">${app.status.toUpperCase()}</span>
                </div>
            </div>
            ${controlActions}
        `;
        container.appendChild(item);
    });
}

function updateFilingState(appId, state) {
    const app = applications.find(a => a.id === appId);
    if (!app) return;
    app.status = state;
    
    notifications.push({
        id: "notif-" + Date.now(),
        recipient: app.applicantEmail,
        message: `📢 Status Update: Your application profile verification track for "${app.jobTitle}" was flagged as [${state.toUpperCase()}] by administrative managers.`,
        timestamp: new Date().toLocaleTimeString()
    });

    syncToLocalStorage();
    alert(`Filing trace configuration resolved as: ${state}`);
    window.location.reload();
}

/* --- STEP-BY-STEP WORKFLOW PROGRESSION LOGIC --- */
function approveCurrentAssignmentStep(appId) {
    const app = applications.find(a => a.id === appId);
    const targetJob = gigs.find(g => g.id === app.jobId);
    if (!app) return;
    
    if (app.currentAssignmentNum < app.totalAssignments) {
        app.currentAssignmentNum += 1;
        app.assignmentStatus = "Assigned";
        app.submittedPayload = null;

        notifications.push({
            id: "notif-" + Date.now(),
            recipient: app.applicantEmail,
            message: `⚡ Task Notification: Your previous submission for "${app.jobTitle}" was approved! Admin assigned Assignment [${app.currentAssignmentNum}/${app.totalAssignments}]. Complete to unlock system parameters.`,
            timestamp: new Date().toLocaleTimeString()
        });
        
        alert("Submission approved! Advancing student timeline forward to next assignment requirement segment.");
    } else {
        app.assignmentStatus = "Completed";
        app.payoutIssued = true;

        notifications.push({
            id: "notif-" + Date.now(),
            recipient: app.applicantEmail,
            message: `💰 CONTRACT PAYOUT RELEASED: All ${app.totalAssignments} assignments for "${app.jobTitle}" are successfully verified! Administrative clearance released the budget allocation payment value: $${targetJob?.budget || 40}.`,
            timestamp: new Date().toLocaleTimeString()
        });

        alert("Final assignment milestone package verified successfully! Total structural payout release command executed to applicant node workspace.");
    }

    syncToLocalStorage();
    window.location.reload();
}

/* --- NOTIFICATIONS ENGINE SYSTEM RENDERS --- */
function renderNotifications() {
    const listElement = document.getElementById("runtimeNotificationList");
    if (!listElement) return; 
    listElement.innerHTML = "";

    const relevantSignals = notifications.filter(n => n.recipient === currentUser.email);

    if (relevantSignals.length === 0) {
        listElement.innerHTML = `<p style="color: var(--text-muted); margin: 0; font-style: italic; font-size:0.8rem;">No active data signals logged inside current account boundaries.</p>`;
        return;
    }

    relevantSignals.reverse().forEach(n => {
        const item = document.createElement('div');
        item.style.cssText = "padding:0.4rem 0; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; color:var(--text-secondary); gap:1rem; text-align:left;";
        item.innerHTML = `<span>${n.message}</span><span style="color:var(--text-muted); font-size:0.7rem; white-space:nowrap;">${n.timestamp}</span>`;
        listElement.appendChild(item);
    });
}

function clearNotifications() {
    notifications = notifications.filter(n => n.recipient !== currentUser.email);
    syncToLocalStorage();
    renderNotifications();
}

/* --- PROFILE MANAGEMENT & DATA STORAGE LAYER --- */
function setupProfileDataBinding() {
    const dName = document.getElementById("displayProfileName");
    const dRole = document.getElementById("displayProfileRole");
    const dMail = document.getElementById("profileEmailDisplay");
    if (dName) dName.innerText = currentUser.name;
    if (dRole) dRole.innerText = `${currentUser.role.toUpperCase()} ROOT SECURITY TOKEN`;
    if (dMail) dMail.innerText = currentUser.email;
}

function validateAndSaveProfile() {
    const form = document.getElementById("labComprehensiveRegisterForm");
    if (!form) return;

    let isFormValid = true;
    const inputs = form.querySelectorAll("input[required], select[required], textarea[required]");

    inputs.forEach(input => {
        const messageContainer = input.parentElement.querySelector(".validation-message");
        if (!input.checkValidity()) {
            isFormValid = false;
            input.style.borderColor = "#ff4a4a";
            if (messageContainer) messageContainer.style.display = "block";
        } else {
            input.style.borderColor = "var(--border-color)";
            if (messageContainer) messageContainer.style.display = "none";
        }
    });

    if (isFormValid) {
        const checkedSkills = [];
        document.querySelectorAll("input[name='skills']:checked").forEach(checkbox => {
            checkedSkills.push(checkbox.value);
        });

        const updatedProfile = {
            name: document.getElementById("profileUsername").value,
            email: document.getElementById("regEmail").value,
            phone: document.getElementById("regPhone").value,
            gender: document.getElementById("regGender").value,
            dob: document.getElementById("regDOB").value,
            specialization: document.getElementById("profileSpecialization").value,
            address: document.getElementById("regAddress").value,
            skills: checkedSkills, 
            feedback: document.getElementById("editableFeedbackArea") ? document.getElementById("editableFeedbackArea").innerText : ""
        };

        localStorage.setItem("campus_user_profile", JSON.stringify(updatedProfile));
        sessionStorage.setItem("active_profile_session_username", updatedProfile.name);
        sessionStorage.setItem("last_session_interaction_timestamp", new Date().toISOString());
        
        if(document.getElementById("displayProfileName")) {
            document.getElementById("displayProfileName").innerText = updatedProfile.name;
        }
        if(document.getElementById("profileEmailDisplay")) {
            document.getElementById("profileEmailDisplay").innerText = updatedProfile.email;
        }

        alert("🚀 Registration parameters and profile configurations successfully committed to system layers.");
    } else {
        alert("❌ Form validation failed! Please check highlighted fields for accuracy.");
    }
}

function loadSavedProfileData() {
    const dataPayload = localStorage.getItem("campus_user_profile");
    if (!dataPayload) return;

    const profile = JSON.parse(dataPayload);
    
    if (document.getElementById("profileUsername")) document.getElementById("profileUsername").value = profile.name || "";
    if (document.getElementById("regEmail")) document.getElementById("regEmail").value = profile.email || "";
    if (document.getElementById("regPhone")) document.getElementById("regPhone").value = profile.phone || "";
    if (document.getElementById("regGender")) document.getElementById("regGender").value = profile.gender || "";
    if (document.getElementById("regDOB")) document.getElementById("regDOB").value = profile.dob || "";
    if (document.getElementById("profileSpecialization")) document.getElementById("profileSpecialization").value = profile.specialization || "";
    if (document.getElementById("regAddress")) document.getElementById("regAddress").value = profile.address || "";
    
    if (profile.skills && Array.isArray(profile.skills)) {
        document.querySelectorAll("input[name='skills']").forEach(checkbox => {
            checkbox.checked = profile.skills.includes(checkbox.value);
        });
    }

    if (document.getElementById("editableFeedbackArea") && profile.feedback) {
        document.getElementById("editableFeedbackArea").innerText = profile.feedback;
    }
}

function retrieveAndDisplayData() {
    const localRaw = localStorage.getItem("campus_user_profile");
    const sessionUser = sessionStorage.getItem("active_profile_session_username");
    const dropStatus = sessionStorage.getItem("last_submission_status") || "No current uploads made this session.";

    const displayContainer = document.getElementById("retrievedDataDisplayBlock");
    const localOutput = document.getElementById("localStorageContentOutput");
    const sessionOutput = document.getElementById("sessionStorageContentOutput");

    if (!localRaw) {
        alert("⚠️ No storage values found! Please fill out the form fields and press submit first.");
        return;
    }

    const data = JSON.parse(localRaw);

    localOutput.innerHTML = `
        <div><strong>👤 Full Identity Name:</strong> ${data.name || "N/A"}</div>
        <div><strong>📧 Correspondence Email:</strong> ${data.email || "N/A"}</div>
        <div><strong>📞 Telephone Contact:</strong> ${data.phone || "N/A"}</div>
        <div><strong>🧬 Gender Demographics:</strong> ${data.gender || "N/A"}</div>
        <div><strong>📅 Birthdate Entry:</strong> ${data.dob || "N/A"}</div>
        <div><strong>🛠️ Specialized Domain:</strong> ${data.specialization || "N/A"}</div>
        <div style="grid-column: span 2;"><strong>📍 Residential Postal Address:</strong> ${data.address || "N/A"}</div>
        <div style="grid-column: span 2;"><strong>🎯 Selected Interests Portfolio:</strong> ${data.skills.length > 0 ? data.skills.join(", ") : "None Chosen"}</div>
        <div style="grid-column: span 2; background: var(--card-bg); padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border-color);">
            <strong>📝 Feedback Log Comments:</strong><br>${data.feedback || "Empty workspace string"}
        </div>
    `;

    sessionOutput.innerHTML = `
        <p><strong>👤 Current Active User Session Token:</strong> ${sessionUser || "Guest Account Profile"}</p>
        <p><strong>📦 Workspace Drag & Drop Activity Status:</strong> ${dropStatus}</p>
    `;

    if (displayContainer) displayContainer.classList.remove("hidden");
}

function handleCancelNavigation() {
    if (confirm("Are you sure you want to discard your input modifications and return home?")) {
        window.location.href = "index.html";
    }
}

function clearCachedRegistration() {
    if (confirm("🚨 Are you sure you want to completely wipe all cached information matrices from this browser?")) {
        localStorage.removeItem("campus_user_profile");
        sessionStorage.removeItem("active_profile_session_username");
        sessionStorage.removeItem("last_submission_status");

        const displayContainer = document.getElementById("retrievedDataDisplayBlock");
        if (displayContainer) displayContainer.classList.add("hidden");

        const form = document.getElementById("labComprehensiveRegisterForm");
        if (form) form.reset();
        if (document.getElementById("editableFeedbackArea")) {
            document.getElementById("editableFeedbackArea").innerText = "";
        }

        alert("🗑️ Local cache storage layers cleared successfully.");
        window.location.reload();
    }
}

/* --- ADVANCED DRAG AND DROP WORKFLOW ENGINE --- */
function setupDragAndDropEnvironment() {
    const dragSource = document.getElementById("dragSourceToken");
    const dropTarget = document.getElementById("fileDropZone");

    ["dragover", "drop"].forEach(eventName => {
        window.addEventListener(eventName, (event) => {
            event.preventDefault();
        });
    });

    if (dragSource) {
        dragSource.addEventListener("dragstart", (event) => {
            event.dataTransfer.effectAllowed = "copyMove";
            event.dataTransfer.setData("text/plain", event.target.id);
            dragSource.style.opacity = "0.5";
        });

        dragSource.addEventListener("dragend", () => {
            dragSource.style.opacity = "1";
        });
    }

    if (dropTarget) {
        ["dragover", "dragenter"].forEach(eventName => {
            dropTarget.addEventListener(eventName, (event) => {
                event.preventDefault();
                event.stopPropagation();
                event.dataTransfer.dropEffect = "copy";
                dropTarget.classList.add("drag_over_active");
            });
        });

        ["dragleave", "drop"].forEach(eventName => {
            dropTarget.addEventListener(eventName, () => {
                dropTarget.classList.remove("drag_over_active");
            });
        });

        dropTarget.addEventListener("drop", (event) => {
            event.preventDefault();
            event.stopPropagation();

            const tokenId = event.dataTransfer.getData("text/plain");
            const files = event.dataTransfer.files;

            if (files && files.length > 0) {
                const droppedFile = files[0];
                dropTarget.style.borderColor = "var(--highlight-green)";
                if (document.getElementById("dropZoneIcon")) document.getElementById("dropZoneIcon").textContent = "📄";
                if (document.getElementById("dropZoneText")) {
                    document.getElementById("dropZoneText").innerHTML = `<strong>✅ Native File Loaded:</strong> ${droppedFile.name} (${(droppedFile.size / 1024).toFixed(1)} KB) ready for processing!`;
                }
                sessionStorage.setItem("last_submission_status", `Uploaded file [${droppedFile.name}] via local explorer drop.`);
                alert(`📁 File "${droppedFile.name}" recognized successfully!`);
            } 
            else if (tokenId === "dragSourceToken" || (!tokenId && event.dataTransfer.items)) {
                dropTarget.style.borderColor = "var(--highlight-purple)";
                if (document.getElementById("dropZoneIcon")) document.getElementById("dropZoneIcon").textContent = "📦";
                if (document.getElementById("dropZoneText")) {
                    document.getElementById("dropZoneText").innerHTML = "<strong>✅ Module Package Dropped:</strong> compressed zip tracking verified successfully via sandbox system!";
                }
                sessionStorage.setItem("last_submission_status", "Uploaded via local verification environment.");
                alert("📦 Package accepted and verified!");
            }
        });
    }
}

/* --- DYNAMIC UTILITY INTERACTION ENGINE --- */
function startLiveClock() {
    const clockElement = document.getElementById("liveClockWidget");
    if (!clockElement) return;

    function updateTime() {
        const now = new Date();
        const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
        clockElement.innerHTML = `📅 ${formattedDate} &nbsp;|&nbsp; ⏰ ${formattedTime}`;
    }
    updateTime();
    setInterval(updateTime, 1000);
}

/* ==========================================================================
   DYNAMIC REAL-TIME COUNTER METRIC ENGINE
   ========================================================================== */
function initializeAsynchronousCounters() {
    // 1. Refresh live local arrays from storage layers
    const liveGigs = JSON.parse(localStorage.getItem('campus_gigs')) || defaultGigs;
    const liveApps = JSON.parse(localStorage.getItem('campus_applications')) || [];
    
    // 2. Calculate true metric values based on data states
    let totalOpenGigs = liveGigs.length;
    let activeCoops = liveApps.filter(app => app.status === "Accepted").length;
    
    // Calculate simulated earnings ($40 baseline per accepted app or total completed budget)
    let totalEarnings = liveApps
        .filter(app => app.status === "Accepted")
        .reduce((sum, app) => {
            const match = liveGigs.find(g => g.id === app.jobId);
            return sum + (match ? match.budget : 40);
        }, 0);

    // 3. Target DOM elements by their respective layout IDs
    const openGigsElement = document.getElementById("counterOpenGigs");
    const activeCoopsElement = document.getElementById("counterActiveCoops");
    const earningsElement = document.getElementById("counterEarnings");

    // 4. Update the element target properties dynamically
    if (openGigsElement) openGigsElement.setAttribute("data-target", totalOpenGigs);
    if (activeCoopsElement) activeCoopsElement.setAttribute("data-target", activeCoops);
    if (earningsElement) earningsElement.setAttribute("data-target", totalEarnings);

    // 5. Run the fluid numeric counting animation
    const counterElements = document.querySelectorAll(".counter-metric");
    counterElements.forEach(counter => {
        const targetValue = parseInt(counter.getAttribute("data-target"), 10) || 0;
        
        if (targetValue === 0) {
            counter.textContent = "0";
            return;
        }

        const engineDuration = 1000; // 1-second animation execution window
        const frameStepTime = 20;
        let activeValue = 0;
        const increment = Math.ceil(targetValue / (engineDuration / frameStepTime));
        
        const runtimeProgressLoop = setInterval(() => {
            activeValue += increment; 
            if (activeValue >= targetValue) {
                counter.textContent = counter.id === "counterEarnings" ? `${targetValue}` : targetValue;
                clearInterval(runtimeProgressLoop);
            } else {
                counter.textContent = activeValue;
            }
        }, frameStepTime);
    });
}

function initializeScrollInterceptor() {
    const topNavigationButton = document.getElementById("scrollToTopBtn");
    if (!topNavigationButton) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            topNavigationButton.style.display = "flex";
        } else {
            topNavigationButton.style.display = "none";
        }
    });

    topNavigationButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

function processLogout() { 
    alert("Closing transmission paths."); 
    sessionStorage.removeItem('active_user');
    window.location.reload(); 
}

function toggleSystemTheme() { 
    document.body.classList.toggle("theme-light"); 
}

/* ==========================================================================
   ==========================================================================
   NEW EVENT-DRIVEN FEATURES MODULE
   Implements the 7 required interactive assignment areas using
   addEventListener(), event delegation, and preventDefault().
   ==========================================================================
   ========================================================================== */

/* ==========================================================================
   2. CLIENT BRIEF PITCH / VIDEO PLAYER
   ========================================================================== */
function setupMediaPlayerEngine() {
    const video = document.getElementById("briefVideoPlayer");
    const playPauseBtn = document.getElementById("mediaPlayPauseBtn");
    const volumeSlider = document.getElementById("mediaVolumeSlider");
    const progressTrack = document.getElementById("mediaProgressTrack");
    const progressFill = document.getElementById("mediaProgressFill");
    const timeLabel = document.getElementById("mediaTimeLabel");

    if (!video || !playPauseBtn) return; // media player not present on this page

    function formatTime(seconds) {
        if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
        return `${mins}:${secs}`;
    }

    // click on the Play/Pause button -> toggles video playback
    playPauseBtn.addEventListener("click", () => {
        if (video.paused || video.ended) {
            video.play();
            playPauseBtn.textContent = "⏸";
            playPauseBtn.setAttribute("data-tooltip", "Pause playback");
        } else {
            video.pause();
            playPauseBtn.textContent = "▶";
            playPauseBtn.setAttribute("data-tooltip", "Resume playback");
        }
    });

    // change on the volume range slider -> adjusts media volume dynamically
    if (volumeSlider) {
        volumeSlider.addEventListener("change", () => {
            video.volume = parseFloat(volumeSlider.value);
        });
        // also respond live while dragging for a smoother UX (input event)
        volumeSlider.addEventListener("input", () => {
            video.volume = parseFloat(volumeSlider.value);
        });
    }

    // timeupdate on the video element -> updates the progress bar as media plays
    video.addEventListener("timeupdate", () => {
        if (video.duration > 0 && progressFill) {
            const pct = (video.currentTime / video.duration) * 100;
            progressFill.style.width = pct + "%";
        }
        if (timeLabel) {
            timeLabel.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
        }
    });

    video.addEventListener("loadedmetadata", () => {
        if (timeLabel) timeLabel.textContent = `0:00 / ${formatTime(video.duration)}`;
    });

    video.addEventListener("ended", () => {
        playPauseBtn.textContent = "▶";
        playPauseBtn.setAttribute("data-tooltip", "Replay video");
    });

    // BONUS: click on the progress bar to seek
    if (progressTrack) {
        progressTrack.addEventListener("click", (event) => {
            if (!video.duration) return;
            const rect = progressTrack.getBoundingClientRect();
            const clickRatio = (event.clientX - rect.left) / rect.width;
            video.currentTime = Math.max(0, Math.min(1, clickRatio)) * video.duration;
        });
    }
}

/* ==========================================================================
   3. STUDENT FREELANCER REGISTRATION / JOB POSTING FORM (auth.html)
   ========================================================================== */
function setupAuthFormEngine() {
    const authForm = document.getElementById("authForm");
    if (!authForm) return; // not on the auth page

    const emailField = document.getElementById("authEmail");
    const passwordField = document.getElementById("authPassword");
    const confirmField = document.getElementById("authConfirmPassword");
    const confirmGroup = document.getElementById("confirmPasswordGroup");
    const emailError = document.getElementById("authEmailError");
    const passwordError = document.getElementById("authPasswordError");
    const confirmError = document.getElementById("authConfirmError");
    const confirmSuccess = document.getElementById("authConfirmSuccess");
    const confirmToast = document.getElementById("authConfirmToast");

    // Show the Confirm Password field only while in SIGNUP / Register mode
    function syncConfirmPasswordVisibility() {
        const isSignup = document.getElementById("fullNameGroup") &&
            document.getElementById("fullNameGroup").style.display !== "none";
        if (confirmGroup) confirmGroup.style.display = isSignup ? "block" : "none";
        if (!isSignup && confirmField) confirmField.value = "";
    }
    // Run once on load, and again whenever tabs are switched (switchAuthMode calls this too)
    syncConfirmPasswordVisibility();
    window.__syncConfirmPasswordVisibility = syncConfirmPasswordVisibility;

    // blur on Email field -> validates format & shows inline error message
    if (emailField) {
        emailField.addEventListener("blur", () => {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const valid = emailPattern.test(emailField.value.trim());
            emailField.classList.toggle("input-invalid", !valid);
            emailField.classList.toggle("input-valid", valid && emailField.value.trim() !== "");
            if (emailError) emailError.classList.toggle("visible", !valid);
        });
        emailField.addEventListener("input", () => {
            if (emailField.classList.contains("input-invalid")) {
                emailField.classList.remove("input-invalid");
                if (emailError) emailError.classList.remove("visible");
            }
        });
    }

    // blur on Password field -> validates format & shows inline error message
    if (passwordField) {
        passwordField.addEventListener("blur", () => {
            const valid = passwordField.value.length >= 6;
            passwordField.classList.toggle("input-invalid", !valid);
            passwordField.classList.toggle("input-valid", valid);
            if (passwordError) passwordError.classList.toggle("visible", !valid);
        });
        passwordField.addEventListener("input", () => {
            if (passwordField.classList.contains("input-invalid")) {
                passwordField.classList.remove("input-invalid");
                if (passwordError) passwordError.classList.remove("visible");
            }
            // Re-check the confirm field live if the user edits the original password afterwards
            if (confirmField && confirmField.value) confirmField.dispatchEvent(new Event("input"));
        });
    }

    // input on "Confirm Password" -> checks live whether the value matches the Password field
    if (confirmField) {
        confirmField.addEventListener("input", () => {
            if (confirmField.value === "") {
                confirmField.classList.remove("input-invalid", "input-valid");
                if (confirmError) confirmError.classList.remove("visible");
                if (confirmSuccess) confirmSuccess.classList.remove("visible");
                return;
            }
            const matches = confirmField.value === passwordField.value;
            confirmField.classList.toggle("input-invalid", !matches);
            confirmField.classList.toggle("input-valid", matches);
            if (confirmError) confirmError.classList.toggle("visible", !matches);
            if (confirmSuccess) confirmSuccess.classList.toggle("visible", matches);
        });
    }

    // submit on the form -> prevents default submission, validates all fields, shows confirmation
    authForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const isSignup = document.getElementById("fullNameGroup") &&
            document.getElementById("fullNameGroup").style.display !== "none";

        let isValid = true;

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailField.value.trim())) {
            isValid = false;
            emailField.classList.add("input-invalid");
            if (emailError) emailError.classList.add("visible");
        }

        if (passwordField.value.length < 6) {
            isValid = false;
            passwordField.classList.add("input-invalid");
            if (passwordError) passwordError.classList.add("visible");
        }

        if (isSignup && confirmField) {
            if (confirmField.value !== passwordField.value || confirmField.value === "") {
                isValid = false;
                confirmField.classList.add("input-invalid");
                if (confirmError) confirmError.classList.add("visible");
            }
        }

        if (!isValid) {
            if (confirmToast) confirmToast.classList.remove("visible");
            return;
        }

        // Delegate to the existing auth action processor (role/session bootstrap), if present
        if (typeof executeAuthAction === "function") {
            executeAuthAction(event, { skipPreventDefault: true });
        }

        if (confirmToast) {
            confirmToast.textContent = isSignup
                ? "✅ Registration successful! Your CampusGig account has been created."
                : "✅ Signed in successfully! Redirecting to your dashboard...";
            confirmToast.classList.add("visible");
        }
    });
}

/* Tab toggle between Sign In / Register modes (referenced by existing onclick markup) */
function switchAuthMode(mode) {
    const tabLogin = document.getElementById("tabLogin");
    const tabSignup = document.getElementById("tabSignup");
    const fullNameGroup = document.getElementById("fullNameGroup");
    const roleGroup = document.getElementById("roleGroup");
    const rememberMeContainer = document.getElementById("rememberMeContainer");
    const submitBtn = document.getElementById("authSubmitBtn");

    const isSignup = mode === "SIGNUP";

    if (tabLogin) tabLogin.classList.toggle("active_tab", !isSignup);
    if (tabSignup) tabSignup.classList.toggle("active_tab", isSignup);
    if (fullNameGroup) fullNameGroup.style.display = isSignup ? "block" : "none";
    if (roleGroup) roleGroup.style.display = isSignup ? "block" : "none";
    if (rememberMeContainer) rememberMeContainer.style.display = isSignup ? "none" : "flex";
    if (submitBtn) submitBtn.textContent = isSignup ? "Create My Account" : "Access Environment";

    if (typeof window.__syncConfirmPasswordVisibility === "function") {
        window.__syncConfirmPasswordVisibility();
    }
}

/* Finalizes sign-in / registration and hands off to the session layer used across the app */
function executeAuthAction(event, options) {
    if (event && !(options && options.skipPreventDefault)) event.preventDefault();

    const emailField = document.getElementById("authEmail");
    const nameField = document.getElementById("authName");
    const isSignup = document.getElementById("fullNameGroup") &&
        document.getElementById("fullNameGroup").style.display !== "none";

    const sessionUser = {
        email: emailField ? emailField.value.trim() : "student.yuva@cit.edu.in",
        role: "applicant",
        name: (isSignup && nameField && nameField.value.trim()) ? nameField.value.trim() : "YUVASREE I"
    };

    sessionStorage.setItem('active_user', JSON.stringify(sessionUser));

    setTimeout(() => {
        window.location.href = "index.html";
    }, 900);
}

/* ==========================================================================
   4. SKILL ASSESSMENT / CODING VERIFICATION MODULE (skill-test.html)
   ========================================================================== */
const skillQuizBank = [
    {
        id: "q1",
        question: "Which JavaScript method attaches an event handler without overwriting existing inline handlers?",
        options: ["element.onclick = fn", "element.addEventListener('click', fn)", "element.setAttribute('onclick', fn)", "element.click(fn)"],
        correctIndex: 1
    },
    {
        id: "q2",
        question: "Which method call stops a form from performing its default page-reload submission?",
        options: ["event.stopPropagation()", "event.cancel()", "event.preventDefault()", "form.stop()"],
        correctIndex: 2
    },
    {
        id: "q3",
        question: "In CSS, which property is used to make a flex container's items wrap onto new lines?",
        options: ["flex-direction", "flex-wrap", "flex-grow", "align-content"],
        correctIndex: 1
    },
    {
        id: "q4",
        question: "Event delegation relies on which key characteristic of the DOM?",
        options: ["Event bubbling up through ancestor elements", "CSS specificity", "Local storage persistence", "The viewport meta tag"],
        correctIndex: 0
    },
    {
        id: "q5",
        question: "Which array method returns a NEW array containing only elements that pass a test function?",
        options: ["Array.map()", "Array.reduce()", "Array.filter()", "Array.forEach()"],
        correctIndex: 2
    }
];

let quizTimerInterval = null;
let quizSecondsRemaining = 90;
let quizUserAnswers = {};
let quizSubmitted = false;

function renderSkillQuizQuestions() {
    const container = document.getElementById("quizQuestionsContainer");
    if (!container) return;
    container.innerHTML = "";

    skillQuizBank.forEach((q, qIndex) => {
        const card = document.createElement("div");
        card.className = "quiz-question-card";
        card.dataset.questionId = q.id;

        const optionsHtml = q.options.map((opt, optIndex) => `
            <label class="quiz-option-label" data-option-index="${optIndex}">
                <input type="radio" name="${q.id}" value="${optIndex}" disabled>
                <span>${opt}</span>
            </label>
        `).join("");

        card.innerHTML = `
            <h4>Q${qIndex + 1}. ${q.question}</h4>
            ${optionsHtml}
        `;
        container.appendChild(card);

        // change on radio button options -> records the selected answer
        card.querySelectorAll(`input[name="${q.id}"]`).forEach(radio => {
            radio.addEventListener("change", (event) => {
                quizUserAnswers[q.id] = parseInt(event.target.value, 10);
            });
        });
    });
}

function formatQuizTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = (totalSeconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs.length === 1 ? "0" + secs : secs}`.replace(/^(\d):/, "0$1:");
}

function setupSkillAssessmentEngine() {
    const startBtn = document.getElementById("startAssessmentBtn");
    const submitBtn = document.getElementById("submitTestBtn");
    const timerDisplay = document.getElementById("quizTimerDisplay");
    const resultPanel = document.getElementById("quizResultPanel");
    const retakeBtn = document.getElementById("retakeQuizBtn");

    if (!startBtn || !submitBtn) return; // not on the skill-test page

    renderSkillQuizQuestions();
    if (timerDisplay) timerDisplay.textContent = `⏱ ${formatQuizTime(quizSecondsRemaining)}`;

    // BONUS: click on "Start Assessment" begins the countdown timer
    startBtn.addEventListener("click", () => {
        startBtn.disabled = true;
        startBtn.style.display = "none";
        submitBtn.style.display = "block";
        quizSubmitted = false;
        quizUserAnswers = {};

        document.querySelectorAll('#quizQuestionsContainer input[type="radio"]').forEach(radio => {
            radio.disabled = false;
        });

        quizSecondsRemaining = 90;
        if (timerDisplay) timerDisplay.textContent = `⏱ ${formatQuizTime(quizSecondsRemaining)}`;

        // A timer using setInterval that auto-submits the assessment when time expires
        clearInterval(quizTimerInterval);
        quizTimerInterval = setInterval(() => {
            quizSecondsRemaining -= 1;
            if (timerDisplay) {
                timerDisplay.textContent = `⏱ ${formatQuizTime(Math.max(quizSecondsRemaining, 0))}`;
                timerDisplay.classList.toggle("time-critical", quizSecondsRemaining <= 15);
            }
            if (quizSecondsRemaining <= 0) {
                clearInterval(quizTimerInterval);
                submitSkillAssessment(true);
            }
        }, 1000);
    });

    // click on "Submit Test" -> calculates and displays the score, disabling further radio inputs
    submitBtn.addEventListener("click", () => submitSkillAssessment(false));

    if (retakeBtn) {
        retakeBtn.addEventListener("click", () => {
            clearInterval(quizTimerInterval);
            quizSubmitted = false;
            quizUserAnswers = {};
            quizSecondsRemaining = 90;
            if (timerDisplay) {
                timerDisplay.textContent = `⏱ ${formatQuizTime(quizSecondsRemaining)}`;
                timerDisplay.classList.remove("time-critical");
            }
            if (resultPanel) resultPanel.classList.remove("visible");
            startBtn.disabled = false;
            startBtn.style.display = "inline-block";
            submitBtn.style.display = "none";
            renderSkillQuizQuestions();
        });
    }
}

function submitSkillAssessment(autoSubmitted) {
    if (quizSubmitted) return;
    quizSubmitted = true;
    clearInterval(quizTimerInterval);

    const submitBtn = document.getElementById("submitTestBtn");
    const resultPanel = document.getElementById("quizResultPanel");
    const scoreValueEl = document.getElementById("quizScoreValue");
    const resultMessageEl = document.getElementById("quizResultMessage");
    const timerDisplay = document.getElementById("quizTimerDisplay");

    let correctCount = 0;

    skillQuizBank.forEach(q => {
        const userAnswer = quizUserAnswers[q.id];
        const card = document.querySelector(`.quiz-question-card[data-question-id="${q.id}"]`);
        if (userAnswer === q.correctIndex) correctCount += 1;

        if (card) {
            card.querySelectorAll(".quiz-option-label").forEach((label, idx) => {
                const radio = label.querySelector("input");
                if (radio) radio.disabled = true; // disabling further radio inputs
                if (idx === q.correctIndex) label.classList.add("correct-answer");
                else if (idx === userAnswer) label.classList.add("wrong-answer");
            });
        }
    });

    if (submitBtn) submitBtn.style.display = "none";
    if (timerDisplay) timerDisplay.classList.remove("time-critical");

    if (scoreValueEl) scoreValueEl.textContent = `${correctCount}/${skillQuizBank.length}`;
    if (resultMessageEl) {
        resultMessageEl.textContent = autoSubmitted
            ? "⏰ Time's up! Your assessment was auto-submitted with your recorded answers."
            : "✅ Your assessment has been submitted and graded.";
    }
    if (resultPanel) resultPanel.classList.add("visible");
}

/* ==========================================================================
   6. GIG DISCUSSION & INQUIRY SECTION (index.html)
   ========================================================================== */
let gigDiscussionThread = JSON.parse(localStorage.getItem('campus_gig_discussion')) || [
    {
        id: "cmt-seed-1",
        author: "admin.desk@cit.edu.in",
        message: "Please make sure your scraper respects robots.txt for all target domains before submitting.",
        timestamp: "9:02 AM",
        replies: []
    }
];

function persistGigDiscussionThread() {
    localStorage.setItem('campus_gig_discussion', JSON.stringify(gigDiscussionThread));
}

function renderGigDiscussionThread() {
    const container = document.getElementById("discussionThreadContainer");
    if (!container) return;
    container.innerHTML = "";

    if (gigDiscussionThread.length === 0) {
        container.innerHTML = `<p style="color:var(--text-muted); font-style:italic; font-size:0.85rem;">No questions posted yet. Be the first to ask!</p>`;
        return;
    }

    gigDiscussionThread.forEach(comment => {
        const item = document.createElement("div");
        item.className = "comment-thread-item";
        item.dataset.commentId = comment.id;

        const repliesHtml = (comment.replies || []).map(reply => `
            <div class="nested-reply-item">
                <span class="comment-author-line">${reply.author}<span class="comment-timestamp">${reply.timestamp}</span></span>
                <p class="comment-body-text">${reply.message}</p>
            </div>
        `).join("");

        item.innerHTML = `
            <span class="comment-author-line">${comment.author}<span class="comment-timestamp">${comment.timestamp}</span></span>
            <p class="comment-body-text" data-comment-id="${comment.id}" title="Double-click to edit your comment">${comment.message}</p>
            <div class="comment-actions">
                <button type="button" class="comment-reply-link" data-reply-toggle="${comment.id}">↩ Reply</button>
            </div>
            <div class="reply-input-box" id="replyBox-${comment.id}">
                <input type="text" placeholder="Write a reply..." id="replyInput-${comment.id}">
                <button type="button" class="apply_btn" style="padding:0.4rem 0.8rem; font-size:0.78rem;" data-reply-submit="${comment.id}">Send</button>
            </div>
            <div class="nested-replies-container">${repliesHtml}</div>
        `;
        container.appendChild(item);
    });
}

function setupGigDiscussionEngine() {
    const form = document.getElementById("discussionForm");
    const container = document.getElementById("discussionThreadContainer");
    if (!form || !container) return; // not on this page

    renderGigDiscussionThread();

    // submit (Post Comment) -> prevents default reload, appends the new message to the thread
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const nameInput = document.getElementById("discussionNameInput");
        const msgInput = document.getElementById("discussionMsgInput");
        if (!nameInput.value.trim() || !msgInput.value.trim()) return;

        gigDiscussionThread.push({
            id: "cmt-" + Date.now(),
            author: nameInput.value.trim(),
            message: msgInput.value.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            replies: []
        });
        persistGigDiscussionThread();
        renderGigDiscussionThread();
        msgInput.value = "";
    });

    // EVENT DELEGATION: reply nodes are appended dynamically, so listeners live on the container
    container.addEventListener("click", (event) => {
        const replyToggleId = event.target.getAttribute("data-reply-toggle");
        const replySubmitId = event.target.getAttribute("data-reply-submit");

        if (replyToggleId) {
            const box = document.getElementById(`replyBox-${replyToggleId}`);
            if (box) box.classList.toggle("visible");
            return;
        }

        if (replySubmitId) {
            const input = document.getElementById(`replyInput-${replySubmitId}`);
            if (!input || !input.value.trim()) return;

            const parentComment = gigDiscussionThread.find(c => c.id === replySubmitId);
            if (parentComment) {
                parentComment.replies = parentComment.replies || [];
                parentComment.replies.push({
                    author: currentUser.name,
                    message: input.value.trim(),
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });
                persistGigDiscussionThread();
                renderGigDiscussionThread();
            }
        }
    });

    // dblclick on a posted comment -> allows the author to edit their message inline
    container.addEventListener("dblclick", (event) => {
        const commentId = event.target.getAttribute("data-comment-id");
        if (!commentId) return;

        const targetComment = gigDiscussionThread.find(c => c.id === commentId);
        if (!targetComment) return;

        const p = event.target;
        p.setAttribute("contenteditable", "true");
        p.focus();

        function commitEdit() {
            targetComment.message = p.textContent.trim() || targetComment.message;
            p.removeAttribute("contenteditable");
            persistGigDiscussionThread();
            renderGigDiscussionThread();
            p.removeEventListener("blur", commitEdit);
        }
        p.addEventListener("blur", commitEdit);
    });
}

/* ==========================================================================
   7. FREELANCER DASHBOARD & EARNINGS PROGRESS TRACKER (my-gigs.html)
   ========================================================================== */
const defaultDashboardProjects = [
    {
        id: "dproj-1",
        title: "Build a Python Data Scraper",
        client: "admin.desk@cit.edu.in",
        totalValue: 40,
        milestones: [
            { id: "m1", label: "Initial project setup & environment configuration", done: true },
            { id: "m2", label: "Implement scraping logic for target retail sites", done: false },
            { id: "m3", label: "Data cleaning & CSV export module", done: false },
            { id: "m4", label: "Final testing & client handoff", done: false }
        ]
    },
    {
        id: "dproj-2",
        title: "UI/UX Profile Designer",
        client: "admin.desk@cit.edu.in",
        totalValue: 100,
        milestones: [
            { id: "m1", label: "Wireframes & user flow diagrams", done: true },
            { id: "m2", label: "High-fidelity Figma mockups", done: true },
            { id: "m3", label: "Interactive prototype states", done: false }
        ]
    }
];

function loadDashboardProjects() {
    const saved = JSON.parse(localStorage.getItem('campus_dashboard_projects'));
    return saved && saved.length ? saved : defaultDashboardProjects;
}

function persistDashboardProjects(projects) {
    localStorage.setItem('campus_dashboard_projects', JSON.stringify(projects));
}

function computeMilestoneProgress(project) {
    const total = project.milestones.length || 1;
    const doneCount = project.milestones.filter(m => m.done).length;
    const percent = Math.round((doneCount / total) * 100);
    const escrowPayout = Math.round((project.totalValue * percent) / 100);
    return { doneCount, total, percent, escrowPayout };
}

function renderFreelancerDashboard() {
    const container = document.getElementById("dashboardGigCardsContainer");
    if (!container) return; // not on my-gigs.html

    const projects = loadDashboardProjects();
    container.innerHTML = "";

    projects.forEach(project => {
        const { doneCount, total, percent, escrowPayout } = computeMilestoneProgress(project);

        const card = document.createElement("div");
        card.className = "fl-dashboard-card";
        card.dataset.projectId = project.id;

        const milestonesHtml = project.milestones.map(m => `
            <div class="fl-milestone-row ${m.done ? 'milestone-done' : ''}">
                <input type="checkbox" data-milestone-checkbox="${project.id}:${m.id}" ${m.done ? "checked" : ""}>
                <label>${m.label}</label>
            </div>
        `).join("");

        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <h3 style="margin:0; font-size:1.05rem; color:var(--text-primary);">${project.title}</h3>
                    <span style="font-size:0.75rem; color:var(--text-muted);">Client: ${project.client}</span>
                </div>
                <span style="font-size:0.7rem; color:var(--highlight-blue); border:1px solid var(--border-color); padding:0.2rem 0.5rem; border-radius:4px;">Click to ${percent === 100 ? 'review' : 'expand'} milestones</span>
            </div>

            <div class="earnings-progress-wrap">
                <div class="earnings-progress-tooltip" id="tooltip-${project.id}">
                    ${percent}% complete &middot; Escrow payout: $${escrowPayout} of $${project.totalValue}
                </div>
                <div class="earnings-progress-track" id="progressTrack-${project.id}" data-project-id="${project.id}">
                    <div class="earnings-progress-fill" id="progressFill-${project.id}" style="width:${percent}%;"></div>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:0.72rem; color:var(--text-muted); margin-top:0.3rem;">
                    <span>${doneCount}/${total} milestones complete</span>
                    <span>$${escrowPayout} / $${project.totalValue} earned</span>
                </div>
            </div>

            <div class="fl-milestone-list" id="milestoneList-${project.id}">
                ${milestonesHtml}
            </div>
        `;
        container.appendChild(card);

        // click on an active gig card -> expands its milestone task checklist
        card.addEventListener("click", (event) => {
            // Ignore clicks that originate from interactive children (checkbox/label/progress bar)
            if (event.target.closest('.fl-milestone-list') || event.target.closest('.earnings-progress-wrap')) return;
            document.getElementById(`milestoneList-${project.id}`).classList.toggle("expanded");
        });

        // mouseover on the earnings progress bar -> shows tooltip with exact % and escrow payout
        const progressTrack = card.querySelector(`#progressTrack-${project.id}`);
        const tooltip = card.querySelector(`#tooltip-${project.id}`);
        if (progressTrack && tooltip) {
            progressTrack.addEventListener("mouseover", () => tooltip.classList.add("visible"));
            progressTrack.addEventListener("mouseout", () => tooltip.classList.remove("visible"));

            // custom 'change' listener used to recalculate overall progress (see checkbox handler below)
            progressTrack.addEventListener("change", () => {
                recalculateProjectProgress(project.id);
            });
        }

        // click on "Mark Milestone Complete" checkbox -> updates milestone bar & triggers recalculation
        card.querySelectorAll("[data-milestone-checkbox]").forEach(checkbox => {
            checkbox.addEventListener("change", (event) => {
                const [projId, milestoneId] = event.target.getAttribute("data-milestone-checkbox").split(":");
                const allProjects = loadDashboardProjects();
                const proj = allProjects.find(p => p.id === projId);
                if (!proj) return;
                const milestone = proj.milestones.find(m => m.id === milestoneId);
                if (!milestone) return;

                milestone.done = event.target.checked;
                persistDashboardProjects(allProjects);

                const row = event.target.closest(".fl-milestone-row");
                if (row) row.classList.toggle("milestone-done", milestone.done);

                // Manually dispatch a 'change' event on the progress track so its dedicated
                // listener (registered above) recalculates the overall project progress.
                const trackEl = document.getElementById(`progressTrack-${projId}`);
                if (trackEl) trackEl.dispatchEvent(new Event("change", { bubbles: false }));
            });
        });
    });
}

function recalculateProjectProgress(projectId) {
    const allProjects = loadDashboardProjects();
    const project = allProjects.find(p => p.id === projectId);
    if (!project) return;

    const { doneCount, total, percent, escrowPayout } = computeMilestoneProgress(project);

    const fillEl = document.getElementById(`progressFill-${projectId}`);
    const tooltipEl = document.getElementById(`tooltip-${projectId}`);
    if (fillEl) fillEl.style.width = percent + "%";
    if (tooltipEl) tooltipEl.textContent = `${percent}% complete · Escrow payout: $${escrowPayout} of $${project.totalValue}`;

    const card = document.querySelector(`.fl-dashboard-card[data-project-id="${projectId}"]`);
    const summarySpans = card ? card.querySelectorAll(".earnings-progress-wrap > div:last-child span") : [];
    if (summarySpans.length === 2) {
        summarySpans[0].textContent = `${doneCount}/${total} milestones complete`;
        summarySpans[1].textContent = `$${escrowPayout} / $${project.totalValue} earned`;
    }
}

/* --- Small fix-up alias: the "Clear Data" button in profile.html references this name --- */
function clearProfileStorage() {
    if (typeof clearCachedRegistration === "function") {
        clearCachedRegistration();
    }
}
