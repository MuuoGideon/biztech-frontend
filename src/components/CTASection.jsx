import React from 'react';
import { Link } from 'react-router-dom';

const CTASection = () => {
	return (
		<>
			{/* CTA SECTION */}
			<section className='bg-black text-white text-center py-16'>
				<h3 className='text-2xl text-white font-bold mb-4'>
					Ready to track your sales efficiently?
				</h3>
				<p className='mb-6 text-emerald-600'>
					Start recording your sales today and monitor your revenue growth.
				</p>
				<Link
					to='/sales'
					className='px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-slate-100 transition'
				>
					Get Started
				</Link>
			</section>
		</>
	);
};

export default CTASection;
