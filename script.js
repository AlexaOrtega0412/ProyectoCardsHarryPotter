const contenedor = document.getElementById('contenedor');
const buscador = document.getElementById('buscador');
const filtroCasa = document.getElementById('filtroCasa');

let personajes = [];
const IMG_DEFAULT = "https://via.placeholder.com/300x400?text=Imagen+No+Disponible";

// Cargar datos de la API
async function obtenerPersonajes() {
    try {
        const res = await fetch('https://hp-api.onrender.com/api/characters');
        personajes = await res.json();
        mostrarFichas(personajes);
    } catch (err) {
        contenedor.innerHTML = "<h2>Error al cargar los datos...</h2>";
    }
}

// Renderizar las fichas en el DOM
function mostrarFichas(lista) {
    contenedor.innerHTML = "";
    
    lista.forEach(p => {
        const casaClase = p.house ? p.house : "Ninguna";
        const foto = p.image ? p.image : IMG_DEFAULT;
        
        const card = document.createElement('article');
        card.className = `ficha ${casaClase}`;
        
        card.innerHTML = `
            <img src="${foto}" alt="${p.name}">
            <div class="info">
                <h3>${p.name}</h3>
                <p><span class="label">Casa:</span> ${p.house || 'Ninguna'}</p>
                <p><span class="label">Actor:</span> ${p.actor || 'N/A'}</p>
                <p><span class="label">Especie:</span> ${p.species}</p>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

// Lógica de Filtros (Texto + Casa)
function aplicarFiltros() {
    const texto = buscador.value.toLowerCase();
    const casa = filtroCasa.value;

    const filtrados = personajes.filter(p => {
        const coincideNombre = p.name.toLowerCase().includes(texto) || 
                               p.actor.toLowerCase().includes(texto);
        const coincideCasa = casa === "" || p.house === casa;
        
        return coincideNombre && coincideCasa;
    });

    mostrarFichas(filtrados);
}

// Listeners para búsqueda en tiempo real
buscador.addEventListener('input', aplicarFiltros);
filtroCasa.addEventListener('change', aplicarFiltros);

// Arrancar app
obtenerPersonajes();