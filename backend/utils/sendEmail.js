export const sendEmail = async(options) => {
    const transporter = nodemailer.createTransport({
        service : process.env.SMPT_SWERVICE,
        auth : {
            user : process.env.SMPT_MAIL,
            pass : process.env.SMPT_PASSWORD
        }
    });
    
    const mailOptions = {
        from : process.env.SMPT_MAIL,
        to : options.email,
        subject : options.subject,
        text : options.message
    }       
    await transporter.sendMail(mailOptions);    
}