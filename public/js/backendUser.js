import axios from 'axios';

import { showAlert } from './alert';



export const createUserDB = async (data) => {

	try {

		const result = await axios({

			method: "POST",
			url: "/api/v1/users",
			data
		})



		if (result.data.status === 'success') {

			showAlert('success', 'User Created Successfully',);

			setTimeout(() => {

				window.location.href = "/admin/be_user-list";

			}, 1500);
		}
	} catch (err) {

		showAlert('error', err.response.data.message);
	}
}




export const updateUserDB = async (data, id) => {


	try {

		const result = await axios({

			method: "PATCH",
			url: `/api/v1/users/${id}`,
			data
		})

		if (result.data.status === 'success') {

			showAlert('success', 'User Data Updated Successfully');

			setTimeout(() => {

				window.location.href = "/admin/be_user-list";

			}, 1500);
		}

	} catch (err) {

		showAlert('error', err.response.data.message);

		console.log(err);
	}
}


export const updateSettings = async (data, type) => {

	try {

		const url = type === 'password'
			? '/api/v1/users/update-my-password'
			: '/api/v1/users/update-me'

		const result = await axios({

			method: "PATCH",

			url,
			data
		}
		)
		if (result.data.status === 'success') {

			showAlert('success', `${type.toUpperCase()} Updated Successfully!!`);

			window.setTimeout(() => {

				location.assign('/my-details')

			}, 1500)
		}
	} catch (err) {

		showAlert('error', err.response.data.message);
	}
}

