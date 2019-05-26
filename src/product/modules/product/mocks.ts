import { Product } from './types';

export const mockProduct: Product = {
  name: 'Tractor',
  sku: 'tractor-parent-sku',
  variants: [
    {
      sku: 't_porsche',
      name: 'Porsche-Diesel Master 419',
      imageUrl: './images/tractor-red.jpg',
      thumbnailUrl: './images/tractor-red-thumb.jpg',
      price: 66,
    },
    {
      sku: 't_fendt',
      name: 'Fendt F20 Dieselroß',
      imageUrl: './images/tractor-green.jpg',
      thumbnailUrl: './images/tractor-green-thumb.jpg',
      price: 54,
    },
    {
      sku: 't_eicher',
      name: 'Eicher Diesel 215/16',
      imageUrl: './images/tractor-blue.jpg',
      thumbnailUrl: './images/tractor-blue-thumb.jpg',
      price: 58,
    },
  ],
};
