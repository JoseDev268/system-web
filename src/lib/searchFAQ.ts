import Fuse from 'fuse.js';
import { hotelFAQ } from './faq';

const fuse = new Fuse(hotelFAQ, {
  keys: ['question'],
  threshold: 0.4,
});

export function searchFAQ(query: string): string | null {
  const result = fuse.search(query);
  if (result.length > 0) {
    return result[0].item.answer;
  }
  return null;
}