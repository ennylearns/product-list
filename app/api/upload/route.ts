import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { verifySession } from '@/src/lib/dal';
import { db } from '@/src/db';
import { stores } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname: string) => {
        // Authenticate the user
        const session = await verifySession();
        if (!session?.userId) {
          throw new Error('Unauthorized: User not authenticated');
        }

        // Verify user has a store
        const store = await db.query.stores.findFirst({
          where: eq(stores.userId, session.userId),
        });

        if (!store) {
          throw new Error('Unauthorized: Store profile not found');
        }

        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'],
          maximumSizeInBytes: 20 * 1024 * 1024, // 20MB limit for videos (client validates 5MB for images)
          validUntil: Date.now() + 5 * 60 * 1000, // Valid for 5 minutes
          tokenPayload: JSON.stringify({
            storeId: store.id,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Blob is successfully uploaded
        // We do not need to save the URL to the database here because
        // the client will submit the URL as part of the product form.
        console.log('Upload completed', blob, tokenPayload);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error('Error in /api/upload route:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }, // The webhook will retry 5 times waiting for a 200
    );
  }
}
