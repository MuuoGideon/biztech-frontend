import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const SalesPage = () => {
	const [sales, setSales] = useState([]);
	const [search, setSearch] = useState('');
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');
	const [loading, setLoading] = useState(false);

	// Fetch sales (with optional filters)
	const fetchSales = async () => {
		try {
			setLoading(true);

			let url = `https://sales-tracker-backend-ozb3.onrender.com/api/sales?search=${search}`;

			if (fromDate) url += `&from=${fromDate}`;
			if (toDate) url += `&to=${toDate}`;

			const res = await fetch(url);

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

	// Debounced search (runs on input change)
	useEffect(() => {
		const delay = setTimeout(() => {
			fetchSales();
		}, 400);

		return () => clearTimeout(delay);
	}, [search, fromDate, toDate]);

	return (
		<div className='bg-[#00061f] rounded-xl p-6 shadow-[0_0_20px_5px_rgba(0,0,0,0.8)]'>
			{/* SEARCH CONTROLS */}
			<div className='grid md:grid-cols-3 gap-4 mb-6'>
				{/* Item Name */}
				<input
					type='text'
					placeholder='Search by product name...'
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className='w-full p-3 rounded-lg bg-[#06001f] border border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500'
				/>

				{/* From Date Picker */}
				<input
					type='date'
					value={fromDate}
					onChange={(e) => setFromDate(e.target.value)}
					className='w-full p-3 rounded-lg bg-[#06001f] border border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white [color-scheme:dark]'
				/>

				{/* To Date Picker */}
				<input
					type='date'
					value={toDate}
					onChange={(e) => setToDate(e.target.value)}
					className='w-full p-3 rounded-lg bg-[#06001f] border border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white [color-scheme:dark]'
				/>
			</div>

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
						<p className='text-sm text-slate-500 dark:text-slate-400 mb-4'>
							Created: {new Date(sale.createdAt).toLocaleString()} <br />
							Updated: {new Date(sale.updatedAt).toLocaleString()}
						</p>

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
