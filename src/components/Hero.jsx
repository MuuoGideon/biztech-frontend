import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
	return (
		<>
			{/* HERO SECTION */}
			<main className='max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center'>
				<div>
					<h2 className='text-4xl md:text-5xl font-extrabold mb-6'>
						Track Your Sales {''}
						<span className='text-emerald-600 dark:text-emerald-400'>
							efficiently
						</span>
					</h2>
					<p className='text-slate-600 dark:text-slate-400 mb-8 max-w-md'>
						Monitor your sales, customers, and revenue growth in real time.
					</p>
					<div className='flex flex-wrap gap-4'>
						<Link
							to='/'
							className='px-6 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition'
						>
							Home
						</Link>
						<Link
							to='/sales'
							className='px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition'
						>
							Sales
						</Link>
						<Link
							to='/add-sale'
							className='px-6 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition'
						>
							Add Sale
						</Link>
					</div>
				</div>
				<div className='relative bg-#000000 rounded-xl p-6 shadow-[0_0_20px_5px_rgba(59,130,246,0.8)]'>
					<Link to='/kpi_dashboard'>Sales Tracker Dashboard</Link>
				</div>
			</main>
		</>
	);
};

export default Hero;
