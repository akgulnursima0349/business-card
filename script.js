// Slider functionality
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let slideInterval;

// Initialize slider
document.addEventListener('DOMContentLoaded', function() {
    showSlide(0);
    startSlideShow();
    initializeAnimations();
    initializeMobileMenu();
});

// Show specific slide
function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Show current slide
    if (slides[index]) {
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }
    
    currentSlideIndex = index;
}

// Next/Previous slide functions
function changeSlide(direction) {
    let newIndex = currentSlideIndex + direction;
    
    if (newIndex >= slides.length) {
        newIndex = 0;
    } else if (newIndex < 0) {
        newIndex = slides.length - 1;
    }
    
    showSlide(newIndex);
    resetSlideShow();
}

// Go to specific slide (for dots)
function currentSlide(index) {
    showSlide(index - 1);
    resetSlideShow();
}

// Auto slide show
function startSlideShow() {
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000); // Change slide every 5 seconds
}

// Reset slide show timer
function resetSlideShow() {
    clearInterval(slideInterval);
    startSlideShow();
}

// Pause slide show on hover
document.querySelector('.slider').addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
});

document.querySelector('.slider').addEventListener('mouseleave', () => {
    startSlideShow();
});

// Mobile menu functionality
function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header background change on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Animation on scroll
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature, .team-member, .project-content p').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Keyboard navigation for slider
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        changeSlide(-1);
    } else if (e.key === 'ArrowRight') {
        changeSlide(1);
    }
});

// Touch/swipe support for mobile slider
let touchStartX = 0;
let touchEndX = 0;

document.querySelector('.slider').addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.querySelector('.slider').addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next slide
            changeSlide(1);
        } else {
            // Swipe right - previous slide
            changeSlide(-1);
        }
    }
}

// Image lazy loading with error handling
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function() {
        this.classList.remove('loading');
    });
    
    img.addEventListener('error', function() {
        this.classList.remove('loading');
        // Image already has onerror attribute in HTML for fallback
    });
    
    // Add loading class initially
    img.classList.add('loading');
});

// CV download tracking (optional - for analytics)
document.querySelectorAll('.cv-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const memberName = this.closest('.team-member').querySelector('h3').textContent;
        console.log(`CV downloaded for: ${memberName}`);
        
        // Check if file exists before download
        const href = this.getAttribute('href');
        if (href && !href.startsWith('data:')) {
            // You can add additional validation here if needed
            // For now, we'll let the browser handle the download
        }
    });
});

// Accessibility improvements
document.addEventListener('keydown', (e) => {
    // Skip to main content with Tab key
    if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
        const mainContent = document.querySelector('#project');
        if (mainContent) {
            mainContent.focus();
            e.preventDefault();
        }
    }
});

// Add focus indicators for keyboard navigation
document.querySelectorAll('.slider-btn, .dot, .cv-btn, .nav-menu a').forEach(element => {
    element.addEventListener('focus', function() {
        this.style.outline = '2px solid #6366f1';
        this.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
});

// Performance optimization - reduce slider animation on low-end devices
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    // Reduce animation complexity for low-end devices
    document.documentElement.style.setProperty('--slide-transition', '0.5s');
} else {
    document.documentElement.style.setProperty('--slide-transition', '1s');
}