import Veterinario from "../models/Veterinario.js";


const registrar = async (req, res) => {

    // const { nombre, email, password } = req.body;

    try {
        //Save Veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        res.json(veterinarioGuardado);
    } catch (error) {
        console.log(error);
    }

    res.json({
        msg: "Registrando usuario"
    });
};
 
const perfil = (req, res) => {
    res.json({
        msg: "Mostrando perfil"
    });
};

const confirmar = async (req, res) => {
    const { token } = req.params;

    const usuarioConfirmar = await Veterinario.findOne({token});

    if( !usuarioConfirmar ) {
        const error = new Error("Token no valido")
        return res.status(404).json({ msg:error.message })
    }
    
    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();
        res.json({msg: "Usuario confirmado correctamente"})
    } catch (error) {
        console.log(error);
    }

    
}

export {
    registrar,
    perfil,
    confirmar
}