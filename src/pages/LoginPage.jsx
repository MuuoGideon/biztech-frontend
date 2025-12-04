import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

const LoginPage = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isSignUp, setIsSignUp] = useState(false);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleOnSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		const endpoint = isSignUp ? 'signUp' : 'login';

		try {
			const res = await axios.post(
				`https://biztech-backend-1.onrender.com/${endpoint}`,
				{
					email,
					password,
				}
			);

			localStorage.setItem('token', res.data.token);
			localStorage.setItem('user', JSON.stringify(res.data.user));
			toast.success(
				`${isSignUp ? 'Account created successfully' : 'Login Successful'}`
			);
			navigate('/sales');
		} catch (err) {
			setError(err.response?.data?.error || 'Something went wrong');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-gray-900 flex items-center justify-center px-4'>
			<div className='w-full max-w-sm bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/10'>
				<h2 className='text-2xl font-bold text-white mb-6 text-center'>
					{isSignUp ? 'Sign Up' : 'Login'}
				</h2>

				<form className='space-y-4' onSubmit={handleOnSubmit}>
					<div>
						<label className='text-gray-300 text-sm'>Email</label>
						<input
							type='email'
							className='w-full mt-1 px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none'
							placeholder='Enter your email'
							onChange={(e) => setEmail(e.target.value)}
							value={email}
							required
						/>
					</div>

					<div>
						<label className='text-gray-300 text-sm'>Password</label>
						<input
							type='password'
							className='w-full mt-1 px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none'
							placeholder='Enter your password'
							onChange={(e) => setPassword(e.target.value)}
							value={password}
							required
						/>
					</div>

					<button
						type='submit'
						disabled={loading}
						className={`w-full text-white font-semibold py-2 rounded-lg transition ${
							loading
								? 'bg-blue-400 cursor-not-allowed flex justify-center items-center gap-2'
								: 'bg-blue-600 hover:bg-blue-700'
						}`}
					>
						{loading ? (
							<>
								<Spinner className='w-5 h-5' />{' '}
								{isSignUp ? 'Signing up...' : 'Logging in...'}
							</>
						) : isSignUp ? (
							'Sign up'
						) : (
							'Login'
						)}
					</button>

					{error && <h6 className='text-red-500 mt-2'>{error}</h6>}

					<p
						onClick={() => setIsSignUp((pre) => !pre)}
						className='text-blue-400 hover:underline mt-4 cursor-pointer'
					>
						{isSignUp
							? 'Already have an account? Click here to login'
							: 'Click here to create a new account'}
					</p>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;
