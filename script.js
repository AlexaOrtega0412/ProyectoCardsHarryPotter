const contenedor = document.getElementById('contenedor');
const buscador = document.getElementById('buscador');
const filtroCasa = document.getElementById('filtroCasa');
const modal = document.getElementById('modalMagico');
const detalleDiv = document.getElementById('detallePersonaje');
const btnCerrar = document.getElementById('cerrarModal');
const cuadroModalContenido = modal.querySelector('.modal-contenido');

let personajes = [];
const IMG_DEFAULT = "https://via.placeholder.com/300x440?text=Imagen+No+Disponible";


async function cargarApp() {
    contenedor.innerHTML = "<h2 style='grid-column: 1/-1; text-align:center;'>Invocando personajes del mundo mágico...</h2>";
    try {
        const respuesta = await fetch('https://hp-api.onrender.com/api/characters');
        personajes = await respuesta.json();
        renderizarFichas(personajes);
    } catch (error) {
        contenedor.innerHTML = "<h2 style='grid-column: 1/-1; text-align:center; color:red;'>Error: El Ministerio de Magia bloqueó la conexión.</h2>";
        console.error("Error API:", error);
    }
}

function renderizarFichas(lista) {
    contenedor.innerHTML = ""; 
    
    if (lista.length === 0) {
        contenedor.innerHTML = "<h2 style='grid-column: 1/-1; text-align:center;'>No se encontraron magos con ese criterio.</h2>";
        return;
    }

    lista.forEach(p => {
        const casa = p.house || "Ninguna";
        const foto = p.image || IMG_DEFAULT;
        const actor = p.actor || "Desconocido";

        const ficha = document.createElement('article');
        ficha.className = `ficha ${casa}`;
        ficha.onclick = () => abrirDetalles(p.id); 

        ficha.innerHTML = `
            <img src="${foto}" alt="${p.name}" loading="lazy">
            <div class="info-basica">
                <h3>${p.name}</h3>
                <p><strong>Actor:</strong> ${actor}</p>
                <p><strong>Casa:</strong> ${casa}</p>
            </div>
        `;
        contenedor.appendChild(ficha);
    });
}
function aplicarFiltros() {
    const textoBusqueda = buscador.value.toLowerCase().trim();
    const casaSeleccionada = filtroCasa.value;

    const resultados = personajes.filter(p => {
        const coincideTexto = p.name.toLowerCase().includes(textoBusqueda) || 
                             (p.actor && p.actor.toLowerCase().includes(textoBusqueda));
        
        const coincideCasa = casaSeleccionada === "" || p.house === casaSeleccionada;
        
        return coincideTexto && coincideCasa;
    });

    renderizarFichas(resultados);
}

function abrirDetalles(idPersonaje) {
   
    const p = personajes.find(item => item.id === idPersonaje);
    if (!p) return;

    const madera = p.wand.wood || "?";
    const nucleo = p.wand.core || "?";
    const patronus = p.patronus || "No tiene/Desconocido";

    detalleDiv.innerHTML = `
        <h2>${p.name}</h2>
        <div class="detalle-flex">
            <img src="${p.image || IMG_DEFAULT}" alt="${p.name}" class="foto-detalle">
            <ul class="lista-datos">
                <li><strong>Casa:</strong> <span>${p.house || 'Ninguna'}</span></li>
                <li><strong>Especie:</strong> <span>${p.species}</span></li>
                <li><strong>Género:</strong> <span>${p.gender}</span></li>
                <li><strong>Ancestros:</strong> <span>${p.ancestry || 'Desconocido'}</span></li>
                <li><strong>Varita:</strong> <span>${madera} / ${nucleo}</span></li>
                <li><strong>Patronus:</strong> <span>${patronus}</span></li>
            </ul>
        </div>
    `;


    modal.style.display = "flex";

    crearChispasMágicas(40, cuadroModalContenido);
}

function crearChispasMágicas(cantidad, contenedorObjetivo) {
    
    const rect = contenedorObjetivo.getBoundingClientRect();
    const centroX = rect.width / 2;
    const centroY = rect.height / 2;

    for (let i = 0; i < cantidad; i++) {
        const chispa = document.createElement('div');
        
        
        chispa.className = `chispa ${i % 2 === 0 ? 'chispa-oro' : 'chispa-plata'}`;
        
        
        chispa.style.left = `${centroX}px`;
        chispa.style.top = `${centroY}px`;
        
        
        const angulo = Math.random() * Math.PI * 2;
        
        const velocidad = 120 + Math.random() * 250; 
        
        
        const destinoX = Math.cos(angulo) * velocidad;
        const destinoY = Math.sin(angulo) * velocidad;
        
        
        chispa.style.setProperty('--tx', `${destinoX}px`);
        chispa.style.setProperty('--ty', `${destinoY}px`);
        
        
        chispa.style.animationDelay = `${Math.random() * 0.15}s`;

        
        contenedorObjetivo.appendChild(chispa);
        
        
        setTimeout(() => {
            chispa.remove();
        }, 850);
    }
}

btnCerrar.onclick = () => { modal.style.display = "none"; };

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

buscador.addEventListener('input', aplicarFiltros);
filtroCasa.addEventListener('change', aplicarFiltros);


cargarApp();