const express = require('express'),
  router = express.Router(),
  nodemailer = require('nodemailer'),
  cors = require('cors'),
  creds = require('./config');

const transport = {
  host: 'smtp.gmail.com', // Don’t forget to replace with the SMTP host of your provider
  port: 465,
  secure: true,
  auth: {
    user: creds.USER,
    pass: creds.PASS,
  },
};

const transporter = nodemailer.createTransport(transport);

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

router.post('/send', (req, res, next) => {
  let name = req.body.name;
  let email = req.body.email;
  let message = req.body.message;
  let content = `name: ${name} \n email: ${email} \n message: ${message} `;

  let mail = {
    from: name,
    to: 'cjfaquino@gmail.com', // Change to email address that you want to receive messages on
    subject: 'New Message from Contact Form',
    text: content,
  };

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        status: 'fail',
      });
    } else {
      res.json({
        status: 'success',
      });
    }
  });
});

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', router);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.info(`Server has started on ${PORT}`));
