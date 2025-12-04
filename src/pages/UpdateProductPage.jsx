import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner'; // Ensure you have a Spinner component

const UpdateProductPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [product, setProduct] = useState({
		name: '',
		quantity: '',
		costPerUnit: '',
		sellingPricePerUnit: '',
		lowStockAlert: 5,
	});

	const [loading, setLoading] = useState(true); // Loading for fetching product
	const [submitting, setSubmitting] = useState(false); // Loading for form submission

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const res = await fetch(
					`https://biztech-backend-1.onrender.com/api/products/${id}`
				);
				if (!res.ok) throw new Error('Failed to fetch product');
				const data = await res.json();
				setProduct({
					name: data.name,
					quantity: data.quantity,
					costPerUnit: data.costPerUnit,
					sellingPricePerUnit: data.sellingPricePerUnit,
					lowStockAlert: data.lowStockAlert || 5,
				});
			} catch (err) {
				toast.error(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchProduct();
	}, [id]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setProduct({ ...product, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);

		try {
			const res = await fetch(
				`https://biztech-backend-1.onrender.com/api/products/${id}`,
				{
					method: 'PUT',
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
				throw new Error(errorData.message || 'Failed to update product');
			}

			toast.success('Product updated successfully');
			navigate('/products');
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
				className={`col-span-2 bg-yellow-500 text-white py-2 rounded flex items-center justify-center transition ${
					submitting
						? 'cursor-not-allowed bg-yellow-400'
						: 'hover:bg-yellow-600'
				}`}
			>
				{submitting && <Spinner className='w-5 h-5 mr-2' />}
				{submitting ? 'Updating...' : 'Update Product'}
			</button>
		</form>
	);
};

export default UpdateProductPage;
