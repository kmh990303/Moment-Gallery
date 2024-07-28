import React from "react";
import homeImg from '../assets/HomeMain.jpg';
import { dummyArts } from "../dummy";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../shared/context/AuthContext";

const Work: React.FC = () => {
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useContext(AuthContext);

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
                        {/* 로그인 되면 Edit 버튼, LogOut 버튼 나오도록 설계 */}
                    </ul>
                </nav>
            </header>

            {/* Main Content */}
            <main className="relative h-screen overflow-hidden bg-black bg-opacity-75">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img src={homeImg} alt="Background" className="w-full h-full object-cover" />
                </div>

                {/* Content Area */}
                <div className="relative z-10 flex flex-col items-center justify-start h-full">
                    <h1 className="text-white text-3xl font-extrabold text-center px-4 mb-8 mt-24">
                        Share your creations with the world
                    </h1>
                    <ul className="w-full max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-auto pb-8">
                        {dummyArts.map((art) => (
                            <li key={art.id} className="bg-white bg-opacity-80 rounded-lg">
                                <div className="flex flex-col items-center">
                                    <img src={art.image} alt={art.title} className="w-full h-auto rounded-md mb-4" />
                                    <h3 className="text-2xl font-bold mb-2">{art.title}</h3>
                                    <p className="text-center">{art.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </>
    );
}

export default Work;
