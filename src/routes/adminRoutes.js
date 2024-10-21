import express from 'express';
import adminController from '../controllers/adminController.js';

const router = express.Router();

// Route to register a new administrator
router.post('/register', adminController.register);

// Route for administrator login
router.post('/login', adminController.login);

export default router;
