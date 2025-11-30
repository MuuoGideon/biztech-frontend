import React from 'react';

const Footer = () => {
	return (
		<>
			{/* FOOTER */}
			<footer className='border-t border-slate-200 dark:border-slate-800 text-center py-6 text-sm text-slate-500 dark:text-slate-400'>
				© {new Date().getFullYear()} Sales_Tracker
			</footer>
		</>
	);
};
export default Footer;
