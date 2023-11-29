const nodemailer = require("nodemailer");


const sendemail = async (data,req,res)=>{

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: "jeelpatel085@gmail.com",
          pass: "vzew nfnn hdxv jasl",
        },
      });
      
      // async..await is not allowed in global scope, must use a wrapper

        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: '"hey 👻" <abc@gmail.com>', // sender address
          to: data.to, // list of receivers
          subject: data.subject, // Subject line
          text: data.text, // plain text body
          html: data.htm, // html body
        });
      
        console.log("Message sent: %s", info.messageId);
  
       

}


module.exports = sendemail;