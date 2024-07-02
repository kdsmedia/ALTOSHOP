const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();
const config = require('./config/config');
const { getProductList, getProductById } = require('./utils/productUtils');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Endpoint untuk menerima pesan masuk
app.post('/webhook', async (req, res) => {
    const message = req.body.entry[0].changes[0].value.messages[0];
    const from = message.from;
    const messageText = message.text.body;

    if (messageText === undefined) {
        res.sendStatus(200);
        return;
    }

    if (messageText.toLowerCase() === 'hai') {
        // Menampilkan 6 produk awal
        await sendWelcomeMessage(from);
    } else if (messageText.startsWith('detail')) {
        // Menampilkan detail produk berdasarkan ID
        const productId = messageText.split(' ')[1];
        await sendProductDetails(from, productId);
    } else if (messageText.startsWith('beli')) {
        // Menampilkan pilihan produk dan jumlah untuk dibeli
        const productId = messageText.split(' ')[1];
        await showProductList(from, productId);
    } else if (messageText.startsWith('checkout')) {
        // Menampilkan detail pembelian berdasarkan ID produk dan jumlah
        const [_, productId, quantity] = messageText.split(' ');
        await sendPurchaseSummary(from, productId, quantity);
    } else if (messageText.startsWith('url')) {
        // Menyimpan URL video/profil/channel
        const url = messageText.split(' ')[1];
        await saveUserUrl(from, url);
    } else {
        await sendDefaultReply(from);
    }

    res.sendStatus(200);
});

// Menyambut pengguna baru
const sendWelcomeMessage = async (to) => {
    const products = getProductList();

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

// Menampilkan detail produk berdasarkan ID
const sendProductDetails = async (to, productId) => {
    const product = getProductById(productId);
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

// Menampilkan daftar produk untuk dibeli
const showProductList = async (to, productId) => {
    const product = getProductById(productId);
    if (product) {
        await axios.post(`https://graph.facebook.com/v16.0/${config.phoneNumberId}/messages`, {
            messaging_product: 'whatsapp',
            to,
            type: 'interactive',
            interactive: {
                type: 'list',
                header: { type: 'text', text: 'Pilih Produk dan Jumlah' },
                body: { text: `Pilih produk dan jumlah yang ingin dibeli:` },
                action: {
                    button: 'Pilih Produk',
                    sections: [
                        {
                            title: 'Pilih Produk',
                            rows: getProductList().map(p => ({
                                id: `product_${p.id}`,
                                title: p.name,
                                description: `Harga: Rp${p.price}`,
                                body: [
                                    { type: 'text', text: `Jumlah: ` },
                                    { type: 'dropdown', options: Array.from({ length: 10 }, (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` })) }
                                ],
                                action: { type: 'reply', reply: { id: `checkout_${p.id}`, title: 'Checkout' } }
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

// Menampilkan detail pembelian
const sendPurchaseSummary = async (to, productId, quantity) => {
    const product = getProductById(productId);
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
                        button: {
                            type: 'url',
                            url: 'https://example.com/rekening'
                        }
                    },
                    {
                        type: 'text',
                        text: {
                            body: `Silakan berikan link/video/profil/channel kamu untuk melanjutkan.\n\nContoh link:\n- Video: https://www.youtube.com/watch?v=example\n- Profil: https://instagram.com/yourprofile\n- Channel: https://www.youtube.com/c/yourchannel`
                        }
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

// Menyimpan URL video/profil/channel
const saveUserUrl = async (to, url) => {
    // Di sini, Anda dapat menambahkan logika untuk menyimpan URL di database atau mengirimkan balasan kepada pengguna

    await axios.post(`https://graph.facebook.com/v16.0/${config.phoneNumberId}/messages`, {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: `Terima kasih! Kami telah menerima link/video/profil/channel kamu: ${url}. Kami akan memproses pesanan kamu.` }
    }, {
        headers: {
            'Authorization': `Bearer ${config.whatsappApiToken}`,
            'Content-Type': 'application/json'
        }
    }).catch(error => console.error('Error saving user URL:', error));
};

// Menyediakan balasan default
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
    console.log(`Server is running on port ${port}`);
});
