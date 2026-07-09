import { Request, Response } from 'express';
import { Contact } from '../models/Contact.js';

// @desc    Submit public contact form message
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    await Contact.create({ name, email, message });
    res.status(201).json({ message: 'Message sent successfully! Our team will reach out soon.' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to process contact request', error: error.message });
  }
};