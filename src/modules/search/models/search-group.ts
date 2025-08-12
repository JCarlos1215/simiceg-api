import { SearchResult } from './search-result';

export class SearchGroup<T> {
  term: string;
  group: string;
  items: SearchResult<T>[];
}
