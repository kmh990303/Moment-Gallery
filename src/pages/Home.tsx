import React from "react"
import homeImg from '../assets/HomeMain.jpg';
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../shared/context/AuthContext";

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useContext(AuthContext);

    console.log('isLoggedIn:', isLoggedIn); // 상태를 로그로 확인합니다.

    return (
        <>
            <Header />
            <main className="h-screen">
                <div className="relative w-full h-full">
                    <div className="absolute inset-0">
                        <img src={homeImg} alt="Background" className="w-full h-full object-cover" />
                    </div>
                    <div className="relative flex flex-col items-center justify-center h-full">
                        <h1 className="text-white text-[8rem] font-extrabold text-center mb-8">Moment Gallery</h1>
                        <h2 className="text-white text-3xl font-extrabold text-center px-4 mb-8">
                            Share your creations with the world
                        </h2>
                        {!isLoggedIn && (
                            <button className="text-white border-4 border-white rounded-xl px-4 py-2 mt-8 hover:border-stone-300" onClick={() => navigate('/login')}>Sign In</button>
                        )}
                        {isLoggedIn && (
                            <button className="text-white border-4 border-white rounded-xl px-4 py-2 mt-8 hover:border-stone-300" onClick={logout}>Logout</button>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
};


export default Home;