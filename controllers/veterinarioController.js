const registrar = (req, res) => {

    console.log(req.body);
    const { nombre, email, password } = req.body;

    console.log(nombre);
    console.log(email);
    console.log(password);


    res.json({
        msg: "Registrando usuario"
    });
};
 
const perfil = (req, res) => {
    res.json({
        msg: "Mostrando perfil"
    });
}

export {
    registrar,
    perfil
}