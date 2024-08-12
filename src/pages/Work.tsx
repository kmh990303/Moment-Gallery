import React, { useState, useContext } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import homeImg from '../assets/HomeMain.jpg';
import { AuthContext } from '../shared/context/AuthContext';

interface Artwork {
    id: string;
    title: string;
    description: string;
    imagePath: string;
}

interface formDataType {
    title: string;
    description: string;
}

const Work: React.FC = () => {
    const { isLoggedIn, logout } = useContext(AuthContext);
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
            const response = await fetch(`http://localhost:5000/api/works/${art.id}`, {
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

    const handleLogout = () => {
        alert('Are you really sure to logout?');
        logout();
    }

    return (
        <>
            {/* Header */}
            <header className="fixed top-0 left-0 w-full flex justify-between items-center p-4 text-white z-20 bg-black bg-opacity-75">
                <div className="ml-4 text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>
                    Moment Gallery
                </div>
                <nav className="mr-8">
                    <ul className="flex gap-8 text-xl">
                        <li>
                            <Link to='/'>Home</Link>
                        </li>
                        <li>
                            <Link to='/work'>Work</Link>
                        </li>
                        {!isLoggedIn && (<li>
                            <Link to='/login'>Login</Link>
                        </li>)}
                        {isLoggedIn && (
                            <button onClick={handleLogout}>Logout</button>
                        )}
                        {isLoggedIn && (
                            <Link to='/edit'>Create</Link>
                        )}
                    </ul>
                </nav>
            </header>
            <main className='relative h-screen overflow-hidden bg-black bg-opacity-75'>
                <div className='absolute inset-0'>
                    <img src={homeImg} alt="Background" className='w-full h-full object-cover' />
                </div>

                <div className='relative z-10 flex flex-col items-center justify-start h-full'>
                    {!IsEdit && (
                        <div className='flex gap-8 mt-8 justify-center'>
                            <div className='w-2/5 ml-8 translate-y-20'>
                                <img src={`http://localhost:5000/${art.imagePath}`} alt="art-image" />
                            </div>
                            <div className='w-2/5 flex flex-col ml-8 translate-y-20'>
                                <p className='rounded-xl mb-8 text-center p-8 text-4xl fond-bold text-white bg-black'>
                                    {art.title}
                                </p>
                                <p className='rounded-xl p-4 text-xl text-center text-white bg-black'>
                                    {art.description}
                                </p>
                                <div className='flex gap-4'>
                                    <button className='w-1/2 rounded-xl p-4 text-xl mt-36 hover:bg-blue-700 text-white bg-black' onClick={handleClickEdit}>
                                        Edit
                                    </button>
                                    <button className='w-1/2 rounded-xl p-4 text-xl mt-36 hover:bg-red-700 text-white bg-black' onClick={handleDelete}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {IsEdit && (
                        <div className='flex gap-8 mt-8 justify-center'>
                            <div className='w-2/5 ml-8 translate-y-20'>
                                <img src={`http://localhost:5000/${art.imagePath}`} alt="art-image" />
                            </div>
                            <form className='w-2/5 flex flex-col ml-8 translate-y-20' onSubmit={handleSubmit}>
                                <input type="text" className='text-white bg-black rounded-xl mb-8 text-center p-8 text-2xl fond-bold' value={formData.title} onChange={handleChange} name='title' />
                                <textarea className='text-white bg-black rounded-xl px-4 py-2 text-xl text-center' value={formData.description} onChange={handleChange} name='description' />
                                <button className='text-white bg-black rounded-xl p-4 text-xl mt-36 hover:bg-blue-700  translate-y-2' type='submit'>
                                    Submit
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

export default Work;
