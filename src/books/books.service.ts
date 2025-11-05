import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";

import { CustomElasticsearchService } from "src/elasticsearch/elasticsearch.service";
import type { BookDetails } from "./types";

@Injectable()
export class BooksService {
    private readonly INDEX_NAME = 'library_books';

    constructor(private readonly esService: CustomElasticsearchService,
        private readonly elasticsearchService: ElasticsearchService
    ) { }

    async createIndex(name: string) {
        try {
            const result = await this.esService.createIndex(name);
            return {
                success: true,
                data: result
            }
        } catch (err) {
            console.error(`Failed to create index: ${err}`)
            return {
                success: false,
                data: null
            }
        }
    }

    async createBook(details: BookDetails) {
        const { title, author, isbn, inStock, price, publishedYear } = details;
        try {
            const result = await this.esService.index(this.INDEX_NAME, {
                title,
                author,
                isbn,
                inStock,
                price,
                publishedYear
            })
            return {
                success: true,
                data: result
            }
        } catch (err) {
            console.error(`Failed to add document to the index. Error ${err}`)
            return {
                success: false,
                data: null
            }
        }
    }

    async createBookById(details: BookDetails & { id: string }) {
        console.log("Details: ", details)
        const { id, title, author, publishedYear, price, inStock, isbn, genre } = details
        try {
            const result = await this.esService.indexWithId(this.INDEX_NAME, {
                id,
                title,
                isbn,
                inStock,
                price,
                publishedYear,
                author,
                genre
            })
            return {
                success: true,
                data: result
            }
        } catch (err) {
            console.error(`Failed to add document to the index with Id ${id}. Error ${err}`)
            return {
                success: false,
                data: null
            }
        }
    }

    async getBookDetailsById(id: string) {
        try {
            const result = await this.esService.getDetailsById(this.INDEX_NAME, id)
            return {
                success: true,
                data: result
            }
        } catch (err) {
            console.error(`Failed to fetch document with Id ${id}. Error ${err}`)
            return {
                success: false,
                data: null
            }
        }
    }

    async bulkInsertBooks(bookDetails: BookDetails[]) {
        try {
            const result = await this.esService.bulkInsert<BookDetails>(this.INDEX_NAME, bookDetails);
            return {
                success: true,
                data: result
            }
        } catch (err) {
            console.error(`Something went wrong while bulk inserting: Error - ${err}`)
            return {
                success: false,
                data: null
            }
        }
    }

    async getAllBooks(page: number = 1, size: number = 5, sort?: Array<{ [field: string]: { order: 'asc' | 'desc' } }>) {
        // enable sorting on multiple fields (asc and desc) and pagination
        try {
            const result = await this.esService.getAllDocuments(this.INDEX_NAME, (page - 1) * size, size, sort);
            return {
                success: true,
                data: result
            }
        }
        catch (err) {
            console.error(`Something went wrong while fetching all books: Error - ${err}`)
            return {
                success: false,
                data: null
            }
        }
    }

    async searchByTitle(title: string) {
        // partial match and case insensitive
        try {
            const result = await this.elasticsearchService.search({
                index: this.INDEX_NAME,
                query: {
                    match: {
                        title: title
                    }
                }
            })
            return {
                success: true,
                data: result
            }
        } catch (err) {
            console.error(`Something went wrong while searching by title: Error - ${err}`)
            return {
                success: false,
                data: null
            }
        }
    }

    async filterByGenre(genre: string) {
        // exact matches
        try {
            const result = await this.elasticsearchService.search({
                index: this.INDEX_NAME,
                query: {
                    term: {
                        genre
                    }
                }
            })
            return {
                success: true,
                data: result
            }
        }
        catch (err) {
            console.error(`Something went wrong while filtering by genre: Error - ${err}`)
            return {
                success: false,
                data: null
            }
        }
    }

    async filterByISBN(isbn: string) {
        // exact matches
        try {
            const result = await this.elasticsearchService.search({
                index: this.INDEX_NAME,
                query: {
                    term: {
                        isbn: isbn
                    }
                }
            })
            return {
                success: true,
                data: result
            }
        }
        catch (err) {
            console.error(`Something went wrong while filtering by ISBN: Error - ${err}`)
            return {
                success: false,
                data: null
            }
        }
    }

    async filterByYearRange(from: number, to: number) {
        // range query
        try {
            const result = await this.elasticsearchService.search({
                index: this.INDEX_NAME,
                query: {
                    range: {
                        publishedYear: {
                            gte: from,
                            lte: to
                        }
                    }
                }
            })
            return {
                success: true,
                data: result
            }
        }
        catch (err) {
            console.error(`Something went wrong while filtering by year range: Error - ${err}`)
            return {
                success: false,
                data: null
            }
        }
    }

    async filterByPriceRange(min: number, max: number) {
        // range query
        try {
            const result = await this.elasticsearchService.search({
                index: this.INDEX_NAME,
                query: {
                    range: {
                        price: {
                            gte: min,
                            lte: max
                        }
                    }
                }
            })
            return {
                success: true,
                data: result
            }
        }
        catch (err) {
            console.error(`Something went wrong while filtering by price range: Error - ${err}`)
            return {
                success: false,
                data: null
            }
        }
    }

    async filterByGenreAndYear(genre: string, from: number, to: number) {
        // bool query
        try {
            const result = await this.elasticsearchService.search({
                index: this.INDEX_NAME,
                query: {
                    bool: {
                        must: [{ term: { genre } }, { range: { publishedYear: { gte: from, lte: to } } }]
                    }
                }
            })
            return {
                success: true,
                data: result
            }
        }
        catch (err) {
            console.error(`Something went wrong while filtering by genre and year: Error - ${err}`)
            return {
                success: false,
                data: null
            }
        }
    }

    async filterByMultiGenre(genres: string[]) {
        // bool query
        try {
            const result = await this.elasticsearchService.search({
                index: this.INDEX_NAME,
                query: {
                    bool: {
                        should: genres.map(genre => ({ term: { genre } }))
                    }
                }
            })
            return {
                success: true,
                data: result
            }
        }
        catch (err) {
            console.error(`Something went wrong while filtering by multiple genres: Error - ${err}`)
            return {
                success: false,
                data: null
            }
        }
    }
}