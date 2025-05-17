const nodemailer = require("nodemailer");

module.exports = async(email, subject, text)=>{
    try{
        const transporter = nodemailer.createTransport({
            service: process.env.SERVICE,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        });
        

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text
        })
        console.log("Email Sent Sucessfully");
    }catch(err){
        console.log("Failed to send email")
        console.log(err)
    }
}