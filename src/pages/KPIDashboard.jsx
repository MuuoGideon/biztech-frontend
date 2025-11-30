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
	LabelList,
	Cell,
} from 'recharts';

const KPIDashboard = () => {
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

	// Auto-calculate profit for each sale
	const salesWithProfit = sales.map((s) => {
		const autoProfit =
			s.sellingPricePerUnit && s.costPerUnit && s.quantity
				? (s.sellingPricePerUnit - s.costPerUnit) * s.quantity
				: s.profit || 0;

		return { ...s, profit: autoProfit };
	});

	// Group by product
	const chartData = Object.values(
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

	const revenueColors = ['#2563eb', '#1e40af', '#3b82f6']; // gradient tones
	const profitColors = ['#22c55e', '#15803d', '#4ade80']; // gradient tones

	return (
		<div className='max-w-7xl mx-auto px-6 py-16 bg-[#0f172a] rounded-xl shadow-lg'>
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

			<h2 className='text-3xl font-bold mb-6 text-white'>
				Revenue & Profit Per Product
			</h2>

			<ResponsiveContainer width='100%' height={450}>
				<BarChart
					data={chartData}
					margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
				>
					<CartesianGrid stroke='#334155' strokeDasharray='3 3' />
					<XAxis dataKey='name' stroke='#cbd5e1' tick={{ fontSize: 14 }} />
					<YAxis stroke='#cbd5e1' tick={{ fontSize: 14 }} />
					<Tooltip
						contentStyle={{
							backgroundColor: '#1e293b',
							border: 'none',
							borderRadius: '8px',
						}}
						itemStyle={{ color: '#f1f5f9' }}
					/>
					<Legend wrapperStyle={{ color: '#cbd5e1' }} />

					<Bar dataKey='totalRevenue' name='Revenue' radius={[6, 6, 0, 0]}>
						{chartData.map((entry, index) => (
							<Cell
								key={`cell-rev-${index}`}
								fill={revenueColors[index % revenueColors.length]}
							/>
						))}
						<LabelList
							dataKey='totalRevenue'
							position='top'
							fill='#f1f5f9'
							fontSize={12}
						/>
					</Bar>

					<Bar dataKey='totalProfit' name='Profit' radius={[6, 6, 0, 0]}>
						{chartData.map((entry, index) => (
							<Cell
								key={`cell-profit-${index}`}
								fill={profitColors[index % profitColors.length]}
							/>
						))}
						<LabelList
							dataKey='totalProfit'
							position='top'
							fill='#f1f5f9'
							fontSize={12}
						/>
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};

export default KPIDashboard;
