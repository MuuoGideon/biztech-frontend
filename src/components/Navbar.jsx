import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
	const navigate = useNavigate();
	let token = localStorage.getItem('token');
	const [isLogin, setIsLogin] = useState(token ? false : true);
	useEffect(() => {
		setIsLogin(token ? 'false' : 'true');
	}, [token]);

	const handleLogout = () => {
		localStorage.removeItem('token');
		return navigate('/login-user');
	};

	return (
		<>
			{/* NAVBAR */}
			<header className='max-w-7xl mx-auto flex justify-between items-center px-6 py-4'>
				<h1 className='text-2xl font-bold text-emerald-600'>SalesTracker</h1>
				<nav className='space-x-6 hidden md:flex'>
					<Link to='/' className='hover:text-emerald-600'>
						Home
					</Link>
					<Link to='/sales' className='hover:text-emerald-600'>
						Sales
					</Link>
					<Link to='/add-sale' className='hover:text-emerald-600'>
						Add Sale
					</Link>
					<Link to='/kpi_dashboard' className='hover:text-emerald-600'>
						Dashboard 1
					</Link>
					<Link to='/dboard' className='hover:text-emerald-600'>
						Dashboard 2
					</Link>

					{!token && (
						<Link to='/login-user' className='hover:text-emerald-600'>
							Login / Sign Up
						</Link>
					)}
				</nav>
				{token && (
					<button
						onClick={handleLogout}
						className='text-white hover:text-red-400'
					>
						Logout
					</button>
				)}
			</header>
		</>
	);
};

export default Navbar;
