// Initialize Icons
lucide.createIcons();

// --- 1. Accountability Feed (Sidebar) ---
const accountabilityData = [
    { text: "Field Officer #402 verified on-site", time: "Just now" },
    { text: "Ticket #5492 auto-assigned to Ward 4", time: "2m ago" },
    { text: "Resolution verified via drone scan", time: "15m ago" },
    { text: "SLA breach prevented: Case #5320", time: "1h ago" }
];

const feedContainer = document.getElementById('accountability-feed-sidebar');
accountabilityData.forEach(item => {
    const el = document.createElement('div');
    el.className = 'feed-item-dot pl-4 flex flex-col mb-4 group';
    el.innerHTML = `
        <span class="text-xs text-slate-300 group-hover:text-white transition">${item.text}</span>
        <span class="text-[10px] text-slate-500 font-medium">${item.time}</span>
    `;
    feedContainer.appendChild(el);
});


// --- 2. Live Processing Feed (Center Layer) ---
const aiFeedContainer = document.getElementById('ai-processing-feed');
const aiSimulatedEvents = [
    { type: "NLP Classification", desc: "PWD - High Priority", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", icon: "alert-triangle" },
    { type: "SLA Alert", desc: "Auto-escalating to Senior Officer in 2h", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", icon: "clock" },
    { type: "Image Recognition", desc: "Pothole severity: 85% (Critical)", color: "text-primary", bg: "bg-primary/10", border: "border-primary/30", icon: "camera" },
    { type: "Auto-Resolution", desc: "Streetlight #22 online. Closing ticket.", color: "text-success", bg: "bg-success/10", border: "border-success/30", icon: "check-circle" }
];

function addAiFeedCard(event) {
    const card = document.createElement('div');
    card.className = `ai-card ${event.bg} border ${event.border} p-3 rounded-lg flex items-start gap-3 slide-in-right opacity-0`;
    // Add special border pulse to critical alerts
    const pulseClass = event.type === "SLA Alert" || event.desc.includes("High Priority") ? 'pulse-border-red' : '';

    card.innerHTML = `
        <div class="mt-0.5 rounded-full bg-surface/50 p-1.5 shrink-0 ${pulseClass}">
            <i data-lucide="${event.icon}" class="w-4 h-4 ${event.color}"></i>
        </div>
        <div>
            <div class="text-[10px] font-bold uppercase tracking-wider ${event.color} mb-0.5">${event.type}</div>
            <div class="text-xs text-slate-200">${event.desc}</div>
        </div>
    `;

    // Add to top
    if (aiFeedContainer.firstChild) {
        aiFeedContainer.insertBefore(card, aiFeedContainer.firstChild);
    } else {
        aiFeedContainer.appendChild(card);
    }
    lucide.createIcons({ root: card });

    // Animate in
    setTimeout(() => { card.style.opacity = '1'; card.classList.add('animate-slide-up'); }, 50);

    // Keep max 5 items
    if (aiFeedContainer.children.length > 5) {
        aiFeedContainer.removeChild(aiFeedContainer.lastChild);
    }
}

// Stagger initial load
aiSimulatedEvents.forEach((ev, idx) => {
    setTimeout(() => addAiFeedCard(ev), idx * 800 + 500);
});


// --- 3. WhatsApp Bot Interaction ---
const chatContainer = document.getElementById('whatsapp-chat');
const typingIndicator = document.getElementById('ai-typing');

setTimeout(() => {
    // Hide typing
    typingIndicator.style.display = 'none';

    // Create new AI response
    const msg = document.createElement('div');
    msg.className = "flex flex-col items-start z-10 animate-slide-up";
    msg.innerHTML = `
        <div class="chat-bubble-ai p-3 rounded-lg max-w-[85%] relative shadow-md border border-success/20">
            <div class="flex items-center gap-2 mb-1">
                <i data-lucide="bot" class="w-4 h-4 text-success"></i>
                <span class="text-xs font-bold text-success">PS-CRM GovBot</span>
            </div>
            <p class="text-xs text-slate-200">Got it. I've analyzed the photo (Severity: High). 🚨</p>
            <div class="mt-2 bg-surface/50 rounded p-2 border border-slate-700">
                <p class="text-xs font-bold text-white">Ticket #5502 Created instantly.</p>
                <p class="text-[10px] text-slate-400">Assigned to: PWD Rapid Team</p>
                <p class="text-[10px] text-slate-400">ETA: 24 Hours</p>
            </div>
            <div class="text-[9px] text-slate-400 text-left mt-1">10:42 AM</div>
        </div>
    `;
    chatContainer.appendChild(msg);
    lucide.createIcons({ root: msg });

    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;

}, 2500); // Trigger after 2.5s


// --- 4. Toast Notifications: Duplicate Merger ---
function showToast(title, message, iconStr) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast-enter bg-surface border border-primary/40 shadow-[0_4px_20px_rgba(56,189,248,0.2)] rounded-lg p-4 flex gap-3 items-start w-80 backdrop-blur-md pointer-events-auto';

    toast.innerHTML = `
        <div class="bg-primary/20 p-2 rounded-full shrink-0">
            <i data-lucide="${iconStr}" class="w-5 h-5 text-primary"></i>
        </div>
        <div>
            <h4 class="text-sm font-bold text-white mb-1">${title}</h4>
            <p class="text-xs text-slate-300 leading-relaxed">${message}</p>
        </div>
        <button class="ml-auto text-slate-500 hover:text-white" onclick="this.parentElement.remove()">
            <i data-lucide="x" class="w-4 h-4"></i>
        </button>
    `;

    container.appendChild(toast);
    lucide.createIcons({ root: toast });

    // Auto remove after 6s
    setTimeout(() => {
        if (toast.parentElement) toast.remove();
    }, 6000);
}

// Show duplicate merger toast after 4s
setTimeout(() => {
    showToast(
        "Duplicate Detected via AI",
        "4 identical pothole complaints detected in Sector 15. Merging into single Ticket ID <strong>#9920</strong>.",
        "layers"
    );
}, 4000);


// --- 5. Department Performance Chart Interaction ---
const deptBtn = document.getElementById('nav-dept-performance');
const chartBtn = document.getElementById('btn-chart-toggle');
const chartModal = document.getElementById('chart-overlay-modal');
const closeChartBtn = document.getElementById('close-chart-modal');
const pwdBar = document.getElementById('pwd-bar');

function showChartAnalysis() {
    chartModal.classList.remove('opacity-0', 'pointer-events-none');
    // Animate the bar down to emphasize the 60% gap
    pwdBar.style.height = '10%';
    setTimeout(() => { pwdBar.style.height = '22%'; }, 1500); // bounce back
}

function hideChartAnalysis() {
    chartModal.classList.add('opacity-0', 'pointer-events-none');
}

deptBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showChartAnalysis();
});
chartBtn.addEventListener('click', showChartAnalysis);
closeChartBtn.addEventListener('click', hideChartAnalysis);


// --- 6. Live Density Heatmap ---
const heatmapCanvas = document.getElementById('heatmap-canvas');

function createHeatmapNodes() {
    // Generate dummy dots
    const numDots = 40;
    for (let i = 0; i < numDots; i++) {
        const dot = document.createElement('div');

        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;

        // Decide red (high density) vs green (efficient)
        // Red is clustered slightly, Green more spread out
        const isRed = Math.random() > 0.6; // 40% red

        // Size
        const size = isRed ? (Math.random() * 60 + 40) : (Math.random() * 40 + 20);

        dot.className = `heatmap-node pulse ${isRed ? 'high' : 'low'}`;
        dot.style.left = `${x}%`;
        dot.style.top = `${y}%`;
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;

        // Random pulse animation delay to look organic
        dot.style.animationDelay = `${Math.random() * 2}s`;

        heatmapCanvas.appendChild(dot);
    }
}

// Init heatmap nodes
createHeatmapNodes();


// --- 7. Tab Switching Logic ---
const navItems = document.querySelectorAll('.nav-item');
const tabPanes = document.querySelectorAll('.tab-pane');

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();

        // Remove active state from all nav items
        navItems.forEach(nav => {
            nav.classList.remove('active', 'bg-slate-800', 'text-white');
            nav.classList.add('text-slate-300');
            const icon = nav.querySelector('svg') || nav.querySelector('i');
            if (icon) {
                icon.classList.remove('text-primary');
                icon.classList.add('text-slate-400');
            }
        });

        // Add active state to clicked item
        item.classList.add('active', 'bg-slate-800', 'text-white');
        item.classList.remove('text-slate-300');
        const clickedIcon = item.querySelector('svg') || item.querySelector('i');
        if (clickedIcon) {
            clickedIcon.classList.remove('text-slate-400');
            clickedIcon.classList.add('text-primary');
        }

        // Hide all tabs
        tabPanes.forEach(pane => {
            pane.classList.remove('opacity-100', 'z-10');
            pane.classList.add('opacity-0', 'pointer-events-none', 'z-0');
        });

        // Show target tab
        const targetId = item.getAttribute('data-target');
        const targetTab = document.getElementById(targetId);
        if (targetTab) {
            targetTab.classList.remove('opacity-0', 'pointer-events-none', 'z-0');
            targetTab.classList.add('opacity-100', 'z-10');

            // Render lucide icons in the newly shown tab just in case
            lucide.createIcons({ root: targetTab });
        }
    });
});


// --- 8. Populate Full AI Feed Tab ---
const fullAiFeedContainer = document.getElementById('full-ai-feed');
const extendedAiEvents = [
    ...aiSimulatedEvents,
    { type: "Duplicate Merge", desc: "Tickets #5311, #5312 merged -> #5310", color: "text-primary", bg: "bg-primary/10", border: "border-primary/30", icon: "git-merge" },
    { type: "Sentiment Analysis", desc: "Citizen tone: Aggressive. Escalating priority.", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", icon: "angry" },
    { type: "Drone Verification", desc: "Visual confirmation of resolved garbage dump Sector 9.", color: "text-success", bg: "bg-success/10", border: "border-success/30", icon: "camera" },
    { type: "Resource Reallocation", desc: "Diverting 2 DJB trucks to flooded zone.", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", icon: "truck" },
];

extendedAiEvents.forEach((ev, idx) => {
    const card = document.createElement('div');
    card.className = `ai-card ${ev.bg} border ${ev.border} p-4 rounded-lg flex items-center justify-between`;
    const pulseClass = ev.type === "SLA Alert" || ev.color === "text-red-400" ? 'pulse-border-red' : '';

    card.innerHTML = `
        <div class="flex gap-4 items-center">
            <div class="rounded-full bg-surface/80 p-2 shrink-0 ${pulseClass}">
                <i data-lucide="${ev.icon}" class="w-5 h-5 ${ev.color}"></i>
            </div>
            <div>
                <div class="text-[11px] font-bold uppercase tracking-wider ${ev.color} mb-1">${ev.type}</div>
                <div class="text-sm text-white font-medium">${ev.desc}</div>
            </div>
        </div>
        <div class="text-xs text-slate-500 font-mono flex flex-col items-end">
             <span>ID: ${Math.floor(Math.random() * 90000) + 10000}</span>
             <span>${10 - idx} mins ago</span>
        </div>
    `;
    fullAiFeedContainer.appendChild(card);
});


// --- 9. Full Tab Gap Analysis Trigger ---
const triggerGapBtn = document.getElementById('trigger-gap-analysis');
const pwdBarTab = document.getElementById('pwd-res-bar-tab');
const pwdTextTab = document.getElementById('pwd-res-text-tab');
const pwdOverlay = document.getElementById('tab-gap-alert-overlay');

if (triggerGapBtn) {
    triggerGapBtn.addEventListener('click', () => {
        // Animate the bar dropping and text changing
        pwdBarTab.style.width = '10%';
        pwdTextTab.textContent = '10%';
        pwdTextTab.classList.add('text-red-400');

        // Show overlay alert
        pwdOverlay.classList.remove('opacity-0', 'pointer-events-none');

        // Reset after 4s
        setTimeout(() => {
            pwdBarTab.style.width = '22%';
            pwdTextTab.textContent = '22%';
            pwdTextTab.classList.remove('text-red-400');
            pwdOverlay.classList.add('opacity-0', 'pointer-events-none');
        }, 4000);
    });
}

