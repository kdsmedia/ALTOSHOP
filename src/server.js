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

    await axios.post(`https://graph.facebook.com/v16.0/${config.phoneNumberId}/messages`, {
        messaging_product: 'whatsapp',
        to,
        type: 'interactive',
        interactive: {
            type: 'list',
            header: { type: 'text', text: 'Selamat datang di ALTOMEDIA!' },
            body: { text: 'Kami menyediakan produk media sosial di bawah ini:' },
            action: { button: 'Pilih Produk', sections: [{ title: 'Pilih Produk', rows: buttons }] }
        }
    }, {
        headers: {
            'Authorization': `Bearer ${config.whatsappApiToken}`,
            'Content-Type': 'application/json'
        }
    }).catch(error => console.error('Error sending welcome message:', error));
};

const sendProductDetails = async (to, productId) => {
    const product = await getProductById(productId);
    if (product) {
        await axios.post(`https://graph.facebook.com/v16.0/${config.phoneNumberId}/messages`, {
            messaging_product: 'whatsapp',
            to,
            type: 'template',
            template: {
                name: 'product_details',
                language: { code: 'id' },
                components: [
                    {
                        type: 'body',
                        parameters: [
                            { type: 'text', text: `Nama Produk: ${product.name}` },
                            { type: 'text', text: `Harga: Rp${product.price}` }
                        ]
                    },
                    {
                        type: 'image',
                        image: { link: product.image }
                    },
                    {
                        type: 'button',
                        button: { type: 'reply', reply: { id: `beli_${product.id}`, title: 'Beli' } }
                    }
                ]
            }
        }, {
            headers: {
                'Authorization': `Bearer ${config.whatsappApiToken}`,
                'Content-Type': 'application/json'
            }
        }).catch(error => console.error('Error sending product details:', error));
    } else {
        await sendDefaultReply(to);
    }
};

const showProductList = async (to, productId) => {
    const product = await getProductById(productId);
    if (product) {
        await axios.post(`https://graph.facebook.com/v16.0/${config.phoneNumberId}/messages`, {
            messaging_product: 'whatsapp',
            to,
            type: 'interactive',
            interactive: {
                type: 'list',
                header: { type: 'text', text: `Pilih jumlah ${product.name}` },
                body: { text: 'Pilih jumlah produk yang ingin dibeli:' },
                action: {
                    button: 'Pilih Jumlah',
                    sections: [
                        {
                            title: 'Pilih Jumlah',
                            rows: Array.from({ length: 10 }, (_, i) => ({
                                title: (i + 1).toString(),
                                id: `checkout_${product.id}_${i + 1}`
                            }))
                        }
                    ]
                }
            }
        }, {
            headers: {
                'Authorization': `Bearer ${config.whatsappApiToken}`,
                'Content-Type': 'application/json'
            }
        }).catch(error => console.error('Error showing product list:', error));
    } else {
        await sendDefaultReply(to);
    }
};

const sendPurchaseSummary = async (to, productId, quantity) => {
    const product = await getProductById(productId);
    if (product) {
        const totalPrice = product.price * quantity;

        await axios.post(`https://graph.facebook.com/v16.0/${config.phoneNumberId}/messages`, {
            messaging_product: 'whatsapp',
            to,
            type: 'template',
            template: {
                name: 'purchase_summary',
                language: { code: 'id' },
                components: [
                    {
                        type: 'body',
                        parameters: [
                            { type: 'text', text: `Nama Produk: ${product.name}` },
                            { type: 'text', text: `Harga: Rp${product.price}` },
                            { type: 'text', text: `Jumlah: ${quantity}` },
                            { type: 'text', text: `Total Harga: Rp${totalPrice}` }
                        ]
                    },
                    {
                        type: 'image',
                        image: { link: config.qrCodeUrl }
                    },
                    {
                        type: 'button',
                        button: { type: 'reply', reply: { id: 'payment_instructions', title: 'Instruksi Pembayaran' } }
                    }
                ]
            }
        }, {
            headers: {
                'Authorization': `Bearer ${config.whatsappApiToken}`,
                'Content-Type': 'application/json'
            }
        }).catch(error => console.error('Error sending purchase summary:', error));
    } else {
        await sendDefaultReply(to);
    }
};

const sendDefaultReply = async (to) => {
    await axios.post(`https://graph.facebook.com/v16.0/${config.phoneNumberId}/messages`, {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: 'Maaf, perintah tidak dikenali. Silakan ketik "hai" untuk memulai.' }
    }, {
        headers: {
            'Authorization': `Bearer ${config.whatsappApiToken}`,
            'Content-Type': 'application/json'
        }
    }).catch(error => console.error('Error sending default reply:', error));
};

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
