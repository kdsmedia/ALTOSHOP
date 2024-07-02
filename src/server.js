const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();
const config = require('./config/config');
const { getProductList, getProductById } = require('./utils/productUtils');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  const message = req.body.entry[0].changes[0].value.messages[0];
  const from = message.from;
  const messageText = message.text.body;

  if (messageText === undefined) {
    res.sendStatus(200);
    return;
  }

  if (messageText.toLowerCase() === 'hai') {
    await sendWelcomeMessage(from);
  } else if (messageText.startsWith('detail')) {
    const productId = messageText.split(' ')[1];
    await sendProductDetails(from, productId);
  } else if (messageText.startsWith('beli')) {
    const productId = messageText.split(' ')[1];
    await showProductList(from, productId);
  } else if (messageText.startsWith('checkout')) {
    const [_, productId, quantity] = messageText.split(' ');
    await sendPurchaseSummary(from, productId, quantity);
  } else if (messageText.startsWith('link')) {
    const [_, productId, quantity, videoLink] = messageText.split(' ');
    await sendPaymentLink(from, productId, quantity, videoLink);
  } else {
    await sendDefaultReply(from);
  }

  res.sendStatus(200);
});

const sendWelcomeMessage = async (to) => {
  const products = await getProductList();

  const buttons = products.map(product => ({
    type: 'button',
    button: {
      type: 'reply',
      reply: { id: `detail_${product.id}`, title: `Detail ${product.name}` }
    }
  }));

  await axios.post(`https://graph.facebook.com/v14.0/${config.phoneNumberId}/messages`, {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: to,
    type: 'interactive',
    interactive: {
      type: 'button',
      header: { type: 'text', text: 'Selamat datang di ALTOMEDIA, kami menyediakan produk media sosial di bawah ini' },
      body: { text: 'Pilih salah satu produk untuk melihat detailnya.' },
      action: { buttons: buttons }
    }
  }, {
    headers: { 'Authorization': `Bearer ${config.whatsappApiToken}` }
  });
};

const sendProductDetails = async (to, productId) => {
  const product = await getProductById(productId);

  await axios.post(`https://graph.facebook.com/v14.0/${config.phoneNumberId}/messages`, {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: to,
    type: 'interactive',
    interactive: {
      type: 'list',
      header: { type: 'text', text: product.name },
      body: { text: `Harga: ${product.price}` },
      footer: { text: 'Pilih salah satu untuk melanjutkan pembelian.' },
      action: {
        button: 'Beli',
        sections: [{
          title: 'Pilih jumlah',
          rows: Array.from({ length: 10 }, (_, i) => ({
            id: `checkout_${productId}_${i + 1}`,
            title: `${i + 1} pcs`,
            description: `Beli ${i + 1} pcs seharga ${product.price * (i + 1)}`
          }))
        }]
      }
    }
  }, {
    headers: { 'Authorization': `Bearer ${config.whatsappApiToken}` }
  });
};

const showProductList = async (to, productId) => {
  const product = await getProductById(productId);

  await axios.post(`https://graph.facebook.com/v14.0/${config.phoneNumberId}/messages`, {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: to,
    type: 'interactive',
    interactive: {
      type: 'list',
      header: { type: 'text', text: 'Daftar Produk' },
      body: { text: 'Pilih produk yang ingin dibeli.' },
      footer: { text: 'Centang produk yang ingin dibeli dan pilih jumlahnya.' },
      action: {
        button: 'Beli',
        sections: [{
          title: 'Produk',
          rows: [
            { id: 'product_1', title: 'Produk A', description: 'Harga: 100000', media: { type: 'image', image_url: 'https://example.com/images/produk_a.jpg' } },
            { id: 'product_2', title: 'Produk B', description: 'Harga: 200000', media: { type: 'image', image_url: 'https://example.com/images/produk_b.jpg' } },
            { id: 'product_3', title: 'Produk C', description: 'Harga: 150000', media: { type: 'image', image_url: 'https://example.com/images/produk_c.jpg' } },
            { id: 'product_4', title: 'Produk D', description: 'Harga: 250000', media: { type: 'image', image_url: 'https://example.com/images/produk_d.jpg' } },
            { id: 'product_5', title: 'Produk E', description: 'Harga: 300000', media: { type: 'image', image_url: 'https://example.com/images/produk_e.jpg' } }
          ]
        }]
      }
    }
  }, {
    headers: { 'Authorization': `Bearer ${config.whatsappApiToken}` }
  });
};

const sendPurchaseSummary = async (to, productId, quantity) => {
  const product = await getProductById(productId);
  const totalPrice = product.price * quantity;

  await axios.post(`https://graph.facebook.com/v14.0/${config.phoneNumberId}/messages`, {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: to,
    type: 'interactive',
    interactive: {
      type: 'button',
      header: { type: 'text', text: 'Detail Pembayaran' },
      body: {
        text: `Nama Produk: ${product.name}\nHarga Satuan: ${product.price}\nJumlah: ${quantity}\nTotal Harga: ${totalPrice}\n\nBerikan link URL video/profile/channel kamu untuk melanjutkan proses pembayaran.`
      },
      footer: { text: 'Silakan lanjutkan dengan mengirimkan link URL video/profile/channel kamu.' },
      action: {
        button: 'Kirim Link',
        buttons: [
          {
            type: 'reply',
            reply: { id: `send_link_${productId}`, title: 'Kirim Link' }
          }
        ]
      }
    }
  }, {
    headers: { 'Authorization': `Bearer ${config.whatsappApiToken}` }
  });
};

const sendPaymentLink = async (to, productId, quantity, videoLink) => {
  const product = await getProductById(productId);
  const totalPrice = product.price * quantity;

  await axios.post(`https://graph.facebook.com/v14.0/${config.phoneNumberId}/messages`, {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: to,
    type: 'text',
    text: {
      body: `Terima kasih telah membeli ${product.name}.\n\nJumlah: ${quantity}\nTotal Harga: ${totalPrice}\n\nLink/URL video/profile/channel kamu: ${videoLink}\n\nSilakan transfer ke rekening kami dan konfirmasi jika pembayaran telah dilakukan.`
    }
  }, {
    headers: { 'Authorization': `Bearer ${config.whatsappApiToken}` }
  });
};

const sendDefaultReply = async (to) => {
  await axios.post(`https://graph.facebook.com/v14.0/${config.phoneNumberId}/messages`, {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: to,
    type: 'text',
    text: { body: 'Maaf, perintah tidak dikenali. Ketik "hai" untuk memulai.' }
  }, {
    headers: { 'Authorization': `Bearer ${config.whatsappApiToken}` }
  });
};

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
