const User = require('../models/user');
const Request = require('../models/request');
const mongoose = require('mongoose');
const { uuid } = require('uuidv4');
var nodemailer = require('nodemailer');
require("dotenv").config();
const date = require('date-and-time');

const reset = async (req, res) => {
    //reset the password
    // const {  } = req.params;
    const { password, uniqueKey } = req.body;

    Request.findOne({uuid_key: uniqueKey})
    .then(request => {
        const now = new Date();
        const SIXTY_MINUTES = 60;
        // console.log("Valid key");
        // console.log(uniqueKey, password);
        
        if(date.subtract(request.expiry_date, now).toMinutes() <= 0){
            //the link has expired
            // console.log("Expired...");
            
            res.status(400).json({success: false, message: "I'm sorry, your unique link has expired.  Please, request another one."});
        }
        else{
            console.log(request.username);
            User.findOne({username: request.username}, (err, user) => {        
                if (user === null) {
                  // console.log("Can't find user...");
                  
                    res.status(400).send({
                        success: false,
                        message: 'User not found.'
                    });
                }
                //User can update his/her own password
                //Only admin can update everyone else password
                else{
                    user.setPassword(password);
                    user.save();
                    res.status(200).json({success: true})
    
                }
            });
        }
    })
    .catch(err => res.status(400).json({success: false, message: "We are experiencing some problem resetting your password.  Please, try again later."}))
    return res;
}


const emailUniqueLink = async ( email, uniqueKey, firstName ) => {
    // console.log("Sending email...");

    //send an email to the 
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // upgrade later with STARTTLS
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL, // sender address
        to: email, // list of receivers
        subject: 'RE: Reset password', // Subject line
        html: `<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>WeExplore - Password Reset</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin: 0; padding: 0;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="padding: 10px 0 30px 0;">
          <table
            align="center"
            border="0"
            cellpadding="0"
            cellspacing="0"
            width="600"
            style="border: 1px solid #cccccc; border-collapse: collapse;"
          >
            <tr>
              <td
                align="center"
                bgcolor="#70bbd9"
                style="padding: 40px 0 30px 0; color: #153643; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;"
              >
                <img
                  src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/210284/h1.gif"
                  alt="Creating Email Magic"
                  width="300"
                  height="230"
                  style="display: block;"
                />
              </td>
            </tr>
            <tr>
              <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td
                      style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;"
                    >
                      <b>Reset your password</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;"
                    >
                      Hello ${ firstName },<br />
                      Please, click the following link to reset your password.
                      <a href="${process.env.FRONTEND_URL}/passreset/${uniqueKey}">reset your password</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td bgcolor="#ee4c50" style="padding: 30px 30px 30px 30px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td
                      style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;"
                      width="75%"
                    >
                      &reg; We Explore, Melbourne 2013<br />
                    </td>
                    <td align="right" width="25%">
                      <table border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td
                            style="font-family: Arial, sans-serif; font-size: 12px; font-weight: bold;"
                          >
                            <a
                              href="http://www.twitter.com/"
                              style="color: #ffffff;"
                            >
                              <img
                                src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/210284/tw.gif"
                                alt="Twitter"
                                width="38"
                                height="38"
                                style="display: block;"
                                border="0"
                              />
                            </a>
                          </td>
                          <td style="font-size: 0; line-height: 0;" width="20">
                            &nbsp;
                          </td>
                          <td
                            style="font-family: Arial, sans-serif; font-size: 12px; font-weight: bold;"
                          >
                            <a
                              href="http://www.twitter.com/"
                              style="color: #ffffff;"
                            >
                              <img
                                src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/210284/fb.gif"
                                alt="Facebook"
                                width="38"
                                height="38"
                                style="display: block;"
                                border="0"
                              />
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`// plain text body
    };

    let success = false;
    let info = await transporter.sendMail(mailOptions);
    // console.log(info);
}

const generateUniqueLink = (req, res) => {
    //generate a unique link that will be send to the user via email
    const {email} = req.body;
    // console.log(email);
    
    User.findOne({"username": email})
    .then(user => {
        //if the username can't be found in the system
        // console.log("We can find you in our record.");
        // console.log(result);
        // console.log(user);
        
        if(!user){
            return res.status(400).json({success: false, message: "Sorry, we don't have your email in our system."})
        }
        else{
            //1. generate an uuid key and store it in the database
            // console.log("Generating unique key");
            
            const uniqueKey = uuid();
            // console.log(uniqueKey);
            // console.log(date.addHours(new Date(), 1));
            const now = new Date();
            const expiryDate = date.addHours(now, 1);
           
            const newRequest = new Request({uuid_key: uniqueKey, username: email, expiry_date: expiryDate});
            // console.log("Created a new request.");

            //2. send an email with the uuid link
            emailUniqueLink(email, uniqueKey, user.first_name)
            .catch(err => {
              res.status(500);
              res.json({success: false, message: "Something went horribly wrong while trying to send an email to you."})
            });
            
            // console.log("Email send...");
            newRequest.save()
            .then(()=>{
                // console.log("Request saved.")
                return res.status(200).json({success: true, message: "We've sent you an email with a unique link to reset your password.  Please, check your inbox or even junk mail."});
            })
           .catch(err => {
              res.status(500);
              res.json({success: false, message: "Something went horribly wrong while trying to serve you."})
            }
            );
      }
    })

}

module.exports = { reset, generateUniqueLink };