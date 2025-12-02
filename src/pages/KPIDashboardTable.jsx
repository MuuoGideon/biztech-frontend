import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const KPIDashboardTable = () => {
	const [sales, setSales] = useState([]);

	const fetchSales = async () => {
		try {
			const res = await fetch(
				'https://sales-tracker-backend-ozb3.onrender.com/api/sales'
			);
			if (!res.ok) throw new Error('Failed to fetch sales');
			const data = await res.json();
			setSales(data);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		fetchSales();
		const interval = setInterval(fetchSales, 5000);
		return () => clearInterval(interval);
	}, []);

	// Auto-calculate profit
	const salesWithProfit = sales.map((s) => {
		const autoProfit =
			s.sellingPricePerUnit && s.costPerUnit && s.quantity
				? (s.sellingPricePerUnit - s.costPerUnit) * s.quantity
				: s.profit || 0;

		return { ...s, profit: autoProfit };
	});

	// Group by product
	const grouped = Object.values(
		salesWithProfit.reduce((acc, sale) => {
			if (!acc[sale.itemName]) {
				acc[sale.itemName] = {
					name: sale.itemName,
					totalRevenue: 0,
					totalProfit: 0,
				};
			}
			acc[sale.itemName].totalRevenue += sale.totalPrice;
			acc[sale.itemName].totalProfit += sale.profit;
			return acc;
		}, {})
	);

	// Sort by revenue descending and take top 15
	const topProducts = grouped
		.sort((a, b) => b.totalRevenue - a.totalRevenue)
		.slice(0, 15);

	// Calculate grand totals
	const totalRevenue = topProducts.reduce((sum, p) => sum + p.totalRevenue, 0);
	const totalProfit = topProducts.reduce((sum, p) => sum + p.totalProfit, 0);

	return (
		<div className='max-w-7xl mx-auto px-6 py-16 bg-[#0f172a] rounded-xl shadow-lg'>
			{/* Dashboard Links */}
			<div className='flex flex-wrap justify-center gap-4 my-6'>
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

			<h2 className='text-3xl font-bold mb-6 text-white text-center'>
				Top Products by Revenue & Profit
			</h2>

			<div className='overflow-x-auto'>
				<table className='min-w-full bg-white dark:bg-slate-900 rounded-lg shadow overflow-hidden'>
					<thead>
						<tr className='bg-slate-200 dark:bg-slate-800 text-left'>
							<th className='px-6 py-3 font-semibold'>#</th>
							<th className='px-6 py-3 font-semibold'>Product</th>
							<th className='px-6 py-3 font-semibold'>Revenue (Ksh)</th>
							<th className='px-6 py-3 font-semibold'>Profit (Ksh)</th>
							<th className='px-6 py-3 font-semibold'>Profit %</th>
						</tr>
					</thead>

					<tbody>
						{topProducts.map((product, index) => {
							const profitPercent =
								totalRevenue > 0
									? (
											(product.totalProfit / product.totalRevenue) *
											100
									  ).toFixed(1)
									: 0;
							return (
								<tr
									key={index}
									className='border-t border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
								>
									<td className='px-6 py-3'>{index + 1}</td>
									<td className='px-6 py-3 font-medium'>{product.name}</td>
									<td className='px-6 py-3 text-blue-600 font-semibold'>
										Ksh {product.totalRevenue.toLocaleString()}
									</td>
									<td className='px-6 py-3 text-green-600 font-semibold'>
										Ksh {product.totalProfit.toLocaleString()}
									</td>
									<td className='px-6 py-3'>{profitPercent}%</td>
								</tr>
							);
						})}
					</tbody>

					<tfoot>
						<tr className='bg-slate-100 dark:bg-slate-800 font-bold'>
							<td className='px-6 py-3' colSpan='2'>
								Total
							</td>
							<td className='px-6 py-3 text-blue-600'>
								Ksh {totalRevenue.toLocaleString()}
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
	);
};

export default KPIDashboardTable;
