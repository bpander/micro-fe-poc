import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Product } from './types';

const latency = (duration: number) => new Promise(resolve => setTimeout(resolve, duration));

export const fetchProduct = async (stream: BehaviorSubject<Product[]>) => {
  await latency(300);
  const { mockProduct } = await import('./mocks');
  stream.next([ ...stream.getValue(), mockProduct ]);
};
