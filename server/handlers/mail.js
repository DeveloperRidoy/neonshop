import isEmail from "../../utils/isEmail";
import AppError from "../utils/AppError";
import catchASync from "../utils/catchASync";
import sendMail from "../utils/sendMail";
import uploadImage from "../utils/uploadImage";

// @route       POSET api/mail
// @purpose     Send mail
// @access      Public
export const sendEmail = catchASync(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    country,
    enquiryType,
    size,
    heardFrom,
    joinNewsLetter,
    productInfo,
    message,
  } = req.body; 

  let image; 
 
  if (!enquiryType)
    throw new AppError(400, "enquiryType is required");

  if (req.file) {
      image = await uploadImage({
       buffer: req.file.buffer,
       width: 500,
       folder: "neonsignco/img/client-uploads",
     });
  }
  
  const data = {
    firstName,
    lastName,
    email,
    phone,
    country,
    enquiryType,
    size, 
    image,
    heardFrom,
    joinNewsLetter,
    productInfo,
    message,
  };


  let text = "";
  let html = "";

  // generate email text and html
  Object.keys(data).forEach(key => {
    // parse the json data
       try {
         data[key] = JSON.parse(data[key]);
    } catch (error) { }

    // for productInfo 
    if (key === "productInfo") {
      if (!data.productInfo) return;
       text += `Product Name: ${data[key].name} \nProduct Image: ${data[key].image} \nProduct link: ${data[key].link}`;
       html += `<p style="color:black"><span style="font-weight: bold">Product Name:</span> ${data[key].name}</p>
            <p style="color:black"><span style="font-weight: bold">Product Image:</span> <img src=${data[key].image} style="width: 400px; object-fit: cover;"/></p>
            <p style="color:black"><span style="font-weight: bold">Product Link:</span> <a href=${data[key].link}>Link</a></p>`;
      return;
    }

    // for image 
    if (key === 'image') {
      if (!data.image) return; 
       text += `Logo/Image: ${data[key].secure_url} `;
      html += `<p style="color:black"><span style="font-weight: bold">Logo/Image:</span> <img src=${data[key].secure_url} style="width: 400px; object-fit: cover;"/></p>`; 
      return;
    }

    // for the rest 
    text += key === "productInfo" ? "" : `${key}: ${data[key]}\n`;
    html += `<p><span style="font-weight: bold">${key}:</span>${data[key]}</p>`;
    return;

  })

  const mailData = {
    from: `"NeonSignCo" <${process.env.MAIL_SMTP_USERNAME}>`,
    to: process.env.MAIL_SMTP_USERNAME,
    subject: data.enquiryType,
    text,
    html,
  };

  await sendMail(mailData);
  return res.json({
    status: "success",
    message: "Your message has been received",
  });
});
