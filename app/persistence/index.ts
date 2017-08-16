import { SearchViewRepository } from "./search-view-repository.service"
import * as angular from "angular";

angular.module("app")
    .service("searchViewRepository", SearchViewRepository);
