import React, { useEffect, useState } from "react";

const ImageUpload: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        }
    }, [previewUrl]);

    const fileSelectedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setSelectedFile(file);

            const fileUrl = URL.createObjectURL(file);
            setPreviewUrl(fileUrl);
        }
    }

    const uploadHandler = () => {
        if (selectedFile) {

        }
    }

    return (
        <div>
            <input type="file" accept=".jpg,.png,.jpeg" onChange={fileSelectedHandler} />
            {previewUrl && <img src={previewUrl} alt="preview" style={{ maxHeight: '300px' }} />}
        </div>
    )
}

export default ImageUpload;