import { injectable } from 'tsyringe';
import { SearchError } from './errors/search.error';
import { SearchGroup } from './models/search-group';
import { SearchResult } from './models/search-result';
import { SearchService } from './search.service';

@injectable()
export class SearchController {
  constructor(private searchService: SearchService) {}

  public async doSearch(searchTerm: string): Promise<SearchGroup<SearchResult<unknown>>[]> {
    if (searchTerm.length > 0) {
      return this.searchService.doSearch(searchTerm);
    } else {
      throw new SearchError('El termino a buscar esta vacío');
    }
  }
}
