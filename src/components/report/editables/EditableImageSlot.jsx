import { useRef } from 'react';
import { useEdit } from '../EditContext';

/**
 * Compress an image file to a JPEG data-URL, capping width at `maxWidth`.
 * Returns a Promise that resolves with the compressed data URL.
 */
function compressImage(file, maxWidth = 800) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ratio = Math.min(maxWidth / img.width, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * EditableImageSlot — wraps an image element to allow uploading
 * a custom replacement image in edit mode.
 *
 * Props:
 *   slotId     — e.g. 'cover.logo', 'gemstone.ruby'
 *   defaultSrc — original image path
 *   alt        — alt text for the image
 *   className  — pass-through CSS class
 */
export default function EditableImageSlot({
  slotId,
  defaultSrc,
  alt,
  className = '',
}) {
  const { isEditMode, getImage, setImage, resetImage } = useEdit();
  const fileInputRef = useRef(null);

  const customSrc = getImage(slotId);
  const displaySrc = customSrc ?? defaultSrc;
  const hasOverride = customSrc !== undefined && customSrc !== null;

  /** Handle file selection from the hidden input */
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const compressedDataURL = await compressImage(file);
    setImage(slotId, compressedDataURL);

    // Reset input so the same file can be re-selected if needed
    e.target.value = '';
  };

  /* ── Read-only mode ── */
  if (!isEditMode) {
    return <img src={displaySrc} alt={alt} className={className} />;
  }

  /* ── Edit mode: image with overlay controls ── */
  return (
    <div className="editable-image-slot">
      <img src={displaySrc} alt={alt} className={className} />

      {/* Hidden file input, triggered programmatically */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="editable-image-file-input"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Camera overlay — click to upload */}
      <button
        className="editable-image-overlay hide-on-print"
        onClick={() => fileInputRef.current?.click()}
        title="Upload custom image"
        aria-label="Upload custom image"
      >
        📷
      </button>

      {/* Reset button — only visible when a custom image is uploaded */}
      {hasOverride && (
        <button
          className="editable-image-reset hide-on-print"
          onClick={() => resetImage(slotId)}
          title="Reset to default image"
          aria-label="Reset to default image"
        >
          ↺
        </button>
      )}
    </div>
  );
}
