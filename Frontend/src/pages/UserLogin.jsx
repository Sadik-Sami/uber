import React, { useState } from 'react';
import { Link } from 'react-router-dom';
const UserLogin = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [userData, setUserData] = useState({});

	const submitHandler = (e) => {
		e.preventDefault();
		setUserData({ email: email, password: password });
		console.log(userData);
		setEmail('');
		setPassword('');
	};
	return (
		<div className='p-7 flex flex-col justify-between'>
			<div>
				<img
					className='w-16 mb-10'
					src='https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png'
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
					New here?{' '}
					<Link to='/signup' className='text-blue-600'>
						Create new Account
					</Link>
				</p>
			</div>
			<div>
				<Link
					to='/captain-login'
					className='flex items-center justify-center bg-[#10b461] text-white font-semibold mb-7 rounded px-4 py-2 w-full text-lg placeholder:text-base'>
					Sign in as Captain
				</Link>
			</div>
		</div>
	);
};

export default UserLogin;
