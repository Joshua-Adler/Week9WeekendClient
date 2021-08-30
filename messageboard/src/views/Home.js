import React, { useState, useEffect } from 'react'
import * as Yup from 'yup'
import axios from 'axios'

import { Formik, Form, Field } from 'formik'
import { Button } from 'react-bootstrap'

import MessageCard from '../components/MessageCard'

const messageSchema = Yup.object().shape({
	content: Yup.string().required()
});

const messageInitVals = {
	content: ''
}

export default function Home(props) {
	const [messages, setMessages] = useState([]);

	const updateMessages = () => {
		axios.get('http://localhost:5000/api/messages', {
			params: {
				token: props.token
			}
		}).then((response) => {
			setMessages(response.data.messages);
		});
	}

	const handleSubmit = (content) => {
		axios.post('http://localhost:5000/api/message', {
			token: props.token,
			content: content
		}).then(() => {
			updateMessages();
		});
	}

	useEffect(updateMessages, [props.token]);

	return (
		<div style={{ marginLeft: '200px', marginRight: '200px' }}>
			<Formik initialValues={messageInitVals}
				validationSchema={messageSchema}
				onSubmit={(values, { resetForm }) => {
					handleSubmit(values.content);
					resetForm({});
				}}>
				{() => (
					<Form>
						<Field component='textarea' rows={5} name='content' className='form-control' />
						<Button style={{ marginTop: '20px' }} type='submit'>Post</Button>
					</Form>
				)}
			</Formik>
			{messages.map((message) => <MessageCard token={props.token} updateMessages={updateMessages} user={props.user} key={message.id} message={message} />)}
		</div>
	)
}
