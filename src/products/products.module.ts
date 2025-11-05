import { Module } from '@nestjs/common';
import { ElasticsearchConfigModule } from '../elasticsearch/elasticsearch.module';
import { CustomElasticsearchService } from '../elasticsearch/elasticsearch.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [ElasticsearchConfigModule],
  controllers: [ProductsController],
  providers: [ProductsService, CustomElasticsearchService],
})
export class ProductsModule {}

