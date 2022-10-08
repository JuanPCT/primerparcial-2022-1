// Variables
const carrito = document.querySelector('#carrito');
const listaCursos = document.querySelector('#lista-cursos');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const comprar = document.querySelector('#comprar');
let articulosCarrito = [];

function mostrarCocteles() {
     let url = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic';

     fetch(url)
          .then(response => response.json())
          .then(data => mostrarData(data))
          .catch(error => console.log(error));

     const mostrarData = (data) => {

          let body = ''
          for (let i = 0; i < data.drinks.length; i++) {
               body += `<div class="card mt-5" style="width: 18rem;">
                                   <img class="card-img-top" src="${data.drinks[i].strDrinkThumb}" alt="Card image cap">
                                   <div class="info-card">
                                        <h4>${data.drinks[i].strDrink}</h4>
                                        <p>${data.drinks[i].idDrink}</p>
                                        <p class="precio"><span class="u-pull-right ">$20.000</span></p>
                                        <a href="#" class="u-full-width button-primary button input agregar-carrito" data-id=${i}>Agregar</a>
                                   </div>
                              </div> `
          }
          document.getElementById('mostrar').innerHTML = body
     }
}
mostrarCocteles();

// Listeners
cargarEventListeners();

function cargarEventListeners() {
     // Dispara cuando se presiona "Agregar Carrito"
     listaCursos.addEventListener('click', agregarCurso);
     // Cuando se elimina un curso del carrito
     carrito.addEventListener('click', eliminarCurso);
     // Al Vaciar el carrito
     vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
     // Ir a comprar
     comprar.addEventListener('click', function(){
          window.location.href = "comprar.html";
     });
     // NUEVO: Contenido cargado
     document.addEventListener('DOMContentLoaded', () => {
          articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
          // console.log(articulosCarrito);
          carritoHTML();
     });
}


// Función que añade el curso al carrito
function agregarCurso(e) {
     e.preventDefault();
     // Delegation para agregar-carrito
     if (e.target.classList.contains('agregar-carrito')) {
          const curso = e.target.parentElement.parentElement;
          // Enviamos el curso seleccionado para tomar sus datos
          leerDatosCurso(curso);
     }
}

// Lee los datos del curso
function leerDatosCurso(curso) {
     const infoCurso = {
          imagen: curso.querySelector('img').src,
          titulo: curso.querySelector('h4').textContent,
          precio: curso.querySelector('.precio span').textContent,
          id: curso.querySelector('p').textContent,
          cantidad: 1
     }
     console.log(infoCurso);

     if (articulosCarrito.some(curso => curso.id === infoCurso.id)) {
          const cursos = articulosCarrito.map(curso => {
               if (curso.id === infoCurso.id) {
                    let cantidad = parseInt(curso.cantidad);
                    cantidad++
                    curso.cantidad = cantidad;
                    return curso;
               } else {
                    return curso;
               }
          })
          articulosCarrito = [...cursos];
     } else {
          articulosCarrito = [...articulosCarrito, infoCurso];
     }

     console.log(articulosCarrito);

     // console.log(articulosCarrito)
     carritoHTML();
}

// Elimina el curso del carrito en el DOM
function eliminarCurso(e) {
     e.preventDefault();
     if (e.target.classList.contains('borrar-curso')) {
          // e.target.parentElement.parentElement.remove();
          const curso = e.target.parentElement.parentElement;
          const cursoId = curso.querySelector('a').getAttribute('data-id');

          // Eliminar del arreglo del carrito
          articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);

          carritoHTML();
     }
}


// Muestra el curso seleccionado en el Carrito
function carritoHTML() {
     vaciarCarrito();
     articulosCarrito.forEach(curso => {
          const row = document.createElement('tr');
          row.innerHTML = `
               <td>  
                    <img src="${curso.imagen}" width=100>
               </td>
               <td>${curso.titulo}</td>
               <td>${curso.precio}</td>
               <td>${curso.cantidad} </td>
               <td>
                    <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
               </td>
          `;
          contenedorCarrito.appendChild(row);
     });
     // NUEVO:
     sincronizarStorage();
}
// NUEVO: 
function sincronizarStorage() {
     localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}
// Elimina los cocteles del carrito
function vaciarCarrito() {
     while (contenedorCarrito.firstChild) {
          contenedorCarrito.removeChild(contenedorCarrito.firstChild);
     }
}
