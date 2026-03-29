import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30).optional(),
});

export const searchSchema = z.object({
  query: z.string().max(100, 'Search query too long').default(''),
});

export const matchUpdateSchema = z.object({
  id: z.string().cuid(),
  status: z.enum(['Scheduled', 'Live', 'Finished', 'Postponed', 'Cancelled']),
  score: z.string().optional(),
});

export const checkoutSchema = z.object({
  matchId: z.string().cuid(),
  quantity: z.number().int().min(1).max(10),
  category: z.enum(['standard', 'premium', 'vip']),
});
