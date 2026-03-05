
import { login, logout } from "./login";

import { signUpUser } from "./userSettings";





/// 		Lucide Icons		///


import { createIcons, icons } from 'lucide';


document.addEventListener('DOMContentLoaded', () => {

	createIcons({ icons });
});




const loginBtn = document.querySelector('.login__form');
const logoutBtn = document.querySelector('.logout--btn');
const signupForm = document.querySelector('.signup__form');

const logoutAccountBtn = document.getElementById('my-account-logout');




//--------------------------- Functionality -----------------------------//



///-------------------- User Login / logout / Signup --------------///



if (loginBtn) {

	loginBtn.addEventListener('submit', e => {

		e.preventDefault();

		const email = document.getElementById('login-email').value;
		const password = document.getElementById('login-password').value;

		login(email, password);
	})
}


if (logoutBtn) {

	logoutBtn.addEventListener('click', e => {

		e.preventDefault();

		logout();
	})
}

if (logoutAccountBtn) {

	logoutAccountBtn.addEventListener('click', e => {

		e.preventDefault();

		logout();
	})
}


if (signupForm) {

	signupForm.addEventListener('submit', e => {

		e.preventDefault();

		const data = {

			name: document.getElementById('signup-name').value,
			email: document.getElementById('signup-email').value,
			password: document.getElementById('signup-password').value,
			passwordConfirm: document.getElementById('signup-passwordConfirm').value,
			phone: document.getElementById('signup-phone').value
		}

		signUpUser(data);
	})
}




/// How it works bubbling 



const howItWorks = document.getElementById("how-it-works");


if (howItWorks) {
	const panels = howItWorks.querySelectorAll(".process__step-text");
	const buttons = howItWorks.querySelectorAll(".process__step--btn");

	howItWorks.addEventListener("click", (e) => {
		const btn = e.target.closest(".process__step--btn");
		if (!btn) return;

		e.preventDefault();

		const step = btn.dataset.step;

		/// panels

		panels.forEach((panel) => {
			const isTarget = panel.classList.contains(`process-step--${step}`);
			panel.classList.toggle("content-active", isTarget);
			panel.classList.toggle("content-hidden", !isTarget);
		});

		/// buttons

		buttons.forEach((b) => {
			const isActive = b === btn;
			b.classList.toggle("btn-active", isActive);
			b.classList.toggle("btn-inactive", !isActive);
		});
	});
}


