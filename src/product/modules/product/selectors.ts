import { Product } from './types';

// TODO: Memoize this somehow
// e.g. reselect, lodash's memoize, custom function, whatever makes the most sense
export const getProduct = (products: Product[], sku: string): Product | undefined => {
  return products.find(p => p.sku === sku);
};
