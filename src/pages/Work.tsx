import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();
    const art = location.state as Artwork;
    const [IsEdit, setIsEdit] = useState(false);
    const [formData, setFormData] = useState<formDataType>({
        title: art.title,
        description: art.description,
    });

    const handleClickEdit = () => {
        setIsEdit(true);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData((prevState) => {
            return {
                ...prevState,
                [name]: value,
            }
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:5000/api/works/edit/${art.id}`, {
                method: 'PATCH',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (!response.ok) {
                throw new Error('Failed to update work');
            }

            const updatedWork = await response.json();
            console.log(updatedWork);

            setIsEdit(false);

            navigate('/work');
        } catch (error) {
            console.error('Error updating work:', error);
        }
    }

    const handleDelete = async () => {
        const confirmed = window.confirm('Are you really sure to delete this work?');

        if (!confirmed) {
            return;
        }



        try {
            const response = await fetch(`http://localhost:5000/api/works/${art.id}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                throw new Error('Failed to delete work');
            }

            const data = await response.json();
            console.log(data.message);

            window.alert('Delete Success!!!');

            navigate('/work');
        } catch (err) {
            console.error('Error deleting work// message: ', err);
        }
    }

    return (
        <>
            {!IsEdit && (
                <div className='flex gap-8 mt-8 justify-center'>
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
                        <div className='flex gap-4'>
                            <button className='w-1/2 border-2 border-blue-500 rounded-xl p-4 text-xl mt-36 hover:bg-blue-700' onClick={handleClickEdit}>
                                Edit
                            </button>
                            <button className='w-1/2 border-2 border-blue-500 rounded-xl p-4 text-xl mt-36 hover:bg-red-700' onClick={handleDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {IsEdit && (
                <div className='flex gap-8 mt-8 justify-center'>
                    <div className='w-2/5 ml-8 translate-y-20'>
                        <img src={art.image} alt="art-image" />
                    </div>
                    <form className='w-2/5 flex flex-col ml-8 translate-y-20' onSubmit={handleSubmit}>
                        <input type="text" className='border-2 border-blue-500 rounded-xl mb-8 text-center p-8 text-4xl fond-bold' value={formData.title} onChange={handleChange} name='title' />
                        <textarea className='border-2 border-blue-500 rounded-xl p-4 text-xl' value={formData.description} onChange={handleChange} name='description' />
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
