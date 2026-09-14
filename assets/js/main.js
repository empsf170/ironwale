/*==================================================
   IRONVALE INDUSTRIAL - MAIN JS
==================================================*/

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Loader & Hero Animation
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        setTimeout(() => {
            heroSection.classList.add('loaded');
        }, 300);
    }
    
    // 2. Sticky Header
    const header = document.getElementById('header');
    const topBar = document.querySelector('.top-bar');
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
            if(backToTop) backToTop.classList.add('active');
        } else {
            header.classList.remove('sticky');
            if(backToTop) backToTop.classList.remove('active');
        }
    });

    // 3. Scroll Reveal with Intersection Observer
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Add staggered delay to children if it's a grid
                if (entry.target.classList.contains('row')) {
                    const children = entry.target.children;
                    for (let i = 0; i < children.length; i++) {
                        children[i].style.transitionDelay = `${i * 0.15}s`;
                    }
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
    
    // 4. Counter Animation
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;
    
    const counterObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !hasCounted) {
            hasCounted = true;
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const duration = 2000; // ms
                const increment = target / (duration / 16); // 60fps
                
                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        // Check if decimal
                        if (target % 1 !== 0) {
                            counter.innerText = current.toFixed(1);
                        } else {
                            counter.innerText = Math.ceil(current);
                        }
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCounter();
            });
        }
    }, { threshold: 0.5 });
    
    const counterWrap = document.getElementById('counter-wrap');
    if (counterWrap) counterObserver.observe(counterWrap);

    // 5. Property Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const filterItems = document.querySelectorAll('.filter-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            filterItems.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || item.classList.contains(filterValue)) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.display = 'none';
                    }
                }, 300);
            });
        });
    });

    // 6. SVG Route Animation trigger
    const locationSection = document.querySelector('.location-section');
    if (locationSection) {
        const locationObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                locationSection.classList.add('active');
            }
        }, { threshold: 0.5 });
        locationObserver.observe(locationSection);
    }
    
    // 7. Lightbox for Gallery
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (lightbox && galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const imgSrc = this.getAttribute('href');
                lightboxImg.src = imgSrc;
                lightbox.style.display = 'block';
                document.body.style.overflow = 'hidden'; // prevent scrolling
            });
        });
        
        closeBtn.addEventListener('click', () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        lightbox.addEventListener('click', (e) => {
            if (e.target !== lightboxImg) {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // 8. Form Validation
    const enquiryForm = document.getElementById('enquiryForm');
    const formMessage = document.getElementById('formMessage');
    
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Simple validation
            let isValid = true;
            const inputs = this.querySelectorAll('input[required], select[required]');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('is-invalid');
                } else {
                    input.classList.remove('is-invalid');
                }
            });
            
            if (isValid) {
                const btn = this.querySelector('button[type="submit"]');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> SENDING...';
                btn.disabled = true;
                
                // Simulate network request
                setTimeout(() => {
                    this.reset();
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    formMessage.classList.remove('d-none');
                    
                    setTimeout(() => {
                        formMessage.classList.add('d-none');
                    }, 5000);
                }, 1500);
            }
        });
    }

    // 9. Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                // Close mobile menu if open
                const offcanvasElement = document.getElementById('mobileMenu');
                if (offcanvasElement && offcanvasElement.classList.contains('show')) {
                    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
                    if (bsOffcanvas) bsOffcanvas.hide();
                }
                
                // Remove active class from all nav links immediately for visual feedback
                document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                // Add active class to clicked link if it's a nav link
                if (this.classList.contains('nav-link')) {
                    this.classList.add('active');
                }
                
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 10. Custom ScrollSpy to highlight menu items robustly
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120; // Offset for sticky header
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        if (current) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        }
    });

});
