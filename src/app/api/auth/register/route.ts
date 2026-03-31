import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sendMail } from '@/lib/mailer';
import { registerSchema } from '@/lib/validations';
import { verifyTurnstile } from '@/lib/turnstile';
import { sanitizePayload } from '@/lib/sanitizer';

export const dynamic = "force-dynamic";

import { getWelcomeEmailTemplate } from '@/lib/email-templates';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { turnstileToken, ...rest } = body;

    // Verify Turnstile
    if (process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY) {
      const isHuman = await verifyTurnstile(turnstileToken);
      if (!isHuman) {
        return NextResponse.json({ error: 'Security verification failed. Please try again.' }, { status: 400 });
      }
    }

    const cleanBody = sanitizePayload(rest);
    const validatedData = registerSchema.safeParse(cleanBody);

    if (!validatedData.success) {
      return NextResponse.json({ 
        error: 'Invalid input data', 
        details: validatedData.error.issues.map((e: any) => e.message) 
      }, { status: 400 });
    }

    const { name, email, password, username } = validatedData.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Generate username if not provided
    let finalUsername = username || email.split('@')[0];
    let counter = 1;
    while (await prisma.user.findFirst({ where: { username: finalUsername } })) {
      finalUsername = `${email.split('@')[0]}${counter}`;
      counter++;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roles: 'user',
        isMember: true,
        membershipType: 'free',
        memberSince: new Date(),
        profileInitialized: false,
        username: finalUsername,
        lastLogin: null,
      },
    });

    // Send welcome email
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const emailHtml = getWelcomeEmailTemplate(name || finalUsername, baseUrl);

    await sendMail({
      to: email,
      subject: 'Registry Activation: Welcome to FC ESCUELA',
      html: emailHtml
    });

    return NextResponse.json({ message: 'Registration successful' }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    const isDev = process.env.NODE_ENV !== 'production';
    return NextResponse.json({ error: isDev && error.message ? error.message : 'Internal server error' }, { status: 500 });
  }
}
