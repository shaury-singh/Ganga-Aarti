import express from "express";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
// import nodemailer from "nodemailer";
// import { google } from "googleapis";
import Mailjet from "node-mailjet";

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

// const mailjet = require("node-mailjet").connect(
// 	"e1719917564ec6bbe573fe4dba68d26a",
// 	"d7292215b6fada71dbf3fa9065f431aa"
// );

const mailjet = Mailjet.apiConnect(
	"e1719917564ec6bbe573fe4dba68d26a",
	"d7292215b6fada71dbf3fa9065f431aa"
);

async function sendEmail(mailOptions) {
	try {
		const request = await mailjet
			.post("send", { version: "v3.1" })
			.request({
				Messages: [
					{
						From: {
							Email: "harshdeepanshustrix@gmail.com",
							Name: "Harsh Deepanshu",
						},
						To: [
							{
								Email: mailOptions.to,
								Name: mailOptions.name,
							},
						],
						Subject: mailOptions.subject,
						TextPart: mailOptions.text,
						HTMLPart: mailOptions.html,
					},
				],
			});
		console.log("Email sent successfully:", request.body);
		return request.body;
	} catch (error) {
		console.error("Error sending email:", error);
		throw error;
	}
}

// Example usage for sending a booking confirmation
app.post("/book-your-aarti", async (req, res) => {
	const body = req.body;

	const mailToAdmin = {
		to: "rathore.singh.shaury@gmail.com",
		name: "Admin",
		subject: "New Booking",
		text: `Date: ${body.date}\n
               Name: ${body.Name}\n
               E-Mail: ${body.Email}\n
               Phone: ${body.phoneNumber}\n
               Place: ${body.Place}`,
		html: `<p>Date: ${body.date}</p>
               <p>Name: ${body.Name}</p>
               <p>E-Mail: ${body.Email}</p>
               <p>Phone: ${body.phoneNumber}</p>
               <p>Place: ${body.Place}</p>`,
	};

	const mailToUser = {
		to: body.Email,
		name: body.Name,
		subject: "Appointment Confirmation For Ganga Aarti Events",
		html: `<h1>Your Appointment Details:</h1>
               <p>Date: ${body.date}</p>
               <p>Name: ${body.Name}</p>
               <p>E-Mail: ${body.Email}</p>
               <p>Phone: ${body.phoneNumber}</p>
               <p>Place: ${body.Place}</p>`,
	};

	try {
		await sendEmail(mailToAdmin);
		console.log("Admin email sent successfully.");
		await sendEmail(mailToUser);
		console.log("User confirmation email sent successfully.");
		res.render("success.pug");
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
