import { Injectable } from '@nestjs/common';
import { CustomElasticsearchService } from '../elasticsearch/elasticsearch.service';

@Injectable()
export class ProductsService {
    constructor(
        private readonly elasticsearchService: CustomElasticsearchService,
    ) { }

    // Add your product-related methods here
}

