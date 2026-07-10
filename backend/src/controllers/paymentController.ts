import { Response, Request } from 'express';
import Stripe from 'stripe';
import { Course } from '../models/Course.js';
import { Transaction } from '../models/Transaction.js';
import { User } from '../models/User.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

// 💡 Stripe is initialized per-request to ensure env vars are fully loaded

// @desc    Create a Stripe Checkout Session for a course purchase
// @route   POST /api/payments/checkout
// @access  Private
export const createCheckoutSession = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.body;
    const userId = req.user?.userId;

    if (!courseId) {
      res.status(400).json({ message: 'Course ID is required' });
      return;
    }

    // Validate Stripe key upfront with a clear error
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      console.error('❌ STRIPE_SECRET_KEY is not set in environment variables');
      res.status(500).json({ message: 'Payment system is not configured. Contact support.' });
      return;
    }

    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    const stripe = new Stripe(stripeKey);

    // Stripe requires images to be absolute HTTPS URLs — sanitize the imageUrl
    const rawImage = course.imageUrl || '';
    const safeImages: string[] = rawImage.startsWith('https://') ? [rawImage] : [];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: course.title,
              description: course.description.substring(0, 200),
              ...(safeImages.length > 0 && { images: safeImages }),
            },
            unit_amount: Math.round(course.price * 100), // ensure integer cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId || '',
        courseId: course.id,
      },
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?payment=success`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/courses/${course.id}?payment=cancelled`,
    });

    await Transaction.create({
      user: userId,
      course: courseId,
      stripeSessionId: session.id,
      amount: course.price,
    });

    res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('❌ Stripe checkout error:', error.message);
    res.status(500).json({ message: 'Failed to create checkout session', error: error.message });
  }
};

// @desc    Stripe Webhook Listener
// @route   POST /api/payments/webhook
export const handleStripeWebhook = async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
    event = stripe.webhooks.constructEvent(
      req.body, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    console.error(`❌ Webhook Signature Verification Failed: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata;

    if (metadata?.userId && metadata?.courseId) {
      try {
        await Transaction.findOneAndUpdate(
          { stripeSessionId: session.id },
          { status: 'completed' }
        );

        await User.findByIdAndUpdate(metadata.userId, {
          $addToSet: { purchaseHistory: metadata.courseId }
        });

        console.log(`✅ Success! Course ${metadata.courseId} added to User ${metadata.userId}`);
      } catch (dbErr) {
        console.error('❌ Error updating order database entries post-purchase:', dbErr);
      }
    }
  }

  res.status(200).json({ received: true });
};

// @desc    Process a mock refund and revoke platform course access
// @route   POST /api/admin/transactions/:id/refund
// @access  Private (Admin Only)
export const processTransactionRefund = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      res.status(404).json({ message: 'Target ledger record not found.' });
      return;
    }

    if (transaction.status === 'refunded') {
      res.status(400).json({ message: 'This transaction has already been refunded.' });
      return;
    }

    // 1. Mutate ledger row status flags
    transaction.status = 'refunded';
    await transaction.save();

    // 2. Erase ownership entitlements out of the student's history logs securely
    await User.findByIdAndUpdate(transaction.user, {
      $pull: { purchaseHistory: transaction.course }
    });

    res.status(200).json({ 
      message: 'Transaction refunded successfully. Platform course access revoked.', 
      data: { id: transaction._id, status: transaction.status } 
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error while processing order refund line', error: error.message });
  }
};