## Problem Statement

Sellers want to showcase their products more effectively by uploading videos in addition to images. Currently, the platform only supports up to 5 images per product. Adding video support will increase customer engagement, give a more premium feel to the storefront, and provide better visual context for the items being sold.

## Solution

Allow sellers to upload a mix of images and videos (up to 5 media items total) per product. The existing `images` concept will be renamed to `media` throughout the platform to accurately reflect this. 
Videos will be limited to 20MB and must be in `.mp4` or `.webm` format. On the public storefront, videos will play seamlessly within the product carousel (autoplay, looped, muted) to provide a premium, uninterrupted browsing experience without startling the customer with sudden audio.

## User Stories

1. As a Seller, I want to upload videos (MP4, WebM) alongside images when creating or editing a product, so that I can provide a richer preview of my items.
2. As a Seller, I want to be restricted to a maximum of 5 media items (any combination of images and videos) per product, so that I can maintain a concise and focused listing.
3. As a Seller, I want the media upload component to enforce a 20MB size limit for videos, so that I don't accidentally upload massive files that consume my bandwidth quota and slow down my storefront.
4. As a Seller, I want to see a preview of my uploaded video in the dashboard gallery, so that I can confirm it uploaded correctly.
5. As a Seller, I want to be able to remove an uploaded video just like I remove images.
6. As a Customer, I want to see product videos automatically play silently in a loop within the product carousel, so that I get a seamless, high-quality browsing experience.
7. As a Customer, I want the storefront to load quickly even if a product has videos, thanks to the 20MB size constraint enforced by the platform.

## Implementation Decisions

- **Terminology**: The domain term `images` will be renamed to `media`. `CONTEXT.md` has already been updated to reflect this.
- **Database Schema**: A Drizzle migration will be created to rename the `products.images` column to `products.media`. It will remain a text array. Existing image data is preserved.
- **Frontend File Upload**: 
  - Rename `ImageUpload` component to `MediaUpload`.
  - Update accepted file types to include `video/mp4` and `video/webm`.
  - Differentiate size limits: 5MB for images, 20MB for videos.
- **Media Type Detection**: Media type (image vs video) will be determined dynamically on the frontend by checking the file extension in the Vercel Blob URL (e.g., `.mp4`, `.webm`).
- **Storefront Carousel**: 
  - Rename `ProductImageCarousel` to `ProductMediaCarousel`.
  - When rendering the carousel items, conditionally render an `<Image>` or a `<video>` tag based on the URL extension.
  - Video tags will have `autoPlay`, `loop`, `muted`, and `playsInline` attributes without native controls.
- **Server Actions**: Update `createProduct`, `updateProduct`, and `deleteProduct` actions to expect and validate a `media` array instead of `images`. The Zod validation schema (`productSchema`) will be updated accordingly.

## Testing Decisions

The feature will be tested across the following seams:

- **Schema Validation (Unit)**: Test `productSchema` to ensure it accepts valid media URLs (up to 5 total) and rejects if limits are exceeded.
- **Component Level (Integration)**: Test the new `MediaUpload` component. Mock the Vercel Blob client. Ensure dragging/dropping a video > 20MB alerts the user and isn't uploaded. Ensure a valid MP4 is uploaded correctly.
- **Carousel Rendering (Unit/Integration)**: Test `ProductMediaCarousel` by passing a mix of image and video URLs. Assert that the `<video>` element is rendered with `muted` and `autoPlay` attributes when an MP4/WebM URL is passed, and an `<img>` tag is rendered otherwise.
- **Server Actions (Integration)**: Mock Drizzle DB and session. Call `createProduct` and `updateProduct` with a mix of image and video URLs as `media`, ensuring the database receives the correct array of strings.

## Out of Scope

- Audio-enabled video playback with user controls (we are intentionally restricting to muted looping).
- Server-side video transcoding or compression (relying entirely on client-side format/size validation).
- Supporting more than 5 media items per product.
- Third-party video embedding (e.g., YouTube or Vimeo links).

## Further Notes

- Existing database records containing image URLs will not be negatively affected by the column rename. They will naturally fall back to being rendered as images because they do not end in video extensions.
