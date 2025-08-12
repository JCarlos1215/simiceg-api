import { injectable, inject, registry } from 'tsyringe';
import { SearchGroup } from './models/search-group';
import { SearchResult } from './models/search-result';

import { SearchPGRepository } from './repositories/search.pg.repository';
import { SearchRepository } from './repositories/search.repository';

@injectable()
@registry([{ token: 'SearchRepository', useClass: SearchPGRepository }])
export class SearchService {
  constructor(@inject('SearchRepository') private searchRepository: SearchRepository) {}

  public async doSearch(searchTerm: string): Promise<SearchGroup<SearchResult<unknown>>[]> {
    return this.searchRepository.executeSearch(searchTerm);
  }
}
