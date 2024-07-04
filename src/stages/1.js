import { menu } from '../menu.js';
import { storage } from '../storage.js';
import { neighborhoods } from './neighborhoods.js';

export const stageOne = {
  exec({ from, message, client }) {
    if (message === '1') {
      let msg = '🚨  MENU  🚨\n\n';

      Object.keys(menu).map((value) => {
        const element = menu[value];
        if (value === '1') {
          msg += `1️⃣ - _${element.description}_ \n`;
        } else if (value === '2') {
          msg += `2️⃣ - _${element.description}_ \n`;
        } else if (value === '3') {
          msg += `3️⃣ - _${element.description}_ \n`;
        } else if (value === '4') {
          msg += `4️⃣ - _${element.description}_ \n`;
        } else if (value === '5') {
          msg += `5️⃣ - _${element.description}_ \n`;
          e if (value === '6') {
          msg += `5️⃣ - _${element.description}_ \n`;
        }
      });

      msg +=
        '\nUntuk melihat, *KLIK*: https://wa.me/6283872543697\n\n⚠️ ```HANYA SATU PILIHAN DALAM SATU WAKTU``` ⚠️\n*Masukkan PILIHAN nama produk yang ingin Anda pesan:*';
      storage[from].stage = 2;

      return msg;
    } else if (message === '2') {
      return (
        '\n-----------------------------------\n1️⃣ - ```PESAN SESUATU``` \n0️⃣ - ```NGOBROL BERSAMA ALTO```\n\n' +
        neighborhoods +
        '\n-----------------------------------\n1️⃣ - ```PESAN SESUATU``` \n0️⃣ - ```NGOBROL BERSAMA ALTO``` '
      );
    } else if (message === '0') {
      client.markUnseenMessage(from);

      storage[from].stage = 5;

      return '🔃 Menghubungkan Anda ke ALTO. \n⏳ *Tunggu sebentar*.';
    }

    return '❌ *Silakan masukkan MENU yang BENAR.*\n⚠️ ```HANYA SATU PILIHAN DALAM SATU WAKTU``` ⚠️';
  },
};
