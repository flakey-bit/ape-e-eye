import { SearchExecutorService} from "./search-executor.service";
import * as angular from "angular";

angular.module("app")
       .service("searchExecutor", SearchExecutorService);
