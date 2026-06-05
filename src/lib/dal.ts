import 'server-only';

import { cache } from 'react';
import { auth } from './auth';
import { redirect } from 'next/navigation';

export const verifySession = cache(async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  return { isAuth: true, userId: session.user.id };
});
