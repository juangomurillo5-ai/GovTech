document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. VERIFICACIÓN DE SESIÓN (KYC)
    // ==========================================
    // Evita que alguien entre a dashboard.html sin registrarse
    const storedUserString = localStorage.getItem('govtechUser');
    if (!storedUserString) {
        alert("Acceso denegado. Debes iniciar sesión primero.");
        window.location.href = "index.html";
        return;
    }

    const userData = JSON.parse(storedUserString);
    // Mostrar el correo o el nombre antes del @
    const userName = userData.email.split('@')[0];
    document.getElementById('userNameDisplay').innerText = `Hola, ${userName}`;

    // ==========================================
    // 2. BASE DE DATOS SIMULADA (Documentos)
    // ==========================================
    // Inicializar documentos si no existen
    if (!localStorage.getItem('govtechDocs')) {
        const defaultDocs = [
            { id: 1, name: "Contrato_Arrendamiento_2026.pdf", hash: "GT-A8F2...9C3", date: "14 Abr 2026", status: "Notarizado" },
            { id: 2, name: "Certificado_SENA.pdf", hash: "GT-B71X...1A9", date: "12 Abr 2026", status: "Notarizado" }
        ];
        localStorage.setItem('govtechDocs', JSON.stringify(defaultDocs));
    }

    // ==========================================
    // 3. NAVEGACIÓN ENTRE VISTAS (SPA)
    // ==========================================
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    const views = document.querySelectorAll('.view-section');

    function switchView(targetId) {
        // Quitar activo a todos los menús y vistas
        menuItems.forEach(i => i.classList.remove('active'));
        views.forEach(v => v.classList.remove('active'));
        
        // Poner activo al menú correspondiente y mostrar la vista
        document.querySelector(`[data-target="${targetId}"]`).classList.add('active');
        document.getElementById(targetId).classList.add('active');

        // Si volvemos a inicio o documentos, recargar la tabla
        if(targetId === 'view-inicio' || targetId === 'view-documentos') {
            renderData();
        }
    }

    // Eventos click para la barra lateral
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const targetId = this.getAttribute('data-target');
            switchView(targetId);
        });
    });

    // Botón "Nuevo Documento" del Inicio
    document.getElementById('btnGoToNew').addEventListener('click', () => {
        switchView('view-nueva');
    });

    // ==========================================
    // 4. RENDERIZADO Y VISOR DE CERTIFICADOS
    // ==========================================
    function renderData(searchTerm = "") {
        const docs = JSON.parse(localStorage.getItem('govtechDocs'));
        
        const filteredDocs = docs.filter(doc => 
            doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            doc.hash.toLowerCase().includes(searchTerm.toLowerCase())
        );

        document.getElementById('statTotal').innerText = docs.length;
        document.getElementById('statVerified').innerText = docs.filter(d => d.status === "Notarizado").length;
        document.getElementById('statPending').innerText = docs.filter(d => d.status === "Procesando").length;

        let tableHTML = "";
        if (filteredDocs.length === 0) {
            tableHTML = `<tr><td colspan="5" style="text-align:center;">No se encontraron documentos</td></tr>`;
        } else {
            // Generar filas inyectando el ID del documento en el botón
            filteredDocs.reverse().forEach(doc => { 
                const statusBadge = doc.status === "Notarizado" ? "badge-success" : "badge-warning";
                // Si está notarizado mostramos el ojo, si no, un spinner sin acción
                const btnAction = doc.status === "Notarizado" 
                    ? `<button class="btn-action view-cert-btn" data-id="${doc.id}"><i class="fa-solid fa-eye"></i></button>`
                    : `<button class="btn-action disabled"><i class="fa-solid fa-spinner fa-spin"></i></button>`;
                
                tableHTML += `
                    <tr>
                        <td><i class="fa-solid fa-file-pdf" style="color: #EF4444; margin-right: 10px;"></i> ${doc.name}</td>
                        <td><span class="hash-id">${doc.hash}</span></td>
                        <td>${doc.date}</td>
                        <td><span class="badge ${statusBadge}">${doc.status}</span></td>
                        <td>${btnAction}</td>
                    </tr>
                `;
            });
        }

        document.getElementById('docsTableBody').innerHTML = tableHTML;
        document.getElementById('fullDocsTableBody').innerHTML = tableHTML;

        // ACTIVAR LOS BOTONES "VER" RECIÉN CREADOS
        attachCertModalEvents();
    }

    // Lógica del Modal del Certificado
    const certModal = document.getElementById('certModal');
    const closeCert = document.getElementById('closeCert');

    function attachCertModalEvents() {
        const viewButtons = document.querySelectorAll('.view-cert-btn');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const docId = this.getAttribute('data-id');
                const docs = JSON.parse(localStorage.getItem('govtechDocs'));
                // Buscar el documento exacto en la base de datos
                const doc = docs.find(d => d.id == docId);

                if(doc) {
                    // Llenar el modal con los datos reales
                    document.getElementById('modalCertId').innerText = `TX-${doc.id}`;
                    document.getElementById('modalCertDate').innerText = doc.date;
                    
                    // Recuperar el nombre del usuario de la sesión
                    const userData = JSON.parse(localStorage.getItem('govtechUser'));
                    document.getElementById('modalCertUser').innerText = userData.email;
                    
                    document.getElementById('modalCertFile').innerText = doc.name;
                    
                    // Generar un hash largo visualmente para el certificado si el original es corto
                    const fullHash = doc.hash.length > 20 ? doc.hash : `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855${doc.id}`;
                    document.getElementById('modalCertHash').innerText = fullHash;

                    // Mostrar el modal
                    certModal.classList.add('active');
                }
            });
        });
    }

    // Cerrar modal
    if(closeCert) closeCert.addEventListener('click', () => certModal.classList.remove('active'));
    window.addEventListener('click', (e) => {
        if (e.target === certModal) certModal.classList.remove('active');
    });

    // Simular Descarga
    document.getElementById('btnDownloadCert').addEventListener('click', () => {
        alert("Generando PDF oficial encriptado...\n(En producción se iniciaría la descarga del archivo).");
    });

    // ==========================================
    // 5. FUNCIONALIDAD DE NUEVO DOCUMENTO (UPLOAD)
    // ==========================================
    const dropZone = document.getElementById('dashDropZone');
    const fileInput = document.getElementById('dashFileInput');
    const dropText = document.getElementById('dashDropText');
    const btnSubmitDoc = document.getElementById('btnSubmitDoc');
    let selectedFileName = "";

    // Abrir buscador de archivos
    dropZone.addEventListener('click', () => fileInput.click());

    // Al seleccionar archivo
    fileInput.addEventListener('change', (e) => {
        if(e.target.files.length > 0) {
            selectedFileName = e.target.files[0].name;
            dropText.innerHTML = `<strong style="color:var(--primary-color);">Archivo listo:</strong> ${selectedFileName}`;
            dropZone.style.borderColor = "#10B981";
            dropZone.style.background = "#D1FAE5";
            btnSubmitDoc.disabled = false; // Habilitar botón
        }
    });

    // Enviar Formulario de Notarización
    document.getElementById('newDocForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        btnSubmitDoc.disabled = true;
        document.getElementById('uploadProgressContainer').style.display = 'block';
        const progressFill = document.getElementById('uploadProgress');
        const statusText = document.getElementById('uploadStatus');
        
        let progress = 0;
        
        // Simular proceso de carga y generación de Blockchain
        const interval = setInterval(() => {
            progress += 10;
            progressFill.style.width = progress + '%';
            
            if(progress < 50) statusText.innerText = "Subiendo archivo a la bóveda...";
            else if(progress < 90) statusText.innerText = "Generando huella criptográfica SHA-256...";
            else statusText.innerText = "Registrando en la red GovTech...";

            if(progress >= 100) {
                clearInterval(interval);
                
                // Generar un Hash Falso aleatorio (Simulación)
                const randomHash = "GT-" + Math.random().toString(16).substr(2, 4).toUpperCase() + "..." + Math.random().toString(16).substr(2, 3).toUpperCase();
                
                // Fecha de hoy
                const today = new Date();
                const dateStr = today.getDate() + " " + today.toLocaleString('es-ES', { month: 'short' }) + " " + today.getFullYear();

                // Guardar en la base de datos (LocalStorage)
                const docs = JSON.parse(localStorage.getItem('govtechDocs'));
                docs.push({
                    id: Date.now(),
                    name: selectedFileName,
                    hash: randomHash,
                    date: dateStr,
                    status: "Notarizado"
                });
                localStorage.setItem('govtechDocs', JSON.stringify(docs));

                // Reiniciar formulario
                alert("¡Documento notarizado exitosamente!");
                fileInput.value = "";
                dropText.innerHTML = `Arrastra tu PDF aquí o <span>haz clic para buscar</span>`;
                dropZone.style.borderColor = "#D1D5DB";
                dropZone.style.background = "#F9FAFB";
                document.getElementById('uploadProgressContainer').style.display = 'none';
                statusText.innerText = "";
                
                // Volver a inicio
                switchView('view-inicio');
            }
        }, 300);
    });

    // ==========================================
    // 6. BUSCADOR EN TIEMPO REAL
    // ==========================================
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const searchTerm = e.target.value;
        // Si estamos en otra vista, nos pasa a "Mis Documentos" para ver los resultados
        if(document.getElementById('view-nueva').classList.contains('active')){
             switchView('view-documentos');
        }
        renderData(searchTerm);
    });

    // ==========================================
    // 7. CERRAR SESIÓN
    // ==========================================
    document.getElementById('btnLogout').addEventListener('click', (e) => {
        e.preventDefault();
        // Borramos la sesión de usuario de la memoria
        localStorage.removeItem('govtechUser');
        alert("Sesión cerrada correctamente.");
        window.location.href = "index.html";
    });

    // Inicializar la tabla al cargar la página por primera vez
    renderData();
    // ==========================================
    // 8. LÓGICA DEL VALIDADOR DE DOCUMENTOS
    // ==========================================
    const valDropZone = document.getElementById('valDropZone');
    const valFileInput = document.getElementById('valFileInput');
    const valDropText = document.getElementById('valDropText');
    const btnValidateDoc = document.getElementById('btnValidateDoc');
    const valResultArea = document.getElementById('valResultArea');
    let valSelectedFileName = "";

    if (valDropZone && valFileInput) {
        // Abrir selector de archivos
        valDropZone.addEventListener('click', () => {
            valFileInput.click();
            valResultArea.style.display = 'none'; // Limpiar resultado anterior
        });

        // Detectar archivo seleccionado
        valFileInput.addEventListener('change', (e) => {
            if(e.target.files.length > 0) {
                valSelectedFileName = e.target.files[0].name;
                valDropText.innerHTML = `<strong style="color:var(--primary-color);">Archivo cargado:</strong> ${valSelectedFileName}`;
                valDropZone.style.borderColor = "#2563EB";
                valDropZone.style.background = "#EFF6FF";
                btnValidateDoc.disabled = false;
            }
        });

        // Simular Auditoría Criptográfica
        btnValidateDoc.addEventListener('click', () => {
            btnValidateDoc.disabled = true;
            document.getElementById('valProgressContainer').style.display = 'block';
            const progressFill = document.getElementById('valProgress');
            const statusText = document.getElementById('valStatus');
            valResultArea.style.display = 'none';
            
            let progress = 0;
            const interval = setInterval(() => {
                progress += 15;
                progressFill.style.width = progress + '%';
                
                // Textos técnicos para darle realismo
                if(progress < 40) statusText.innerText = "Extrayendo Hash SHA-256 del documento...";
                else if(progress < 80) statusText.innerText = "Consultando red blockchain de GovTech...";
                else statusText.innerText = "Comparando firmas criptográficas...";

                if(progress >= 100) {
                    clearInterval(interval);
                    document.getElementById('valProgressContainer').style.display = 'none';
                    statusText.innerText = "";
                    
                    // SIMULACIÓN: Verificar si el nombre del archivo está en nuestra base de datos local
                    const docs = JSON.parse(localStorage.getItem('govtechDocs') || '[]');
                    const foundDoc = docs.find(d => d.name.toLowerCase() === valSelectedFileName.toLowerCase());

                    if(foundDoc) {
                        // ÉXITO: El archivo coincide con uno notarizado
                        valResultArea.className = "result-box success";
                        valResultArea.innerHTML = `
                            <i class="fa-solid fa-circle-check result-icon" style="color: #10B981;"></i>
                            <h3>Documento Original Auténtico</h3>
                            <p>Este documento no ha sido alterado y su firma digital coincide con los registros de la bóveda de GovTech.</p>
                            <div class="result-details">
                                <strong>Hash Verificado (ADN del archivo):</strong><br> ${foundDoc.hash}<br><br>
                                <strong>Registrado el:</strong> ${foundDoc.date}
                            </div>
                        `;
                    } else {
                        // ERROR: El archivo no existe o fue alterado
                        // Generamos un hash "falso" para mostrar la diferencia
                        const fakeHash = "ERR-" + Math.random().toString(16).substr(2, 10).toUpperCase() + "...MODIFICADO";
                        valResultArea.className = "result-box error";
                        valResultArea.innerHTML = `
                            <i class="fa-solid fa-triangle-exclamation result-icon" style="color: #EF4444;"></i>
                            <h3>Documento Alterado o Falso</h3>
                            <p>El Hash de este archivo no existe en nuestra red. El documento es falso o ha sufrido modificaciones (incluso un solo píxel o letra).</p>
                            <div class="result-details">
                                <strong>Hash Calculado (Inválido):</strong><br> ${fakeHash}
                            </div>
                        `;
                    }
                    
                    valResultArea.style.display = 'block'; // Mostrar resultado
                    
                    // Resetear la zona de carga
                    valDropText.innerHTML = `Arrastra otro documento o <span>haz clic para buscar</span>`;
                    valDropZone.style.borderColor = "#D1D5DB";
                    valDropZone.style.background = "#F9FAFB";
                    valFileInput.value = "";
                }
            }, 300); // Velocidad de la animación
        });
    }
});