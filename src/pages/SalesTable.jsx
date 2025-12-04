import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner'; // Make sure you have a Spinner component

const SalesTable = () => {
	const [sales, setSales] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchSales = async () => {
			try {
				const res = await fetch(
					'https://biztech-backend-1.onrender.com/api/sales'
				);
				if (!res.ok) throw new Error('Failed to fetch sales');
				const data = await res.json();
				setSales(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchSales();
	}, []);

	if (loading)
		return (
			<div className='flex justify-center items-center h-64'>
				<Spinner className='w-12 h-12 text-blue-600' />
			</div>
		);

	if (error) return <p className='text-red-500 text-center'>{error}</p>;
	if (!sales.length)
		return <p className='text-center'>No sales data available</p>;

	// Calculate total profit for percentage column
	const totalProfit = sales.reduce((sum, sale) => {
		const profit =
			sale.profit ??
			(sale.costPerUnit !== undefined
				? (sale.pricePerUnit - sale.costPerUnit) * sale.quantity
				: 0);
		return sum + profit;
	}, 0);

	return (
		<>
			<div className='flex flex-wrap justify-center gap-4 my-6'>
				{/* Dashboard Links */}
				<Link
					to='/kpi_dashboard'
					className='px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all'
				>
					Revenue per Product
				</Link>

				<Link
					to='/DayWeekDashDB'
					className='px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all'
				>
					Revenue per Time
				</Link>

				<Link
					to='/SalesTable'
					className='px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all'
				>
					Profit Distribution
				</Link>

				<Link
					to='/TotalQuantityDB'
					className='px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all'
				>
					Quantity Sold
				</Link>
			</div>

			<div className='bg-white dark:bg-slate-900 shadow-md rounded-lg p-6'>
				<h3 className='text-xl font-semibold mb-1 text-center'>
					Sales Profit Distribution by Item
				</h3>

				<p className='text-center text-sm text-gray-500 mb-6'>
					Total Profit:{' '}
					<span className='font-semibold text-green-600'>
						Ksh {totalProfit.toLocaleString()}
					</span>
				</p>

				<div className='overflow-x-auto'>
					<table className='min-w-full border-collapse rounded-lg overflow-hidden'>
						<thead>
							<tr className='bg-slate-200 dark:bg-slate-800 text-left'>
								<th className='px-6 py-3 font-semibold'>#</th>
								<th className='px-6 py-3 font-semibold'>Product</th>
								<th className='px-6 py-3 font-semibold'>Quantity</th>
								<th className='px-6 py-3 font-semibold'>Profit (Ksh)</th>
								<th className='px-6 py-3 font-semibold'>
									Percentage of total profit (%)
								</th>
							</tr>
						</thead>

						<tbody>
							{sales.map((sale, index) => {
								const profit =
									sale.profit ??
									(sale.costPerUnit !== undefined
										? (sale.pricePerUnit - sale.costPerUnit) * sale.quantity
										: 0);
								const percent = ((profit / totalProfit) * 100).toFixed(1);

								return (
									<tr
										key={index}
										className='border-t border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
									>
										<td className='px-6 py-3'>{index + 1}</td>
										<td className='px-6 py-3 font-medium'>{sale.itemName}</td>
										<td className='px-6 py-3'>{sale.quantity}</td>
										<td className='px-6 py-3 text-green-600 font-semibold'>
											Ksh {profit.toLocaleString()}
										</td>
										<td className='px-6 py-3'>{percent}%</td>
									</tr>
								);
							})}
						</tbody>

						<tfoot>
							<tr className='bg-slate-100 dark:bg-slate-800 font-bold'>
								<td className='px-6 py-3' colSpan='3'>
									Total
								</td>
								<td className='px-6 py-3 text-green-600'>
									Ksh {totalProfit.toLocaleString()}
								</td>
								<td className='px-6 py-3'>100%</td>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>
		</>
	);
};

export default SalesTable;
