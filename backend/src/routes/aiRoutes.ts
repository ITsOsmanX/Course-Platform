import { Router } from 'express';
import { handleChatbotQuery } from '../controllers/aiController.js';

const router = Router();

// Public AI Chat (no auth required — students and guests can use chatbot)
router.post('/chat', handleChatbotQuery);

export default router;
