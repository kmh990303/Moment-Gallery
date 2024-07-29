import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginImg from '../assets/Login-scene.jpg';
import LogoImg from '../assets/galleryIcon.png';
// import { AuthContext } from '../shared/context/AuthContext';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    // const authContext = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.password !== formData.password2) {
            setError('Passwords do not match');
            return;
        }

        try {
            // 사용자 등록
            const signupResponse = await fetch('http://localhost:5000/api/users/signup', {
                method: 'POST',
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (!signupResponse.ok) {
                const errorData = await signupResponse.json();
                console.error('Signup failed:', errorData);
                throw new Error('Signup failed');
            }

            alert('Success to create user!!!')

            navigate('/');
        } catch (err) {
            console.error('Error:', err);
            setError('Registration or login failed. Please try again.');
            setSuccess(null);
        }
    };

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
                    <form onSubmit={handleSubmit} className="flex flex-col">
                        <input
                            className="border-2 border-customColor p-4 w-1/2 rounded-xl placeholder-customColor mx-auto mb-4 focus:outline-none"
                            type="text"
                            name="name"
                            placeholder="이름"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <input
                            className="border-2 border-customColor p-4 w-1/2 rounded-xl placeholder-customColor mx-auto mb-4 focus:outline-none"
                            type="email"
                            name="email"
                            placeholder="이메일"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            className="border-2 border-customColor p-4 w-1/2 rounded-xl placeholder-customColor mx-auto mb-4 focus:outline-none"
                            type="password"
                            name="password"
                            placeholder="비밀번호"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <input
                            className="border-2 border-customColor p-4 w-1/2 rounded-xl placeholder-customColor mx-auto mb-4 focus:outline-none"
                            type="password"
                            name="password2"
                            placeholder="비밀번호 확인"
                            value={formData.password2}
                            onChange={handleChange}
                            required
                        />
                        <button
                            className="w-1/2 mx-auto rounded-xl text-white font-bold my-4 p-4 bg-customColor"
                            type="submit"
                        >
                            Enroll
                        </button>
                    </form>
                    {success && <p className="text-green-500">{success}</p>}
                    {error && <p className="text-red-500">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default Signup;
