import { Router } from 'express';
import {
  createCheckoutSession,
  processTransactionRefund,
} from '../controllers/paymentController.js';

import { protect, authorize } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * Protected checkout session
 */
router.post('/checkout', protect, createCheckoutSession);

/**
 * Admin refund endpoint
 */
router.post(
  '/transactions/:id/refund',
  protect,
  authorize('admin'),
  processTransactionRefund,
);

export default router;