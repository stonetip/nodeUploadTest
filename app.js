// Add the express module
const express = require("express");
const app = express();

// Allow access to static assets, e.g. html pages
app.use(express.static(__dirname));

// Enable JSON processing in routes
app.use(express.json());

// file upload support
const multer = require("multer");
const fs = require("fs-extra");

// upload func
var upload = multer(
	{
		storage: multer.diskStorage({

			destination: (req, file, cb) => {

				const subDir = req.body.dirName;

				const path = `./uploads/${subDir}/`;
				fs.mkdirsSync(path);

				cb(null, path);
			},
			filename: (req, file, cb) => {

				cb(null, file.originalname);
			}
		})
	}).any();


// upload route
app.post('/upload', (req, res, next) => {

	upload(req, res, function (err) {
		if (err instanceof multer.MulterError) {

			console.log(`multer err: $[err}`);

			res.status(500).send(err);

		} else if (err) {
			console.log(`general upload err: $[err}`);

			res.status(500).send(err);
		}
		else {
			console.log("upload ok");

			res.status(202).send("uploaded ok");
		}
	
	});
});



// Start the server up
let appInstance = app.listen(process.env.PORT || 8877, function () {
	console.log(`Node server is running on port ${appInstance.address().port}`);
});




