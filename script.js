document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. SCROLL NAVBAR
    // ==========================================
    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // ==========================================
    // 2. FAQ ACORDEÓN
    // ==========================================
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('i');
            
            // Alternar la altura máxima para mostrar/ocultar
            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
                icon.style.transform = 'rotate(0deg)';
            } else {
                // Cerrar las otras abiertas para que solo haya una abierta a la vez
                document.querySelectorAll('.faq-answer').forEach(ans => ans.style.maxHeight = null);
                document.querySelectorAll('.faq-question i').forEach(i => i.style.transform = 'rotate(0deg)');
                
                answer.style.maxHeight = answer.scrollHeight + "px";
                icon.style.transform = 'rotate(180deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
    });

 // ==========================================
    // 3. LÓGICA DE AUTENTICACIÓN Y REGISTRO (KYC)
    // ==========================================
    const authModal = document.getElementById('authModal');
    const btnAcceder = document.getElementById('btnAcceder');
    const closeAuth = document.getElementById('closeAuth');
    
    // Vistas y Botones de cambio
    const loginView = document.getElementById('loginView');
    const registerView = document.getElementById('registerView');
    const btnShowRegister = document.getElementById('btnShowRegister');
    const btnShowLogin = document.getElementById('btnShowLogin');

    // Formularios
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    // Abrir y cerrar modal
    if (btnAcceder) {
        btnAcceder.addEventListener('click', (e) => { 
            e.preventDefault(); 
            authModal.classList.add('active'); 
            // Siempre abrir en la vista de login por defecto
            registerView.classList.remove('active');
            loginView.classList.add('active');
        });
    }
    if (closeAuth) closeAuth.addEventListener('click', () => authModal.classList.remove('active'));

    // Cambiar entre Login y Registro
    btnShowRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginView.classList.remove('active');
        registerView.classList.add('active');
    });

    btnShowLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerView.classList.remove('active');
        loginView.classList.add('active');
    });

    // Subida de ID visual en el registro
    const idUpload = document.getElementById('idUpload');
    const idUploadText = document.getElementById('idUploadText');
    if(idUpload) {
        idUpload.addEventListener('change', function(e) {
            if(e.target.files.length > 0) {
                idUploadText.innerText = "Archivo cargado: " + e.target.files[0].name;
                document.querySelector('.id-upload-zone').style.backgroundColor = '#D1FAE5';
                document.querySelector('.id-upload-zone').style.borderColor = '#10B981';
                document.querySelector('.id-upload-zone').style.color = '#065F46';
            }
        });
    }
  // Validación y Guardado de Registro
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const errorText = document.getElementById('passwordError');
            
            // Regex: Mínimo 8 caracteres, al menos una letra y un número.
            const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d.,!@#$%^&*_-]{8,}$/;

            if (!passwordRegex.test(password)) {
                errorText.innerText = "La contraseña debe tener letras, números y mínimo 8 caracteres.";
                errorText.style.display = "block";
                return;
            } else {
                errorText.style.display = "none";
            }

            const btnSubmit = registerForm.querySelector('.btn-submit');
            const originalText = btnSubmit.innerHTML;
            btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Validando KYC...';
            
            setTimeout(() => {
                // SIMULACIÓN DE BASE DE DATOS: Guardamos el usuario en la memoria del navegador
                const userData = { email: email, password: password };
                localStorage.setItem('govtechUser', JSON.stringify(userData));

                btnSubmit.innerHTML = originalText;
                alert('¡Identidad verificada! Tu bóveda ha sido creada. Por favor, inicia sesión.');
                registerForm.reset();
                idUploadText.innerText = "Haz clic para subir foto/PDF"; 
                
                // Cambiar a la vista de Login
                registerView.classList.remove('active');
                loginView.classList.add('active');
            }, 2000);
        });
    }
    // Lógica de Inicio de Sesión (Validando contra la memoria)
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const loginEmail = document.getElementById('loginEmail').value;
            const loginPassword = document.getElementById('loginPassword').value;
            const loginError = document.getElementById('loginError');
            
            // Buscamos si existe un usuario registrado en la memoria del navegador
            const storedUserString = localStorage.getItem('govtechUser');
            
            if (!storedUserString) {
                // Si no hay datos guardados
                loginError.innerText = "No existe ninguna cuenta con este correo. Por favor, regístrate primero.";
                loginError.style.display = "block";
                return;
            }

            const storedUser = JSON.parse(storedUserString);

            // Comprobamos si el correo y la contraseña coinciden exactamente
            if (loginEmail === storedUser.email && loginPassword === storedUser.password) {
                // Si todo está correcto
                loginError.style.display = "none";
                const btnSubmit = loginForm.querySelector('.btn-submit');
                const originalText = btnSubmit.innerHTML;
                
                btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Autenticando...';
                
                setTimeout(() => {
                    btnSubmit.innerHTML = originalText;
                    window.location.href = "dashboard.html"; 
                }, 1000);
            } else {
                // Si la contraseña o el correo están mal
                loginError.innerText = "Correo o contraseña incorrectos.";
                loginError.style.display = "block";
            }
        });
    }
    // ==========================================
    // 4. LÓGICA MODAL SIMULADOR NOTARIZACIÓN
    // ==========================================
    const uploadModal = document.getElementById('uploadModal');
    const btnSimulador = document.getElementById('btnSimulador');
    const closeUpload = document.getElementById('closeUpload');
    
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const btnNextToBio = document.getElementById('btnNextToBio');

    if (btnSimulador) {
        btnSimulador.addEventListener('click', (e) => { 
            e.preventDefault(); 
            uploadModal.classList.add('active'); 
        });
    }

    if (closeUpload) {
        closeUpload.addEventListener('click', () => uploadModal.classList.remove('active'));
    }

    // Cerrar modales haciendo click fuera de la caja blanca
    window.addEventListener('click', (e) => {
        if (e.target === authModal) authModal.classList.remove('active');
        if (e.target === uploadModal) uploadModal.classList.remove('active');
    });

    // Simular carga de archivo
    if (dropZone && fileInput) {
        dropZone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
            if(e.target.files.length > 0) {
                document.getElementById('fileName').innerText = e.target.files[0].name;
                document.getElementById('certFile').innerText = e.target.files[0].name;
                dropZone.style.display = 'none';
                fileInfo.style.display = 'flex';
            }
        });
    }

    // Pasar de Paso 1 (Archivo) a Paso 2 (Biometría)
    if (btnNextToBio) {
        btnNextToBio.addEventListener('click', () => {
            document.getElementById('uploadStep1').classList.remove('active');
            document.getElementById('uploadStep2').classList.add('active');
            
            // Animar barra de progreso biométrica
            let progress = 0;
            const interval = setInterval(() => {
                progress += 5;
                document.getElementById('bioProgress').style.width = progress + '%';
                document.getElementById('bioStatus').innerText = `Analizando biometría... ${progress}%`;
                
                if(progress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        // Pasar a Paso 3 (Certificado)
                        document.getElementById('uploadStep2').classList.remove('active');
                        document.getElementById('uploadStep3').classList.add('active');
                    }, 600);
                }
            }, 150);
        });
    }

    // ==========================================
    // 5. ANIMACIONES AL HACER SCROLL (SCROLL REVEAL)
    // ==========================================
    
    // Seleccionamos todos los elementos que queremos animar
    const elementsToReveal = document.querySelectorAll('.step, .feature-card, .pricing-card, .faq-item');

    // Configuramos el "Observador"
    const revealOptions = {
        threshold: 0.15, // Se activa cuando el 15% del elemento es visible
        rootMargin: "0px 0px -50px 0px" // Activa la animación un poquito antes de que llegue al borde inferior
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return; // Si no está en pantalla, no hace nada
            } else {
                // Si entra en pantalla, le añadimos la clase que activa la animación CSS
                entry.target.classList.add('revealed');
                // Dejamos de observarlo para que la animación ocurra solo una vez
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    // Le decimos al observador que vigile cada elemento
    elementsToReveal.forEach(el => {
        revealOnScroll.observe(el);
    });

});