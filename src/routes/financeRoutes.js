import express from 'express';
import { createRecord, getAllRecords, getUserRecords, updateRecord, deleteRecord, getDashboardSummary } from '../controllers/financeControllers.js';
import { userMiddleware, authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(userMiddleware);

//admin specific routes to create,update and manage records
router.post('/', authorizeRoles('admin'), createRecord);
router.put('/:id', authorizeRoles('admin'), updateRecord);
router.delete('/:id', authorizeRoles('admin'), deleteRecord);


//admin and analyst routes for viewing records and dashboard summaries
router.get('/', authorizeRoles('admin', 'analyst'), getAllRecords);
router.get('/summary', authorizeRoles('admin', 'analyst'), getDashboardSummary);


//routes to all types of users
router.get('/my-records', getUserRecords);

export default router;
