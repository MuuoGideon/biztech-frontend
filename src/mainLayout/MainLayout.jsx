import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainLayout = () => {
	return (
		<>
			<div className='min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800 dark:from-slate-900 dark:to-black dark:text-slate-100 transition-colors duration-300'>
				<Navbar />
				<Outlet />
				<Footer />
				<ToastContainer />
			</div>
		</>
	);
};
export default MainLayout;
