import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { BooksService } from "./books.service";
import type { BookDetails } from "./types";

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) { }

    @Post('/index')
    async createIndex(@Body() body: { name: string }) {
        return await this.booksService.createIndex(body.name);
    }

    @Post('/')
    async createBook(@Body() body: BookDetails) {
        return await this.booksService.createBook(body);
    }

    @Put('/:id')
    async createBookById(@Param() params: { id: string }, @Body() body: BookDetails) {
        return await this.booksService.createBookById({
            id: params.id, ...body
        });
    }

    @Get('/')
    async getAllBooks(@Query() query: { page: number, size: number, sort: any }) {
        let parsedSort: Array<{ [field: string]: { order: 'asc' | 'desc' } }> | undefined;

        if (query.sort) {
            if (typeof query.sort === 'string') {
                try {
                    parsedSort = JSON.parse(query.sort);
                } catch (err) {
                    // If parsing fails, treat as undefined
                    parsedSort = undefined;
                }
            } else if (Array.isArray(query.sort)) {
                parsedSort = query.sort;
            } else {
                parsedSort = undefined;
            }
        }

        return await this.booksService.getAllBooks(query.page, query.size, parsedSort);
    }

    @Post('/bulkInsert')
    async bulkInsertBooksData(@Body() body: BookDetails[]) {
        return await this.booksService.bulkInsertBooks(body);
    }

    // Implement update and delete endpoints

    @Get('/search')
    async searchByTitle(@Query() query: { title: string }) {
        return await this.booksService.searchByTitle(query.title);
    }

    @Get('/genre/:genre')
    async filterByGenre(@Param() params: { genre: string }) {
        return await this.booksService.filterByGenre(params.genre);
    }

    @Get('/isbn/:isbn')
    async filterByISBN(@Param() params: { isbn: string }) {
        return await this.booksService.filterByISBN(params.isbn);
    }

    @Get('/year-range')
    async filterByYearRange(@Query() query: { from: number, to: number }) {
        return await this.booksService.filterByYearRange(query.from, query.to);
    }

    @Get('/price-range')
    async filterByPriceRange(@Query() query: { min: number, max: number }) {
        return await this.booksService.filterByPriceRange(query.min, query.max);
    }

    @Get('/advanced')
    async filterByGenreAndYear(@Query() query: { genre: string, from: number, to: number }) {
        return await this.booksService.filterByGenreAndYear(query.genre, query.from, query.to);
    }

    @Get('/:id')
    async getBookDetailsById(@Param() params: { id: string }) {
        return await this.booksService.getBookDetailsById(params.id);
    }
}