import { useEffect, useState } from 'react';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	BarChart,
	Bar,
} from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Spinner from '../components/Spinner';

export default function DBoard() {
	const [sales, setSales] = useState([]);
	const [loading, setLoading] = useState(true);

	// Date range filter
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	// Fetch sales
	useEffect(() => {
		const fetchSales = async () => {
			try {
				const res = await fetch(
					'https://sales-tracker-backend-ozb3.onrender.com/api/sales',
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
						},
					}
				);
				const data = await res.json();
				setSales(data);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};
		fetchSales();
	}, []);

	if (loading)
		return (
			<div className='flex justify-center items-center h-screen'>
				<Spinner className='w-16 h-16' />
			</div>
		);

	// ==========================
	// AUTO-CALCULATE PROFIT HERE
	// ==========================
	const salesWithProfit = sales.map((s) => {
		const autoProfit =
			s.sellingPricePerUnit && s.costPerUnit && s.quantity
				? (s.sellingPricePerUnit - s.costPerUnit) * s.quantity
				: s.profit || 0;
		return { ...s, profit: autoProfit };
	});

	// Filter by date range
	const filteredSales = salesWithProfit.filter((s) => {
		const saleDate = new Date(s.createdAt);
		if (startDate && saleDate < startDate) return false;
		if (endDate && saleDate > endDate) return false;
		return true;
	});

	// Total revenue
	const totalRevenue = filteredSales.reduce((sum, s) => sum + s.totalPrice, 0);

	// Total profit
	const totalProfit = filteredSales.reduce((sum, s) => sum + s.profit, 0);

	// Top-Selling Items
	const itemMap = {};
	filteredSales.forEach((s) => {
		if (itemMap[s.itemName]) itemMap[s.itemName] += s.quantity;
		else itemMap[s.itemName] = s.quantity;
	});

	const topItems = Object.entries(itemMap)
		.map(([itemName, quantity]) => ({ itemName, quantity }))
		.sort((a, b) => b.quantity - a.quantity)
		.slice(0, 5);

	// Revenue Trend
	const salesByDate = {};
	const profitByDate = {};

	filteredSales.forEach((s) => {
		const date = new Date(s.createdAt).toLocaleDateString();

		// revenue
		if (salesByDate[date]) salesByDate[date] += s.totalPrice;
		else salesByDate[date] = s.totalPrice;

		// profit
		if (profitByDate[date]) profitByDate[date] += s.profit;
		else profitByDate[date] = s.profit;
	});

	const trendData = Object.entries(salesByDate).map(([date, total]) => ({
		date,
		revenue: total,
		profit: profitByDate[date] || 0,
	}));

	return (
		<div className='min-h-screen bg-gray-900 text-white p-6'>
			<h1 className='text-3xl font-bold mb-6'>Sales Dashboard</h1>

			{/* Date Picker */}
			<div className='flex gap-4 mb-6 items-center'>
				<div>
					<label className='text-gray-300'>Start Date</label>
					<DatePicker
						selected={startDate}
						onChange={(date) => setStartDate(date)}
						selectsStart
						startDate={startDate}
						endDate={endDate}
						className='mt-1 px-3 py-2 rounded bg-gray-800 text-white'
						placeholderText='Select start date'
					/>
				</div>

				<div>
					<label className='text-gray-300'>End Date</label>
					<DatePicker
						selected={endDate}
						onChange={(date) => setEndDate(date)}
						selectsEnd
						startDate={startDate}
						endDate={endDate}
						minDate={startDate}
						className='mt-1 px-3 py-2 rounded bg-gray-800 text-white'
						placeholderText='Select end date'
					/>
				</div>

				<button
					onClick={() => {
						setStartDate(null);
						setEndDate(null);
					}}
					className='ml-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded'
				>
					Reset
				</button>
			</div>

			{/* KPI CARDS */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
				<div className='bg-gray-800 p-4 rounded-lg shadow'>
					<h2 className='text-lg font-semibold'>Total Sales</h2>
					<p className='text-2xl mt-2'>{filteredSales.length}</p>
				</div>

				<div className='bg-gray-800 p-4 rounded-lg shadow'>
					<h2 className='text-lg font-semibold'>Total Revenue</h2>
					<p className='text-2xl mt-2'>Ksh. {totalRevenue.toFixed(2)}</p>
				</div>

				<div className='bg-gray-800 p-4 rounded-lg shadow'>
					<h2 className='text-lg font-semibold'>Total Profit</h2>
					<p className='text-2xl mt-2 text-green-400'>
						Ksh. {totalProfit.toFixed(2)}
					</p>
				</div>
			</div>

			{/* SALES TREND */}
			<div className='bg-gray-800 p-4 rounded-lg shadow mb-8'>
				<h2 className='text-lg font-semibold mb-4'>Revenue & Profit Trend</h2>
				<ResponsiveContainer width='100%' height={300}>
					<LineChart data={trendData}>
						<XAxis dataKey='date' stroke='#ccc' />
						<YAxis stroke='#ccc' />
						<Tooltip />
						<Line
							type='monotone'
							dataKey='revenue'
							stroke='#3b82f6'
							strokeWidth={3}
							name='Revenue'
						/>
						<Line
							type='monotone'
							dataKey='profit'
							stroke='#22c55e'
							strokeWidth={3}
							name='Profit'
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>

			{/* Top Item Chart */}
			<div className='bg-gray-800 p-4 rounded-lg shadow'>
				<h2 className='text-lg font-semibold mb-4'>Top Selling Items</h2>
				<ResponsiveContainer width='100%' height={300}>
					<BarChart data={topItems}>
						<XAxis dataKey='itemName' stroke='#ccc' />
						<YAxis stroke='#ccc' />
						<Tooltip />
						<Bar dataKey='quantity' fill='#3b82f6' />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
