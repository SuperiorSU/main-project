import express from 'express';
import {
  getDeletedMembers,
  getSuspendedMembers,
  getNonVerifiedMembers,
  deleteMember,
  restoreMember,
  suspendMember,
  unsuspendMember,
  verifyMember,
  getAllMembers
} from '../controllers/adminController.js';
import { protect, admin } from '../middlewares/protect.js';

const adminRouter = express.Router();

// Apply authentication and admin middleware to all routes
adminRouter.use(protect, admin);

// Get members by status
adminRouter.get('/members', getAllMembers);
adminRouter.get('/members/deleted', getDeletedMembers);
adminRouter.get('/members/suspended', getSuspendedMembers);
adminRouter.get('/members/non-verified', getNonVerifiedMembers);

// Member management
adminRouter.put('/members/:id/delete', deleteMember);
adminRouter.put('/members/:id/restore', restoreMember);
adminRouter.put('/members/:id/suspend', suspendMember);
adminRouter.put('/members/:id/unsuspend', unsuspendMember);
adminRouter.put('/members/:id/verify', verifyMember);

export default adminRouter;