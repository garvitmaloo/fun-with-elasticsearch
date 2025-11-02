import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { CustomElasticsearchService } from './elasticsearch.service';

@Module({
    imports: [
        ElasticsearchModule.register({
            node: process.env.ELASTICSEARCH_NODE,
        }),
    ],
    exports: [ElasticsearchModule],
    providers: [CustomElasticsearchService]
})
export class ElasticsearchConfigModule { }