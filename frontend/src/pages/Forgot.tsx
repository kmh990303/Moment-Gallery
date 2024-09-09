import React, { useState } from "react"
import LoginImg from '../assets/Login-scene.jpg';
import LogoImg from '../assets/galleryIcon.png';
import { useNavigate } from "react-router-dom";


const Forgot: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
    })

    const navigate = useNavigate();

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const findResponse = await fetch('http://localhost:5000/api/users/findUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: formData.name,
                email: formData.email
            })
        })

        if (!findResponse.ok) {
            const error = await findResponse.json();
            console.log(error);
            throw new Error('failed to connect');
        }

        const data = await findResponse.json();

        alert(`your password is ${data.password}!!!`);

        navigate('/');
    }

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
                        <input className="border-2 border-customColor p-4 w-1/2 rounded-xl  placeholder-customColor mx-auto mb-4 focus:outline-none" type="text" name="name" placeholder="이름" required value={formData.name} onChange={handleChange} />
                        <input className="border-2 border-customColor p-4 w-1/2 rounded-xl  placeholder-customColor mx-auto mb-4 focus:outline-none" type="email" name="email" placeholder="이메일" required value={formData.email} onChange={handleChange} />
                        <button className="w-1/2 mx-auto rounded-xl text-white font-bold my-4 p-4 bg-customColor" type="submit">
                            Find Existing User
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Forgot;