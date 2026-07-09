import express, { Router } from 'express';
import { 
  createCheckoutSession, 
  handleStripeWebhook, 
  processTransactionRefund // 💳 Added our new refund processor
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = Router();

// Webhook endpoint MUST use express.raw body parser configuration, not JSON
router.post(
  '/webhook', 
  express.raw({ type: 'application/json' }), 
  handleStripeWebhook
);

// Protected standard checkout session route
router.post('/checkout', protect, createCheckoutSession);

// Private Admin-only refund control action
router.post('/transactions/:id/refund', protect, authorize('admin'), processTransactionRefund);

export default router;