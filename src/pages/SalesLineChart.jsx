import React, { useState, useEffect } from 'react';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
	ResponsiveContainer,
	Legend,
} from 'recharts';
import { Link } from 'react-router-dom';

const SalesLineChart = () => {
	const [sales, setSales] = useState([]);
	const [groupBy, setGroupBy] = useState('day'); // 'day', 'week', 'month'
	const [chartData, setChartData] = useState([]);

	useEffect(() => {
		const fetchSales = async () => {
			try {
				const res = await fetch('https://gmern-app-2.onrender.com/api/sales');
				const data = await res.json();
				setSales(data);
			} catch (err) {
				console.error(err);
			}
		};
		fetchSales();
	}, []);

	useEffect(() => {
		if (!sales || sales.length === 0) return;

		const getWeek = (date) => {
			const d = new Date(date);
			d.setHours(0, 0, 0, 0);
			d.setDate(d.getDate() + 4 - (d.getDay() || 7));
			const yearStart = new Date(d.getFullYear(), 0, 1);
			return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
		};

		const grouped = {};

		sales.forEach((sale) => {
			const date = new Date(sale.createdAt);
			let key;
			if (groupBy === 'day') key = date.toISOString().split('T')[0];
			else if (groupBy === 'week')
				key = `${date.getFullYear()}-W${getWeek(date)}`;
			else
				key = `${date.getFullYear()}-${(date.getMonth() + 1)
					.toString()
					.padStart(2, '0')}`;

			if (!grouped[key]) grouped[key] = { totalSales: 0, totalProfit: 0 };

			grouped[key].totalSales += sale.totalPrice;

			const profit =
				sale.profit !== undefined
					? sale.profit
					: sale.costPerUnit !== undefined
					? sale.quantity * (sale.pricePerUnit - sale.costPerUnit)
					: 0;

			grouped[key].totalProfit += profit;
		});

		const chartArray = Object.keys(grouped)
			.sort()
			.map((key) => ({
				period: key,
				totalSales: grouped[key].totalSales,
				totalProfit: grouped[key].totalProfit,
			}));

		setChartData(chartArray);
	}, [sales, groupBy]);

	return (
		<div className='max-w-5xl mx-auto p-6 bg-[#0f172a] rounded-xl shadow-xl'>
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

			<div className='flex justify-between items-center mb-4'>
				<h2 className='text-2xl font-bold text-emerald-400'>Sales Trend</h2>

				<select
					value={groupBy}
					onChange={(e) => setGroupBy(e.target.value)}
					className='border rounded px-3 py-1 bg-gray-800 text-white focus:outline-none'
				>
					<option value='day'>Day</option>
					<option value='week'>Week</option>
					<option value='month'>Month</option>
				</select>
			</div>

			{chartData.length === 0 ? (
				<p className='text-center text-gray-400'>No sales data available</p>
			) : (
				<ResponsiveContainer width='100%' height={400}>
					<LineChart
						data={chartData}
						margin={{ top: 20, right: 30, bottom: 20, left: 0 }}
					>
						<CartesianGrid stroke='#334155' strokeDasharray='4 4' />
						<XAxis dataKey='period' stroke='#cbd5e1' tick={{ fontSize: 12 }} />
						<YAxis stroke='#cbd5e1' tick={{ fontSize: 12 }} />
						<Tooltip
							contentStyle={{
								backgroundColor: '#1e293b',
								borderRadius: '8px',
								border: 'none',
							}}
							itemStyle={{ color: '#f1f5f9' }}
						/>
						<Legend wrapperStyle={{ color: '#cbd5e1' }} />

						<Line
							type='monotone'
							dataKey='totalSales'
							stroke='#3b82f6'
							strokeWidth={3}
							dot={{ r: 5, fill: '#3b82f6' }}
							activeDot={{ r: 7, fill: '#60a5fa' }}
							name='Revenue'
							animationDuration={1500}
						/>

						<Line
							type='monotone'
							dataKey='totalProfit'
							stroke='#22c55e'
							strokeWidth={3}
							dot={{ r: 5, fill: '#22c55e' }}
							activeDot={{ r: 7, fill: '#4ade80' }}
							name='Profit'
							animationDuration={1500}
						/>
					</LineChart>
				</ResponsiveContainer>
			)}
		</div>
	);
};

export default SalesLineChart;
