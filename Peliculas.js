class Carrusel {
    constructor(items, activeIndex = 0) {
        this.items = items;
        this.active = activeIndex;
        this.container = document.querySelector('.carrusel-items');
        this.isTransitioning = false;
        this.render();
    }

    generateItems() {
        this.container.innerHTML = '';
        
        for (let i = this.active - 2; i < this.active + 3; i++) {
            let index = i;
            if (i < 0) {
                index = this.items.length + i;
            } else if (i >= this.items.length) {
                index = i % this.items.length;
            }
            
            const level = this.active - i;
            this.createItem(this.items[index], level, index);
        }
    }

    createItem(content, level, index) {
        const item = document.createElement('div');
        item.className = `item level${level} noselect`;

        const img = document.createElement('img');
        img.src = images[index];
        img.alt = `Película ${index + 1}`;
        img.className = "carrusel-img";
        img.setAttribute('data-trailer', trailers[index]);

        item.appendChild(img);
        
        // Evento para abrir el modal al hacer click en la imagen
        img.addEventListener('click', function(e) {
            e.stopPropagation();
            const trailerUrl = this.getAttribute('data-trailer');
            document.getElementById('trailer-frame').src = trailerUrl;
            document.getElementById('trailer-modal').style.display = 'flex';
        });

        //mover el carrusel al hacer click en la tarjeta
        item.addEventListener('click', () => {
            if (!this.isTransitioning && level !== 0) {
                if (level > 0) {
                    for (let i = 0; i < level; i++) {
                        this.moveRight();
                    }
                } else {
                    for (let i = 0; i < Math.abs(level); i++) {
                        this.moveLeft();
                    }
                }
            }
        });

        this.container.appendChild(item);
    }

    moveLeft() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        const newActive = this.active - 1;
        this.active = newActive < 0 ? this.items.length - 1 : newActive;
        this.render();
    
        setTimeout(() => {
            this.isTransitioning = false;
        }, 1000);
    }

    moveRight() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.active = (this.active + 1) % this.items.length;
        this.render();

        setTimeout(() => {
            this.isTransitioning = false;
        }, 1000);
    }

    render() {
        // Agregar clase de transición a elementos existentes
        const items = this.container.querySelectorAll('.item');
        items.forEach(item => item.classList.add('transitioning'));
        
        // Pequeño delay para que las transiciones se vean suaves
        setTimeout(() => {
            this.generateItems();
        }, 50);
    }

    // Método para cambiar los elementos del carrusel
    updateItems(newItems) {
        this.items = newItems;
        this.active = 0;
        this.render();
    }


    goToIndex(index) {
        if (index >= 0 && index < this.items.length && !this.isTransitioning) {
            this.active = index;
            this.render();
        }
    }

    getCurrentItem() {
        return this.items[this.active];
    }

    getCurrentIndex() {
        return this.active;
    }
}

const items = [
  "p1.jpg", "p2.jpg", "p3.jpg", "p4.jpg", "p5.jpg",
  "p6.jpg", "p7.jpg", "p8.jpg", "p9.jpg", "p10.jpg"
];

const images = [
  "p1.jpg", "p2.jpg", "p3.jpg", "p4.jpg", "p5.jpg",
  "p6.jpg", "p7.jpg", "p8.jpg", "p9.jpg", "p10.jpg"
];

const links = [
  "https://www.youtube.com/watch?v=3Y-IhY9adC4&t=3s",
  "https://www.youtube.com/watch?v=xPnSbM9xZH0",
  "https://www.youtube.com/watch?v=kRSasuf3JoU",
  "https://www.youtube.com/watch?v=3kAyfsDhO8Q",
  "https://www.youtube.com/watch?v=5G8Hpd0rk4g",
  "https://www.youtube.com/watch?v=qhV7OmTZz8E",
  "https://www.youtube.com/watch?v=FOH5hw0DPog",
  "https://www.youtube.com/watch?v=wmmcPYp3fxc",
  "https://www.youtube.com/watch?v=R0rnjTAsA0o",
  "https://www.youtube.com/watch?v=q1hLWZzgZvU"
];

const trailers = [
  "https://www.youtube.com/embed/KHFSeLUzbqk",
  "https://www.youtube.com/embed/xPnSbM9xZH0",
  "https://www.youtube.com/embed/kRSasuf3JoU",
  "https://www.youtube.com/embed/3kAyfsDhO8Q",
  "https://www.youtube.com/embed/fzQdnAzYg38",
  "https://www.youtube.com/embed/qhV7OmTZz8E",
  "https://www.youtube.com/embed/QbYoYUKt8hI",
  "https://www.youtube.com/embed/wmmcPYp3fxc",
  "https://www.youtube.com/embed/R0rnjTAsA0o",
  "https://www.youtube.com/embed/q1hLWZzgZvU"
];

let carrusel;
let circleInterval = null;

// Fondo
function createFloatingCircle() {
    let sizeW = Math.random() * 22;
    let duration = Math.random() * 3;
    let e = document.createElement("div");
    e.setAttribute("class", "circle");
    
    // Establecer el tamaño del círculo
    e.style.width = 12 + sizeW + "px";
    e.style.height = 12 + sizeW + "px";
    
    // Posición horizontal aleatoria
    e.style.left = Math.random() * window.innerWidth + "px";
    
    // Duración de la animación
    e.style.animationDuration = 2 + duration + "s";
    
    // Colores aleatorios para variedad
    const colors = ['#6a82fb', '#8000FF', '#5f72bd', '#a18cd1'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    e.style.background = randomColor;
    e.style.boxShadow = `
        0 0 10px ${randomColor}, 
        0 0 20px ${randomColor},
        0 0 30px ${randomColor}, 
        0 0 50px ${randomColor}
    `;
    
    // Agregar al body
    document.body.appendChild(e);
    
    // Eliminar el elemento después de que termine la animación
    setTimeout(function() {
        if (document.body.contains(e)) {
            document.body.removeChild(e);
        }
    }, (2 + duration) * 1000);
}

// Función para pausar las burbujas
function pauseCircles() {
    if (circleInterval) {
        clearInterval(circleInterval);
        circleInterval = null;
    }
}

// Función para reanudar las burbujas
function resumeCircles() {
    if (!circleInterval) {
        circleInterval = setInterval(function() {
            createFloatingCircle();
        }, 200);
    }
}

// Inicializar todo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar carrusel
    carrusel = new Carrusel(items, 0);
    console.log('Carrusel inicializado con elemento:', carrusel.getCurrentItem());
    
    // Iniciar los círculos flotantes
    resumeCircles();
    
    // Configurar eventos del modal
    const modal = document.getElementById('trailer-modal');
    const closeModal = document.querySelector('.close-modal');
    const trailerFrame = document.getElementById('trailer-frame');
    
    // Cerrar modal con X
    if (closeModal) {
        closeModal.onclick = function() {
            modal.style.display = 'none';
            trailerFrame.src = '';
            resumeCircles();
        };
    }
    
    // Cerrar modal clicando fuera
    modal.onclick = function(e) {
        if (e.target === this) {
            this.style.display = 'none';
            trailerFrame.src = '';
            resumeCircles();
        }
    };
    
    // Observer para pausar/reanudar círculos cuando se abre/cierra el modal
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                if (modal.style.display === 'flex') {
                    pauseCircles();
                } else if (modal.style.display === 'none' || modal.style.display === '') {
                    resumeCircles();
                }
            }
        });
    });

    observer.observe(modal, {
        attributes: true,
        attributeFilter: ['style']
    });
});

// Flechiyas
function moveLeft() {
    if (carrusel) {
        carrusel.moveLeft();
        console.log('Elemento actual:', carrusel.getCurrentItem());
    }
}

function moveRight() {
    if (carrusel) {
        carrusel.moveRight();
        console.log('Elemento actual:', carrusel.getCurrentItem());
    }
}

// Controles de teclado
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        moveLeft();
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        moveRight();
    } else if (e.key === 'Escape') {
        // Cerrar modal si está abierto
        const modal = document.getElementById('trailer-modal');
        if (modal && modal.style.display === 'flex') {
            modal.style.display = 'none';
            document.getElementById('trailer-frame').src = '';
            resumeCircles();
        }
    }
});

// API pública del carrusel
window.carouselAPI = {
    moveLeft: moveLeft,
    moveRight: moveRight,
    goToIndex: (index) => carrusel && carrusel.goToIndex(index),
    updateItems: (newItems) => carrusel && carrusel.updateItems(newItems),
    getCurrentItem: () => carrusel && carrusel.getCurrentItem(),
    getCurrentIndex: () => carrusel && carrusel.getCurrentIndex(),
    pauseCircles: pauseCircles,
    resumeCircles: resumeCircles
};