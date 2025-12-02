import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';

const DayWeekDashDB = () => {
	const [sales, setSales] = useState([]);
	const [groupBy, setGroupBy] = useState('day'); // 'day' | 'week' | 'month'

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
		const interval = setInterval(fetchSales, 5000); // auto-update every 5 seconds
		return () => clearInterval(interval);
	}, []);

	// ==========================
	// GROUP SALES + AUTO PROFIT
	// ==========================
	const groupSales = (sales) => {
		const grouped = {};

		sales.forEach((sale) => {
			const date = parseISO(sale.createdAt);
			let key;

			// Grouping logic
			switch (groupBy) {
				case 'day':
					key = format(date, 'yyyy-MM-dd');
					break;
				case 'week':
					const weekNumber = Math.ceil(
						(date.getDate() + 6 - date.getDay()) / 7
					);
					key = `${date.getFullYear()}-W${weekNumber}`;
					break;
				case 'month':
					key = format(date, 'yyyy-MM');
					break;
				default:
					key = format(date, 'yyyy-MM-dd');
			}

			// Auto-calc profit if not stored
			const totalRevenue = sale.totalPrice;
			const autoProfit =
				sale.sellingPricePerUnit && sale.costPerUnit && sale.quantity
					? (sale.sellingPricePerUnit - sale.costPerUnit) * sale.quantity
					: sale.profit || 0;

			if (!grouped[key]) {
				grouped[key] = {
					totalPrice: 0,
					totalProfit: 0,
				};
			}

			grouped[key].totalPrice += totalRevenue;
			grouped[key].totalProfit += autoProfit;
		});

		return Object.entries(grouped).map(([name, data]) => ({
			name,
			totalPrice: data.totalPrice,
			totalProfit: data.totalProfit,
		}));
	};

	const chartData = groupSales(sales);

	return (
		<div className='max-w-7xl mx-auto px-6 py-16'>
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

			<h2 className='text-3xl font-bold mb-6'>
				Total Sales & Profit Per Day/Week/Month
			</h2>

			{/* Group selection buttons */}
			<div className='mb-6 flex gap-4'>
				{['day', 'week', 'month'].map((option) => (
					<button
						key={option}
						className={`px-4 py-2 rounded ${
							groupBy === option
								? 'bg-emerald-600 text-white'
								: 'bg-slate-500 text-white'
						}`}
						onClick={() => setGroupBy(option)}
					>
						{option.charAt(0).toUpperCase() + option.slice(1)}
					</button>
				))}
			</div>

			{/* Chart */}
			<ResponsiveContainer width='100%' height={400}>
				<BarChart
					data={chartData}
					margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
				>
					<CartesianGrid strokeDasharray='3 3' />
					<XAxis dataKey='name' />
					<YAxis />
					<Tooltip />
					<Legend />

					{/* Revenue */}
					<Bar dataKey='totalPrice' fill='#003366' name='Total Revenue' />

					{/* Profit */}
					<Bar dataKey='totalProfit' fill='#009933' name='Total Profit' />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};

export default DayWeekDashDB;
