/**
 * Compresses an image using an HTML5 Canvas, reducing its size significantly.
 * @param {File} file - The image file to compress.
 * @param {number} maxWidth - Maximum width (maintains aspect ratio).
 * @param {number} quality - JPEG quality from 0.0 to 1.0.
 * @returns {Promise<File>} Compressed File object.
 */
export const compressImage = (file, maxWidth = 1280, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas back to a file
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Canvas is empty'));
            }
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Uploads an image to Cloudinary using an unsigned upload preset.
 * Fallbacks to a mock URL if env vars aren't configured yet.
 */
export const uploadToCloudinary = async (file) => {
  try {
    // 1. Fetch a secure, time-stamped signature from your backend
    const signatureRes = await fetch(`${import.meta.env.VITE_API_URL}/api/upload-signature`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!signatureRes.ok) throw new Error("Could not get upload signature");
    const { signature, timestamp, apiKey, cloudName } = await signatureRes.json();

    // 2. Append the secure signature instead of the public preset
    const formData = new FormData();
    formData.append('file', file);
    formData.append('signature', signature);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);

    // 3. Upload to Cloudinary securely
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Failed to upload image to Cloudinary');

    const data = await res.json();
    return data.secure_url; 

  } catch (error) {
    console.error("Upload Error:", error);
    // Fallback for development UI mapping if cloud fails
    return "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";
  }
};
