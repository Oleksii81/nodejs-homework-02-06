import nodemailer from "nodemailer";
import "dotenv/config";

const {UKR_NET_PASSWORD, UKR_NET_FROM} = process.env;

const nodemailerConfig = {
    host: "smtp.ukr.net",
    port: 465, // 25, 465, 2525
    secure: true,
    auth: {
        user: UKR_NET_FROM,
        pass: UKR_NET_PASSWORD,
    }
};

const transport = nodemailer.createTransport(nodemailerConfig);

//const email = {
//    to: "tourus81@gmail.com",
//    from: UKR_NET_FROM,
//    subject: "Test",
//    html: "<p> It is working</p>",
// };

//const sendEmail = async () => {
//   try {
//     await transport.sendMail(email);
//     console.log("Email sent successfully");
//   } catch (error) {
//     console.log(error.message);
//   }
// };

const sendEmail = data => {
    const email = {...data, from: UKR_NET_FROM};
    return transport.sendMail(email);
}

export default sendEmail;