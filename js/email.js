import emailjs from '@emailjs/browser';

const SERVICE_ID = "service_wnfaq3p"; // no security, hard coded IDs because only mock website
const TEMPLATE_ID = "template_4h5cf9g"; // no security, hard coded IDs because only mock website
const PUBLIC_KEY = "MdOC5qc4MLrdpIhtS"; // no security, hard coded IDs because only mock website

/**
 * sends a contact email using the template
 * @param {Object} formData
 */
export const sendSkateInquiry = async (formData) => {
  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        name: formData.name,
        title: formData.title,
        message: formData.message,
        user_email: formData.email,
      },
      PUBLIC_KEY
    );
    return response;
  } catch (error) {
    console.error("EmailJS Error:", error);
    throw error;
  }
};