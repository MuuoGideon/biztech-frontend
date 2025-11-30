import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const SalesPage = () => {
	const [sales, setSales] = useState([]);
	const [search, setSearch] = useState('');
	const [loading, setLoading] = useState(false);

	// Fetch sales (with optional search)
	const fetchSales = async (searchTerm = '') => {
		try {
			setLoading(true);

			const res = await fetch(
				`http://localhost:5000/api/sales?search=${searchTerm}`
			);

			if (!res.ok) throw new Error('Fetch error');

			const data = await res.json();
			setSales(data);
		} catch (err) {
			toast.error('Failed to fetch sales');
		} finally {
			setLoading(false);
		}
	};

	// Initial load
	useEffect(() => {
		fetchSales();
	}, []);

	// AJAX Search (debounced)
	useEffect(() => {
		const delay = setTimeout(() => {
			fetchSales(search);
		}, 400); // 400ms debounce

		return () => clearTimeout(delay);
	}, [search]);

	return (
		<div className='bg-[#00061f] rounded-xl p-6 shadow-[0_0_20px_5px_rgba(0,0,0,0.8)]'>
			{/* SEARCH BAR */}
			<input
				type='text'
				placeholder='Search by product name...'
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className='w-full mb-6 p-3 rounded-lg bg-[#06001f] border border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500'
			/>

			{loading && <p className='text-gray-400'>Searching...</p>}

			{sales.length === 0 && !loading && (
				<p className='text-gray-400 text-center'>No sales found</p>
			)}

			{sales.map((sale) => {
				let profit = sale.profit;

				if (profit === undefined && sale.costPerUnit !== undefined) {
					profit = sale.quantity * (sale.pricePerUnit - sale.costPerUnit);
				}

				return (
					<div
						key={sale._id}
						className='bg-[#00061f] rounded-xl p-6 m-4 shadow-[0_0_20px_5px_rgba(5,150,105,0.3)]'
					>
						<h2 className='font-semibold text-3xl'>{sale.itemName}</h2>

						<p className='text-sm text-gray-600'>
							Quantity:{' '}
							<span className='font-medium text-xl'>{sale.quantity}</span>
						</p>

						{profit !== undefined && (
							<p className='text-sm my-2 text-green-600'>
								Profit:{' '}
								<span className='font-medium text-xl'>Ksh {profit}</span>
							</p>
						)}

						<Link
							to={`/sales/${sale._id}`}
							className='px-6 py-1 my-5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition'
						>
							View Details →
						</Link>
					</div>
				);
			})}
		</div>
	);
};

export default SalesPage;
