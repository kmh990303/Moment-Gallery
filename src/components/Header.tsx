import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../shared/context/AuthContext";

const Header: React.FC = (props) => {
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);
    return (
        <header className="text-white fixed w-full flex justify-between items-center p-4 z-10" {...props}>
            <div className="ml-4 text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>
                Moment Gallery
            </div>
            <nav className="mr-8">
                <ul className="flex gap-8 text-xl">
                    <Link to='/'>
                        Home
                    </Link>
                    <Link to='/work'>
                        Work
                    </Link>
                    {!isLoggedIn && (<Link to='/login'>
                        Login
                    </Link>)}
                    {isLoggedIn && (<Link to='/edit'>
                        Edit
                    </Link>)}
                    {/* 로그인 되면 Edit 버튼, LogOut 버튼 나오도록 설계 */}
                </ul>
            </nav>
        </header>
    )
}

export default Header;
