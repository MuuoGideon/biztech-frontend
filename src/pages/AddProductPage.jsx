import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner'; // Make sure you have a Spinner component

const AddProductPage = () => {
	const navigate = useNavigate();
	const [product, setProduct] = useState({
		name: '',
		quantity: '',
		costPerUnit: '',
		sellingPricePerUnit: '',
		lowStockAlert: 5,
	});

	const [submitting, setSubmitting] = useState(false); // Added submitting state

	const handleChange = (e) => {
		const { name, value } = e.target;
		setProduct({ ...product, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setSubmitting(true); // Start spinner

			const res = await fetch(
				'https://sales-tracker-backend-ozb3.onrender.com/api/products',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: product.name,
						quantity: Number(product.quantity),
						costPerUnit: Number(product.costPerUnit),
						sellingPricePerUnit: Number(product.sellingPricePerUnit),
						lowStockAlert: Number(product.lowStockAlert),
					}),
				}
			);

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.message || 'Failed to add product');
			}

			toast.success('Product added successfully!');
			navigate('/products');
		} catch (err) {
			toast.error(err.message);
		} finally {
			setSubmitting(false); // Stop spinner
		}
	};

	return (
		<form className='grid sm:grid-cols-2 gap-4 my-6' onSubmit={handleSubmit}>
			<input
				type='text'
				name='name'
				placeholder='Product Name'
				value={product.name}
				onChange={handleChange}
				className='border rounded px-3 py-2'
				required
			/>
			<input
				type='number'
				name='quantity'
				placeholder='Quantity'
				value={product.quantity}
				onChange={handleChange}
				className='border rounded px-3 py-2'
				required
			/>
			<input
				type='number'
				name='costPerUnit'
				placeholder='Cost per Unit'
				value={product.costPerUnit}
				onChange={handleChange}
				className='border rounded px-3 py-2'
				required
			/>
			<input
				type='number'
				name='sellingPricePerUnit'
				placeholder='Selling Price per Unit'
				value={product.sellingPricePerUnit}
				onChange={handleChange}
				className='border rounded px-3 py-2'
				required
			/>
			<input
				type='number'
				name='lowStockAlert'
				placeholder='Low Stock Alert'
				value={product.lowStockAlert}
				onChange={handleChange}
				className='border rounded px-3 py-2'
			/>

			<button
				type='submit'
				disabled={submitting}
				className={`col-span-2 bg-blue-600 text-white py-2 rounded flex items-center justify-center transition ${
					submitting ? 'cursor-not-allowed bg-blue-400' : 'hover:bg-blue-700'
				}`}
			>
				{submitting && <Spinner className='w-5 h-5 mr-2' />}
				{submitting ? 'Adding...' : 'Add Product'}
			</button>
		</form>
	);
};

export default AddProductPage;
