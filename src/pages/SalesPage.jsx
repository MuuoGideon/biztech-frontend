import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const SalesPage = () => {
	const { id } = useParams();
	const [sales, setSales] = useState([]);
	const [search, setSearch] = useState('');
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');
	const [loading, setLoading] = useState(false);

	// Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(8);

	// Inline edit
	const [editingId, setEditingId] = useState(null);
	const [editedSale, setEditedSale] = useState({});

	// Fetch sales
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
			setCurrentPage(1);
		} catch (err) {
			toast.error('Failed to fetch sales');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchSales();
	}, []);

	useEffect(() => {
		const delay = setTimeout(() => {
			fetchSales();
		}, 400);
		return () => clearTimeout(delay);
	}, [search, fromDate, toDate]);

	// Pagination logic
	const indexOfLastRow = currentPage * rowsPerPage;
	const indexOfFirstRow = indexOfLastRow - rowsPerPage;
	const currentSales = sales.slice(indexOfFirstRow, indexOfLastRow);

	const totalPages = Math.ceil(sales.length / rowsPerPage);

	const changePage = (page) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm('Are you sure you want to delete this sale?')) return;

		try {
			const res = await fetch(
				`https://sales-tracker-backend-ozb3.onrender.com/api/sales/${id}`,
				{
					method: 'DELETE',
				}
			);

			if (!res.ok) throw new Error();

			toast.success('Sale deleted');
			fetchSales();
		} catch (err) {
			toast.error('Failed to delete sale');
		}
	};

	return (
		<div className='bg-[#00061f] rounded-xl p-6 shadow-[0_0_20px_5px_rgba(0,0,0,0.8)]'>
			{/* SEARCH CONTROLS */}
			<div className='grid md:grid-cols-3 gap-4 mb-6'>
				<input
					type='text'
					placeholder='Search by product name...'
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className='w-full p-3 rounded-lg bg-[#06001f] border border-emerald-500'
				/>

				<input
					type='date'
					value={fromDate}
					onChange={(e) => setFromDate(e.target.value)}
					className='w-full p-3 rounded-lg bg-[#06001f] border border-emerald-500 text-white [color-scheme:dark]'
				/>

				<input
					type='date'
					value={toDate}
					onChange={(e) => setToDate(e.target.value)}
					className='w-full p-3 rounded-lg bg-[#06001f] border border-emerald-500 text-white [color-scheme:dark]'
				/>
			</div>

			{/* PAGINATION SETTINGS */}
			<div className='flex justify-between mb-4 text-gray-300'>
				<div>
					Show
					<select
						value={rowsPerPage}
						onChange={(e) => setRowsPerPage(Number(e.target.value))}
						className='mx-2 p-1 bg-[#06001f] border border-emerald-600 rounded'
					>
						<option value='5'>5</option>
						<option value='8'>8</option>
						<option value='15'>15</option>
					</select>
					rows
				</div>
				<p>Total: {sales.length}</p>
			</div>

			{/* TABLE */}
			<div className='overflow-x-auto'>
				<table className='w-full border-collapse'>
					<thead className='bg-emerald-700 text-white'>
						<tr>
							<th className='p-3 text-left'>Product</th>
							<th className='p-3 text-left'>Qty</th>
							<th className='p-3 text-left'>Price</th>
							<th className='p-3 text-left'>Profit</th>
							<th className='p-3 text-left'>Date</th>
							<th className='p-3 text-left'>Actions</th>
						</tr>
					</thead>

					<tbody className='bg-[#00061f] text-gray-200'>
						{currentSales.map((sale) => {
							let profit = sale.profit;

							if (profit === undefined && sale.costPerUnit !== undefined) {
								profit = sale.quantity * (sale.pricePerUnit - sale.costPerUnit);
							}

							const isEditing = editingId === sale._id;

							return (
								<tr key={sale._id} className='border-b border-emerald-900'>
									{/* ITEM NAME */}
									<td className='p-3'>
										{isEditing ? (
											<input
												name='itemName'
												value={editedSale.itemName}
												onChange={handleInputChange}
												className='bg-[#06001f] border border-emerald-600 p-1 rounded'
											/>
										) : (
											sale.itemName
										)}
									</td>

									{/* QUANTITY */}
									<td className='p-3'>
										{isEditing ? (
											<input
												type='number'
												name='quantity'
												value={editedSale.quantity}
												onChange={handleInputChange}
												className='bg-[#06001f] border border-emerald-600 p-1 rounded w-20'
											/>
										) : (
											sale.quantity
										)}
									</td>

									{/* PRICE */}
									<td className='p-3'>
										{isEditing ? (
											<input
												type='number'
												name='pricePerUnit'
												value={editedSale.pricePerUnit}
												onChange={handleInputChange}
												className='bg-[#06001f] border border-emerald-600 p-1 rounded w-24'
											/>
										) : (
											`Ksh ${sale.pricePerUnit}`
										)}
									</td>

									{/* PROFIT */}
									<td
										className={`p-3 font-bold ${
											profit > 0 ? 'text-green-500' : 'text-red-500'
										}`}
									>
										{profit !== undefined ? `Ksh ${profit}` : 'N/A'}
									</td>

									{/* DATE */}
									<td className='p-3'>
										{new Date(sale.createdAt).toLocaleDateString()}
									</td>

									{/* ACTIONS */}
									<td className='p-3 flex gap-2'>
										{isEditing ? (
											<>
												<button
													onClick={() => handleSave(sale._id)}
													className='px-3 py-1 bg-emerald-600 rounded text-white'
												>
													Save
												</button>

												<button
													onClick={handleCancel}
													className='px-3 py-1 bg-gray-600 rounded text-white'
												>
													Cancel
												</button>
											</>
										) : (
											<>
												<Link
													to={`/sales/update/${sale._id}`}
													className='px-3 py-1 bg-blue-600 rounded text-white'
												>
													Edit
												</Link>

												<button
													onClick={() => handleDelete(sale._id)}
													className='px-3 py-1 bg-red-600 rounded text-white'
												>
													Delete
												</button>

												<Link
													to={`/sales/${sale._id}`}
													className='px-3 py-1 bg-emerald-700 rounded text-white'
												>
													View
												</Link>
											</>
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{/* PAGINATION */}
			{totalPages > 1 && (
				<div className='flex justify-center gap-2 mt-6 flex-wrap'>
					<button
						onClick={() => changePage(currentPage - 1)}
						disabled={currentPage === 1}
						className='px-3 py-1 border border-emerald-600 rounded'
					>
						Prev
					</button>

					{Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
						<button
							key={num}
							onClick={() => changePage(num)}
							className={`px-3 py-1 rounded ${
								currentPage === num
									? 'bg-emerald-600 text-white'
									: 'border border-emerald-600'
							}`}
						>
							{num}
						</button>
					))}

					<button
						onClick={() => changePage(currentPage + 1)}
						disabled={currentPage === totalPages}
						className='px-3 py-1 border border-emerald-600 rounded'
					>
						Next
					</button>
				</div>
			)}
		</div>
	);
};

export default SalesPage;
