'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Validation schema
const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export async function signInAction(prevState: unknown, formData: FormData) {
  // 1. Validate input
  const validatedFields = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    rememberMe: formData.get('rememberMe') === 'on',
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please fix the errors below.',
    };
  }

  const { email, password, rememberMe } = validatedFields.data;

  // 2. Authenticate user (replace with your DB logic)
  // Example: find user by email, compare hashed password
  const user = await authenticateUser(email, password);

  if (!user) {
    return {
      errors: { email: ['Invalid email or password'] },
      message: 'Authentication failed',
    };
  }

  // 3. Create session (JWT or random token)
  const sessionToken = crypto.randomUUID();
  const cookieStore = await cookies();

  // Set session cookie (httpOnly, secure, sameSite)
  cookieStore.set('session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24, // 30 days or 1 day
    path: '/',
  });

  // Optionally store session in database (e.g., Redis)
  await storeSession(sessionToken, user.id);

  // 4. Redirect to dashboard
  redirect('/dashboard');
}

// Mock functions – replace with real implementation
async function authenticateUser(email: string, password: string) {
  // Use bcrypt or similar to compare
  // Return user object if valid, else null
  const users = [{ id: '1', email: 'archivist@editorial.com', passwordHash: '$2b$10$...' }];
  const user = users.find(u => u.email === email);
  if (!user) return null;
  // const valid = await bcrypt.compare(password, user.passwordHash);
  const valid = password === '********'; // demo only
  return valid ? { id: user.id, email: user.email } : null;
}

async function storeSession(token: string, userId: string) {
  // Store in Redis / database with expiry
}