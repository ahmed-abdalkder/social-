
import nodemailer from  'nodemailer'

export const SendEmail = async(to,subject,html)=>{
const transporter = nodemailer.createTransport({
  service:"gmail",
  auth: {
    user: email_name,
    pass: email_key,
  },
});

 const info = await transporter.sendMail({
    from: email_name,  
    to: to ? to :"" , 
    subject: subject  ? subject : "Hello ✔", 
    html: html ? html : "<b>Hello world?</b>", 
  })
}