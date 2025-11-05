import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ElasticsearchConfigModule } from './elasticsearch/elasticsearch.module';
import { SearchModule } from './search/search.module';
import { BooksModule } from './books/books.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ElasticsearchConfigModule,
    SearchModule,
    BooksModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
