import express from 'express';
import { login, logout, signup } from '../controllers/auth.controllers.js';

const router = express.Router();

// Define routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// Export the router
export default router;
