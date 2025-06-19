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
            this.createItem(this.items[index], level);
        }
    }

    createItem(content, level) {
        const item = document.createElement('div');
        item.className = `item level${level} noselect`;
        item.innerHTML = `<img src="${content}" alt="Imagen ${content.split('.')[0]}">`;
        
        // Agregar evento click para seleccionar elemento
        item.addEventListener('click', () => {
            if (!this.isTransitioning && level !== 0) {
                if (level > 0) {
                    // Elemento está a la izquierda, mover hacia la derecha
                    for (let i = 0; i < level; i++) {
                        this.moveRight();
                    }
                } else {
                    // Elemento está a la derecha, mover hacia la izquierda
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