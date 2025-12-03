
declare const heic2any: any;

export const ImageUtils = {
  loadImage: async (file: File): Promise<HTMLImageElement> => {
    // Check for HEIC format
    if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
        if (typeof heic2any !== 'undefined') {
            try {
                // Convert HEIC to JPEG blob
                const blobOrBlobs = await heic2any({ 
                    blob: file, 
                    toType: 'image/jpeg',
                    quality: 0.9
                });
                const blob = Array.isArray(blobOrBlobs) ? blobOrBlobs[0] : blobOrBlobs;
                // Create a new File object for consistency
                file = new File([blob], file.name.replace(/\.heic$/i, '.jpg'), { type: 'image/jpeg' });
            } catch (e) {
                console.error("HEIC conversion failed", e);
                // Fallthrough to try loading normally, though it will likely fail
            }
        }
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(new Error("Failed to load image. Format may not be supported."));
      img.src = URL.createObjectURL(file);
    });
  },

  canvasToBlob: (canvas: HTMLCanvasElement, type: string = 'image/png', quality?: number): Promise<Blob | null> => {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), type, quality);
    });
  },

  resizeImage: async (file: File, width: number, height: number): Promise<Blob | null> => {
    const img = await ImageUtils.loadImage(file);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    // Better quality scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    ctx.drawImage(img, 0, 0, width, height);
    return ImageUtils.canvasToBlob(canvas, file.type);
  },

  compressImage: async (file: File, quality: number): Promise<Blob | null> => {
    const img = await ImageUtils.loadImage(file);
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0);
    // Convert PNG to JPEG for effective compression if quality is used, otherwise browser might ignore quality for PNG
    // Default to jpeg if original is png to ensure compression works visually
    const type = file.type === 'image/png' ? 'image/jpeg' : file.type;
    return ImageUtils.canvasToBlob(canvas, type, quality);
  },

  roundImage: async (file: File): Promise<Blob | null> => {
    const img = await ImageUtils.loadImage(file);
    const canvas = document.createElement('canvas');
    const size = Math.min(img.width, img.height);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    
    const x = (img.width - size) / 2;
    const y = (img.height - size) / 2;
    ctx.drawImage(img, x, y, size, size, 0, 0, size, size);
    
    return ImageUtils.canvasToBlob(canvas, 'image/png');
  },

  flipImage: async (file: File): Promise<Blob | null> => {
    const img = await ImageUtils.loadImage(file);
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(img, 0, 0);
    
    return ImageUtils.canvasToBlob(canvas, file.type);
  },

  rotateImage: async (file: File, angle: number): Promise<Blob | null> => {
    const img = await ImageUtils.loadImage(file);
    const canvas = document.createElement('canvas');
    
    const deg = angle % 360;
    const rad = deg * Math.PI / 180;
    
    if (Math.abs(deg) === 90 || Math.abs(deg) === 270) {
        canvas.width = img.height;
        canvas.height = img.width;
    } else {
        canvas.width = img.width;
        canvas.height = img.height;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rad);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    
    return ImageUtils.canvasToBlob(canvas, file.type);
  },

  cropImage: async (file: File, x: number, y: number, w: number, h: number): Promise<Blob | null> => {
    const img = await ImageUtils.loadImage(file);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
    
    return ImageUtils.canvasToBlob(canvas, file.type);
  },

  toGrayscale: async (file: File): Promise<Blob | null> => {
    const img = await ImageUtils.loadImage(file);
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg;     // red
      data[i + 1] = avg; // green
      data[i + 2] = avg; // blue
    }
    
    ctx.putImageData(imageData, 0, 0);
    return ImageUtils.canvasToBlob(canvas, file.type);
  },

  toBlackAndWhite: async (file: File, threshold: number = 128): Promise<Blob | null> => {
    const img = await ImageUtils.loadImage(file);
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      const val = avg >= threshold ? 255 : 0;
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
    }
    
    ctx.putImageData(imageData, 0, 0);
    return ImageUtils.canvasToBlob(canvas, file.type);
  },

  toSketch: async (file: File): Promise<Blob | null> => {
    const img = await ImageUtils.loadImage(file);
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    ctx.drawImage(img, 0, 0);
    const input = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const output = ctx.createImageData(canvas.width, canvas.height);
    const w = canvas.width;
    const h = canvas.height;
    
    const grayscale = (r: number, g: number, b: number) => 0.299 * r + 0.587 * g + 0.114 * b;
    
    const data = input.data;
    const outData = output.data;
    
    const kx = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
    const ky = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
    
    for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
            let gx = 0;
            let gy = 0;
            
            for (let ky_i = -1; ky_i <= 1; ky_i++) {
                for (let kx_i = -1; kx_i <= 1; kx_i++) {
                    const idx = ((y + ky_i) * w + (x + kx_i)) * 4;
                    const val = grayscale(data[idx], data[idx + 1], data[idx + 2]);
                    gx += val * kx[ky_i + 1][kx_i + 1];
                    gy += val * ky[ky_i + 1][kx_i + 1];
                }
            }
            
            const mag = Math.sqrt(gx * gx + gy * gy);
            const color = 255 - mag;
            
            const idx = (y * w + x) * 4;
            outData[idx] = color;
            outData[idx + 1] = color;
            outData[idx + 2] = color;
            outData[idx + 3] = 255;
        }
    }
    
    ctx.putImageData(output, 0, 0);
    return ImageUtils.canvasToBlob(canvas, 'image/png');
  },

  convertImage: async (file: File, format: string): Promise<Blob | null> => {
    const img = await ImageUtils.loadImage(file);
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0);
    
    // Handle formats canvas doesn't natively write well
    // Attempt to return best effort
    return ImageUtils.canvasToBlob(canvas, format, 0.95);
  }
};
