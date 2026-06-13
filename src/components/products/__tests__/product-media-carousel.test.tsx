/**
 * @vitest-environment jsdom
 */
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { ProductMediaCarousel } from '../product-media-carousel';

afterEach(() => {
  cleanup();
});

// Mock Next.js Image to a simple img tag for testing
vi.mock('next/image', () => ({
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    const { fill, priority, sizes, ...rest } = props;
    return <img {...rest} alt={props.alt} />;
  },
}));

describe('ProductMediaCarousel', () => {
  it('renders standard image URLs using img tags', () => {
    const media = [
      'https://example.com/image1.jpg',
      'https://example.com/image2.png'
    ];
    
    render(<ProductMediaCarousel media={media} productName="Test Product" />);
    
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    expect(images[0].getAttribute('src')).toContain('https://example.com/image1.jpg');
    expect(images[1].getAttribute('src')).toContain('https://example.com/image2.png');
  });

  it('renders video tags with correct attributes for .mp4 and .webm URLs', () => {
    const media = [
      'https://example.com/video1.mp4',
      'https://example.com/video2.webm'
    ];
    
    // We need to use container.querySelectorAll since videos don't have a specific ARIA role by default that's consistently supported
    const { container } = render(<ProductMediaCarousel media={media} productName="Test Product" />);
    
    const videos = container.querySelectorAll('video');
    expect(videos).toHaveLength(2);
    
    expect(videos[0].getAttribute('src')).toBe('https://example.com/video1.mp4');
    expect((videos[0] as HTMLVideoElement).autoplay).toBe(true);
    expect((videos[0] as HTMLVideoElement).loop).toBe(true);
    expect((videos[0] as HTMLVideoElement).muted).toBe(true);
    // playsInline is an attribute
    expect(videos[0].hasAttribute('playsinline')).toBe(true);
    
    expect(videos[1].getAttribute('src')).toBe('https://example.com/video2.webm');
  });

  it('plays the active video and pauses inactive videos', () => {
    const playMock = vi.fn().mockResolvedValue(undefined);
    const pauseMock = vi.fn();
    window.HTMLMediaElement.prototype.play = playMock;
    window.HTMLMediaElement.prototype.pause = pauseMock;

    const media = [
      'https://example.com/video1.mp4',
      'https://example.com/video2.webm'
    ];
    
    render(<ProductMediaCarousel media={media} productName="Test Product" />);
    
    // Initially index 0 is active.
    expect(playMock).toHaveBeenCalled();
    // Inactive video should be paused
    expect(pauseMock).toHaveBeenCalled();
    
    // Clear mocks
    playMock.mockClear();
    pauseMock.mockClear();

    // Click next to make index 1 active
    const nextBtn = screen.getByLabelText('Next image');
    fireEvent.click(nextBtn);

    // The previous video (index 0) should be paused, the new video (index 1) should be played.
    expect(pauseMock).toHaveBeenCalled();
    expect(playMock).toHaveBeenCalled();
  });
});




