import React, { useState } from 'react';
import { useParams, useLoaderData, Link, useNavigate } from 'react-router-dom';
import CTASection from '../components/CTASection';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

const SalePage = () => {
	const { id } = useParams();
	const sale = useLoaderData();
	const navigate = useNavigate();
	const [deleting, setDeleting] = useState(false);

	const handleDelete = async () => {
		if (!window.confirm('Are you sure you want to delete this sale?')) return;

		setDeleting(true);
		try {
			const res = await fetch(
				`https://sales-tracker-backend-ozb3.onrender.com/api/sales/${id}`,
				{ method: 'DELETE' }
			);

			if (!res.ok) {
				const msg = await res.text();
				throw new Error(msg || 'Failed to delete sale');
			}

			toast.success('Sale deleted successfully!');
			navigate('/sales');
		} catch (err) {
			alert(err.message);
		} finally {
			setDeleting(false);
		}
	};

	return (
		<>
			<div className='max-w-4xl mx-auto my-5 text-center mt-6'>
				<div className='relative bg-#336699 rounded-xl p-6 shadow-[0_0_20px_5px_rgba(59,130,246,0.8)]'>
					<h1 className='text-4xl font-bold text-emerald-600 mb-4'>
						{sale.itemName}
					</h1>

					<p className='text-lg text-slate-600 dark:text-slate-400 mb-2'>
						<span className='font-semibold mr-2'>Quantity:</span>
						{sale.quantity}
					</p>

					<p className='text-lg text-slate-600 dark:text-slate-400 mb-2'>
						<span className='font-semibold mr-2'>Selling Price/Unit:</span>
						{`${sale.pricePerUnit} KES`}
					</p>

					{sale.costPerUnit !== undefined && (
						<p className='text-lg text-slate-600 dark:text-slate-400 mb-2'>
							<span className='font-semibold mr-2'>Cost Price/Unit:</span>
							{`${sale.costPerUnit} KES`}
						</p>
					)}

					{sale.totalCost !== undefined && (
						<p className='text-lg text-slate-600 dark:text-slate-400 mb-2'>
							<span className='font-semibold mr-2'>Total Cost:</span>
							{`${sale.totalCost} KES`}
						</p>
					)}

					<p className='text-lg text-slate-600 dark:text-slate-400 mb-2'>
						<span className='font-semibold mr-2'>Total Price:</span>
						{`${sale.totalPrice} KES`}
					</p>

					{sale.profit !== undefined && (
						<p className='text-xl font-bold text-green-600 dark:text-green-400 mb-4'>
							<span className='font-semibold mr-2'>Profit:</span>
							{`${sale.profit} KES`}
						</p>
					)}

					{sale.customerName && (
						<p className='text-lg text-slate-600 dark:text-slate-400 mb-2'>
							<span className='font-semibold mr-2'>Customer:</span>
							{sale.customerName}
						</p>
					)}

					{sale.notes && (
						<p className='text-lg text-slate-600 dark:text-slate-400 mb-2'>
							<span className='font-semibold'>Notes:</span> {sale.notes}
						</p>
					)}

					<p className='text-sm text-slate-500 dark:text-slate-400 mb-4'>
						Created: {new Date(sale.createdAt).toLocaleString()} <br />
						Updated: {new Date(sale.updatedAt).toLocaleString()}
					</p>

					{/* Buttons aligned on same line */}
					<div className='flex flex-wrap gap-4 justify-center mt-5'>
						<Link
							to='/sales'
							className='px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center'
						>
							← Back
						</Link>

						<Link
							to={`/sales/update/${id}`}
							className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition shadow flex items-center justify-center'
						>
							Update
						</Link>

						<button
							onClick={handleDelete}
							disabled={deleting}
							className={`px-4 py-2 bg-red-600 text-white rounded transition flex items-center justify-center ${
								deleting ? 'cursor-not-allowed' : 'hover:bg-red-700'
							}`}
						>
							{deleting && <Spinner className='w-5 h-5 mr-2' />}
							{deleting ? 'Deleting...' : 'Delete'}
						</button>
					</div>
				</div>
			</div>

			<CTASection />
		</>
	);
};

const saleLoader = async ({ params }) => {
	const res = await fetch(
		`https://sales-tracker-backend-ozb3.onrender.com/api/sales/${params.id}`
	);
	if (!res.ok) throw new Error('Failed to load sale');
	return res.json();
};

export { SalePage as default, saleLoader };
