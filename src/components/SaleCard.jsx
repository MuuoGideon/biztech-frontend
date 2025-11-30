import React from 'react';
import { Link } from 'react-router-dom';

const SaleCard = ({ sale }) => {
	// Determine profit color
	const profitColor =
		sale.profit > 0
			? 'text-green-600 font-semibold'
			: sale.profit < 0
			? 'text-red-600 font-semibold'
			: 'text-gray-600 font-semibold';

	return (
		<div
			key={sale._id}
			className='p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition'
		>
			<h4 className='text-3xl font-semibold text-emerald-600 mb-2'>
				{sale.itemName}
			</h4>

			<p className='text-slate-600 dark:text-slate-400 text-lg mb-1'>
				<span className='font-semibold'>Quantity:</span> {sale.quantity}
			</p>

			<p className='text-slate-600 dark:text-slate-400 text-lg mb-1'>
				<span className='font-semibold'>Price/Unit:</span>{' '}
				{`${sale.pricePerUnit} KES`}
			</p>

			<p className='text-slate-600 dark:text-slate-400 text-lg mb-1'>
				<span className='font-semibold'>Total:</span> {`${sale.totalPrice} KES`}
			</p>

			{/* 🔥 PROFIT DISPLAY */}
			<p className='text-lg mb-1'>
				<span className='font-semibold'>Profit:</span>{' '}
				<span className={profitColor}>{sale.profit} KES</span>
			</p>

			<p className='text-slate-600 dark:text-slate-400 text-lg mb-4'>
				<span className='font-semibold'>Customer:</span> {sale.customerName}
			</p>

			<Link
				to={`/sales/${sale._id}`}
				className='px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition'
			>
				View Details
			</Link>
		</div>
	);
};

export default SaleCard;
