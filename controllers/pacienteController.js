import Paciente from "../models/Paciente.js";

const agregarPacientes = async (req, res) => {

    const paciente = new Paciente(req.body);
    paciente.veterinario = req.veterinario._id
    
    try {
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado)
    } catch (error) {
        console.log(error);
    }

};

const obtenerPacientes = async (req, res) => {
    const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario);

    res.json(pacientes);

}

export { agregarPacientes, obtenerPacientes }