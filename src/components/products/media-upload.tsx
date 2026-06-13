'use client';

import { useState, useRef, useCallback } from 'react';
import { upload } from '@vercel/blob/client';

interface MediaUploadProps {
  maxFiles?: number;
  maxSizeMB?: number; // 5MB for images, hardcoded 20MB for videos
  initialMedia?: string[];
  onMediaChange?: (urls: string[]) => void;
  error?: string;
}

export function MediaUpload({ 
  maxFiles = 5, 
  maxSizeMB = 5,
  initialMedia = [],
  onMediaChange,
  error 
}: MediaUploadProps) {
  const [media, setMedia] = useState<string[]>(initialMedia);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<{ id: string, name: string, progress: number }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const notifyChange = useCallback((newMedia: string[]) => {
    setMedia(newMedia);
    if (onMediaChange) {
      onMediaChange(newMedia);
    }
  }, [onMediaChange]);

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    // Check remaining slots
    const availableSlots = maxFiles - media.length - uploadingFiles.length;
    const filesToUpload = fileArray.slice(0, availableSlots);
    
    if (filesToUpload.length === 0) return;
    
    if (fileArray.length > availableSlots) {
      alert(`You can only upload up to ${maxFiles} media items. Only the first ${availableSlots} valid files will be uploaded.`);
    }

    const validFiles = filesToUpload.filter(file => {
      const isImage = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      const isVideo = ['video/mp4', 'video/webm'].includes(file.type);
      const isValidType = isImage || isVideo;
      
      const maxFileSizeBytes = isVideo ? 20 * 1024 * 1024 : maxSizeMB * 1024 * 1024;
      const isValidSize = file.size <= maxFileSizeBytes;
      
      if (!isValidType) alert(`${file.name} is not a valid format (JPEG, PNG, WebP, MP4, WebM).`);
      else if (!isValidSize) {
        alert(`${file.name} exceeds the ${isVideo ? '20' : maxSizeMB}MB limit.`);
      }
      
      return isValidType && isValidSize;
    });

    const newUploading = validFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      file,
      progress: 0
    }));

    setUploadingFiles(prev => [...prev, ...newUploading.map(({ id, name }) => ({ id, name, progress: 0 }))]);

    // Process uploads
    for (const item of newUploading) {
      try {
        const newBlob = await upload(item.file.name, item.file, {
          access: 'public',
          handleUploadUrl: '/api/upload',
          onUploadProgress: (progressEvent) => {
            setUploadingFiles(prev => prev.map(u => 
              u.id === item.id ? { ...u, progress: Math.round((progressEvent.loaded / progressEvent.total) * 100) } : u
            ));
          }
        });
        
        setMedia(prev => {
          const newMedia = [...prev, newBlob.url];
          if (onMediaChange) onMediaChange(newMedia);
          return newMedia;
        });
      } catch (err) {
        console.error('Upload failed for', item.name, err);
        alert(`Failed to upload ${item.name}. Please try again.`);
      } finally {
        setUploadingFiles(prev => prev.filter(u => u.id !== item.id));
      }
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [media.length, uploadingFiles.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const removeImage = (indexToRemove: number) => {
    const newMedia = media.filter((_, idx) => idx !== indexToRemove);
    notifyChange(newMedia);
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div 
        className={`relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-500 ease-out flex flex-col items-center justify-center p-8
          ${isDragging 
            ? 'border-emerald-500 bg-emerald-500/5 scale-[1.02] shadow-xl shadow-emerald-500/10' 
            : error 
              ? 'border-red-300 bg-red-50/50 hover:bg-red-50 hover:border-red-400' 
              : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'}
          ${media.length + uploadingFiles.length >= maxFiles ? 'opacity-50 pointer-events-none grayscale' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
        
        <div className={`w-16 h-16 mb-4 rounded-full flex items-center justify-center transition-all duration-500
          ${isDragging ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-110' : 'bg-white text-slate-400 shadow-sm'}`}>
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </div>
        
        <h4 className={`text-base font-bold transition-colors duration-300 ${isDragging ? 'text-emerald-600' : 'text-slate-700'}`}>
          {isDragging ? 'Drop files here' : 'Click or drag files to upload'}
        </h4>
        <p className="text-sm text-slate-500 mt-2 font-medium">
          Images up to {maxSizeMB}MB, Videos up to 20MB
        </p>
        
        <input 
          ref={fileInputRef}
          type="file" 
          multiple 
          accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
          className="hidden" 
          data-testid="media-upload-input"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          disabled={media.length + uploadingFiles.length >= maxFiles}
        />
      </div>

      {error && <p className="text-sm font-medium text-rose-500">{error}</p>}

      {/* Gallery */}
      {(media.length > 0 || uploadingFiles.length > 0) && (
        <div className="space-y-2">
          <div className="flex justify-between items-end mb-3">
            <h5 className="text-sm font-bold text-slate-900 tracking-tight">Gallery</h5>
            <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
              {media.length + uploadingFiles.length} / {maxFiles}
            </span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {media.map((url, idx) => {
              const isVideo = url.endsWith('.mp4') || url.endsWith('.webm');
              return (
              <div key={url} className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm animate-in zoom-in-95 duration-300">
                {isVideo ? (
                  <video 
                    src={url} 
                    data-testid={`video-preview-${idx}`} 
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                ) : (
                  <img src={url} alt={`Uploaded ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                )}
                
                {/* Hidden input to pass to server action */}
                <input type="hidden" name="media" value={url} />
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <button 
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm text-slate-600 hover:text-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-sm"
                  aria-label="Remove image"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )})}

            {uploadingFiles.map(file => (
              <div key={file.id} className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shadow-inner flex flex-col items-center justify-center p-4">
                <div className="w-8 h-8 mb-3 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${file.progress}%` }} />
                </div>
                <span className="text-[10px] font-bold text-slate-400 mt-2 truncate w-full text-center">
                  {file.progress}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
