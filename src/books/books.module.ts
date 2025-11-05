import { Module } from "@nestjs/common";
import { ElasticsearchConfigModule } from "src/elasticsearch/elasticsearch.module";
import { BooksController } from "./books.controller";
import { BooksService } from "./books.service";
import { CustomElasticsearchService } from "src/elasticsearch/elasticsearch.service";

@Module({
    controllers: [BooksController],
    imports: [ElasticsearchConfigModule],
    providers: [BooksService, CustomElasticsearchService]
})
export class BooksModule { }