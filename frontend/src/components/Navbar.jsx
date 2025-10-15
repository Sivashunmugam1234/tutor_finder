import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="bg-blue-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">TutorFinder</Link>
                <div>
                    {user ? (
                        <>
                            {user.role === 'teacher' && <Link to="/teacher/dashboard" className="mr-4">Dashboard</Link>}
                            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="mr-4">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
export default Navbar;