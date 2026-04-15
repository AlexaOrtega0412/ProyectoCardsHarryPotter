const contenedor = document.getElementById('contenedor');
const buscador = document.getElementById('buscador');
const filtroCasa = document.getElementById('filtroCasa');
const modal = document.getElementById('modalMagico');
const detalleDiv = document.getElementById('detallePersonaje');
const btnCerrar = document.getElementById('cerrarModal');

let personajes = [];
const IMG_DEFAULT = "https://via.placeholder.com/300x400?text=No+Foto";


async function cargarApp() {
    contenedor.innerHTML = "<h2 style='text-align:center; grid-column: 1/-1;'>Invocando personajes...</h2>";
    try {
        const respuesta = await fetch('https://hp-api.onrender.com/api/characters');
        personajes = await respuesta.json();
        renderizar(personajes);
    } catch (error) {
        contenedor.innerHTML = "<h2>Error: El Ministerio de Magia bloqueó la conexión.</h2>";
    }
}


function renderizar(lista) {
    contenedor.innerHTML = "";
    if (lista.length === 0) {
        contenedor.innerHTML = "<h2 style='text-align:center; grid-column: 1/-1;'>No se encontraron magos con ese criterio.</h2>";
        return;
    }

    lista.forEach(p => {
        const casa = p.house || "Ninguna";
        const foto = p.image || IMG_DEFAULT;

        const ficha = document.createElement('div');
        ficha.className = `ficha ${casa}`;
        ficha.onclick = () => abrirDetalles(p.id); // Evento para abrir modal

        ficha.innerHTML = `
            <img src="${foto}" alt="${p.name}">
            <div class="info-basica">
                <h3>${p.name}</h3>
                <p><strong>Actor:</strong> ${p.actor || 'N/A'}</p>
                <p><strong>Casa:</strong> ${p.house || 'Sin casa'}</p>
            </div>
        `;
        contenedor.appendChild(ficha);
    });
}


function filtrar() {
    const texto = buscador.value.toLowerCase();
    const casa = filtroCasa.value;

    const resultados = personajes.filter(p => {
        const coincideTexto = p.name.toLowerCase().includes(texto) || 
                             p.actor.toLowerCase().includes(texto);
        const coincideCasa = casa === "" || p.house === casa;
        
        return coincideTexto && coincideCasa;
    });

    renderizar(resultados);
}


function abrirDetalles(id) {
    const p = personajes.find(item => item.id === id);
    if (!p) return;

    
    const madera = p.wand.wood || "Desconocida";
    const nucleo = p.wand.core || "Desconocido";

    detalleDiv.innerHTML = `
        <h2 style="color:#1a1a1a; margin-top:0;">${p.name}</h2>
        <div class="detalle-flex">
            <img src="${p.image || IMG_DEFAULT}" class="foto-detalle">
            <ul class="lista-datos">
                <li><strong>Casa:</strong> ${p.house || 'Ninguna'}</li>
                <li><strong>Especie:</strong> ${p.species}</li>
                <li><strong>Género:</strong> ${p.gender}</li>
                <li><strong>Patronus:</strong> ${p.patronus || 'No tiene'}</li>
                <li><strong>Varita:</strong> ${madera} (${nucleo})</li>
                <li><strong>Nacimiento:</strong> ${p.dateOfBirth || 'Desconocido'}</li>
            </ul>
        </div>
    `;
    modal.style.display = "flex";
}


btnCerrar.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };


buscador.addEventListener('input', filtrar);
filtroCasa.addEventListener('change', filtrar);


cargarApp();