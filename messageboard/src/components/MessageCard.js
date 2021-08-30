import React, { useState } from 'react'
import * as Yup from 'yup'
import axios from 'axios'

import { Formik, Form, Field } from 'formik'
import { Card, Button } from 'react-bootstrap'

const editSchema = Yup.object().shape({
	content: Yup.string().required()
});

export default function MessageCard(props) {
	const [isEditing, setIsEditing] = useState(false);

	const deleteMessage = (id) => {
		axios.delete('http://localhost:5000/api/message', {
			params: {
				token: props.token,
				message_id: id
			}
		}).then(() => {
			props.updateMessages();
		});
	}

	const editMessage = (content) => {
		axios.patch('http://localhost:5000/api/message', {
			token: props.token,
			content: content,
			message_id: props.message.id
		}).then(() => {
			props.updateMessages();
			setIsEditing(false);
		});
	}

	let createdDelta = new Date() - new Date(props.message.created);
	// days
	let time = Math.floor(createdDelta / 86400000);
	if (time === 0) {
		// hours
		time = Math.floor(createdDelta / 3600000);
		if (time === 0) {
			// Minutes
			time = Math.floor(createdDelta / 60000);
			if (time === 0) {
				time = 'now'
			} else {
				time += 'm';
			}
		} else {
			time += 'h';
		}
	} else {
		time += 'd';
	}
	return (
		<div>
			{isEditing ?
				<Formik initialValues={{ content: props.message.content }}
					validationSchema={editSchema}
					onSubmit={(values, { resetForm }) => {
						editMessage(values.content);
						resetForm({});
					}}>
					{() => (
						<Form style={{ marginTop: '40px' }}>
							<Field component='textarea' rows={5} name='content' className='form-control' />
							<Button style={{ marginTop: '20px', marginRight: '20px' }} type='submit'>Save Changes</Button>
							<Button onClick={() => setIsEditing(false)} className='btn-secondary' style={{ marginTop: '20px' }}>Cancel</Button>
						</Form>
					)}
				</Formik>
				:
				<Card body style={{ marginTop: '40px', borderRadius: '10px' }}>
					<span className='h3 text-primary'>{props.message.username}	</span>
					<span className='text-muted'>({time}) {props.message.updated ? '(edited)' : ''}</span>
					{/* I spent a painful amount of time trying to make these go to the right using */}
					{/* normal methods, Bootstrap doesn't like me */}
					{props.user.id === props.message.user_id ?
						<span style={{ position: 'absolute', right: '18px' }}>
							<Button onClick={() => setIsEditing(true)} style={{ marginRight: '20px' }} className='btn-success'>Edit</Button>
							<Button onClick={() => deleteMessage(props.message.id)} className='btn-danger'>Delete</Button>
						</span> : null}
					<Card.Text style={{ marginTop: '10px', whiteSpace: 'pre-line' }}>{props.message.content}</Card.Text>
				</Card>}
		</div>
	)
}
