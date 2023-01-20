
//VARIABLES
const listaCursos = document.querySelector("#lista-cursos")
const contenedorCarrito = document.querySelector("#lista-carrito tbody")
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito")
let arrayArticulosCarrito = [];

cargarEventListeners();



function cargarEventListeners(){

    //muestra los cursos del LocalStorage
    document.addEventListener('DOMContentLoaded',() => {
        arrayArticulosCarrito = JSON.parse(localStorage.getItem('cursos')) || [];
        carritoHTML();
    })


    //se agrega un curso cuando se presiona "agregar al carrito"
    listaCursos.addEventListener('click',agregarCurso);

    //elimina cursos del carrito
    contenedorCarrito.addEventListener('click',eliminarCurso);

    //vaciar carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        arrayArticulosCarrito = []; //reseteamos el arreglo
        limpiarHTML(); //eliminamos todo el html
    });
}

//funciones
function eliminarCurso(event){
    event.preventDefault();
    if(event.target.classList.contains('borrar-curso')){
        let idCursoAborrar = event.target.getAttribute('data-id');

        //elimina el curso del arrayArticulosCarrito por el ID del curso
       eliminarUnCurso(idCursoAborrar);
    }
    carritoHTML();
}


function agregarCurso(event){
    event.preventDefault();
    if(event.target.classList.contains('agregar-carrito')){
        const cursoSeleccionado = event.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);
    }
    
}


//Lee el contenido del html al que le damos click y extrae la info del curso
function leerDatosCurso(curso){
    //crear objeto con el curso actual
    const infoCurso = {
        imagen : curso.querySelector('img').src,
        titulo : curso.querySelector('h4').textContent,
        precio : curso.querySelector('.precio span').textContent,
        id : curso.querySelector('a').getAttribute('data-id'),
        cantidad : 1
        }
    //verificar si un articulo existe en el carrito
    const existe = arrayArticulosCarrito.some(curso => curso.id === infoCurso.id)
    if(existe){ //actualizamos cantidad
        arrayArticulosCarrito.forEach((curso)=>{
            if(curso.id===infoCurso.id){
                curso.cantidad++;
            }
        })
    }else{ //agregamos el curso al carrito
        arrayArticulosCarrito.push(infoCurso);  //se puede usar spread operator : articuloCarrito = [...articuloCarrito,infocurso]
    }
    carritoHTML();
}




//Muestra el carrito de compras en el HTML
function carritoHTML(){
    //limpia el html
    limpiarHTML();
    //recorre el carrito de compras y genera el HTML
    arrayArticulosCarrito.forEach((curso) => {
        const {imagen , titulo, precio, cantidad, id} = curso;
        const row = document.createElement('tr');
        row.innerHTML = `  
        <td>
            <img src ="${imagen}" width="100">
        </td>
        <td>${titulo}</td>
        <td>${precio}</td>
        <td>${cantidad}</td>
        <td>
            <a href="#" class="borrar-curso" data-id="${id}"> X </a>
        </td>
         `
         //agrega el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row);
    })
  
    //sincroniza LocalStorage
    sincronizarLocalStorage();
}

function sincronizarLocalStorage(){
    localStorage.setItem('cursos',JSON.stringify(arrayArticulosCarrito))

}


function limpiarHTML(){
    //limpiar HTML FORMA LENTA:
    //contenedorCarrito.innerHTML = '';
    //FORMA RAPIDA
    while(contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}


function eliminarUnCurso(idCursoAborrar){
    arrayArticulosCarrito.forEach((curso =>{

        if(idCursoAborrar === curso.id){
            if(curso.cantidad > 1){ //verifica si la cantidad es mayor a uno
                curso.cantidad--; //le resta uno
            }else{
                //crea un nuevo array pero sin ese curso
                arrayArticulosCarrito = arrayArticulosCarrito.filter(curso => curso.id !== idCursoAborrar);
            }
        }


    }))

}