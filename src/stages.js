import {
  initialStage,
  stageOne,
  stageTwo,
  stageThree,
  stageFour,
  finalStage,
} from './stages/index.js';

import { storage } from './storage.js';

export const stages = [
  {
    descricao: 'Selamat Datang',
    stage: initialStage,
  },
  {
    descricao: 'Pilih Menu',
    stage: stageOne,
  },
  {
    descricao: 'Alamat',
    stage: stageTwo,
  },
  {
    descricao: 'Transaksi',
    stage: stageThree,
  },
  {
    descricao: 'Pembelian',
    stage: stageFour,
  },
  {
    descricao: 'Pelayan',
    stage: finalStage,
  },
];

export function getStage({ from }) {
  if (storage[from]) {
    return storage[from].stage;
  } else {
    storage[from] = {
      stage: 0,
      itens: [],
      address: '',
    };

    return storage[from].stage;
  }
}
