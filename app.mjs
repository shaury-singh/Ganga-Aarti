import express from "express";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import { google } from "googleapis";

const app = express();
const port = 8000;

app.use("/static", express.static("static"));
app.set("view engine", "pug");
const __dirname = dirname(fileURLToPath(import.meta.url));
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.status(200).render("index.pug");
});

app.get("/book-your-aarti", (req, res) => {
	res.status(200).render("book.pug");
});

// app.post('/book-your-aarti',async (req,res)=>{
//     const body = req.body;
//     // mail data
//     const mail = {
//         from: 'shaurysingh84@gmail.com',
//         to: 'rathore.singh.shaury@gmail.com',
//         subject: 'New Booking',
//         text: `Date:${req.body.date}\n
//         Name:${req.body.Name}\n
//         E-Mail:${req.body.Email}\n
//         Phone:${req.body.phoneNumber}\n
//         Place:${req.body.Place}`
//     };
//     const mailToUser = {
//         from: 'shaurysingh84@gmail.com',
//         to: 'rathore.singh.shaury@gmail.com',
//         subject: 'Appointment Confirmation For Ganga Aarti Events',
//         // text: `The Following is yourDate:${req.body.date}\n
//         // Name:${req.body.Name}\n
//         // E-Mail:${req.body.Email}\n
//         // Phone:${req.body.phoneNumber}\n
//         // Place:${req.body.Place}`
//         html: `<h1>The Following Is Your Appointment Details: <br> Date: ${req.body.date} <br>Name:${req.body.Name} <br>E-Mail:${req.body.Email} <br>Phone:${req.body.phoneNumber} <br>Place:${req.body.Place}`
//     };
//     transporter.sendMail(mail, (error, info) => {
//         if (error) {
//           return console.error('Error sending email:', error);
//         }
//         console.log('Email sent successfully:', info.response);
//     }).then(()=>{
//         console.log(body);
//         res.render('sucess.pug');
//     });
// });

// const transporter = nodemailer.createTransport({
// 	host: "mail.gangaaartievents.com",
// 	port: 465,
// 	secure: true, // use TLS
// 	auth: {
// 		user: "info@gangaaartievents.com",
// 		pass: "info@gangaaartievents.com",
// 	},
// 	tls: {
// 		// do not fail on invalid certs
// 		rejectUnauthorized: false,
// 	},
// });

// transporter.verify((err, success) => {
// 	if (err) console.error(err);
// 	console.log("Your config is correct");
// });

const CLIENT_ID =
	"405359127930-5bv29egjig19bqike6rjd2acjhssvsf2.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
	"1//046u2hxMUAPM-CgYIARAAGAQSNwF-L9IrbIoixknxBqOZaNY4oMdufkH_YQ_2TptE75l0u6W6CKyaX9F94iIuy7mTMFFgqrauKI4";

const oAuth2Client = new google.auth.OAuth2(
	CLIENT_ID,
	CLIENT_SECRET,
	REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function createTransporter() {
	try {
		const accessToken = await oAuth2Client.getAccessToken();
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				user: "harshdeepanshustrix@gmail.com",
				clientId: CLIENT_ID,
				clientSecret: CLIENT_SECRET,
				refreshToken: REFRESH_TOKEN,
				accessToken: accessToken.token, // Use .token here
			},
		});
		// Verify the transporter
		transporter.verify((err, success) => {
			if (err) console.error("Error in verifying transporter", err);
			console.log("Your config is correct");
		});
		return transporter;
	} catch (error) {
		console.error("Error creating transporter", error);
		throw error;
	}
}

app.post("/book-your-aarti", async (req, res) => {
	const body = req.body;
	const mail = {
		from: "harshdeepanshustrix@gmail.com",
		to: "rathore.singh.shaury@gmail.com",
		subject: "New Booking",
		text: `Date: ${body.date}\n
        Name: ${body.Name}\n
        E-Mail: ${body.Email}\n
        Phone: ${body.phoneNumber}\n
        Place: ${body.Place}`,
	};

	const mailToUser = {
		from: "harshdeepanshustrix@gmail.com",
		to: body.Email,
		subject: "Appointment Confirmation For Ganga Aarti Events",
		html: `<h1>The Following Is Your Appointment Details:</h1>
               <p>Date: ${body.date}</p>
               <p>Name: ${body.Name}</p>
               <p>E-Mail: ${body.Email}</p>
               <p>Phone: ${body.phoneNumber}</p>
               <p>Place: ${body.Place}</p>`,
	};

	try {
		const transporter = await createTransporter(); // Get the transporter
		await transporter.sendMail(mail);
		console.log("Admin email sent successfully.");
		await transporter.sendMail(mailToUser);
		console.log("User confirmation email sent successfully.");
		res.render("sucess.pug");
	} catch (error) {
		console.error("Error sending email:", error);
		res.status(500).send(
			"There was an error processing your request. Please try again later."
		);
	}
});

app.get("/about-us", (req, res) => {
	res.status(200).render("aboutUs.pug");
});

app.get("/gallery", (req, res) => {
	res.status(200).render("gallery.pug");
});

app.get("/services", (req, res) => {
	res.status(200).render("services.pug");
});

app.listen(port, () => {
	console.log(
		`Application Started in Development Phase on you Localhost at Port:${port}`
	);
});
