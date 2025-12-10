
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== MOBILE MENU TOGGLE =====
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('change', function() {
            if (this.checked) {
                navLinks.classList.add('show');
            } else {
                navLinks.classList.remove('show');
            }
        });
    }

    // ===== NEWSLETTER FORM =====
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // TODO: Implement actual newsletter signup
            alert(`Thank you for subscribing with: ${email}`);
            this.reset();
        });
    });

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });


    // Loading state (wait for the page to load)
    window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    
    if (preloader) {
        // Add the class that fades it out
        preloader.classList.add('loader-hidden');
        
        // Optional: Remove it from the HTML entirely after the fade finishes
        // This keeps the DOM clean
        preloader.addEventListener('transitionend', function() {
            preloader.remove();
        });
    }
});
});

