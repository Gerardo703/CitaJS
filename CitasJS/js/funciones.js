import Citas from './Clases/Citas.js';
import UI from './Clases/UI.js';



import { 
    mascotaInput, 
    propietarioInput, 
    telefonoInput,
    fechaInput, 
    horaInput, 
    sintomasInput, 
    formulario 
} from './selectores.js';



const administrarCitas = new Citas();
const ui = new UI(administrarCitas);

let editando = false;

const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora:'',
    sintomas: ''
}

export let DB;

export function datosCita(e) {
     //console.log(e.target.name) // Obtener el Input
     citaObj[e.target.name] = e.target.value;
}

export function nuevaCita(e) {
    e.preventDefault();

    const {mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;
    
    // Validar
    if( mascota === '' || propietario === '' || telefono === '' || fecha === ''  || hora === '' || sintomas === '' ) {
        ui.imprimirAlerta('Todos los campos son Obligatorios', 'error')

        return;
    }

    if(editando) {
        // Estamos editando
        administrarCitas.editarCita( {...citaObj} );

        // Editar el IndexedDB
        const transaction = DB.transaction(['citas'], 'readwrite');
        const objectStore = transaction.objectStore('citas');
        
        objectStore.put(citaObj);

        transaction.oncomplete = () => {
            ui.imprimirAlerta('Guardado Correctamente');

            formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

            editando = false;
        }

        

    } else {
        // Nuevo Registrando

        // Generar un ID único
        citaObj.id = Date.now();
        
        // Añade la nueva cita
        administrarCitas.agregarCita({...citaObj});

        // Insertar en la base de datos IndexedDB
        const transaction =  DB.transaction(['citas'], 'readwrite');

        // Habilitar el objectstore
        const objectStore = transaction.objectStore('citas');

        // Insertarlo en DB
        objectStore.add(citaObj);

        transaction.oncomplete = () => {
            console.log('Cita agregada');

            // Mostrar mensaje de que todo esta bien...
            ui.imprimirAlerta('Se agregó correctamente');
        }

    }


    // Imprimir el HTML de citas
    ui.imprimirCitas();

    // Reinicia el objeto para evitar futuros problemas de validación
    reiniciarObjeto();

    // Reiniciar Formulario
    formulario.reset();

}

export function reiniciarObjeto() {
    // Reiniciar el objeto
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}


export function eliminarCita(id) {
    const transaction = DB.transaction(['citas'], 'readwrite');
    const objectStore = transaction.objectStore('citas');

    objectStore.delete(id);

    transaction.oncomplete = () => {
        ui.imprimirCitas();
        ui.imprimirAlerta('Cita eliminada correctamente');
    }

    transaction.onerror = () => {
        console.log('Hubo un error');
    }

}

export function cargarEdicion(cita) {

    const {mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    // Reiniciar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    // Llenar los Inputs
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editando = true;

}

export function crearDB(){
    // Crear la base de datos
    const crearDB = window.indexedDB.open('citas', 1);

    // Verificar si hay errores
    crearDB.onerror = () => {
        console.log('Hubo un error en la creación de la DB');
    }

    // Si todo está ok
    crearDB.onsuccess = () => {
        console.log('Base de datos creada correctamente');

        DB = crearDB.result;

        // Mostramos las citas al cargar { Pero con IDB lista}
        ui.imprimirCitas();
    }

    // Configuración del Schema de DB
    crearDB.onupgradeneeded = e => {
        const db = e.target.result;

        const objectStore = db.createObjectStore('citas', {
            keyPath: 'id',
            autoIncrement: true
        });

        // Definir las columnas
        objectStore.createIndex('mascota', 'mascota', { unique: false });
        objectStore.createIndex('propietario', 'propietario', { unique: false });
        objectStore.createIndex('telefono', 'telefono', { unique: false });
        objectStore.createIndex('fecha', 'fecha', { unique: false });
        objectStore.createIndex('hora', 'hora', { unique: false });
        objectStore.createIndex('sintomas', 'sintomas', { unique: false });
        objectStore.createIndex('id', 'id', { unique: false });

        console.log('Base de datos creada');
    }

}