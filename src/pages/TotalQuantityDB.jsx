import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner'; // Ensure you have a Spinner component

const TotalQuantityDB = () => {
	const [sales, setSales] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchSales = async () => {
			try {
				const res = await fetch(
					'https://sales-tracker-backend-ozb3.onrender.com/api/sales'
				);
				if (!res.ok) throw new Error('Failed to fetch sales');
				const data = await res.json();
				setSales(data);
			} catch (err) {
				toast.error(err.message);
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

	/* ===================================
     AGGREGATE QUANTITY + PROFIT BY ITEM
  =================================== */
	const tableData = Object.values(
		sales.reduce((acc, sale) => {
			const profit =
				sale.profit ??
				(sale.costPerUnit !== undefined
					? (sale.pricePerUnit - sale.costPerUnit) * sale.quantity
					: 0);

			if (!acc[sale.itemName]) {
				acc[sale.itemName] = {
					name: sale.itemName,
					quantity: 0,
					profit: 0,
				};
			}

			acc[sale.itemName].quantity += sale.quantity;
			acc[sale.itemName].profit += profit;

			return acc;
		}, {})
	).sort((a, b) => b.quantity - a.quantity);

	const totalQuantity = tableData.reduce((sum, item) => sum + item.quantity, 0);
	const totalProfit = tableData.reduce((sum, item) => sum + item.profit, 0);

	return (
		<div className='p-6'>
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

			{/* Table Container */}
			<div className='bg-white dark:bg-slate-900 shadow-md rounded-xl p-6'>
				<h2 className='text-2xl font-bold mb-4 text-center text-emerald-400'>
					Sales Quantities & Profit per Product
				</h2>

				<p className='text-center text-gray-500 mb-4'>
					Total Quantity: <span className='font-semibold'>{totalQuantity}</span>{' '}
					| Total Profit:{' '}
					<span className='font-semibold text-green-600'>
						Ksh {totalProfit.toLocaleString()}
					</span>
				</p>

				<div className='overflow-x-auto'>
					<table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
						<thead className='bg-gray-100 dark:bg-gray-800'>
							<tr>
								<th className='px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200'>
									#
								</th>
								<th className='px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200'>
									Item Name
								</th>
								<th className='px-4 py-2 text-right text-sm font-medium text-gray-700 dark:text-gray-200'>
									Quantity
								</th>
								<th className='px-4 py-2 text-right text-sm font-medium text-gray-700 dark:text-gray-200'>
									Profit (Ksh)
								</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
							{tableData.map((item, index) => (
								<tr
									key={item.name}
									className='hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
								>
									<td className='px-4 py-2 text-sm text-gray-600 dark:text-gray-300'>
										{index + 1}
									</td>
									<td className='px-4 py-2 text-sm text-gray-800 dark:text-gray-100'>
										{item.name}
									</td>
									<td className='px-4 py-2 text-sm text-right text-gray-800 dark:text-gray-100'>
										{item.quantity}
									</td>
									<td className='px-4 py-2 text-sm text-right text-green-600 dark:text-green-400'>
										{item.profit.toLocaleString()}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default TotalQuantityDB;
