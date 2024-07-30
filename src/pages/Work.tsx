import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

interface Artwork {
    id: string;
    title: string;
    description: string;
    image: string;
}

interface formDataType {
    title: string;
    description: string;
}

const Work: React.FC = () => {
    const location = useLocation();
    const art = location.state as Artwork;
    const [IsEdit, setIsEdit] = useState(false);
    const [formData, setFormData] = useState<formDataType>({
        title: art.title,
        description: art.description,
    });

    const handleClickEdit = () => {
        setIsEdit(true);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const { name, value } = e.target;

        setFormData((prevState) => {
            return {
                ...prevState,
                [name]: value,
            }
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();


    } //여기부터 다시 시작 -> work에 대한 api 구축 필요

    return (
        <>
            {!IsEdit && (
                <div className='flex gap=8 mt-8 justify-center'>
                    <div className='w-2/5 ml-8 translate-y-20'>
                        <img src={art.image} alt="art-image" />
                    </div>
                    <div className='w-2/5 flex flex-col ml-8 translate-y-20'>
                        <p className='border-2 border-blue-500 rounded-xl mb-8 text-center p-8 text-4xl fond-bold'>
                            {art.title}
                        </p>
                        <p className='border-2 border-blue-500 rounded-xl p-4 text-xl'>
                            {art.description}
                        </p>
                        <button className='border-2 border-blue-500 rounded-xl p-4 text-xl mt-36 hover:bg-blue-700' onClick={handleClickEdit}>
                            Edit
                        </button>
                    </div>
                </div>
            )}
            {IsEdit && (
                <div className='flex gap=8 mt-8 justify-center'>
                    <div className='w-2/5 ml-8 translate-y-20'>
                        <img src={art.image} alt="art-image" />
                    </div>
                    <form method='PATCH' className='w-2/5 flex flex-col ml-8 translate-y-20' onSubmit={handleSubmit}>
                        <input type="text" className='border-2 border-blue-500 rounded-xl mb-8 text-center p-8 text-4xl fond-bold' value={formData.title} onChange={handleChange} />
                        <input type="text" className='border-2 border-blue-500 rounded-xl p-4 text-xl' value={formData.description} onChange={handleChange} />
                        <button className='border-2 border-blue-500 rounded-xl p-4 text-xl mt-36 hover:bg-blue-700' type='submit'>
                            Submit
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default Work;
