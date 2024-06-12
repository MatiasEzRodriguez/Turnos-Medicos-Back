// routes/products.js
const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://postgres:admin@localhost:5432/turnos_medicos')


// Define a route
router.get('/', (req, res) => {
    db.any('SELECT "Turns".turn_id as "turnId", "Turns".date, "Patients".name, "Patients"."lastName", "Patients".dni FROM public."Turns" JOIN public."Patients" ON "Turns".patient_id = "Patients".patient_id;')
        .then((data) => {
            res.status(200).json(data); // Enviar los datos como respuesta
        })
        .catch((error) => {
            console.log('ERROR:', error);
            res.status(500).json({ error: 'Error al obtener datos de la base de datos' }); // Manejar el error y enviar una respuesta de error
            // return; // Detener la ejecución en caso de error
        });
});

router.post('/', (req, res) => {
    const { date, id } = req.body; // Obtener datos del turno del cuerpo de la solicitud
    // Validar si se recibieron los datos necesarios
    if (!date || !id) {
        return res.status(400).json({ message: 'Datos insuficientes' });
    }

    db.one('INSERT INTO public."Turns"(date, patient_id) VALUES($1, $2) RETURNING patient_id as "patientId", turn_id as "turnId"', [date, id])
        .then(data => {
            res.status(200).json(data);
            // res.status(200).json({ message: 'Turno agregado correctamente' });
        })
        .catch(error => {
            console.log('ERROR:', error);
            res.status(500).json({ error: 'Error al obtener datos de la base de datos' }); // Manejar el error y enviar una respuesta de error
            return;
        });
});

router.put('/:id', (req, res) => {
    const turnId = parseInt(req.params.id); // Obtener el ID del turno a editar
    const { date, id } = req.body; // Obtener los nuevos datos del turno
    db.one('UPDATE public."Turns" SET date=$1, patient_id=$2 WHERE turn_id=$3 RETURNING turn_id as "turnId", date, patient_id as "patientId"', [date, id, turnId])
        .then((data) => {
            res.status(200).json(data); // Enviar los datos como respuesta
        })
        .catch((error) => {
            console.log('ERROR:', error);
            res.status(500).json({ error: 'Error al actualizar el paciente de la base de datos' }); // Manejar el error y enviar una respuesta de error
            return; // Detener la ejecución en caso de error
        });
});

router.delete('/:id', (req, res) => {
    const turnId = parseInt(req.params.id); // Obtener el ID del turno a eliminar

    db.one('DELETE FROM public."Turns" WHERE turn_id=$1 RETURNING TRUE', [turnId])
        .then((data) => {
            res.status(200).json({ message: 'Turno eliminado correctamente' });
        })
        .catch((error) => {
            console.log('ERROR:', error);
            res.status(500).json({ error: 'Error al eliminar el turno de la base de datos' }); // Manejar el error y enviar una respuesta de error
        });
});



router.get('/101', (req, res) => {
    res.send('this is product 101 route');// http://localhost:3000/product/101
});

router.get('/102', (req, res) => {
    res.send('this is product 102 route');//  http://localhost:3000/product/102
});

// export the router module so that server.js file can use it
module.exports = router;