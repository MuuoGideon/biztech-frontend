import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

const SalesPieChart = () => {
	const [sales, setSales] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchSales = async () => {
			try {
				const res = await fetch('https://gmern-app-2.onrender.com/api/sales');
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

	if (loading) return <p className='text-center'>Loading sales data...</p>;
	if (error) return <p className='text-red-500 text-center'>{error}</p>;
	if (!sales.length)
		return <p className='text-center'>No sales data available</p>;

	// Aggregate profit per item
	const aggregatedData = Object.values(
		sales.reduce((acc, sale) => {
			const profit =
				sale.profit ??
				(sale.costPerUnit !== undefined
					? (sale.pricePerUnit - sale.costPerUnit) * sale.quantity
					: 0);

			if (!acc[sale.itemName]) {
				acc[sale.itemName] = { name: sale.itemName, profit: 0 };
			}

			acc[sale.itemName].profit += profit;
			return acc;
		}, {})
	);

	return (
		<>
			{/* Dashboard Links */}
			<div className='flex flex-wrap justify-center gap-4 my-6'>
				<div className='flex flex-wrap justify-center gap-4 my-6'>
					<Link
						to='/kpi_dashboard'
						className='px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg shadow hover:bg-emerald-700 hover:shadow-lg transition-all duration-200'
					>
						Total revenue per Product
					</Link>

					<Link
						to='/DayWeekDashDB'
						className='px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 hover:shadow-lg transition-all duration-200'
					>
						Total Revenue per Day/Week/Month
					</Link>

					<Link
						to='/SalesPieChart'
						className='px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow hover:bg-purple-700 hover:shadow-lg transition-all duration-200'
					>
						Sales Distribution per Item
					</Link>
					<Link
						to='/TotalQuantityDB'
						className='px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow hover:bg-purple-700 hover:shadow-lg transition-all duration-200'
					>
						Total Quantity Sold
					</Link>
				</div>
			</div>

			<div className='bg-white dark:bg-slate-900 shadow-md rounded-lg p-6'>
				<h3 className='text-xl font-semibold mb-4 text-center'>
					Sales Profit Distribution by Item
				</h3>
				<ResponsiveContainer width='100%' height={300}>
					<PieChart>
						<Pie
							data={aggregatedData}
							dataKey='profit' // use 'profit' instead of 'value'
							nameKey='name'
							cx='50%'
							cy='50%'
							outerRadius={100}
							fill='#8884d8'
							label={(entry) => entry.name}
						>
							{aggregatedData.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={COLORS[index % COLORS.length]}
								/>
							))}
						</Pie>
						<Tooltip formatter={(value) => `Ksh ${value.toFixed(2)}`} />
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</div>
		</>
	);
};

export default SalesPieChart;
