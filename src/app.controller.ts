import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CustomElasticsearchService } from './elasticsearch/elasticsearch.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly elasticsearchService: CustomElasticsearchService,
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('setup')
  async setupIndexAndSeedData() {
    return await this.elasticsearchService.createIndexAndSeedData();
  }
}
