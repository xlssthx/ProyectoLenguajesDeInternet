class Carousel {
    constructor(items, activeIndex = 0) {
        this.items = items;
        this.active = activeIndex;
        this.container = document.querySelector('.carousel-items');
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

        // Crea la imagen
        const img = document.createElement('img');
        img.src = images[index];
        img.alt = `Película ${index + 1}`;
        img.className = "carousel-img";
        img.setAttribute('data-trailer', trailers[index]);


        item.appendChild(img);        // Evento para abrir el modal al hacer click en la imagen
        img.addEventListener('click', function(e) {
            e.stopPropagation();
            const trailerUrl = this.getAttribute('data-trailer');
            document.getElementById('trailer-frame').src = trailerUrl;
            document.getElementById('trailer-modal').style.display = 'flex';
        });        // Evento para abrir el modal al hacer click en la imagen

        // Evento para mover el carrusel al hacer click en la tarjeta (pero NO en la imagen)
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
        
        // Resetear el flag después de la transición
        setTimeout(() => {
            this.isTransitioning = false;
        }, 1000);
    }

    moveRight() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.active = (this.active + 1) % this.items.length;
        this.render();
        
        // Resetear el flag después de la transición
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

    // Método para ir a un índice específico
    goToIndex(index) {
        if (index >= 0 && index < this.items.length && !this.isTransitioning) {
            this.active = index;
            this.render();
        }
    }

    // Método para obtener el elemento activo current
    getCurrentItem() {
        return this.items[this.active];
    }

    // Método para obtener el índice activo current
    getCurrentIndex() {
        return this.active;
    }
}

// Configuración inicial
const items = [
  "p1.jpg",
  "p2.jpg",
  "p3.jpg",
  "p4.jpg",
  "p5.jpg",
  "p6.jpg",
  "p7.jpg",
  "p8.jpg",
  "p9.jpg",
  "p10.jpg"
];
let carousel;

// Inicializar el carrusel cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    carousel = new Carousel(items, 0);
    
    // Mostrar información del elemento actual (opcional)
    console.log('Carrusel inicializado con elemento:', carousel.getCurrentItem());
    
    document.querySelector('.close-modal').onclick = function() {
        document.getElementById('trailer-modal').style.display = 'none';
        document.getElementById('trailer-frame').src = '';
    };

    document.getElementById('trailer-modal').onclick = function(e) {
        if (e.target === this) {
            this.style.display = 'none';
            document.getElementById('trailer-frame').src = '';
        }
    };
});

// Funciones globales para los botones
function moveLeft() {
    if (carousel) {
        carousel.moveLeft();
        console.log('Elemento actual:', carousel.getCurrentItem());
    }
}

function moveRight() {
    if (carousel) {
        carousel.moveRight();
        console.log('Elemento actual:', carousel.getCurrentItem());
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
        // Parar autoplay si está activo
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
            console.log('Autoplay detenido');
        }
    }
});

// Autoplay (descomenta para activar)
let autoplayInterval = null;

/*
// Función para iniciar autoplay
function startAutoplay(intervalTime = 3000) {
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
    }
    
    autoplayInterval = setInterval(() => {
        moveRight();
    }, intervalTime);
    
    console.log('Autoplay iniciado');
}

// Función para detener autoplay
function stopAutoplay() {
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
        console.log('Autoplay detenido');
    }
}

// Pausar autoplay cuando el mouse está sobre el carrusel
document.getElementById('carousel').addEventListener('mouseenter', stopAutoplay);
document.getElementById('carousel').addEventListener('mouseleave', () => startAutoplay(3000));

// Iniciar autoplay automáticamente
setTimeout(() => {
    startAutoplay(3000);
}, 1000);
*/

// Funciones adicionales para uso externo
window.carouselAPI = {
    moveLeft: moveLeft,
    moveRight: moveRight,
    goToIndex: (index) => carousel && carousel.goToIndex(index),
    updateItems: (newItems) => carousel && carousel.updateItems(newItems),
    getCurrentItem: () => carousel && carousel.getCurrentItem(),
    getCurrentIndex: () => carousel && carousel.getCurrentIndex()
};

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


// Cerrar el modal al hacer clic en la X
document.querySelector('.close-modal').onclick = function() {
    document.getElementById('trailer-modal').style.display = 'none';
    document.getElementById('trailer-frame').src = '';
};

// Cerrar el modal al hacer clic fuera del contenido
document.getElementById('trailer-modal').onclick = function(e) {
    if (e.target === this) {
        this.style.display = 'none';
        document.getElementById('trailer-frame').src = '';
    }
};
