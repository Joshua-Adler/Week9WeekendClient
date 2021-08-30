import React from 'react'

import { Link } from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap'

export default function Navigation(props) {

	const logout = () => {
		props.setToken(null);
		localStorage.removeItem('token');
	}

	return (
		<Navbar bg='light' style={{ paddingLeft: '150px', paddingRight: '150px' }}>
			<Navbar.Brand>MessageBoard</Navbar.Brand>
			<Nav style={{ width: '100%' }}>
				{props.token ?
					<>
						<Nav.Link as={Link} to='/'>Home</Nav.Link>
						<Nav.Link onClick={logout}>Log Out</Nav.Link>
						<h4 style={{ margin: 'auto 0 auto auto' }}>{props.user.name}</h4>
					</>
					:
					<>
						<Nav.Link as={Link} to='/login'>Log In</Nav.Link>
						<Nav.Link as={Link} to='/register'>Register</Nav.Link>
					</>
				}
			</Nav>
		</Navbar>
	)
}
