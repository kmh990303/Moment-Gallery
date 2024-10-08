import React, { useState, useContext } from "react";
import LoginImg from '../assets/Login-scene.jpg';
import LogoImg from '../assets/galleryIcon.png';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../shared/context/AuthContext';

const Edit: React.FC = () => {
    const [artName, setArtName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const navigate = useNavigate();
    const { token } = useContext(AuthContext); // 토큰을 가져옵니다.

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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
            const response = await fetch('http://localhost:5000/api/works/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: 'Bearer ' + token // 'Authorization' 헤더가 올바른지 확인
                }
            });

            if (response.ok) {
                alert('Success to Create new work');
                setArtName('');
                setDescription('');
                setSelectedFile(null);
                setPreviewUrl(null);
                navigate('/');
            } else {
                const errorData = await response.json();
                alert(`Fail to create new work: ${errorData.message}`);
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
                    <img src={LogoImg} alt="logoimg" className="cursor-pointer" onClick={() => navigate('/')} />
                </div>
                <div className="flex flex-col p-5">
                    <form method="POST" className="flex flex-col" onSubmit={handleSubmit}>
                        <input className="border-2 border-customColor p-4 w-1/2 rounded-xl placeholder-customColor mx-auto mb-4 focus:outline-none" type="text" name="name" placeholder="작품명" required value={artName} onChange={handleArtNameChange} />
                        <textarea className="border-2 border-customColor p-4 w-1/2 rounded-xl placeholder-customColor mx-auto mb-4 focus:outline-none" placeholder="작품 설명" required value={description} onChange={handleDescriptionChange} />
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} required className="border-2 border-customColor p-4 w-1/2 rounded-xl mx-auto mb-4 focus:outline-none" style={{ display: 'none' }} />
                        <div className="flex w-1/2 mx-auto">
                            {!previewUrl && (
                                <button className="w-1/4 mx-auto rounded-xl text-white font-bold my-4 p-4 bg-blue-600 transition duration-300 ease-in-out transform hover:bg-blue-700 hover:scale-105" onClick={handleButtonClick} type="button">
                                    Select an Image
                                </button>
                            )}
                            {previewUrl && (
                                <img src={previewUrl} alt='preview' className="w-1/4 mx-auto rounded-xl my-4" />
                            )}
                            <button className="w-1/4 mx-auto rounded-xl text-white font-bold my-4 p-4 bg-blue-600 transition duration-300 ease-in-out transform hover:bg-blue-700 hover:scale-105" type="submit">
                                Create Your Work
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Edit;