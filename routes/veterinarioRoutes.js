import express  from "express";
import { registrar, perfil, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword, actualizarPerfil, actualizarPassword } from '../controllers/veterinarioController.js';
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

// public routes
router.post('/', registrar);
// express permette params dinamico :
router.get('/confirmar/:token', confirmar);

router.post('/login', autenticar);

// Password reset
router.post('/olvide-password', olvidePassword);
// router.get('/olvide-password/:token', comprobarToken);
// router.post('/olvide-password/:token', nuevoPassword);
// Another sintax
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);


// private routes
router.get('/perfil',checkAuth, perfil);
router.put('/perfil/:id', checkAuth, actualizarPerfil)
router.put('/actualizar-password', checkAuth, actualizarPassword)


export default router;