function applyFilter() {
  const estadoSelect = document.getElementById("estadoSelect");
  const ciudadSelect = document.getElementById("ciudadSelect");
  const form = document.getElementById("filterForm");
  const selectedSent = form.elements["sentimiento"].value;
  const mapFrame = document.getElementById("mapFrame");

  // Si no se seleccionó ninguna opción o la opción "Todas" está seleccionada,
  // asignamos un valor predeterminado (por ejemplo, 0)
  //const starsValue = selectedSent ? selectedSent : "Negativo";  // Usa "all" o 0

  const estado = estadoSelect.value || "all"; // Valor predeterminado si no se selecciona nada
  const ciudad = ciudadSelect.value || "all";
  const sentimiento = selectedSent || "all";
  if (ciudad === "all" || ciudad === "") {
    alert("Por favor, selecciona una ciudad.");
    return;  // Detener la función si no se seleccionó ciudad
  }  
  const queryParams = `estado=${encodeURIComponent(estado)}&ciudad=${encodeURIComponent(ciudad)}&sentimiento=${encodeURIComponent(sentimiento)}`;
  // Cargar el mapa filtrado con la selección de estrellas
  mapFrame.src = `/googleyelp/map?average_rating=${queryParams}`;// ESTE ANDA; ESTOY PROBANDO OTRO
  //mapFrame.src = `/googleyelp/map?${queryParams}`;
}


// Llama a esta función dependiendo de la lógica de navegación o botones seleccionados
//cargarEstadosYCiudades("sentimiento");
// Cargar el mapa inicial sin filtros

window.onload = () => {
    const mapFrame = document.getElementById("mapFrame");
    mapFrame.src = `/googleyelp/map?estado=""&ciudad=""`;  
    loadEstados();  // Cargar los estados cuando la página cargue
    loadCiudades();
    loadEstadosReco();  // Cargar los estados cuando la página cargue
    loadCiudadesReco();

};


// Función para cargar los estados
async function loadEstados() {
  const estadoSelect = document.getElementById("estadoSelect");

  try {
      // Hacer la solicitud para obtener los estados
      const response = await fetch("/googleyelp/estados");
      const estados = await response.json();

      // Limpiar el select de estados antes de agregar las nuevas opciones
      estadoSelect.innerHTML = "<option value=''>Selecciona un Estado</option>";

      // Agregar los estados al select
      estados.forEach(estado => {
          const option = document.createElement("option");
          option.value = estado;
          option.textContent = estado;
          estadoSelect.appendChild(option);
      });

      // Cargar las ciudades cuando un estado es seleccionado
      estadoSelect.addEventListener("change", function() {
          const estadoSeleccionado = this.value;
          loadCiudades(estadoSeleccionado);
      });
  } catch (error) {
      console.error("Error al cargar los estados:", error);
  }
}

// Función para cargar las ciudades
async function loadCiudades(estado) {
  const ciudadSelect = document.getElementById("ciudadSelect");

  if (!estado) {
      ciudadSelect.innerHTML = "<option value=''>Selecciona una Ciudad</option>";
      return;
  }

  try {
      // Hacer la solicitud para obtener las ciudades del estado seleccionado
      const response = await fetch(`/googleyelp/ciudades/${estado}`);
      if (!response.ok) {
          throw new Error("No se encontraron ciudades para este estado");
      }

      const ciudades = await response.json();

      // Limpiar el select de ciudades antes de agregar las nuevas opciones
      ciudadSelect.innerHTML = "<option value=''>Selecciona una Ciudad</option>";

      // Agregar las ciudades al select
      ciudades.forEach(ciudad => {
          const option = document.createElement("option");
          option.value = ciudad;
          option.textContent = ciudad;
          ciudadSelect.appendChild(option);
      });
  } catch (error) {
      console.error("Error al cargar las ciudades:", error);
      alert("No se pudieron cargar las ciudades.");
  }
}

// PRUEBA PARA EL OTRO MODELO DE RECO


// Función para cargar las ciudades
async function loadCiudadesReco(estado) {
const ciudadSelectRecomendacion = document.getElementById("ciudadSelectRecomendacion");

if (!estado) {
ciudadSelectRecomendacion.innerHTML = "<option value=''>Selecciona una Ciudad</option>";
  return;
}

try {
  // Hacer la solicitud para obtener las ciudades del estado seleccionado
  const response = await fetch(`/googleyelp/ciudades/${estado}`);
  if (!response.ok) {
      throw new Error("No se encontraron ciudades para este estado");
  }

  const ciudades = await response.json();

  // Limpiar el select de ciudades antes de agregar las nuevas opciones
  ciudadSelectRecomendacion.innerHTML = "<option value=''>Selecciona una Ciudad</option>";

  // Agregar las ciudades al select
  ciudades.forEach(ciudad => {
      const option = document.createElement("option");
      option.value = ciudad;
      option.textContent = ciudad;
      ciudadSelectRecomendacion.appendChild(option);
  });
} catch (error) {
  console.error("Error al cargar las ciudades:", error);
  alert("No se pudieron cargar las ciudades.");
}
}


// scripts para la eleccion de los 2 modelos
const modSentim = document.getElementById('modsentim');
const modEstrella = document.getElementById('modestrella');
const containerSentimiento = document.querySelector('.modelo-sentimiento');
const containerRecomendacion = document.querySelector('.modelo-recomendacion');

// Mostrar el contenedor correspondiente según el modelo seleccionado
modSentim.addEventListener('change', () => {
    containerSentimiento.style.display = 'block';
    containerRecomendacion.style.display = 'none';
});

modEstrella.addEventListener('change', () => {
    containerSentimiento.style.display = 'none';
    containerRecomendacion.style.display = 'block';
});


const images = document.querySelectorAll('.carousel img');
let currentIndex = 0;



function showNextImage() {
    // Ocultar la imagen actual
    images[currentIndex].classList.remove('active');
    
    // Calcular el siguiente índice
    currentIndex = (currentIndex + 1) % images.length;
    
    // Mostrar la siguiente imagen
    images[currentIndex].classList.add('active');
}

// Cambiar la imagen cada 3 segundos
setInterval(showNextImage, 4000);