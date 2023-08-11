import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res, next) => { // Add 'next' as a parameter
    const { email, nombre } = req.body;

    //Prevent duplicate Users
    const existeUsuario = await Veterinario.findOne({ email });
    if(existeUsuario) {
        const error = new Error("Usuario ya registrado");
        return res.status(400).json({ msg: error.message })
    }
    try {
        // Save Veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        //Sending email
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token,
        });

        res.json(veterinarioGuardado);
    } catch (error) {
        console.log(error);
        // Sending an error response or passing the error to the error handling middleware
        // res.status(500).json({ error: "Something went wrong" });
        next(error); // If you have error handling middleware, this will pass the error to it
    }
};
 
const perfil = (req, res) => {
    const { veterinario } = req
    res.json(veterinario);
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
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email:usuario.email,
            token: generarJWT(usuario.id),
        });
    }else {
        const error = new Error("El Password es incorrecto")
        return res.status(403).json({msg: error.message})
    }

};

const olvidePassword = async (req, res) => {
    const { email } = req.body;
    
    // looking in db if the email exist
    const existeVeterinario = await Veterinario.findOne({email})
    
     if( !existeVeterinario ) {
        const error = new Error("El usuario no existe");
        return res.status(400).json({ msg: error.message })
     }

     try {
        // new token
        existeVeterinario.token = generarId();
        await existeVeterinario.save();

        //Enviar Email con las instrucciones
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })

        res.json({ msg: "Hemos enviado una email con las instrucciones" })

     } catch (error) {
        console.log(error);
     }
}

const comprobarToken = async (req, res) => {
    const { token } = req.params
    
    const tokenValido = await Veterinario.findOne({ token });

    if(tokenValido) {
        //Token Valido
        res.json({ msg: "Token Valido" })
    } else {
        const error = new Error("Token no valido");
        return res.status(400).json({ msg: error.message });
    }
}

const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const veterinario = await Veterinario.findOne({ token });
    if(!veterinario) {
        const error = new Error('Hubo un error')
        return res.status(400).json({ msg: error.message })
    }

    try {
        veterinario.token = null
        veterinario.password = password;
        await veterinario.save();
        res.json({ msg: 'Password modificado correctamente' })
        console.log(veterinario);
    } catch (error) {
        console.log(error);
    }
};

const actualizarPassword = async(req, res) => {
    // read data
    const { id } = req.veterinario;
    const { pwd_actual, pwd_nuevo } = req.body
    // Veterinario exist?
    const veterinario = await Veterinario.findById(id);
    if(!veterinario) { 
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message }); 
    }
    // Trust password
    if( await veterinario.comprobarPassword(pwd_actual)) {
        // Save new password
        veterinario.password = pwd_nuevo;
        await veterinario.save();
        res.json({ msg: 'Password Almacenado Correctamente' })
    }else {
        const error = new Error('Password actual es incorrecto');
        return res.status(400).json({ msg: error.message }); 
    }
    
}

const actualizarPerfil = async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id);
    if(!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message })
    }
    
    const { email } = req.body;
    if(veterinario.email !== req.body.email) {
        const existeEmail = await Veterinario.findOne({email});
        if(existeEmail) {
            const error = new Error("Ese Email ya esta en uso");
            return res.status(400).json({ msg: error.message })
        }
    }

    try {
        veterinario.nombre = req.body.nombre;
        veterinario.email = req.body.email;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono;

        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado);
    } catch (error) {
        console.log(error);
    }
};
 
export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword,
}