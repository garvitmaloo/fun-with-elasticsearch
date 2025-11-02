import { Injectable, OnModuleInit } from "@nestjs/common";
import { CustomElasticsearchService } from "src/elasticsearch/elasticsearch.service";

@Injectable()
export class SearchService implements OnModuleInit {
    constructor(private readonly elasticsearchService: CustomElasticsearchService) { }

    onModuleInit() { }

    async search(text: string) {
        try {
            const results = await this.elasticsearchService.search(text);
            return {
                success: true,
                data: results
            };
        } catch (err) {
            console.error('Error searching: ', err)
            return {
                success: false,
                data: null
            }
        }
    }
}