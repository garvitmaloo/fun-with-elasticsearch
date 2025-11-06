import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get('range-query')
  async rangeQuery(@Query('priceUpperBound') priceUpperBound: number, @Query('priceLowerBound') priceLowerBound: number, @Query('createdAfter') createdAfter: Date) {
    return await this.productsService.rangeQuery(priceUpperBound, priceLowerBound, createdAfter);
  }

  @Get('exists-query')
  async existsQuery() {
    return await this.productsService.existsQuery();
  }

  @Get('terms-query')
  async termsQuery(@Query('category') category: string, @Query('brands') brands: string) {
    return await this.productsService.termsQuery(category, brands);
  }

  @Get('full-text-search-with-boosting')
  async fullTextSearchWithBoosting(@Query('text') text: string) {
    return await this.productsService.fullTextSearchWithBoosting(text);
  }

  @Get('complex-bool-query')
  async complexBoolQuery() {
    return await this.productsService.complexBoolQuery();
  }

  @Get('fuzzy-query')
  async fuzzyQuery(@Query('text') text: string) {
    return await this.productsService.fuzzyQuery(text);
  }

  @Get('wildcard-query')
  async wildcardQuery() {
    return await this.productsService.wildcardQuery();
  }

  @Get('match-phrase-query')
  async matchPhraseQuery() {
    return await this.productsService.matchPhraseQuery();
  }
}

