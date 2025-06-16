import React, { useState } from 'react';
import { Link } from 'react-router-dom';
const CaptainLogin = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [captainData, setCaptainData] = useState({});

	const submitHandler = (e) => {
		e.preventDefault();
		setCaptainData({ email: email, password: password });
		console.log(captainData);
		setEmail('');
		setPassword('');
	};
	return (
		<div className='p-7 flex flex-col justify-between'>
			<div>
				<img
					className='w-16 mb-2'
					src='https://www.svgrepo.com/show/505031/uber-driver.svg'
					alt='uber logo'
				/>
				<form onSubmit={submitHandler}>
					<h3 className='text-xl mb-2 font-medium'>What's your email</h3>
					<input
						className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
						type='email'
						placeholder='email@example.com'
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<h3 className='text-xl mb-2 font-medium'>Enter Password</h3>
					<input
						className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
						type='password'
						placeholder='password'
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<button className='bg-[#111] text-white font-semibold mb-7 rounded px-4 py-2 w-full text-lg placeholder:text-base'>
						Login
					</button>
				</form>
				<p className='text-center'>
					Join our team?{' '}
					<Link to='/captain-signup' className='text-blue-600'>
						Register as a Captain
					</Link>
				</p>
			</div>
			<div>
				<Link
					to='/login'
					className='flex items-center justify-center bg-[#d5622d] text-white font-semibold mb-7 rounded px-4 py-2 w-full text-lg placeholder:text-base'>
					Sign in as User
				</Link>
			</div>
		</div>
	);
};

export default CaptainLogin;
