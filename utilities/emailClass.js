const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert } = require('html-to-text');

module.exports = class Email {

	constructor(user, url = null) {

		this.to = user.email;
		this.firstname = user.name.split(' ')[0];

		this.url = url;
		this.from = `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`;
	}


	newTransport() {

		if (process.env.NODE_ENV === 'development') {

			return nodemailer.createTransport(
				{
					host: process.env.EMAIL_HOST,
					port: Number(process.env.EMAIL_PORT),
					connectionTimeout: 10000,
					greetingTimeout: 10000,
					socketTimeout: 15000,
					auth: {

						user: process.env.EMAIL_USERNAME,
						pass: process.env.EMAIL_PASSWORD

					}
				}
			);
		}

		/// (Brevo)

		if (process.env.NODE_ENV === 'production') {

			return nodemailer.createTransport({

				host: process.env.BREVO_HOST,
				port: Number(process.env.BREVO_PORT),

				/// use secure on port 587, dont on 465

				secure: Number(process.env.BREVO_PORT) === 465,
				connectionTimeout: 10000,
				greetingTimeout: 10000,
				socketTimeout: 15000,
				auth: {

					user: process.env.BREVO_LOGIN,
					pass: process.env.BREVO_PASSWORD
				}
			});
		}

		throw new Error(`Unsupported NODE_ENV value: ${process.env.NODE_ENV}`);
	}

	async send(template, subject) {

		try {
			const transport = this.newTransport();
			const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`,
				{
					firstname: this.firstname,
					url: this.url,
					subject,
					logoUrl: `${process.env.CANONICAL_URL}/img/logo/newLogo.png`
				}
			);

			const mailOptions = {

				from: this.from,
				to: this.to,
				subject,
				html,
				text: convert(html)
			};

			const info = await transport.sendMail(mailOptions);
			console.log('Email sent:', {
				to: mailOptions.to,
				subject: mailOptions.subject,
				messageId: info.messageId,
				response: info.response
			});
			return info;

		} catch (err) {

			console.error('Email failed:', {
				message: err.message,
				code: err.code,
				command: err.command,
				response: err.response,
				responseCode: err.responseCode
			});
			throw err;
		}
	}


	/// Template send functions


	async sendWelcome() {

		await this.send('welcome', 'Welcome to our website');
	}


	async orderConfirm() {

		await this.send('orderConfirm', 'Order details');
	}


	async resetPassword() {

		await this.send('resetPassword', 'Reset Password');
	}


	async enquiryEmail() {

		this.to = process.env.BUSINESS_EMAIL;
		await this.send('enquiryEmail', 'You Received an Enquiry');
	}


};
