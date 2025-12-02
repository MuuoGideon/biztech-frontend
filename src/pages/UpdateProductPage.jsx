import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const res = await fetch(
					`https://sales-tracker-backend-ozb3.onrender.com/api/products/${id}`
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
		try {
			const res = await fetch(
				`https://sales-tracker-backend-ozb3.onrender.com/api/products/${id}`,
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
				className='col-span-2 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600'
			>
				Update Product
			</button>
		</form>
	);
};

export default UpdateProductPage;
