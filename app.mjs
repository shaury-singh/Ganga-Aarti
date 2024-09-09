import express from "express";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
// import nodemailer from "nodemailer";
// import { google } from "googleapis";
// import Mailjet from "node-mailjet";

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

const mailjet = Mailjet.apiConnect(
	"API KEY", // Update this with your API Key (Admin)
	"API SECRET" // Update this with your API Secret (Admin)
);

async function sendEmail(mailOptions) {
	try {
		const request = await mailjet
			.post("send", { version: "v3.1" })
			.request({
				Messages: [
					{
						From: {
							Email: "EMAIL ID", // Update this with your email (Admin)
							Name: "FULL NAME", // Update this with your name (Admin)
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
		console.log("Check API Key and Secret and Email Address (Admin)");
		throw error;
	}
}

// Example usage for sending a booking confirmation
app.post("/book-your-aarti", async (req, res) => {
	const body = req.body;

const mailToAdmin = {
	to: "rathore.singh.shaury@gmail.com", // Update this with your email (Admin)
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
