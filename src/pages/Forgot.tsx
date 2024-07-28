import React from "react"
import LoginImg from '../assets/Login-scene.jpg';
import LogoImg from '../assets/galleryIcon.png';

const Forgot: React.FC = () => {
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
                    <form method="POST" className="flex flex-col">
                        <input className="border-2 border-customColor p-4 w-1/2 rounded-xl  placeholder-customColor mx-auto mb-4 focus:outline-none" type="text" name="name" placeholder="이름" required />
                        <input className="border-2 border-customColor p-4 w-1/2 rounded-xl  placeholder-customColor mx-auto mb-4 focus:outline-none" type="email" name="email" placeholder="이메일" required />
                    </form>
                    <button className="w-1/2 mx-auto rounded-xl text-white font-bold my-4 p-4 bg-customColor" type="button">
                        Find Existing User
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Forgot;