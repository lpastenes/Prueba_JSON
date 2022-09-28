class Producto {
    constructor(id, imgUrl, titulo, precio) {
        this.id = id        
        this.imgUrl = imgUrl
        this.titulo = titulo
        this.precio = precio
    }
}

let baseDatos = [];
baseDatos.push(new Producto(1, "./img/airport.jpg", "Aeropuerto - Chicureo", 50000) )
baseDatos.push(new Producto(2, "./img/tour_santiago.jpg", "City Tour Santiago", 40000) )
baseDatos.push(new Producto(3, "./img/lan-chile.jpg", "Chicureo - Aeropuerto", 40000) )
baseDatos.push(new Producto(4, "./img/valpo.jpg", "Tour Valparaiso", 40000) )
baseDatos.push(new Producto(5, "./img/vina-del-mar2.jpg", "Tour Viña del Mar", 40000) )
baseDatos.push(new Producto(6, "./img/hotel.jpg", "Aeropuerto - Hotel", 50000) )
baseDatos.push(new Producto(7, "./img/valle-nevado.jpg", "Aeropuerto - Valle Nevado", 50000) )
baseDatos.push(new Producto(8, "./img/valpo.jpg", "Aeropuerto - Valparaíso", 50000) )
baseDatos.push(new Producto(9, "./img/vina-del-mar.jpg", "Aeropuerto - Viña del Mar", 40000) )
baseDatos.push(new Producto(10, "./img/beach.jpg", "Tour Isla Negra", 40000) )

//let carrito = {};


let carrito = JSON.parse(localStorage.getItem("Carro")) || {}; // RECUPERAR DATOS DEL LOCAL STORAGE AL CARRITO DE COMPRA



//DOM
const btnCarro = document.querySelector('#carroCompra');
const card = document.querySelector('#tarjeta');
const templateCard = document.querySelector('#template-card').content;
const templateCarrito = document.getElementById('template-carrito').content;
const templateCarritoFooter = document.getElementById('template-carrito-footer').content;
const items = document.getElementById('items-carro');
const footerItem = document.getElementById('footer');
const fragmento = document.createDocumentFragment();



//FUNCION CARD DE PRODUCTOS
function render(baseDatos) {
    card.innerHTML = ""
    baseDatos.forEach((baseDatos) => {
        templateCard.querySelector('img').setAttribute("src", baseDatos.imgUrl);
        templateCard.querySelector('.card-title').textContent = baseDatos.titulo;
        templateCard.querySelector('.card-text').textContent = baseDatos.precio;
        templateCard.querySelector('.btn-warning').dataset.id = baseDatos.id;        
        const clone = templateCard.cloneNode(true);
        fragmento.appendChild(clone);
    });
    card.appendChild(fragmento);
};

//VISUALIZAR TODOS LOS PRODUCTOS
render(baseDatos);


//FILTROS ARRAY
const btnFiltro1 = document.querySelector('#option1')
btnFiltro1.addEventListener('click', () => {
    render(baseDatos);
});

const btnFiltro2 = document.querySelector('#option2')
btnFiltro2.addEventListener('click', () => {
    const resultado1 = baseDatos.filter((el) => el.titulo.includes('Aeropuerto'));
    render(resultado1);
});

const btnFiltro3 = document.querySelector('#option3')
btnFiltro3.addEventListener('click', () => {
    const resultado2 = baseDatos.filter((el) => el.titulo.includes('Tour'));
    render(resultado2);
});

//PRESIONAR BTN CARRO DE COMPRA
btnCarro.addEventListener('click', () => {  
    renderCarrito();  
    renderFooter(); 
});

//PRESIONAR BTN COMPRAR EN DIV DE LAS CARD
card.addEventListener('click', e => {    
    addCarrito(e);
});

//BOTON MAS Y MENOS
items.addEventListener('click', e => {
    btnPasajero(e);
})


const addCarrito = e => {
    if (e.target.classList.contains('btn-warning')) {
        setCarrito(e.target.parentElement);        
    };
    //e.stopPropagation()
};

// CREACION DE LOS ITEM DEL CARRITO
const setCarrito = item => {
    //console.log(item)    
    const productoCarro = {
        id: item.querySelector('.btn-warning').dataset.id,
        titulo: item.querySelector('.card-title').textContent,
        precio: item.querySelector('.card-text').textContent,
        cantidad: 1
    }
    //console.log(productoCarro)
    if (carrito.hasOwnProperty(productoCarro.id)) { // SI EXISTE EL PRODUCTO EN EL CARRITO SE SUMA 1
        productoCarro.cantidad = carrito[productoCarro.id].cantidad + 1   
        //console.log(productoCarro)     
    }
    carrito[productoCarro.id] = {...productoCarro};    
    renderCarrito();      
}

// VISULAIZAR ELEMENTOS EN EL CARRITO 
    const renderCarrito = () => {   
    items.innerHTML = ''     

    Object.values(carrito).forEach(productoCarro => {        
        templateCarrito.querySelector('th').textContent = productoCarro.id
        templateCarrito.querySelectorAll('td')[0].textContent = productoCarro.titulo
        templateCarrito.querySelectorAll('td')[1].textContent = productoCarro.cantidad
        templateCarrito.querySelector('.btn-secondary').dataset.id = productoCarro.id
        templateCarrito.querySelector('.btn-warning').dataset.id = productoCarro.id
        templateCarrito.querySelector('span').textContent = productoCarro.precio * productoCarro.cantidad
        
        const clone = templateCarrito.cloneNode(true)
        fragmento.appendChild(clone)
    })
    
    items.appendChild(fragmento)
    renderFooter();
    guardaLocal();   
} 


const renderFooter = () => {
    footerItem.innerHTML = "";
    
    if (Object.keys(carrito).length === 0) {
        footerItem.innerHTML = `<th class="text-center display-4" scope="row" colspan="5">Carrito vacío</th>`
        return
    }
    
    // sumar cantidad y sumar totales
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)
    

    templateCarritoFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateCarritoFooter.querySelector('span').textContent = nPrecio

    const clone = templateCarritoFooter.cloneNode(true)
    fragmento.appendChild(clone)

    footerItem.appendChild(fragmento)
    
    //BTN VACIAR CARRITO
    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {              
        carrito = {};
        renderCarrito();
        guardaLocal()
    })

};

//AUMENTAR Y DESMINUIR CANTIDAD
const btnPasajero = e => {    
    if (e.target.classList.contains('btn-warning')) {
        const productoCarro = carrito[e.target.dataset.id]
        productoCarro.cantidad = carrito[e.target.dataset.id].cantidad + 1        
        carrito[e.target.dataset.id] = {...productoCarro}         
        renderCarrito()
    }

    if (e.target.classList.contains('btn-secondary')) {
        const productoCarro = carrito[e.target.dataset.id]
        productoCarro.cantidad = carrito[e.target.dataset.id].cantidad - 1
        if (productoCarro.cantidad === 0) {
            delete carrito[e.target.dataset.id]            
        }
        renderCarrito()        
    }
    e.stopPropagation()
}

// JSON Local Storage

function guardaLocal() {
    localStorage.setItem("Carro", JSON.stringify(carrito))
}






