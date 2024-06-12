// routes/users.js
const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://postgres:admin@localhost:5432/turnos_medicos')

var pacientes = [
  { id: 1, name: 'Juan', lastName: 'Gonzalez', dni: 11222333, mail: 'juangonzalez@gmail.com' },
  { id: 2, name: 'María', lastName: 'Garcia', dni: 7888999, mail: 'mariagarcia@gmail.com' },
  { id: 3, name: 'Pedro', lastName: 'Pascal', dni: 16151515, mail: 'pedropascal@gmail.com' },
];
// Define a route
router.get('/', (req, res) => {
  db.any('SELECT patient_id as id, name, "lastName", dni, mail FROM public."Patients"')
    .then((data) => {
      res.status(200).json(data); // Enviar los datos como respuesta
    })
    .catch((error) => {
      console.log('ERROR:', error);
      res.status(500).json({ error: 'Error al obtener datos de la base de datos' }); // Manejar el error y enviar una respuesta de error
      return; // Detener la ejecución en caso de error
    });
});


// Ruta para agregar un nuevo paciente (POST)
router.post('/', (req, res) => {
  const { name, lastName, dni, mail } = req.body; // Obtener datos del paciente del cuerpo de la solicitud

  // Validar si se recibieron los datos necesarios
  if (!name || !lastName || !dni || !mail) {
    return res.status(400).json({ message: 'Se requiere nombre, apellido, dni y mail del paciente' });
  }

  db.one('INSERT INTO public."Patients"(name, "lastName", dni, mail) VALUES($1, $2, $3, $4) RETURNING patient_id as id', [name, lastName, dni, mail])
    .then(data => {
      res.status(200).json({ message: 'Paciente agregado correctamente' });
      // res.status(200).json(data);
    })
    .catch(error => {
      console.log('ERROR:', error);
      res.status(500).json({ error: 'Error al obtener datos de la base de datos' }); // Manejar el error y enviar una respuesta de error
      return;
    });
  // let newPatientId = generateId();
  // // Crear un nuevo objeto Paciente y agregarlo al array de pacientes
  // const nuevoPaciente = { id: newPatientId, name, lastName, dni, mail };
  // pacientes.push(nuevoPaciente);

  // // Enviar respuesta con el nuevo paciente agregado
  // res.status(201).json(nuevoPaciente);
});

// Ruta para editar un paciente existente (PUT)
router.put('/:id', (req, res) => {
  const patientId = parseInt(req.params.id); // Obtener el ID del paciente a editar
  const { name, lastName, dni, mail } = req.body; // Obtener los nuevos datos del paciente
  db.one('UPDATE public."Patients" SET name=$1, "lastName"=$2, dni=$3, mail=$4 WHERE patient_id=$5 RETURNING patient_id as id, name, "lastName", dni, mail', [name, lastName, dni, mail, patientId])
    .then((data) => {
      res.status(200).json(data); // Enviar los datos como respuesta
    })
    .catch((error) => {
      console.log('ERROR:', error);
      res.status(500).json({ error: 'Error al actualizar el paciente de la base de datos' }); // Manejar el error y enviar una respuesta de error
      return; // Detener la ejecución en caso de error
    });

  // // Buscar el paciente por su ID en el array de pacientes
  // const pacienteIndex = pacientes.findIndex(paciente => paciente.id === patientId);

  // // Validar si el paciente existe
  // if (pacienteIndex === -1) {
  //   return res.status(404).json({ message: 'Paciente no encontrado' });
  // }

  // // Actualizar los datos del paciente
  // pacientes[pacienteIndex].name = name || pacientes[pacienteIndex].name;
  // pacientes[pacienteIndex].lastName = lastName || pacientes[pacienteIndex].lastName;
  // pacientes[pacienteIndex].dni = dni || pacientes[pacienteIndex].dni;
  // pacientes[pacienteIndex].mail = mail || pacientes[pacienteIndex].mail;

  // res.status(200).json(pacientes[pacienteIndex]); // Enviar el paciente actualizado como respuesta
});

// Ruta para borrar un paciente (DELETE)
router.delete('/:id', (req, res) => {
  const patientId = parseInt(req.params.id); // Obtener el ID del paciente a eliminar

  db.one('DELETE FROM public."Patients" WHERE patient_id=$1 RETURNING patient_id as id, name, "lastName", dni, mail', [patientId])
    .then((data) => {
      res.status(200).json(data); // Enviar los datos como respuesta
      res.status(200).json({ message: 'Paciente eliminado correctamente' });
    })
    .catch((error) => {
      console.log('ERROR:', error);
      res.status(500).json({ error: 'Error al eliminar el paciente de la base de datos' }); // Manejar el error y enviar una respuesta de error
    });
  // // Filtrar el array de pacientes para obtener el array sin el paciente a eliminar
  // pacientes = pacientes.filter(paciente => paciente.id !== patientId);

  // res.status(200).json({ message: 'Paciente eliminado correctamente' });
});


router.get('/101', (req, res) => {
  res.send('this is user 101 route');// this gets executed when user visit http://localhost:3000/user/101
});

router.get('/102', (req, res) => {
  res.send('this is user 102 route');// this gets executed when user visit http://localhost:3000/user/102
});

function generateId() {
  // Encuentra el ID máximo actual en el array de objetos
  const maxId = pacientes.reduce((max, obj) => (obj.id > max ? obj.id : max), 0);
  // Incrementa el ID máximo en 1 para generar un nuevo ID único
  return maxId + 1;
}

// export the router module so that server.js file can use it
module.exports = router;
