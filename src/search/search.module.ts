import { Module } from "@nestjs/common";
import { ElasticsearchConfigModule } from "src/elasticsearch/elasticsearch.module";
import { CustomElasticsearchService } from "src/elasticsearch/elasticsearch.service";
import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";

@Module({
    imports: [ElasticsearchConfigModule],
    controllers: [SearchController],
    providers: [SearchService, CustomElasticsearchService]
})
export class SearchModule { }