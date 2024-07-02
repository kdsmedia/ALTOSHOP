// src/config/config.js

require('dotenv').config();

module.exports = {
  whatsappApiToken: process.env.WHATSAPP_API_TOKEN,
  phoneNumberId: process.env.PHONE_NUMBER_ID,
  qrCodeUrl: process.env.QR_CODE_URL
};
