// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MediaUpload } from '../media-upload';

// Mock the @vercel/blob upload
vi.mock('@vercel/blob/client', () => ({
  upload: vi.fn(),
}));

describe('MediaUpload Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock alert since the component uses it for error messages
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
  });

  it('should render initial media including a video and an image', () => {
    const initialMedia = [
      'https://example.com/image.jpg',
      'https://example.com/video.mp4',
    ];

    render(<MediaUpload initialMedia={initialMedia} />);

    // Image should be rendered
    const image = screen.getByAltText('Uploaded 1');
    expect(image).toBeDefined();
    expect(image.tagName.toLowerCase()).toBe('img');

    // Video should be rendered
    // We expect a video tag with a specific title or data-testid, or we can query by tagName
    const video = screen.getByTestId('video-preview-1');
    expect(video).toBeDefined();
    expect(video.tagName.toLowerCase()).toBe('video');
  });

  it('should reject video files larger than 20MB', () => {
    render(<MediaUpload />);
    
    const input = screen.getByTestId('media-upload-input');
    
    // Create a 21MB video file
    const file = new File(['a'.repeat(21 * 1024 * 1024)], 'large-video.mp4', { type: 'video/mp4' });
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('20MB limit'));
  });

  it('should reject image files larger than 5MB', () => {
    render(<MediaUpload />);
    
    const input = screen.getByTestId('media-upload-input');
    
    // Create a 6MB image file
    const file = new File(['a'.repeat(6 * 1024 * 1024)], 'large-image.jpg', { type: 'image/jpeg' });
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('5MB limit'));
  });
});
