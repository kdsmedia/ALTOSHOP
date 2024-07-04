import { storage } from '../storage.js';

export const initialStage = {
  exec({ from }) {
    storage[from].stage = 1;

    return '👋 Halo \n\nSaya ALTO, *Robot Canggih* MEDIA. \n* ada yang bisa saya bantu?* 🙋‍♂️ \n-----------------------------------\n1️⃣ - ```PESAN SESUATU``` \n2️⃣ - ```CEK PENGIRIMAN```\n0️⃣ - ```NGOBROL BERSAMA ALTO```';
  },
};
