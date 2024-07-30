import React, { useState } from "react"
import LoginImg from '../assets/Login-scene.jpg';
import LogoImg from '../assets/galleryIcon.png';



const Edit: React.FC = () => {
    const [artName, setArtName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const fileInputRef = React.createRef<HTMLInputElement>();

    const handleArtNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setArtName(event.target.value);
    }

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value);
    }

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const handelFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setSelectedFile(file);

            const fileUrl = URL.createObjectURL(file);
            setPreviewUrl(fileUrl);
        }
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!selectedFile) {
            console.log('No file selected');
            return;
        }

        const formData = new FormData();


        formData.append('title', artName);
        formData.append('description', description);
        formData.append('image', selectedFile);

        try {
            const response = await fetch('http://localhost:5000/', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                alert('Success to Create new work')
                setArtName('');
                setDescription('');
                setSelectedFile(null);
                setPreviewUrl(null);
            } else {
                alert('Fail to create new work ...')
            }
        } catch (err) {
            console.error('Error uploading file:', err);
        }
    };


    return (
        <div className="flex">
            <div className="w-1/3">
                <img className="w-full h-screen" src={LoginImg} alt="loginimg" />
            </div>
            <div className="w-2/3 flex flex-col mt-12">
                <div className="w-1/3 mx-auto">
                    <img src={LogoImg} alt="logoimg" />
                </div>
                <div className="flex flex-col p-5">
                    <form method="POST" className="flex flex-col" onSubmit={handleSubmit}>
                        <input className="border-2 border-customColor p-4 w-1/2 rounded-xl  placeholder-customColor mx-auto mb-4 focus:outline-none" type="text" name="name" placeholder="작품명" required value={artName} onChange={handleArtNameChange} />
                        <textarea className="border-2 border-customColor p-4 w-1/2 rounded-xl  placeholder-customColor mx-auto mb-4 focus:outline-none" placeholder="작품 설명" required value={description} onChange={handleDescriptionChange} />
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handelFileChange} required className="border-2 border-customColor p-4 w-1/2 rounded-xl mx-auto mb-4 focus:outline-none" style={{ display: 'none' }} />
                        <div className="flex w-1/2 mx-auto">
                            {!previewUrl && (<button className="w-1/4 mx-auto rounded-xl text-white font-bold my-4 p-4 bg-customColor translate-x-32" onClick={handleButtonClick} type="button">
                                Select an Image
                            </button>)}
                            {previewUrl && (<img src={previewUrl} alt='preview' className="w-1/4 mx-auto rounded-xl text-white font-bold my-4 p-4 bg-customColor" />)}
                            <button className="w-1/4 mx-auto rounded-xl text-white font-bold my-4 p-4 bg-customColor translate-x-16" type="submit">
                                Create Your Work
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Edit;
