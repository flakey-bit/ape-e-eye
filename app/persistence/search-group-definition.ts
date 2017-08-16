import { SearchDefinition } from './search-definition';

export interface SearchGroupDefinition {
    baseUrl: string;
    minimumPeriod: number;
    searches: SearchDefinition[];
}
