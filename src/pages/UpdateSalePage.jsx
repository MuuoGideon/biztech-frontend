import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UpdateSalePage = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [sale, setSale] = useState({
		itemName: '',
		quantity: '',
		pricePerUnit: '',
		costPerUnit: '',
		totalPrice: '',
		profit: '',
		customerName: '',
		notes: '',
	});

	useEffect(() => {
		const fetchSale = async () => {
			try {
				const res = await fetch(`http://localhost:5000/api/sales/${id}`);
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

				setSale({
					...data,
					quantity,
					pricePerUnit,
					costPerUnit,
					totalPrice,
					profit,
				});
			} catch (err) {
				toast.error(err.message);
			}
		};

		fetchSale();
	}, [id]);

	const handleChange = (e) => {
		const { name, value } = e.target;

		const updatedSale = { ...sale, [name]: value };

		const quantity = Number(updatedSale.quantity);
		const pricePerUnit = Number(updatedSale.pricePerUnit);
		const costPerUnit = Number(updatedSale.costPerUnit);

		// Only calculate if required fields have values
		if (updatedSale.quantity && updatedSale.pricePerUnit) {
			updatedSale.totalPrice = (quantity * pricePerUnit).toString();
		} else {
			updatedSale.totalPrice = '';
		}

		if (
			updatedSale.quantity &&
			updatedSale.pricePerUnit &&
			updatedSale.costPerUnit
		) {
			updatedSale.profit = ((pricePerUnit - costPerUnit) * quantity).toString();
		} else {
			updatedSale.profit = '';
		}

		setSale(updatedSale);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const res = await fetch(`http://localhost:5000/api/sales/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					itemName: sale.itemName,
					quantity: Number(sale.quantity),
					pricePerUnit: Number(sale.pricePerUnit),
					costPerUnit: sale.costPerUnit ? Number(sale.costPerUnit) : 0,
					customerName: sale.customerName,
					notes: sale.notes,
				}),
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.message || 'Failed to update sale');
			}

			toast.success('Sale updated successfully');
			navigate('/sales');
		} catch (err) {
			toast.error(err.message);
		}
	};

	return (
		<form className='grid sm:grid-cols-2 gap-4 my-6' onSubmit={handleSubmit}>
			<input
				type='text'
				name='itemName'
				placeholder='Item Name'
				value={sale.itemName}
				onChange={handleChange}
				className='border rounded px-3 py-2'
			/>

			<input
				type='number'
				name='quantity'
				placeholder='Quantity'
				value={sale.quantity}
				onChange={handleChange}
				className='border rounded px-3 py-2'
			/>

			<input
				type='number'
				name='pricePerUnit'
				placeholder='Price per Unit'
				value={sale.pricePerUnit}
				onChange={handleChange}
				className='border rounded px-3 py-2'
			/>

			<input
				type='number'
				name='costPerUnit'
				placeholder='Cost per Unit'
				value={sale.costPerUnit}
				onChange={handleChange}
				className='border rounded px-3 py-2'
			/>

			<input
				type='number'
				name='totalPrice'
				placeholder='Total Price'
				value={sale.totalPrice}
				readOnly
				className='border rounded px-3 py-2 bg-black text-white'
			/>

			<input
				type='number'
				name='profit'
				placeholder='Profit'
				value={sale.profit}
				readOnly
				className='border rounded px-3 py-2 bg-black text-white'
			/>

			<input
				type='text'
				name='customerName'
				placeholder='Customer Name'
				value={sale.customerName}
				onChange={handleChange}
				className='border rounded px-3 py-2'
			/>

			<input
				type='text'
				name='notes'
				placeholder='Notes'
				value={sale.notes}
				onChange={handleChange}
				className='border rounded px-3 py-2'
			/>

			<button
				type='submit'
				className='col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700'
			>
				Update Sale
			</button>
		</form>
	);
};

export default UpdateSalePage;
