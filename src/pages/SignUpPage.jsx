import react from 'react';

const SignUpPage = () => {
	return (
		<>
			<div className='min-h-screen bg-gray-900 flex items-center justify-center px-4'>
				<div className='w-full max-w-sm bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/10'>
					<h2 className='text-2xl font-bold text-white mb-6 text-center'>
						Create Account
					</h2>

					<form className='space-y-4'>
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
							Register
						</button>

						<p className='text-gray-400 text-sm text-center mt-2'>
							Already have an account?{' '}
							<a href='/login-user' className='text-blue-400 hover:underline'>
								Login
							</a>
						</p>
					</form>
				</div>
			</div>
		</>
	);
};
export default SignUpPage;
