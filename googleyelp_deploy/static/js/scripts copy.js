async function loadEstados() {
    const response = await fetch('http://127.0.0.1:8001/googleyelp/estados');
    const estados = await response.json();
    const countrySelect = document.getElementById('estadoSelect');
    
    estados.forEach(estado => {
      const option = document.createElement('option');
      option.value = estado;
      option.text = estado;
      estadoSelect.appendChild(option);
    });
}


document.getElementById('estadoSelect').addEventListener('change', async function() {
    const estado = this.value;
    const ciudadSelect = document.getElementById('ciudadSelect');
    ciudadSelect.innerHTML = '<option value="">Selecciona una ciudad</option>';
    
    if (estado) {
      const response = await fetch(`http://127.0.0.1:8001/googleyelp/ciudades/${estado}`);
      const ciudades = await response.json();
      
      ciudades.forEach(ciudad => {
        const option = document.createElement('option');
        option.value = ciudad;
        option.text = ciudad;
        ciudadSelect.appendChild(option);
      });
    }
});

// Función para cargar los tipos de comida
function loadComidas() {
    const comidas = ["Americana", "Mexicana", "China", "Koreana", "Italiana", "Griega"];
    const comidaSelect = document.getElementById('comidaSelect');
    
    comidas.forEach(comida => {
      const option = document.createElement('option');
      option.value = comida;
      option.text = comida;
      comidaSelect.appendChild(option);
    });
}

  // Inicializar las listas desplegables
  loadEstados();
  loadComidas();
  // Función para manejar el botón "Buscar"
  document.getElementById('busqButton').addEventListener('click', function() {
    const estado = document.getElementById('estadoSelect').value;
    const ciudad = document.getElementById('ciudadSelect').value;

    if (estado && ciudad) {
      alert(`Has seleccionado: Estado - ${estado}, Ciudad - ${ciudad}`);
    } else {
      alert('Por favor, selecciona un estado y una ciudad.');
    }
  });

function applyFilter() {
    const form = document.getElementById("filterForm");
    const selectedStars = form.elements["stars"].value;
    const mapFrame = document.getElementById("mapFrame");

    // Si no se seleccionó ninguna opción o la opción "Todas" está seleccionada,
    // asignamos un valor predeterminado (por ejemplo, 0)
    const starsValue = selectedStars ? selectedStars : "0";  // Usa "all" o 0

    // Cargar el mapa filtrado con la selección de estrellas
    mapFrame.src = `/googleyelp/map?stars=${starsValue}`;
}

// Cargar el mapa inicial sin filtros
window.onload = () => {
      const mapFrame = document.getElementById("mapFrame");
      mapFrame.src = `/googleyelp/map`;  // Asegúrate de que esté correcto
};
