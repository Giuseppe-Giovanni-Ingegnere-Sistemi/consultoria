document.addEventListener('DOMContentLoaded', (event) => {
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 4px rgba(0,0,0,.1)';
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Fade-in animation
    const fadeElems = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0,
        rootMargin: "0px 0px -100px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);

    fadeElems.forEach(elem => {
        appearOnScroll.observe(elem);
    });

    // Form submission with validation and security measures
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Basic form validation
            const name = contactForm.elements['name'].value;
            const email = contactForm.elements['email'].value;
            const message = contactForm.elements['message'].value;

            if (!name || !email || !message) {
                alert('Por favor, complete todos los campos requeridos.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, ingrese una dirección de correo electrónico válida.');
                return;
            }

            // reCAPTCHA validation
            const recaptchaResponse = grecaptcha.getResponse();
            if (!recaptchaResponse) {
                alert('Por favor, complete el reCAPTCHA.');
                return;
            }

            // Show loader
            document.querySelector('.loader').classList.add('show');

            try {
                // Simulating an API call (replace with your actual API endpoint)
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        message,
                        recaptchaResponse
                    }),
                });

                if (response.ok) {
                    alert('Gracias por su mensaje. Nos pondremos en contacto pronto.');
                    contactForm.reset();
                    grecaptcha.reset();
                } else {
                    throw new Error('Error al enviar el mensaje');
                }
            } catch (error) {
                alert('Lo sentimos, hubo un problema al enviar su mensaje. Por favor, inténtelo de nuevo más tarde.');
                console.error('Error:', error);
            } finally {
                // Hide loader
                document.querySelector('.loader').classList.remove('show');
            }
        });
    }

    // Cookie consent
    const cookieConsent = document.querySelector('.cookie-consent');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (!localStorage.getItem('cookiesAccepted')) {
        cookieConsent.classList.add('show');
    }

    acceptCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieConsent.classList.remove('show');
    });

    // Implement actual cookie functionality here
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }

    function getCookie(name) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for(let i=0;i < ca.length;i++) {
            let c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    // Example of setting a cookie when user accepts
    if (localStorage.getItem('cookiesAccepted')) {
        setCookie('exampleCookie', 'someValue', 30); // Sets a cookie that expires in 30 days
    }
});

