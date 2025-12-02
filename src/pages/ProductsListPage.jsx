import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const ProductsListPage = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchProducts = async () => {
		try {
			setLoading(true);
			const res = await fetch(
				'https://sales-tracker-backend-ozb3.onrender.com/api/products'
			);
			if (!res.ok) throw new Error('Failed to fetch products');
			const data = await res.json();
			setProducts(data);
			setLoading(false);
		} catch (err) {
			toast.error(err.message);
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	const handleDelete = async (id) => {
		if (!window.confirm('Are you sure you want to delete this product?'))
			return;
		try {
			const res = await fetch(
				`https://sales-tracker-backend-ozb3.onrender.com/api/products/${id}`,
				{
					method: 'DELETE',
				}
			);
			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.message || 'Failed to delete product');
			}
			toast.success('Product deleted successfully');
			setProducts(products.filter((p) => p._id !== id));
		} catch (err) {
			toast.error(err.message);
		}
	};

	return (
		<div className='min-h-screen bg-gray-900 text-white max-w-7xl mx-auto px-6 py-6'>
			<div className='flex justify-between items-center mb-4'>
				<h2 className='text-2xl font-bold'>Products</h2>
				<Link
					to='/add-product'
					className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
				>
					Add Product
				</Link>
			</div>

			{loading ? (
				<p>Loading products...</p>
			) : products.length === 0 ? (
				<p>No products available.</p>
			) : (
				<div className='overflow-x-auto'>
					<table className='min-w-full bg-gray-800 border rounded'>
						<thead className='bg-gray-700'>
							<tr>
								<th className='py-2 px-4 border'>Name</th>
								<th className='py-2 px-4 border'>Quantity</th>
								<th className='py-2 px-4 border'>Cost/unit</th>
								<th className='py-2 px-4 border'>Price/unit</th>
								<th className='py-2 px-4 border'>Low Stock Alert</th>
								<th className='py-2 px-4 border'>Actions</th>
							</tr>
						</thead>
						<tbody>
							{products.map((p) => (
								<tr key={p._id} className='text-center'>
									<td className='py-2 px-4 border'>{p.name}</td>
									<td className='py-2 px-4 border'>{p.quantity}</td>
									<td className='py-2 px-4 border'>{p.costPerUnit}</td>
									<td className='py-2 px-4 border'>{p.sellingPricePerUnit}</td>
									<td className='py-2 px-4 border'>{p.lowStockAlert}</td>
									<td className='py-2 px-4 border flex justify-center gap-2'>
										<Link
											to={`/update-product/${p._id}`}
											className='bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600'
										>
											Edit
										</Link>
										<button
											onClick={() => handleDelete(p._id)}
											className='bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700'
										>
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default ProductsListPage;
