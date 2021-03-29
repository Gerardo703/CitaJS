import { eliminarCita, cargarEdicion } from '../funciones.js';
import { tablaCitas, heading } from '../selectores.js'
 
class UI {

    constructor({citas}) {
        this.textoHeading(citas);
    }

    imprimirAlerta(mensaje, tipo) {
        // Crea el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');
        
        // Si es de tipo error agrega una clase
        if(tipo === 'error') {
             divMensaje.classList.add('alert-danger');
        } else {
             divMensaje.classList.add('alert-success');
        }

        // Mensaje de error
        divMensaje.textContent = mensaje;

        // Insertar en el DOM
        document.querySelector('#contenido').insertBefore( divMensaje , document.querySelector('.agregar-cita'));

        // Quitar el alert despues de 3 segundos
        setTimeout( () => {
            divMensaje.remove();
        }, 3000);
   }

   imprimirCitas({citas}) { // Se puede aplicar destructuring desde la función...
       
        this.limpiarHTML();

        this.textoHeading(citas);

        citas.forEach(cita => {
            const {mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

            const tablaHTML = document.createElement('tr');
            tablaHTML.dataset.id = id;

            // Scripting 

            tablaHTML.innerHTML = `
            <td>${mascota}</td>
            <td>${propietario}</td>
            <td>${telefono}</td>
            <td>${fecha}</td>
            <td>${hora}</td>
            <td>${sintomas}</td>
            `;

        
            // Agregar un botón de eliminar...
            const btnEliminar = document.createElement('button');
            btnEliminar.onclick = () => eliminarCita(id); // añade la opción de eliminar
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2', 'mt-2');
            btnEliminar.innerHTML = 'Eliminar'

            // Añade un botón de editar...
            const btnEditar = document.createElement('button');
            btnEditar.onclick = () => cargarEdicion(cita);

            btnEditar.classList.add('btn', 'btn-info', 'mt-2');
            btnEditar.innerHTML = 'Editar'

            tablaHTML.appendChild(btnEliminar);
            tablaHTML.appendChild(btnEditar);

            tablaCitas.appendChild(tablaHTML);
            
        });    
   }

   textoHeading(citas) {
        if(citas.length > 0 ) {
            heading.textContent = 'Administra tus Citas ';
        } else {
            heading.textContent = 'Sin Citas';
        }
    }

   limpiarHTML() {
        while(tablaCitas.firstChild) {
            tablaCitas.removeChild(tablaCitas.firstChild);
        }
   }
}

export default UI;