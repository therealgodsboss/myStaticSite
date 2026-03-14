const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongooseSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utilities/appError');

const errorController = require('./controllers/errorController');


///---		Route Handlers		---///


const enquiryRouter = require('./routes/enquiryRoute');
const userRouter = require('./routes/userRoute');
const viewRouter = require('./routes/viewRoute');
const adminRouter = require('./routes/adminRoute');


const app = express();

app.set('trust proxy', 1);



///---			FrontEnd Rendering			---///


app.set('view engine', 'pug');

app.set('views', path.join(__dirname, 'views'));


/// static file server


app.use(express.static(path.join(__dirname, 'public')));



const crypto = require('crypto');

app.use((req, res, next) => {
	res.locals.nonce = crypto.randomBytes(16).toString('base64');
	next();
});


/// GA4 Tag

app.use((req, res, next) => {
	res.locals.gaMeasurementId = process.env.GA_MEASUREMENT_ID;
	next();
});




///---			Middleware			---///


///	Helmet

app.use(

	helmet.contentSecurityPolicy({

		useDefaults: false,

		directives: {

			defaultSrc: [
				"'self'"
			],
			scriptSrc: [
				"'self'",
				"'unsafe-inline'",
				'https://www.googletagmanager.com',
				'https://www.google-analytics.com',
				'https://maps.googleapis.com'
			],
			frameSrc: [
				"'self'",
				'https://www.youtube.com',
				'https://www.youtube-nocookie.com',
				'https://www.google.com'
			],
			connectSrc: [
				"'self'",
				'https://www.google-analytics.com',
				'https://analytics.google.com',
				'https://www.googletagmanager.com',
				'https://maps.googleapis.com',
				'https://res.cloudinary.com'
			],
			styleSrc: [
				"'self'",
				"https://fonts.googleapis.com",
				"'unsafe-inline'"
			],
			fontSrc: [
				"'self'",
				'https://fonts.gstatic.com',
				'data:'
			],
			imgSrc: [
				"'self'",
				'data:',
				'https://www.google-analytics.com',
				'https://maps.googleapis.com',
				'https://maps.gstatic.com',
				'https://res.cloudinary.com'
			],
			objectSrc: ["'none'"],

			upgradeInsecureRequests: []
		}
	})
);



/// Morgan console info

app.use(morgan('dev'));



/// convert incoming data to Json

app.use(express.json());



///  Cookie Parser  

app.use(cookieParser());


/// form data=method

app.use(express.urlencoded({ extended: true }))




///	API rate limiter

const limiter = rateLimit(

	{
		max: 100,

		windowMs: 60 * 60 * 1000,

		message: 'Too many API requests for this IP address. Please try again in 60 minutes...'
	}
)

app.use('/api', limiter);



/// Data sanitize NoSQL Injection 

app.use(mongooseSanitize());



/// Data sanitize XSS Attacks 

app.use(xss());



/// Prevent Parameter Pollution 

app.use(hpp(
	{
		whitelist: ['tags', 'category']
	}
))




app.use((req, res, next) => {

	console.log(`API call logged at :${req.requestTime = new Date().toISOString()}`);

	next();
})




///---				Routes				---///


app.use('/api/v1/enquiries', enquiryRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/', viewRouter);



///---		Error Handling		---///


app.all('*', (req, res, next) => {

	next(new AppError(`Cant find ${req.originalUrl} on this server`, 404));

});



app.use(errorController.globalErrorHandler);

module.exports = app;