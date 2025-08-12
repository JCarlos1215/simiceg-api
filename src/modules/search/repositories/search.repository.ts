import { SearchGroup } from '../models/search-group';
import { SearchResult } from '../models/search-result';

export interface SearchRepository {
  executeSearch(searchTerm: string): Promise<SearchGroup<SearchResult<unknown>>[]>;
}
