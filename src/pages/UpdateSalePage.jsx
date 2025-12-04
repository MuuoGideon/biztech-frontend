import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner'; // Ensure you have a Spinner component

const UpdateSalePage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [products, setProducts] = useState([]);
	const [sale, setSale] = useState({
		productId: '',
		itemName: '',
		quantity: '',
		pricePerUnit: '',
		costPerUnit: '',
		totalPrice: '',
		profit: '',
		customerName: '',
		notes: '',
	});
	const [originalQuantity, setOriginalQuantity] = useState(0);

	const [loading, setLoading] = useState(true); // Loading state for fetching data
	const [submitting, setSubmitting] = useState(false); // Submitting state for form

	// Fetch products
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const res = await fetch(
					'https://sales-tracker-backend-ozb3.onrender.com/api/products'
				);
				if (!res.ok) throw new Error('Failed to fetch products');
				const data = await res.json();
				setProducts(data);
			} catch (err) {
				toast.error(err.message);
			}
		};
		fetchProducts();
	}, []);

	// Fetch sale data
	useEffect(() => {
		const fetchSale = async () => {
			try {
				setLoading(true);

				const res = await fetch(
					`https://sales-tracker-backend-ozb3.onrender.com/api/sales/${id}`
				);
				if (!res.ok) throw new Error('Failed to load sale');
				const data = await res.json();

				const quantity = data.quantity?.toString() || '';
				const pricePerUnit = data.pricePerUnit?.toString() || '';
				const costPerUnit = data.costPerUnit?.toString() || '';

				let totalPrice = '';
				let profit = '';

				if (quantity && pricePerUnit) {
					totalPrice = (Number(quantity) * Number(pricePerUnit)).toString();
				}
				if (quantity && pricePerUnit && costPerUnit) {
					profit = (
						(Number(pricePerUnit) - Number(costPerUnit)) *
						Number(quantity)
					).toString();
				}

				const product =
					data.productId ||
					products.find((p) => p.name === data.itemName)?._id ||
					'';

				setSale({
					...data,
					productId: product,
					quantity,
					pricePerUnit,
					costPerUnit,
					totalPrice,
					profit,
				});
				setOriginalQuantity(Number(quantity));
			} catch (err) {
				toast.error(err.message);
			} finally {
				setLoading(false);
			}
		};
		fetchSale();
	}, [id, products]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		let updatedSale = { ...sale, [name]: value };

		// If product is selected, update price & cost
		if (name === 'productId') {
			const selectedProduct = products.find((p) => p._id === value);
			if (selectedProduct) {
				updatedSale.itemName = selectedProduct.name;
				updatedSale.pricePerUnit = selectedProduct.sellingPricePerUnit;
				updatedSale.costPerUnit = selectedProduct.costPerUnit;
			} else {
				updatedSale.itemName = '';
				updatedSale.pricePerUnit = '';
				updatedSale.costPerUnit = '';
			}
		}

		const quantityNum =
			updatedSale.quantity === '' ? null : Number(updatedSale.quantity);
		const priceNum =
			updatedSale.pricePerUnit === '' ? null : Number(updatedSale.pricePerUnit);
		const costNum =
			updatedSale.costPerUnit === '' ? null : Number(updatedSale.costPerUnit);

		updatedSale.totalPrice =
			quantityNum !== null && priceNum !== null ? quantityNum * priceNum : '';
		updatedSale.profit =
			quantityNum !== null && priceNum !== null && costNum !== null
				? (priceNum - costNum) * quantityNum
				: '';

		setSale(updatedSale);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!sale.productId) return toast.error('Please select a product');
		if (!sale.quantity || sale.quantity <= 0)
			return toast.error('Please enter a valid quantity');

		const selectedProduct = products.find((p) => p._id === sale.productId);
		const availableStock = selectedProduct.quantity + originalQuantity;

		if (sale.quantity > availableStock) {
			return toast.error(`Not enough stock. Available: ${availableStock}`);
		}

		try {
			setSubmitting(true);

			const res = await fetch(
				`https://sales-tracker-backend-ozb3.onrender.com/api/sales/${id}`,
				{
					method: 'PUT',
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
				throw new Error(errorData.message || 'Failed to update sale');
			}

			toast.success('Sale updated successfully');
			navigate('/sales');
		} catch (err) {
			toast.error(err.message);
		} finally {
			setSubmitting(false);
		}
	};

	if (loading)
		return (
			<div className='flex justify-center items-center h-64'>
				<Spinner className='w-12 h-12 text-blue-600' />
			</div>
		);

	return (
		<form className='grid sm:grid-cols-2 gap-4 my-6' onSubmit={handleSubmit}>
			<select
				name='productId'
				value={sale.productId}
				onChange={handleChange}
				className='border rounded px-3 py-2 bg-gray-700 text-white'
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
						{p.name} (Stock: {p.quantity})
						{p.quantity <= p.lowStockAlert ? ' ⚠️ Low Stock' : ''}
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
			/>

			<input
				type='number'
				name='pricePerUnit'
				placeholder='Price per Unit'
				value={sale.pricePerUnit}
				readOnly
				className='border rounded px-3 py-2 bg-gray-800 text-white'
			/>

			<input
				type='number'
				name='costPerUnit'
				placeholder='Cost per Unit'
				value={sale.costPerUnit}
				readOnly
				className='border rounded px-3 py-2 bg-gray-800 text-white'
			/>

			<input
				type='number'
				name='totalPrice'
				placeholder='Total Price'
				value={sale.totalPrice}
				readOnly
				className='border rounded px-3 py-2 bg-gray-800 text-white'
			/>

			<input
				type='number'
				name='profit'
				placeholder='Profit'
				value={sale.profit}
				readOnly
				className='border rounded px-3 py-2 bg-gray-800 text-white'
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
				className={`col-span-2 bg-green-600 text-white py-2 rounded flex items-center justify-center transition ${
					submitting ? 'cursor-not-allowed bg-green-400' : 'hover:bg-green-700'
				}`}
			>
				{submitting && <Spinner className='w-5 h-5 mr-2' />}
				{submitting ? 'Updating...' : 'Update Sale'}
			</button>
		</form>
	);
};

export default UpdateSalePage;
