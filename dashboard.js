document.addEventListener("DOMContentLoaded", () => {
    
    // Interacción simple para el menú lateral
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Removemos la clase active de todos
            menuItems.forEach(i => i.classList.remove('active'));
            // Se la añadimos al que hicimos click
            this.classList.add('active');
        });
    });

    // Simulación del botón "Nuevo Documento"
    const btnNewDoc = document.getElementById('btnNewDoc');
    
    if(btnNewDoc) {
        btnNewDoc.addEventListener('click', () => {
            alert("Redirigiendo al Asistente de Notarización Biométrica de GovTech...");
            // Aquí en un proyecto real redirigiríamos a la vista del formulario
            // window.location.href = "notarizar.html"; 
        });
    }

    // Funcionalidad de la barra de búsqueda simulada
    const searchInput = document.querySelector('.search-bar input');
    
    if(searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if(e.key === 'Enter') {
                alert(`Buscando el documento o Hash: ${e.target.value} en la red...`);
            }
        });
    }
});