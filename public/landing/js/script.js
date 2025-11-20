        // Inisialisasi EmailJS
        // Ganti dengan Public Key Anda dari dashboard EmailJS
        emailjs.init("YOUR_PUBLIC_KEY_HERE");
        // Mobile menu toggle
        const mobileToggle = document.getElementById('mobileToggle');
        const navMenu = document.getElementById('navMenu');

        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Form submission
         // Form submission dengan EmailJS
        document.getElementById('requestDemoForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form elements
            const submitBtn = document.getElementById('submitBtn');
            const formMessage = document.getElementById('formMessage');
            
            // Show loading state
            submitBtn.classList.add('btn-loading');
            submitBtn.disabled = true;
            formMessage.style.display = 'none';
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                institution: document.getElementById('institution').value,
                phone: document.getElementById('phone').value,
                message: document.getElementById('message').value,
                date: new Date().toLocaleString('id-ID')
            };
            
            // Send email using EmailJS
            emailjs.send(
                'YOUR_SERVICE_ID_HERE',  // Ganti dengan Service ID Anda
                'YOUR_TEMPLATE_ID_HERE', // Ganti dengan Template ID Anda
                formData
            ).then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                
                // Show success message
                formMessage.textContent = 'Terima kasih! Permintaan demo Anda telah berhasil dikirim. Tim kami akan menghubungi Anda dalam waktu 1x24 jam.';
                formMessage.className = 'form-message form-success';
                formMessage.style.display = 'block';
                
                // Reset form
                document.getElementById('requestDemoForm').reset();
                
            }, function(error) {
                console.log('FAILED...', error);
                
                // Show error message
                formMessage.textContent = 'Maaf, terjadi kesalahan. Silakan coba lagi atau hubungi kami langsung di info@spkapoteker.com';
                formMessage.className = 'form-message form-error';
                formMessage.style.display = 'block';
                
            }).finally(function() {
                // Reset button state
                submitBtn.classList.remove('btn-loading');
                submitBtn.disabled = false;
            });
        });