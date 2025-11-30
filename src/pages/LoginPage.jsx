import react from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const LoginPage = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isSignUp, setIsSignUp] = useState(false);
	const [error, setError] = useState('');

	const handleOnSubmit = async (e) => {
		e.preventDefault();
		let endpoint = isSignUp ? 'signUp' : 'login';

		await axios
			.post(`http://localhost:5000/${endpoint}`, { email, password })
			.then((res) => {
				localStorage.setItem('token', res.data.token);
				localStorage.setItem('user', JSON.stringify(res.data.user));
				toast.success(
					`${isSignUp ? 'Account created successfully' : 'Login Successful'}`
				);
				return navigate('/sales');
			})
			.catch((data) => setError(data.response?.data?.error));
	};
	return (
		<>
			<div className='min-h-screen bg-gray-900 flex items-center justify-center px-4'>
				<div className='w-full max-w-sm bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/10'>
					<h2 className='text-2xl font-bold text-white mb-6 text-center'>
						Login
					</h2>

					<form className='space-y-4' onSubmit={handleOnSubmit}>
						<div>
							<label className='text-gray-300 text-sm'>Email</label>
							<input
								type='email'
								className='w-full mt-1 px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none'
								placeholder='Enter your email'
								onChange={(e) => setEmail(e.target.value)}
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
								required
							/>
						</div>
						<button
							type='submit'
							className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition'
						>
							{isSignUp ? 'Sign up' : 'Login'}
						</button>{' '}
						<br /> <br />
						{error != '' && <h6 className='text-red-500'>{error}</h6>}
						<p
							onClick={() => setIsSignUp((pre) => !pre)}
							className='text-blue-400 hover:underline'
						>
							{isSignUp
								? 'Already have an account ? Click here to login'
								: 'Click here to Create new account'}
						</p>
					</form>
				</div>
			</div>
		</>
	);
};
export default LoginPage;
