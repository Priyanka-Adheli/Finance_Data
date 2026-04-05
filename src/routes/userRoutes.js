import express from 'express';
import { registerUser, loginUser, logoutUser, assignRole, changeUserStatus, getAllUsers } from '../controllers/userControllers.js';
import { userMiddleware, authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

//admin routes only to manage users
router.put('/assign-role', userMiddleware, authorizeRoles('admin'), assignRole);
router.put('/change-status', userMiddleware, authorizeRoles('admin'), changeUserStatus);
router.get('/all', userMiddleware, authorizeRoles('admin'), getAllUsers);

export default router;
