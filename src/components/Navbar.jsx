import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/images/GloTech-logo.png'; // <-- Adjust filename if needed

const Navbar = () => {
	const navigate = useNavigate();
	let token = localStorage.getItem('token');

	const [isLogin, setIsLogin] = useState(token ? false : true);

	useEffect(() => {
		setIsLogin(token ? false : true);
	}, [token]);

	const handleLogout = () => {
		localStorage.removeItem('token');
		return navigate('/login-user');
	};

	return (
		<header className='max-w-7xl mx-auto flex justify-between items-center px-6 py-4'>
			{/* LOGO + NAME */}
			<Link to='/' className='flex items-center space-x-3'>
				<img
					src={logo}
					alt='GloTech Logo'
					className='w-10 h-10 object-contain'
				/>
				<span className='text-2xl font-bold text-emerald-600'>GloTech</span>
			</Link>

			{/* NAV LINKS */}
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
				<Link to='/add-product' className='hover:text-emerald-600'>
					Add Product
				</Link>
				<Link to='/products' className='hover:text-emerald-600'>
					Products
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

			{/* LOGOUT BUTTON */}
			{token && (
				<button
					onClick={handleLogout}
					className='text-white bg-emerald-600 px-4 py-1 rounded hover:bg-red-600'
				>
					Logout
				</button>
			)}
		</header>
	);
};

export default Navbar;
