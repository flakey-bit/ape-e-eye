import { SearchGroupDefinition } from './search-group-definition';

export interface SearchViewDefinition {
    name: string;
    groups: SearchGroupDefinition[];
}
