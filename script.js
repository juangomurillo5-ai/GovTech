document.addEventListener("DOMContentLoaded", () => {
    
    // 1. SCROLL NAVBAR
    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) navbar.classList.add("scrolled");
        else navbar.classList.remove("scrolled");
    });

    // 2. FAQ ACORDEÓN
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('i');
            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
                icon.style.transform = 'rotate(0deg)';
            } else {
                document.querySelectorAll('.faq-answer').forEach(ans => ans.style.maxHeight = null);
                document.querySelectorAll('.faq-question i').forEach(i => i.style.transform = 'rotate(0deg)');
                answer.style.maxHeight = answer.scrollHeight + "px";
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });

    // 3. LÓGICA MODAL DE LOGIN
    const authModal = document.getElementById('authModal');
    const btnAcceder = document.getElementById('btnAcceder');
    const closeAuth = document.getElementById('closeAuth');
    const loginForm = document.getElementById('loginForm');

    btnAcceder.addEventListener('click', (e) => { e.preventDefault(); authModal.classList.add('active'); });
    closeAuth.addEventListener('click', () => authModal.classList.remove('active'));
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btnSubmit = loginForm.querySelector('.btn-submit');
        const originalText = btnSubmit.innerHTML;
        btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verificando...';
        setTimeout(() => {
            btnSubmit.innerHTML = originalText;
            window.location.href = "dashboard.html";
            authModal.classList.remove('active');
            loginForm.reset();
        }, 1500);
    });

    // 4. LÓGICA MODAL SIMULADOR NOTARIZACIÓN
    const uploadModal = document.getElementById('uploadModal');
    const btnSimulador = document.getElementById('btnSimulador');
    const closeUpload = document.getElementById('closeUpload');
    
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const btnNextToBio = document.getElementById('btnNextToBio');

    btnSimulador.addEventListener('click', (e) => { e.preventDefault(); uploadModal.classList.add('active'); });
    closeUpload.addEventListener('click', () => uploadModal.classList.remove('active'));

    // Cerrar modales haciendo click fuera
    window.addEventListener('click', (e) => {
        if (e.target === authModal) authModal.classList.remove('active');
        if (e.target === uploadModal) uploadModal.classList.remove('active');
    });

    // Simular carga de archivo
    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        if(e.target.files.length > 0) {
            document.getElementById('fileName').innerText = e.target.files[0].name;
            document.getElementById('certFile').innerText = e.target.files[0].name;
            dropZone.style.display = 'none';
            fileInfo.style.display = 'flex';
        }
    });

    // Pasar de Paso 1 (Archivo) a Paso 2 (Biometría)
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
});