import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddSalePage = () => {
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

	const handleChange = (e) => {
		const { name, value } = e.target;
		let updatedValue = value;

		// For numeric fields, allow empty string
		if (['quantity', 'pricePerUnit', 'costPerUnit'].includes(name)) {
			if (value === '') {
				updatedValue = '';
			} else {
				updatedValue = Number(value);
			}
		}

		const updatedSale = { ...sale, [name]: updatedValue };

		// Auto-calc totalPrice and profit only if inputs are filled
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

		try {
			const res = await fetch(
				'https://sales-tracker-backend-ozb3.onrender.com/api/sales',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(sale),
				}
			);

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.message || 'Failed to add sale');
			}

			toast.success('Sale added successfully!');
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
				className='border rounded px-3 py-2 bg-black'
			/>
			<input
				type='number'
				name='profit'
				placeholder='Profit'
				value={sale.profit}
				readOnly
				className='border rounded px-3 py-2 bg-black'
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
				Add Sale
			</button>
		</form>
	);
};

export default AddSalePage;
