import { Router } from 'express'

import * as authController from '../controlleurs/auth/authentification.js';

const authRouter = Router();

// Inscrire utilisateur
authRouter.post('/inscription', authController.authInscription)

// Connexion utilisateur
authRouter.post('/connexion', authController.authConnexion)

export default authRouter