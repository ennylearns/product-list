'use server';

import { z } from 'zod';
import { SignupFormSchema, SigninFormSchema, FormState } from './validations';
import { db } from '@/src/db';
import { users } from '@/src/db/schema';
import bcrypt from 'bcryptjs';
import { signIn, signOut } from './auth';
import { redirect } from 'next/navigation';

export async function signup(state: FormState, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.insert(users).values({
      email,
      hashedPassword,
    }).returning({ id: users.id });
  } catch (error: any) {
    if (error.code === '23505') {
      // Unique constraint violation (Postgres)
      return { message: 'An account with this email already exists' };
    }
    throw error;
  }

  await signIn('credentials', { email, password, redirect: false });
  redirect('/dashboard');
}

export async function signin(state: FormState, formData: FormData) {
  const validatedFields = SigninFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn('credentials', { email, password, redirect: false });
  } catch (error: any) {
    if (error.type === 'CredentialsSignin') {
      return { message: 'Invalid email or password' };
    }
    throw error;
  }

  redirect('/dashboard');
}

export async function signout() {
  await signOut({ redirectTo: '/login' });
}
