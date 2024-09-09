import React, { useContext, useState } from "react"
import LoginImg from '../assets/Login-scene.jpg';
import LogoImg from '../assets/galleryIcon.png';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../shared/context/AuthContext";


const Login: React.FC = () => {
    const navigate = useNavigate();
    const { isLoggedIn, login, logout } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                [name]: value,
            }
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const loginResponse = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                })
            })

            if (!loginResponse.ok) {
                const errorData = await loginResponse.json();
                console.error('Login failed:', errorData);
                throw new Error('Login failed');
            }

            const data = await loginResponse.json();

            login(data.userId, data.token);


            setSuccess('Login Successful');
            setError(null);

            navigate('/');

        } catch (err) {
            console.log(err);
            setError('Login Failed')
            setSuccess(null)
        }
    }
    return (
        <div className="flex">
            <div className="w-1/3">
                <img className="w-full h-screen" src={LoginImg} alt="loginimg" />
            </div>
            <div className="w-2/3 flex flex-col mt-12">
                <div className="w-1/2 mx-auto">
                    <img src={LogoImg} alt="logoimg" />
                </div>
                <div className="flex flex-col p-5">
                    <form className="flex flex-col" method="POST" onSubmit={handleSubmit}>
                        <input
                            className="border-2 border-customColor p-4 w-1/2 rounded-xl  placeholder-customColor mx-auto mb-4 focus:outline-none"
                            type="email"
                            name="email"
                            placeholder="이메일"
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <input
                            className="border-2 border-customColor p-4 w-1/2 rounded-xl  placeholder-customColor mx-auto mb-4 focus:outline-none"
                            type="password"
                            name="password"
                            placeholder="비밀번호"
                            required
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <button className="w-1/2 mx-auto rounded-xl text-white font-bold my-4 p-4 bg-customColor" type="submit">
                            Enter Gallery
                        </button>
                    </form>

                    <div className="w-1/2 mx-auto flex justify-between mt-4">
                        <button type="button" className="text-stone-500" onClick={() => navigate('/signup')}>
                            Create new user
                        </button>
                        <button type="button" className="text-stone-500" onClick={() => navigate('/forgot')}>
                            forgot your password?
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;