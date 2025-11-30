import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';
import { toast } from 'react-toastify';

const TotalQuantityDB = () => {
	const [sales, setSales] = useState([]);

	useEffect(() => {
		const fetchSales = async () => {
			try {
				const res = await fetch('https://gmern-app-2.onrender.com/api/sales');
				if (!res.ok) throw new Error('Failed to fetch sales');
				const data = await res.json();
				setSales(data);
			} catch (err) {
				toast.error(err.message);
			}
		};
		fetchSales();
	}, []);

	// Aggregate quantities and profit by item
	const chartData = Object.values(
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
	);

	return (
		<>
			{/* Dashboard Links */}
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

			{/* Chart Container */}
			<div className='w-full h-96 p-6 bg-[#0f172a] rounded-xl shadow-xl'>
				<h2 className='text-2xl font-bold mb-4 text-emerald-400'>
					Sales Quantities & Profit
				</h2>
				<ResponsiveContainer width='100%' height='100%'>
					<LineChart
						data={chartData}
						margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
					>
						<CartesianGrid stroke='#334155' strokeDasharray='4 4' />
						<XAxis dataKey='name' stroke='#cbd5e1' tick={{ fontSize: 12 }} />
						<YAxis stroke='#cbd5e1' tick={{ fontSize: 12 }} />
						<Tooltip
							contentStyle={{
								backgroundColor: '#1e293b',
								borderRadius: '8px',
								border: 'none',
							}}
							formatter={(value) => `Ksh ${value}`}
							itemStyle={{ color: '#f1f5f9' }}
						/>
						<Legend wrapperStyle={{ color: '#cbd5e1' }} />

						<Line
							type='monotone'
							dataKey='quantity'
							stroke='#3b82f6'
							strokeWidth={3}
							dot={{ r: 5, fill: '#3b82f6' }}
							activeDot={{ r: 7, fill: '#60a5fa' }}
							name='Quantity'
							animationDuration={1500}
						/>

						<Line
							type='monotone'
							dataKey='profit'
							stroke='#10B981'
							strokeWidth={3}
							dot={{ r: 5, fill: '#10B981' }}
							activeDot={{ r: 7, fill: '#4ade80' }}
							name='Profit'
							animationDuration={1500}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</>
	);
};

export default TotalQuantityDB;
