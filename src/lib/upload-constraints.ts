export const MAX_FILE_SIZE = 1 * 1024 * 1024;

export const ALLOWED_UPLOAD_TYPES: Record<string, readonly string[]> = {
  "image/png": ["png"],
  "image/jpeg": ["jpg", "jpeg"],
  "image/webp": ["webp"],
};

export const IMAGE_UPLOAD_ACCEPT = Object.keys(ALLOWED_UPLOAD_TYPES).join(",");
