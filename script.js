const contenedor = document.getElementById('contenedor');
const buscador = document.getElementById('buscador');
const filtroCasa = document.getElementById('filtroCasa');

let todosLosPersonajes = [];
const IMG_DEFAULT = "https://via.placeholder.com/300x400?text=Imagen+No+Disponible";

// 1. Consumir la API
async function obtenerPersonajes() {
    try {
        const respuesta = await fetch('https://hp-api.onrender.com/api/characters');
        todosLosPersonajes = await respuesta.json();
        renderizarFichas(todosLosPersonajes);
    } catch (error) {
        contenedor.innerHTML = "<p>Error al conectar con el Ministerio de Magia.</p>";
        console.error(error);
    }
}

// 2. Crear las fichas en el HTML
function renderizarFichas(lista) {
    contenedor.innerHTML = ""; // Limpiar antes de mostrar
    
    if (lista.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron coincidencias.</p>";
        return;
    }

    lista.forEach(personaje => {
        const fichaDiv = document.createElement('article');
        fichaDiv.className = 'ficha';
        
        // Validación de imagen por defecto
        const foto = personaje.image ? personaje.image : IMG_DEFAULT;

        fichaDiv.innerHTML = `
            <img src="${foto}" alt="${personaje.name}">
            <div class="info">
                <h3>${personaje.name}</h3>
                <p><span class="label">Casa:</span> ${personaje.house || 'Ninguna'}</p>
                <p><span class="label">Actor:</span> ${personaje.actor || 'Desconocido'}</p>
                <p><span class="label">Especie:</span> ${personaje.species}</p>
                <p><span class="label">Género:</span> ${personaje.gender}</p>
            </div>
        `;
        contenedor.appendChild(fichaDiv);
    });
}

// 3. Función de filtrado dinámico
function filtrar() {
    const textoBusqueda = buscador.value.toLowerCase();
    const casaSeleccionada = filtroCasa.value;

    const filtrados = todosLosPersonajes.filter(p => {
        // Filtro por texto (Nombre o Actor)
        const coincideTexto = p.name.toLowerCase().includes(textoBusqueda) || 
                             p.actor.toLowerCase().includes(textoBusqueda);
        
        // Filtro por Casa
        const coincideCasa = casaSeleccionada === "" || p.house === casaSeleccionada;

        return coincideTexto && coincideCasa;
    });

    renderizarFichas(filtrados);
}

// Eventos de escucha
buscador.addEventListener('input', filtrar);
filtroCasa.addEventListener('change', filtrar);

// Iniciar la carga
obtenerPersonajes();