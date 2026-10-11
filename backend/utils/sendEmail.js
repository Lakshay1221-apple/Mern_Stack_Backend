export const sendEmail = async(options) => {
    const transporter = nodemailer.createTransport({
        service : "gmail",
        auth : {
            user : "",
            pass : ""
        }
    });
    
    const mailOptions = {
        from : process.env.SMPT_MAIL,
        to : options.email,
        subject : options.subject,
        text : options.message
    }           
}