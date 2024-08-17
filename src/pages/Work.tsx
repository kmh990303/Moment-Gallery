import React, { useState, useContext } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import homeImg from '../assets/HomeMain.jpg';
import { AuthContext } from '../shared/context/AuthContext';

interface Artwork {
    id: string;
    title: string;
    description: string;
    imagePath: string;
    userId: string;
}



const Work: React.FC = () => {
    const { isLoggedIn, logout, userId, token } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const art = location.state as Artwork;
    const [IsEdit, setIsEdit] = useState(false);
    const [formData, setFormData] = useState<{ title: string; description: string }>({
        title: art.title,
        description: art.description,
    });

    const handleClickEdit = () => {
        setIsEdit(true);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:5000/api/works/edit/${art.id}`, {
                method: 'PATCH',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error('Failed to update work');
            }

            const updatedWork = await response.json();
            console.log(updatedWork);

            setIsEdit(false);

            navigate('/work', { state: updatedWork });
        } catch (error) {
            console.error('Error updating work:', error);
        }
    }

    const handleDelete = async () => {
        const confirmed = window.confirm('Are you really sure to delete this work?');

        if (!confirmed) return;

        try {
            const response = await fetch(`http://localhost:5000/api/works/${art.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete work');
            }

            const data = await response.json();
            console.log(data.message);

            window.alert('Delete Success!!!');

            navigate('/work');
        } catch (err) {
            console.error('Error deleting work:', err);
        }
    }

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
        }
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
                            <Link to='/' className="hover:text-gray-400">Home</Link>
                        </li>
                        <li>
                            <Link to='/work' className="hover:text-gray-400">Work</Link>
                        </li>
                        {!isLoggedIn && (
                            <li>
                                <Link to='/login' className="hover:text-gray-400">Login</Link>
                            </li>
                        )}
                        {isLoggedIn && (
                            <>
                                <button onClick={handleLogout} className="hover:text-red-500">
                                    Logout
                                </button>
                                <Link to='/edit' className="hover:text-gray-400">Create</Link>
                            </>
                        )}
                    </ul>
                </nav>
            </header>

            <main className='relative h-screen overflow-hidden bg-black bg-opacity-75'>
                <div className='absolute inset-0'>
                    <img src={homeImg} alt="Background" className='w-full h-full object-cover' />
                </div>

                <div className='relative z-10 flex flex-col items-center justify-start h-full'>
                    {!IsEdit ? (
                        <div className='flex gap-8 mt-8 justify-center'>
                            <div className='w-2/5 ml-8 translate-y-20'>
                                <img src={`http://localhost:5000/${art.imagePath}`} alt="art-image" className="rounded-lg shadow-lg" />
                            </div>
                            <div className='w-2/5 flex flex-col ml-8 translate-y-20'>
                                <p className='rounded-xl mb-8 text-center p-8 text-5xl font-extrabold text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg'>
                                    {art.title}
                                </p>
                                <p className='rounded-xl p-8 text-xl text-center text-white bg-gray-800 bg-opacity-90 shadow-lg leading-relaxed'>
                                    {art.description}
                                </p>
                                {isLoggedIn && (
                                    <div className='flex gap-4 mt-10'>
                                        <button
                                            className='w-1/2 rounded-xl px-4 py-5 text-xl font-semibold transition duration-300 ease-in-out transform bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:scale-105 translate-y-16'
                                            onClick={handleClickEdit}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className='w-1/2 rounded-xl px-4 py-5 text-xl font-semibold transition duration-300 ease-in-out transform bg-red-600 hover:bg-red-700 text-white shadow-lg hover:scale-105 translate-y-16'
                                            onClick={handleDelete}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className='flex gap-8 mt-8 justify-center'>
                            <div className='w-2/5 ml-8 translate-y-20'>
                                <img src={`http://localhost:5000/${art.imagePath}`} alt="art-image" className="rounded-lg shadow-lg" />
                            </div>
                            <form className='w-2/5 flex flex-col ml-8 translate-y-20' onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    className='text-white bg-gray-800 rounded-xl mb-8 text-center p-8 text-3xl font-bold shadow-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                                    value={formData.title}
                                    onChange={handleChange}
                                    name='title'
                                />
                                <textarea
                                    className='text-white bg-gray-800 rounded-xl px-6 py-4 text-xl text-center shadow-lg leading-relaxed placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                                    value={formData.description}
                                    onChange={handleChange}
                                    name='description'
                                />
                                <button
                                    className='text-white bg-indigo-600 rounded-xl p-4 text-xl font-semibold mt-14 transition duration-300 ease-in-out transform hover:bg-indigo-700 shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 translate-y-16'
                                    type='submit'
                                >
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
