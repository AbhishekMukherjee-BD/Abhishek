// --- SUPABASE API CONFIGURATION ---
const SUPABASE_URL = "https://bdmwjwwyhkbocjdxunsu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkbXdqd3d5aGtib2NqZHh1bnN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5MDY3NDksImV4cCI6MjA5ODQ4Mjc0OX0.SGH_lwtKPx_vDM9FB6bkOxIEDEoSEhS5glCcUum9LMU";
let supabaseClient = null;

if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
    console.warn("Supabase SDK is not loaded. Falling back to static project cards.");
}

// Register ScrollTrigger with GSAP
gsap.registerPlugin(ScrollTrigger);

// Setup Lenis Smooth Scrolling
const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential ease out
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 1.5,
    infinite: false,
});

// Update ScrollTrigger when Lenis scrolls
lenis.on('scroll', ScrollTrigger.update);

// Lenis animation loop
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Animation Setup Variables
const aboutCanvas = document.getElementById('about-canvas');
const aboutCtx = aboutCanvas.getContext('2d');
const aboutFrameCount = 61;
const aboutSequence = { frame: 0 };
const aboutImages = [];

const projectsCanvas = document.getElementById('projects-canvas');
const projectsCtx = projectsCanvas.getContext('2d');
const projectsFrameCount = 32;
const projectsSequence = { frame: 0 };
const projectsImages = [];

const totalFrames = aboutFrameCount + projectsFrameCount;
let loadedCount = 0;

// URL Generators for frames inside separate subfolders
const aboutFrameUrl = (index) => `about_frames/ezgif-frame-${String(index).padStart(3, '0')}.jpg`;
const projectsFrameUrl = (index) => `projects_frames/ezgif-frame-${String(index).padStart(3, '0')}.jpg`;

// Loader UI Elements
const loaderBar = document.getElementById('loader-bar');
const loaderPercentage = document.getElementById('loader-percentage');
const loaderStatus = document.getElementById('loader-status');

// Preload Images Promise for all frames in parallel
function preloadAllImages() {
    return new Promise((resolve) => {
        let loadedThisTask = 0;
        
        const checkDone = () => {
            loadedThisTask++;
            updateLoader(loadedThisTask, totalFrames);
            if (loadedThisTask === totalFrames) {
                resolve();
            }
        };

        // Preload About Frames
        for (let i = 1; i <= aboutFrameCount; i++) {
            const img = new Image();
            img.onload = checkDone;
            img.onerror = () => {
                console.warn(`About frame ${i} failed to load.`);
                checkDone();
            };
            img.src = aboutFrameUrl(i);
            aboutImages.push(img);
        }

        // Preload Projects Frames
        for (let i = 1; i <= projectsFrameCount; i++) {
            const img = new Image();
            img.onload = checkDone;
            img.onerror = () => {
                console.warn(`Projects frame ${i} failed to load.`);
                checkDone();
            };
            img.src = projectsFrameUrl(i);
            projectsImages.push(img);
        }
    });
}

// Update preloader UI elements
function updateLoader(current, total) {
    const percentage = Math.round((current / total) * 100);
    loaderPercentage.textContent = `${percentage}%`;
    loaderBar.style.width = `${percentage}%`;
    loaderStatus.textContent = `Preloading experience assets (${current}/${total})...`;
}

// Cover Scaling Canvas Drawing (equivalent to CSS object-fit: cover)
function renderCanvasFrame(canvas, ctx, img) {
    if (!img) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    const imgWidth = img.naturalWidth || img.width;
    const imgHeight = img.naturalHeight || img.height;
    
    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = canvasWidth / canvasHeight;
    
    let drawWidth, drawHeight, offsetX, offsetY;
    
    if (canvasRatio > imgRatio) {
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imgRatio;
        offsetX = 0;
        offsetY = (canvasHeight - drawHeight) / 2;
    } else {
        drawWidth = canvasHeight * imgRatio;
        drawHeight = canvasHeight;
        offsetX = (canvasWidth - drawWidth) / 2;
        offsetY = 0;
    }
    
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, 0, 0, imgWidth, imgHeight, offsetX, offsetY, drawWidth, drawHeight);
}

// Specific drawing functions
function renderAboutFrame() {
    renderCanvasFrame(aboutCanvas, aboutCtx, aboutImages[aboutSequence.frame]);
}

function renderProjectsFrame() {
    renderCanvasFrame(projectsCanvas, projectsCtx, projectsImages[projectsSequence.frame]);
}

// Handle Responsive Sizing for both canvases
function resizeCanvases() {
    // About Canvas
    const aboutRect = aboutCanvas.parentNode.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    aboutCanvas.width = aboutRect.width * dpr;
    aboutCanvas.height = aboutRect.height * dpr;
    aboutCanvas.style.width = `${aboutRect.width}px`;
    aboutCanvas.style.height = `${aboutRect.height}px`;
    renderAboutFrame();

    // Projects Canvas
    const projectsRect = projectsCanvas.parentNode.getBoundingClientRect();
    projectsCanvas.width = projectsRect.width * dpr;
    projectsCanvas.height = projectsRect.height * dpr;
    projectsCanvas.style.width = `${projectsRect.width}px`;
    projectsCanvas.style.height = `${projectsRect.height}px`;
    renderProjectsFrame();
}

// Coordination variables for tracing and loading
window.assetsLoaded = false;
window.tracingCompleted = false;

window.checkExperienceReady = function() {
    if (window.assetsLoaded && window.tracingCompleted) {
        const loader = document.getElementById('loader');
        loader.classList.add('fade-out');
        
        setTimeout(() => {
            loader.style.display = 'none';
            
            // Trigger the portrait draw-in animation
            if (typeof window.startHeroAnimation === 'function') {
                window.startHeroAnimation();
            }
            
            // Enable animations on scroll
            initScrollAnimations();
        }, 800);
    }
};

function initScrollAnimations() {
    // Initial render sizing
    resizeCanvases();
    window.addEventListener('resize', () => {
        resizeCanvases();
        ScrollTrigger.refresh();
    });
    
    // ==========================================
    // ABOUT SECTION PIN & SCROLL TIMELINE
    // ==========================================
    const aboutTl = gsap.timeline({
        scrollTrigger: {
            trigger: '#about-hero-section',
            start: 'top top',
            end: '+=250%',
            pin: true,
            scrub: 0.6,
        }
    });
    
    // 1. Scrub frames (left canvas)
    aboutTl.to(aboutSequence, {
        frame: aboutFrameCount - 1,
        snap: 'frame',
        ease: 'none',
        onUpdate: renderAboutFrame
    }, 0);
    
    // 2. Text line lighting staggers (Apple-style scroll-text scrub)
    const lines = gsap.utils.toArray('.about-scrub-line');
    if (lines.length >= 3) {
        // Line 1: lights up, then dims
        aboutTl.to(lines[0], { opacity: 1, duration: 0.25 }, 0.0);
        aboutTl.to(lines[0], { opacity: 0.2, duration: 0.25 }, 0.25);
        
        // Line 2: lights up, then dims
        aboutTl.to(lines[1], { opacity: 1, duration: 0.25 }, 0.35);
        aboutTl.to(lines[1], { opacity: 0.2, duration: 0.25 }, 0.60);
        
        // Line 3: lights up, stays lit
        aboutTl.to(lines[2], { opacity: 1, duration: 0.30 }, 0.70);
    } else {
        // Fallback stagger if array length differs
        aboutTl.to(lines, {
            opacity: 1,
            stagger: 0.3,
            duration: 0.5
        }, 0);
    }

    // ==========================================
    // PROJECTS SECTION PIN & SCROLL TIMELINE
    // ==========================================
    const projectsTl = gsap.timeline({
        scrollTrigger: {
            trigger: '#projects-section',
            start: 'top top',
            end: '+=300%',
            pin: true,
            scrub: 0.6,
            onEnter: () => {
                document.querySelector('.projects-header-overlay').classList.add('in-view');
            },
            onLeaveBack: () => {
                document.querySelector('.projects-header-overlay').classList.remove('in-view');
            }
        }
    });
    
    // 1. Scrub frames (background canvas)
    projectsTl.to(projectsSequence, {
        frame: projectsFrameCount - 1,
        snap: 'frame',
        ease: 'none',
        onUpdate: renderProjectsFrame
    }, 0);
    
    // 2. Entrance effect for the two carousel rows
    projectsTl.from('.carousel-container-wrapper', {
        opacity: 0,
        y: 60,
        duration: 0.5,
        ease: 'power2.out'
    }, 0);

    projectsTl.to('.carousel-container-wrapper', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out'
    }, 0.15);

    // ==========================================
    // REACH ME SECTION ENTRANCE TIMELINE
    // ==========================================
    gsap.from('.reach-me-content > *', {
        opacity: 0,
        y: 40,
        duration: 1.0,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
            trigger: '#reach-me-section',
            start: 'top 85%',
            toggleActions: 'play none none none'
        }
    });

    // Initialize Card Stacks for Projects Section
    new CardStack('webdev-stack', 3000);
    new CardStack('aiautomations-stack', 3000);
}

// Reusable vanilla JS & GSAP Card Stack component (Aceternity UI inspired)
class CardStack {
    constructor(elementId, autoPlayInterval = 5000) {
        this.container = document.getElementById(elementId);
        if (!this.container) return;
        
        this.cardsWrapper = this.container.querySelector('.cards-wrapper');
        this.cards = Array.from(this.cardsWrapper.querySelectorAll('.project-card'));
        this.dots = Array.from(this.container.querySelectorAll('.dot'));
        this.totalCards = this.cards.length;
        this.currentIndex = 0;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.dragged = false;
        this.autoPlayInterval = autoPlayInterval;
        this.timer = null;
        
        this.init();
    }
    
    init() {
        // Position initial stacked cards
        this.updateStack();
        
        // Bind drag & swipe events
        this.bindEvents();
        
        // Start auto rotation
        this.startAutoplay();
        
        // Bind navigation dots
        this.dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                this.stopAutoplay();
                this.goToIndex(idx);
                this.startAutoplay();
            });
        });
    }
    
    updateStack() {
        this.cards.forEach((card, i) => {
            let relativeIndex = (i - this.currentIndex + this.totalCards) % this.totalCards;
            
            if (relativeIndex === 0) {
                // Top Card
                gsap.to(card, {
                    x: 0,
                    y: 0,
                    scale: 1,
                    rotation: 0,
                    opacity: 1,
                    zIndex: 10,
                    pointerEvents: 'auto',
                    duration: 0.45,
                    ease: 'power2.out'
                });
            } else if (relativeIndex === 1) {
                // Middle Card (Behind, offset down and scaled)
                gsap.to(card, {
                    x: 0,
                    y: 15,
                    scale: 0.95,
                    rotation: 0,
                    opacity: 0.75,
                    zIndex: 9,
                    pointerEvents: 'none',
                    duration: 0.45,
                    ease: 'power2.out'
                });
            } else if (relativeIndex === 2) {
                // Bottom Card (Further behind, more offset and scale down)
                gsap.to(card, {
                    x: 0,
                    y: 30,
                    scale: 0.9,
                    rotation: 0,
                    opacity: 0.4,
                    zIndex: 8,
                    pointerEvents: 'none',
                    duration: 0.45,
                    ease: 'power2.out'
                });
            } else {
                // Hidden stack cards
                gsap.to(card, {
                    x: 0,
                    y: 45,
                    scale: 0.85,
                    rotation: 0,
                    opacity: 0,
                    zIndex: 0,
                    pointerEvents: 'none',
                    duration: 0.45,
                    ease: 'power2.out'
                });
            }
        });
        
        // Update dots state
        this.dots.forEach((dot, idx) => {
            if (idx === this.currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    bindEvents() {
        const onDown = (e) => {
            const topCard = this.cards[this.currentIndex];
            if (e.target.closest('.project-card') !== topCard) return;
            
            // Allow default click action on links
            if (e.target.tagName.toLowerCase() === 'a') {
                return;
            }
            
            this.isDragging = true;
            this.startX = e.clientX || (e.touches && e.touches[0].clientX) || e.pageX;
            this.startY = e.clientY || (e.touches && e.touches[0].clientY) || e.pageY;
            this.currentX = this.startX;
            this.currentY = this.startY;
            this.dragged = false;
            
            this.stopAutoplay();
            
            topCard.style.cursor = 'grabbing';
            
            // Support modern pointer events (fallback to mouse/touch handled by pointer)
            document.addEventListener('pointermove', onMove, { passive: false });
            document.addEventListener('pointerup', onUp);
        };
        
        const onMove = (e) => {
            if (!this.isDragging) return;
            
            const clientX = e.clientX || (e.touches && e.touches[0].clientX) || e.pageX;
            const clientY = e.clientY || (e.touches && e.touches[0].clientY) || e.pageY;
            
            const dx = clientX - this.startX;
            const dy = clientY - this.startY;
            
            this.currentX = clientX;
            this.currentY = clientY;
            
            // Treat as drag if moved more than 8px
            if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
                this.dragged = true;
                if (e.cancelable) e.preventDefault();
            }
            
            const topCard = this.cards[this.currentIndex];
            gsap.set(topCard, {
                x: dx,
                y: dy,
                rotation: dx * 0.06,
            });
        };
        
        const onUp = () => {
            if (!this.isDragging) return;
            this.isDragging = false;
            
            document.removeEventListener('pointermove', onMove);
            document.removeEventListener('pointerup', onUp);
            
            const dx = this.currentX - this.startX;
            const topCard = this.cards[this.currentIndex];
            
            topCard.style.cursor = 'grab';
            
            // Drag swipe threshold: 120px
            if (this.dragged && Math.abs(dx) > 120) {
                const direction = dx > 0 ? 1 : -1;
                this.swipeCard(direction);
            } else {
                // Snap back to stack position
                gsap.to(topCard, {
                    x: 0,
                    y: 0,
                    rotation: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                this.startAutoplay();
            }
        };
        
        this.cardsWrapper.addEventListener('pointerdown', onDown);
        
        // Pause rotation on mouse hover
        this.container.addEventListener('mouseenter', () => this.stopAutoplay());
        this.container.addEventListener('mouseleave', () => this.startAutoplay());
    }
    
    swipeCard(direction) {
        const topCard = this.cards[this.currentIndex];
        
        // Swipe card off screen dynamically
        gsap.to(topCard, {
            x: direction * 450,
            rotation: direction * 15,
            opacity: 0,
            duration: 0.35,
            ease: 'power2.in',
            onComplete: () => {
                this.currentIndex = (this.currentIndex + 1) % this.totalCards;
                this.updateStack();
                this.startAutoplay();
            }
        });
    }
    
    goToIndex(idx) {
        if (idx === this.currentIndex) return;
        
        const topCard = this.cards[this.currentIndex];
        gsap.to(topCard, {
            x: -450,
            rotation: -15,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                this.currentIndex = idx;
                this.updateStack();
            }
        });
    }
    
    startAutoplay() {
        if (this.timer) return;
        this.timer = setInterval(() => {
            this.swipeCard(-1);
        }, this.autoPlayInterval);
    }
    
    stopAutoplay() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}

// Async function to fetch projects from Supabase and render them dynamically in the DOM
async function fetchAndRenderDynamicProjects() {
    if (!supabaseClient) return;

    const { data: projects, error } = await supabaseClient
        .from('projects')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error("Error fetching projects from Supabase:", error);
        return;
    }

    if (!projects || projects.length === 0) {
        console.log("No projects found in Supabase. Using static fallback cards.");
        return;
    }

    // Filter projects by category
    const webdevProjects = projects.filter(p => p.category === 'webdev');
    const n8nProjects = projects.filter(p => p.category === 'n8n');

    // Helper function to render a dynamic card stack
    const renderStack = (containerId, categoryProjects, badgeText) => {
        const container = document.getElementById(containerId);
        if (!container || categoryProjects.length === 0) return;

        const wrapper = container.querySelector('.cards-wrapper');
        const dotsContainer = container.querySelector('.stack-dots');
        if (!wrapper || !dotsContainer) return;

        // Clear existing static fallback elements
        wrapper.innerHTML = '';
        dotsContainer.innerHTML = '';

        const total = categoryProjects.length;

        categoryProjects.forEach((project, index) => {
            const numStr = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
            const card = document.createElement('div');
            card.className = 'project-card';
            card.setAttribute('data-index', index);
            
            // Set class and CSS variable for custom background image and overlay opacity transition
            card.classList.add('has-bg');
            card.style.setProperty('--card-img', `url('${project.image_url}')`);

            card.innerHTML = `
                <div class="card-top">
                    <span class="card-badge">${badgeText}</span>
                    <span class="card-number">${numStr}</span>
                </div>
                <div class="card-body">
                    <h3 class="card-title">${project.title}</h3>
                    <p class="card-desc">${project.description}</p>
                </div>
                <div class="card-footer">
                    <span class="card-tech">${project.tech_stack}</span>
                    ${project.project_url 
                        ? `<a href="${project.project_url}" target="_blank" class="card-action-link">Live Site &rarr;</a>` 
                        : `<span class="card-action-disabled">Demo Only</span>`}
                </div>
            `;
            wrapper.appendChild(card);

            // Add navigation dot
            const dot = document.createElement('span');
            dot.className = `dot ${index === 0 ? 'active' : ''}`;
            dot.setAttribute('data-index', index);
            dotsContainer.appendChild(dot);
        });
    };

    // Render Web Dev Stack
    renderStack('webdev-stack', webdevProjects, 'Web Dev');

    // Render AI Automations Stack
    renderStack('aiautomations-stack', n8nProjects, 'AI Automation');
}

// Start loading assets and fetch projects in parallel
preloadAllImages().then(async () => {
    try {
        await fetchAndRenderDynamicProjects();
    } catch (e) {
        console.error("Failed to load dynamic projects:", e);
    }
    window.assetsLoaded = true;
    window.checkExperienceReady();
});
