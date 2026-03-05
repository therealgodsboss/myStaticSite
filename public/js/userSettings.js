import axios from 'axios';

import { showAlert } from './alert';




export const signUpUser = async (data) => {

	try {

		const result = await axios({

			method: "POST",
			url: '/api/v1/users/signup',
			data

		})

		if (result.data.status === 'success') {

			showAlert('success', `SignUp Successful - \n Please Check your Inbox!!`);

			window.setTimeout(() => {

				location.assign('/')
			}, 3000)
		}

	} catch (err) {

		showAlert('error', 'Error Signing up ..... Try Again!!');
	}
}





export const userUpdateSettings = async (data, type, userId) => {

	try {

		const url = type === 'password'
			? '/api/v1/users/update-my-password'
			: '/api/v1/users/update-me'

		const result = await axios({

			method: "PATCH",
			url,
			data
		})
		if (result.data.status === 'success') {

			showAlert('success', `${type.toUpperCase()} Updated Successfully!!`);

			window.setTimeout(() => {

				location.assign(`/my-account/${userId}`)

			}, 1500)
		}
	} catch (err) {

		showAlert('error', err.response.data.message);
	}
}





///			 Reset Password			/// 




export const resetEmailPasswordUser = async (email) => {

	try {

		const result = await axios({

			method: "POST",
			url: `/api/v1/users/forgot-password`,
			data: { email }

		})

		if (result.data.status === 'success') {

			showAlert('success', 'Reset Password Email sent. Please check your inbox.');

			window.setTimeout(() => {

				location.assign('/login-page')
			}, 3000)
		}

	} catch (err) {

		showAlert('error', 'Error Password Reset ..... Try Again!!');
	}
}



export const setNewPasswordUser = async (data, token) => {

	try {

		const result = await axios({

			method: "PATCH",
			url: `/api/v1/users/reset-password/${token}`,
			data

		})

		if (result.data.status === 'success') {

			showAlert('success', 'Password reset. Please log in!');

			window.setTimeout(() => {

				location.assign('/login-page')
			}, 3000)
		}

	} catch (err) {

		showAlert('error', 'Error Password Reset ..... Try Again!!');
	}
}





//------------------------- Address functions --------------------------//



export const userUpdateAddress = async (data, addressId, userId) => {

	try {

		const result = await axios({

			method: "PATCH",
			url: `/api/v1/users/updateMyAddress/${addressId}`,
			data
		})

		if (result.data.status === 'success') {

			showAlert('success', `Address Updated Successfully!!`);

			window.setTimeout(() => {

				location.assign(`/my-account/${userId}`)

			}, 1500)
		}

	} catch (err) {

		showAlert('error', err.response.data.message);
	}
}




export const userNewAddress = async (data, userId) => {

	try {

		const result = await axios({

			method: "POST",
			url: `/api/v1/users/createNewAddress`,
			data
		})

		if (result.data.status === 'success') {

			showAlert('success', `Address Created Successfully!!`);

			window.setTimeout(() => {

				location.assign(`/my-account/${userId}`)

			}, 1500)
		}

	} catch (err) {

		showAlert('error', err.response.data.message);
	}
}




/// delete user address




export const userdeleteAddress = async (addressId, userId) => {

	try {

		const result = await axios({

			method: "DELETE",
			url: `/api/v1/users/deleteAddress/${addressId}`
		})

		if (result.data.status === 'success') {

			showAlert('success', `Address Deleted Successfully!!`);

			window.setTimeout(() => {

				location.assign(`/my-account/${userId}`)

			}, 1500)
		}
	} catch (err) {

		showAlert('error', err.response.data.message);
	}
}



///			 Create a review			///


export const createReview = async (data, productId, slug) => {

	try {

		const result = await axios(
			{

				method: "POST",
				url: `/api/v1/products/${productId}/reviews`,
				data
			})

		if (result.data.status === 'success') {

			showAlert('success', `Review Added Successfully!!`);

			window.setTimeout(() => {

				location.assign(`/product-page/${slug}`);

			}, 2500);
		}

	} catch (err) {

		showAlert('error', err.response.data.message);
	}
}