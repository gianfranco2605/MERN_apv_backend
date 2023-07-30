import express  from "express";
import { registrar, perfil, confirmar } from '../controllers/veterinarioController.js'

const router = express.Router();

router.post('/', registrar)

router.get('/perfil', perfil)
// express permette params dinamico :
router.get('/confirmar/:token', confirmar)



export default router;