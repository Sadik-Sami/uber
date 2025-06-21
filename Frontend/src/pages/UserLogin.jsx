import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/userContext';
import axios from 'axios';
const UserLogin = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { setUser } = useContext(UserDataContext);
	const navigate = useNavigate();

	const submitHandler = async (e) => {
		e.preventDefault();
		const user = {
			email: email,
			password: password,
		};
		const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, user);
		if (response.status === 200) {
			console.log(response);
			const data = response.data;
			setUser(data.user);
			navigate('/home');
		}
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
