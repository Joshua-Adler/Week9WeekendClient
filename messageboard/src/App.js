import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { Switch, Route, Redirect } from 'react-router-dom'

import Home from './views/Home'
import Login from './views/Login'
import Register from './views/Register'
import Navigation from './components/Navigation'

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
	const [token, setToken] = useState(localStorage.getItem('token'));
	const [user, setUser] = useState({name: '...'});

	useEffect(() => {
		if (token != null) {
			axios.get('http://localhost:5000/api/user', {
				params: {
					token: token
				}
			}).then((response) => {
				setUser(response.data);
			}).catch((error) => {
				setToken(null);
				localStorage.removeItem('token');
			});
		}
	}, [token])

	return (
		<div>
			<Navigation user={user} token={token} setToken={setToken} />
			<div style={{ margin: '50px' }}>
				<Switch>
					<Route exact path='/'>{token ? <Home user={user} token={token} /> : <Redirect to={{ pathname: '/login' }} />}</Route>
					<Route exact path='/login'><Login setToken={setToken} /></Route>
					<Route exact path='/register'><Register setToken={setToken} /></Route>
					<Route path='/'>404</Route>
				</Switch>
			</div>
		</div>
	)
}

export default App;
