document.addEventListener('DOMContentLoaded', () => {
    // --- FAQ Accordion Logic ---
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        if (header) {
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherBody = otherItem.querySelector('.faq-body');
                    if (otherBody) otherBody.style.maxHeight = null;
                });
                
                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                    const body = item.querySelector('.faq-body');
                    if (body) body.style.maxHeight = body.scrollHeight + "px";
                }
            });
        }
    });

    // --- Countdown Timer Logic ---
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        // Set date to 7 days from now for demonstration purposes
        const countDownDate = new Date().getTime() + (7 * 24 * 60 * 60 * 1000);

        const x = setInterval(function() {
            const now = new Date().getTime();
            const distance = countDownDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const formatNumber = (num) => num < 10 ? `0${num}` : num;

            document.getElementById("days").innerHTML = formatNumber(days);
            document.getElementById("hours").innerHTML = formatNumber(hours);
            document.getElementById("minutes").innerHTML = formatNumber(minutes);
            document.getElementById("seconds").innerHTML = formatNumber(seconds);

            if (distance < 0) {
                clearInterval(x);
                countdownElement.innerHTML = "INSCRIÇÕES ENCERRADAS";
            }
        }, 1000);
    }

    // --- Dynamic Thank You Page Logic ---
    const urlParams = new URLSearchParams(window.location.search);
    const origem = urlParams.get('origem'); // expect 'ebook', 'cpl', or 'compra'
    
    if (document.getElementById('obrigado-dynamic')) {
        const ebookContent = document.getElementById('content-ebook');
        const cplContent = document.getElementById('content-cpl');
        const compraContent = document.getElementById('content-compra');

        if (ebookContent) ebookContent.style.display = 'none';
        if (cplContent) cplContent.style.display = 'none';
        if (compraContent) compraContent.style.display = 'none';

        if (origem === 'ebook' && ebookContent) {
            ebookContent.style.display = 'block';
        } else if (origem === 'cpl' && cplContent) {
            cplContent.style.display = 'block';
        } else if (origem === 'compra' && compraContent) {
            compraContent.style.display = 'block';
        } else if (compraContent) {
            // Default behavior if no valid origin is provided
            compraContent.style.display = 'block';
        }
    }

    // --- Scroll to Top Button Logic ---
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
