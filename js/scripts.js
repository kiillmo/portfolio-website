document.addEventListener('DOMContentLoaded', function() {
    // Theme toggler
    const themeToggle = document.querySelector('.theme-toggle');
    const themeToggleIcon = document.querySelector('.theme-toggle-icon');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeToggleIcon.textContent = '🌙';
    }
    
    // Theme toggle functionality
    themeToggle.addEventListener('click', function() {
        if (document.body.getAttribute('data-theme') === 'dark') {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeToggleIcon.textContent = '☀️';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggleIcon.textContent = '🌙';
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateForm()) {
                return false;
            }
            
            // Get form data
            const formData = new FormData(contactForm);
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Send form data to server using fetch API
            fetch('process-form.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                // Show success message
                contactForm.innerHTML = `
                    <div class="form-success">
                        <h3>Thank you for reaching out!</h3>
                        <p>I'll get back to you as soon as possible.</p>
                    </div>
                `;
            })
            .catch(error => {
                console.error('Error:', error);
                
                // Restore the button
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
                
                // Show error message
                const errorElement = document.createElement('div');
                errorElement.className = 'form-error';
                errorElement.innerHTML = `
                    <p>Sorry, there was a problem sending your message.</p>
                    <p>Please try again or contact me directly at contact@mohamedelhag.com</p>
                `;
                
                // Insert error message after the submit button
                submitButton.parentNode.insertBefore(errorElement, submitButton.nextSibling);
                
                // Remove error message after 5 seconds
                setTimeout(() => {
                    if (errorElement.parentNode) {
                        errorElement.parentNode.removeChild(errorElement);
                    }
                }, 5000);
            });
        });
    }
    
    // Hero section animations
    function animateHero() {
        const heroElements = document.querySelectorAll('#hero .fade-in');
        
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 300 * index);
        });
    }
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.id === 'hero') {
                    animateHero();
                }
                
                // Add more section-specific animations here
            }
        });
    }, observerOptions);
    
    // Observe sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // GSAP animations (if GSAP is loaded)
    if (typeof gsap !== 'undefined') {
        // Animate project cards on hover
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -10,
                    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
                    duration: 0.3
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
                    duration: 0.3
                });
            });
        });
        
        // Animate section titles when they come into view
        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: title,
                    start: 'top 80%',
                    once: true
                },
                opacity: 0,
                y: 30,
                duration: 0.8
            });
        });
    }
    
    // Sticky header
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.padding = '0.5rem 0';
            header.style.boxShadow = '0 2px 10px var(--shadow-color)';
        } else {
            header.style.padding = '1rem 0';
            header.style.boxShadow = 'none';
        }
        
        if (scrollTop > lastScrollTop) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
});

// Function to validate form inputs
function validateForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    let isValid = true;
    
    // Simple validation
    if (name.value.trim() === '') {
        highlightError(name);
        isValid = false;
    } else {
        removeError(name);
    }
    
    if (email.value.trim() === '' || !isValidEmail(email.value)) {
        highlightError(email);
        isValid = false;
    } else {
        removeError(email);
    }
    
    if (message.value.trim() === '') {
        highlightError(message);
        isValid = false;
    } else {
        removeError(message);
    }
    
    return isValid;
}

// Helper function to check if email is valid
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Function to highlight error field
function highlightError(field) {
    field.style.borderColor = '#e74c3c';
    field.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
}

// Function to remove error styling
function removeError(field) {
    field.style.borderColor = 'var(--border-color)';
    field.style.backgroundColor = 'var(--bg-secondary)';
}

// Projects filter (if you add this feature later)
function filterProjects(category) {
    const projects = document.querySelectorAll('.project-card');
    
    projects.forEach(project => {
        const tags = project.querySelectorAll('.tag');
        let shouldShow = category === 'all';
        
        tags.forEach(tag => {
            if (tag.textContent.toLowerCase() === category.toLowerCase()) {
                shouldShow = true;
            }
        });
        
        if (shouldShow) {
            project.style.display = 'block';
        } else {
            project.style.display = 'none';
        }
    });
}

// Add a simple typewriter effect to the hero section
function typeWriterEffect(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}