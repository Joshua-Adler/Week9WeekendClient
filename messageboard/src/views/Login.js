import React, { useState } from 'react'
import * as Yup from 'yup'
import { Formik, Form, Field } from 'formik'
import { Button } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import axios from 'axios'

const registerSchema = Yup.object().shape({
	username: Yup.string().required('Required'),
	password: Yup.string().required('Required'),
});

const registerInitVals = {
	username: '',
	password: '',
}

export default function Login(props) {
	const [redirect, setRedirect] = useState(false);
	const [error, setError] = useState('')

	const styles = {
		error: { color: 'red', position: 'absolute' },
		spaced: { marginTop: '40px' }
	}

	const handleSubmit = (username, password) => {
		setError('');
		axios.post('http://localhost:5000/api/login', {
			username: username,
			password: password
		}).then((response) => {
			props.setToken(response.data.token);
			localStorage.setItem('token', response.data.token);
			setRedirect(true);
		}).catch((error) => {
			console.log(error);
			switch (error.response.status) {
				case 400:
					setError('Username and password are required');
					break;
				case 401:
					setError('Incorrect password');
					break;
				case 404:
					setError('That user does not exist');
					break;
				default:
					setError('Unknown error');
					break;
			}
		});
	}

	return (
		<div style={{ padding: '10vh 20vw 10vh 20vw' }}>
			{redirect ? <Redirect to={{ pathname: '/' }} /> : null}
			<h1 className='text-center'>Log In</h1>
			<Formik initialValues={registerInitVals}
				validationSchema={registerSchema}
				onSubmit={(values) => handleSubmit(values.username, values.password)}>
				{({ errors, touched }) => (
					<Form>
						<label style={styles.spaced} htmlFor='username' className='form-label'>Username</label>
						<Field name='username' className='form-control' />
						{errors.username && touched.username ?
							<div style={styles.error}>{errors.username}</div> : null}

						<label style={styles.spaced} htmlFor='password' className='form-label'>Password</label>
						<Field type='password' name='password' className='form-control' />
						{errors.password && touched.password ?
							<div style={styles.error}>{errors.password}</div> : null}

						<Button style={styles.spaced} type='submit'>Log In</Button>
					</Form>
				)}
			</Formik>
			<h5 style={{ ...styles.error, ...styles.spaced }}>{error}</h5>
		</div>
	)
}
