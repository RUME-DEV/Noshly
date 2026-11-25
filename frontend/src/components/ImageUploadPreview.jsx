import { useEffect, useRef, useState } from 'react'
import styles from '../pages/owner/Owner.module.css'

function ImageUploadPreview({
    id = 'image',
    label,
    existingImage = '',
    imageAlt = 'Image preview',
    required = false,
    helpText = 'JPEG, PNG or WebP. Maximum size: 2MB.',
}) {
    const [previewUrl, setPreviewUrl] = useState(existingImage)
    const [isNewImage, setIsNewImage] = useState(false)

    const inputRef = useRef(null)

    // Release temporary image URLs when replaced or when the component unmounts.
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl !== existingImage) {
                URL.revokeObjectURL(previewUrl)
            }
        }
    }, [previewUrl, existingImage])

    const handleImageChange = (event) => {
        const file = event.target.files[0]

        if (!file) return

        const newPreviewUrl = URL.createObjectURL(file)

        setPreviewUrl(newPreviewUrl)
        setIsNewImage(true)
    }

    const handleRemoveImage = () => {
        // Clear the selected file from the actual input.
        if (inputRef.current) {
            inputRef.current.value = ''
        }

        // Return to the original image, if one exists.
        setPreviewUrl(existingImage)
        setIsNewImage(false)
    }

    return (
        <div className={styles.imageUpload}>
            <label htmlFor={id}>{label}</label>

            <input
                ref={inputRef}
                type="file"
                id={id}
                name="image"
                accept="image/jpeg,image/png,image/webp"
                required={required}
                onChange={handleImageChange}
            />

            <small>{helpText}</small>

            <div className={styles.imagePreview}>
                {previewUrl ? (
                    <>
                        <p>
                            {isNewImage ? 'New Image Preview' : 'Current Image'}
                        </p>

                        <img src={previewUrl} alt={imageAlt} />
                    </>
                ) : (
                    <p className={styles.imagePlaceholder}>
                        Your image preview will appear here.
                    </p>
                )}
            </div>

            {isNewImage && (
                <button
                    type="button"
                    className={styles.removeImageButton}
                    onClick={handleRemoveImage}
                >
                    Remove selected image
                </button>
            )}
        </div>
    )
}

export default ImageUploadPreview