import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddSalePage = () => {
	const navigate = useNavigate();

	const [products, setProducts] = useState([]);
	const [sale, setSale] = useState({
		productId: '',
		quantity: '',
		pricePerUnit: '',
		costPerUnit: '',
		customerName: '',
		notes: '',
	});
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);

	// Fetch products to populate dropdown
	const fetchProducts = async () => {
		try {
			const res = await fetch(
				'https://sales-tracker-backend-ozb3.onrender.com/api/products'
			);
			if (!res.ok) throw new Error('Failed to fetch products');
			const data = await res.json();
			setProducts(data);
			setLoading(false);
		} catch (err) {
			toast.error(err.message);
		}
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setSale({ ...sale, [name]: value });

		// Auto-fill pricePerUnit and costPerUnit when product is selected
		if (name === 'productId') {
			const selected = products.find((p) => p._id === value);
			if (selected) {
				setSale((prev) => ({
					...prev,
					pricePerUnit: selected.sellingPricePerUnit,
					costPerUnit: selected.costPerUnit,
				}));
			}
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (
			!sale.productId ||
			!sale.quantity ||
			!sale.pricePerUnit ||
			!sale.costPerUnit
		) {
			toast.error('Please fill in all required fields');
			return;
		}

		setSubmitting(true);
		try {
			const res = await fetch(
				'https://sales-tracker-backend-ozb3.onrender.com/api/sales',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						productId: sale.productId,
						quantity: Number(sale.quantity),
						pricePerUnit: Number(sale.pricePerUnit),
						costPerUnit: Number(sale.costPerUnit),
						customerName: sale.customerName,
						notes: sale.notes,
					}),
				}
			);

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.message || 'Failed to create sale');
			}

			toast.success('Sale created successfully!');
			navigate('/sales');
		} catch (err) {
			toast.error(err.message);
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) return <p>Loading products...</p>;

	return (
		<form className='grid sm:grid-cols-2 gap-4 my-6' onSubmit={handleSubmit}>
			<select
				name='productId'
				value={sale.productId}
				onChange={handleChange}
				className='border rounded px-3 py-2 bg-gray-700 text-white'
				required
			>
				<option value=''>Select Product</option>
				{products.map((p) => (
					<option
						key={p._id}
						value={p._id}
						className={
							p.quantity <= p.lowStockAlert
								? 'bg-red-600 text-white'
								: 'bg-gray-700 text-white'
						}
					>
						{p.name} (Stock: {p.quantity}
						{p.quantity <= p.lowStockAlert ? ' ⚠️ Low Stock' : ''})
					</option>
				))}
			</select>

			<input
				type='number'
				name='quantity'
				placeholder='Quantity'
				value={sale.quantity}
				onChange={handleChange}
				className='border rounded px-3 py-2 bg-gray-800 text-white'
				min='1'
				max={
					sale.productId
						? products.find((p) => p._id === sale.productId)?.quantity || 0
						: undefined
				}
				required
			/>

			<input
				type='number'
				name='pricePerUnit'
				placeholder='Selling Price per Unit'
				value={sale.pricePerUnit}
				onChange={handleChange}
				className='border rounded px-3 py-2 bg-gray-800 text-white'
				required
			/>

			<input
				type='number'
				name='costPerUnit'
				placeholder='Cost per Unit'
				value={sale.costPerUnit}
				onChange={handleChange}
				className='border rounded px-3 py-2 bg-gray-800 text-white'
				required
			/>

			<input
				type='text'
				name='customerName'
				placeholder='Customer Name'
				value={sale.customerName}
				onChange={handleChange}
				className='border rounded px-3 py-2 bg-gray-800 text-white'
			/>

			<input
				type='text'
				name='notes'
				placeholder='Notes'
				value={sale.notes}
				onChange={handleChange}
				className='border rounded px-3 py-2 bg-gray-800 text-white'
			/>

			<button
				type='submit'
				disabled={submitting}
				className='col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50'
			>
				{submitting ? 'Processing...' : 'Add Sale'}
			</button>
		</form>
	);
};

export default AddSalePage;
