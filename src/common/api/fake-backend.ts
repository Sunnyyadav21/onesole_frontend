// @ts-nocheck
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

type User = {
	id: number
	email?: string
	username: string
	password: string
	firstName: string
	lastName: string
	role: string
	token: string
}

// const TOKEN =
//	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjU4NTAwOTVhYzRhMDBkNzNjMGZiYjEiLCJpYXQiOjE3MTc0MDg3MjksImV4cCI6MTcyMDAwMDcyOSwidHlwZSI6InJlZnJlc2gifQ.mnDquIZGV_K4P4eTKzc9_wmabUR44syNKzOUCkZuF0A'

const mock = new MockAdapter(axios, { onNoMatch: 'passthrough' })

const users: User[] = [
	{
		id: 1,
		email: 'johndoe@example.com',
		username: 'mohan',
		password: 'mohan',
		firstName: 'John ',
		lastName: 'Doe',
		role: 'Admin',
		token: TOKEN,
	},
]

export default function configureFakeBackend() {
	mock.onPost('/login').reply(function (config) {
		return new Promise(function (resolve, reject) {
			setTimeout(function () {
				// get parameters from post request
				const params = JSON.parse(config.data)
				// find if any user matches login credentials
				const filteredUsers = users.filter((user) => {
					return (
						user.email === params.email && user.password === params.password
					)
				})
				if (filteredUsers.length) {
					// if login details are valid return user details and fake jwt token
					const user = filteredUsers[0]
					resolve([200, user])
				} else {
					// else return error
					resolve([401, { message: 'Email or password is incorrect' }])
				}
			}, 1000)
		})
	})

	mock.onPost('/register').reply(function (config) {
		return new Promise(function (resolve, reject) {
			setTimeout(function () {
				// get parameters from post request
				const params = JSON.parse(config.data)

				// add new users
				const [firstName, lastName] = params.fullname.split(' ')
				const newUser: User = {
					id: users.length + 1,
					email: params.email,
					username: firstName,
					password: params.password,
					firstName: firstName,
					lastName: lastName,
					role: 'Admin',
					token: TOKEN,
				}
				users.push(newUser)

				resolve([200, newUser])
			}, 1000)
		})
	})

	mock.onPost('/forget-password').reply(function (config) {
		return new Promise(function (resolve, reject) {
			setTimeout(function () {
				// get parameters from post request
				const params = JSON.parse(config.data)

				// find if any user matches login credentials
				const filteredUsers = users.filter((user) => {
					return user.email === params.email
				})

				if (filteredUsers.length) {
					// if login details are valid return user details and fake jwt token
					const responseJson = {
						message:
							"We've sent you a link to reset password to your registered email.",
					}
					resolve([200, responseJson])
				} else {
					// else return error
					resolve([
						401,
						{
							message:
								'Sorry, we could not find any registered user with entered email',
						},
					])
				}
			}, 1000)
		})
	})
}
