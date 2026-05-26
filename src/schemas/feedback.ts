import { z } from 'zod';

export const feedbackSchema = z.object({
  name: z.string().trim().min(2, 'Минимум 2 символа').max(255),
  email: z.string().trim().email('Невалидный email').max(255),
  phone: z.string().trim().max(50).optional().or(z.literal('')),
  subject: z.string().trim().max(500).optional().or(z.literal('')),
  message: z.string().trim().min(10, 'Минимум 10 символов').max(5000),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;
