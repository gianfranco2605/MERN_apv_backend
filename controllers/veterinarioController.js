import Veterinario from "../models/Veterinario.js";


const registrar = async (req, res, next) => { // Add 'next' as a parameter
    try {
        // Save Veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        res.json(veterinarioGuardado);
    } catch (error) {
        console.log(error);
        // Sending an error response or passing the error to the error handling middleware
        // res.status(500).json({ error: "Something went wrong" });
        next(error); // If you have error handling middleware, this will pass the error to it
    }
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

    
};

const autenticar = async (req,res) => {

    const { email, password } = req.body;
     //User exist
    const usuario = await Veterinario.findOne({email});

    if(!usuario) {
        const error = new Error("El usuario no existe")
        return res.status(404).json({ msg:error.message })
    }

    // User confirm?
    if(!usuario.confirmado) {
        const error = new Error("Tu cuenta no ha sido confirmada")
        return res.status(403).json({msg: error.message})
    }

    // Check password
    if(await usuario.comprobarPassword(password)) {
    // User Auth
    }else {
        const error = new Error("El Password es incorrecto")
        return res.status(403).json({msg: error.message})
    }

};

export {
    registrar,
    perfil,
    confirmar,
    autenticar
}