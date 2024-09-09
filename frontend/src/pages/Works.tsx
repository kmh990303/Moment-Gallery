import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../shared/context/AuthContext";

interface Artwork {
  id: string;
  title: string;
  description: string;
  imagePath: string;
}

const Works: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [works, setWorks] = useState<Artwork[]>([]);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/works/getWorks"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch works");
        }
        const data = await response.json();
        setWorks(data.works);
      } catch (error) {
        console.error("Error fetching works: ", error);
      }
    };
    fetchWorks();
  }, []);

  const handleLogout = () => {
    if (window.prompt("Are you really sure to logout?")) {
      logout();
      navigate("/");
    }
  };

  const handleClick = (artwork: Artwork) => {
    navigate(`/work/${artwork.id}`, { state: artwork });
  };

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 w-full flex justify-between items-center p-4 text-white z-20 bg-black bg-opacity-75">
        <div
          className="ml-4 text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          Moment Gallery
        </div>
        <nav className="mr-8">
          <ul className="flex gap-8 text-xl">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/work">Work</Link>
            </li>
            {!isLoggedIn && (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
            {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
            {isLoggedIn && <Link to="/edit">Create</Link>}
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main
        className="relative h-full bg-black bg-opacity-75 overflow-y-auto"
        style={{
          backgroundImage: `url(${require("../assets/HomeMain.jpg")})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Content Area */}
        <div className="relative z-10 flex flex-col items-center justify-start min-h-screen">
          <div>
            <p className="text-white text-3xl font-extrabold text-center px-4 mb-8 mt-24">
              Share your creations with the world
            </p>
          </div>
          <ul className="w-full max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-8">
            {works.map((work) => (
              <li key={work.id} className="bg-white bg-opacity-80 rounded-lg">
                <div
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => handleClick(work)}
                >
                  {/* 이미지 크기 고정 및 비율 유지 */}
                  <img
                    src={`http://localhost:5000/${work.imagePath}`}
                    alt={work.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-2xl font-bold mb-2">{work.title}</h3>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
};

export default Works;
