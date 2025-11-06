import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { QueryDslQueryContainer } from 'node_modules/@elastic/elasticsearch/lib/api/types';

@Injectable()
export class ProductsService {
    private readonly INDEX_NAME = 'products';
    constructor(
        private readonly elasticsearchService: ElasticsearchService,
    ) { }

    // Task 1: Range Query (Numeric & Date Fields)
    async rangeQuery(priceUpperBound: number, priceLowerBound: number, createdAfter: Date) {
        const currentDate = new Date('2024-02-28');
        const createdAfterDate = new Date(createdAfter);

        const query: QueryDslQueryContainer = {
            bool: {
                must: [
                    {
                        range: {
                            price: {
                                gte: priceLowerBound,
                                lte: priceUpperBound
                            }
                        }
                    },
                    {
                        range: {
                            createdAt: {
                                gte: createdAfterDate.toISOString(),
                                lte: currentDate.toISOString()
                            }
                        }
                    }
                ]
            }
        }
        try {
            const result = await this.elasticsearchService.search({
                index: this.INDEX_NAME,
                query,
                sort: [
                    {
                        price: { order: 'asc' }
                    }
                ]
            })
            return {
                success: true,
                data: result
            }
        } catch (err) {
            console.error('Error searching: ', err)
            return {
                success: false,
                data: null
            }
        }
    }

    // Task 2: Exists query (Check for missing fields)
    async existsQuery() {
        try {
            const result = await this.elasticsearchService.search({
                index: this.INDEX_NAME,
                query: {
                    bool: {
                        must_not: [
                            {
                                exists: {
                                    field: 'discount'
                                }
                            },
                            {
                                exists: {
                                    field: 'brand'
                                }
                            }
                        ]
                    }
                }
            })
            return {
                success: true,
                data: result
            }
        } catch (err) {
            console.error('Error searching: ', err)
            return {
                success: false,
                data: null
            }
        }
    }

    async termsQuery(category: string, brands: string) {
        const brandArray = brands.split(',');
        try {
            const result = await this.elasticsearchService.search({
                index: this.INDEX_NAME,
                query: {
                    bool: {
                        must: [
                            {
                                term: {
                                    category
                                }
                            },
                            {
                                terms: {
                                    brand: brandArray
                                }
                            }
                        ]
                    }
                }
            })
            return {
                success: true,
                data: result
            }
        } catch (err) {
            console.error('Error searching: ', err)
            return {
                success: false,
                data: null
            }
        }
    }

    async fullTextSearchWithBoosting(text: string) {
        try {
            const result = await this.elasticsearchService.search({
                index: this.INDEX_NAME,
                query: {
                    bool: {
                        must: [
                            {
                                multi_match: {
                                    fields: ['title^2', 'description', 'content'],
                                    query: text,
                                }
                            }
                        ],
                        filter: {
                            term: {
                                isActive: true
                            }
                        }
                    }
                }
            })
            return {
                success: true,
                data: result
            }
        } catch (err) {
            console.error('Error searching: ', err)
            return {
                success: false,
                data: null
            }
        }
    }

    async complexBoolQuery() {
        try {
            const result = await this.elasticsearchService.search({
                index: this.INDEX_NAME,
                query: {
                    bool: {
                        must: [
                            {
                                term: {
                                    featured: true
                                }
                            },
                            {
                                term: {
                                    category: 'Electronics'
                                }
                            }
                        ],
                        should: [
                            {
                                range: {
                                    rating: {
                                        gte: 4.8
                                    }
                                }
                            },
                            {
                                range: {
                                    discount: {
                                        gte: 10
                                    }
                                }
                            }
                        ],
                        must_not: [
                            {
                                term: {
                                    status: "draft"
                                }
                            }
                        ],
                        filter: {
                            range: {
                                price: {
                                    lt: 1000
                                }
                            }
                        }
                    }
                }
            })
            return {
                success: true,
                data: result
            }
        } catch (err) {
            console.error('Error searching: ', err)
            return {
                success: false,
                data: null
            }
        }
    }

    async fuzzyQuery(text: string) {
        try {
            const results = await this.elasticsearchService.search({
                index: this.INDEX_NAME,
                query: {
                    fuzzy: {
                        title: {
                            value: text,
                            fuzziness: 'AUTO',
                            prefix_length: 2,
                            max_expansions: 50,
                        },
                    }
                }
            })
            return {
                success: true,
                data: results
            }
        } catch (err) {
            console.error('Error searching: ', err)
            return {
                success: false,
                data: null
            }
        }
    }

    async wildcardQuery() {
        try {
            const result = await this.elasticsearchService.search({
                index: this.INDEX_NAME,
                query: {
                    bool: {
                        should: [
                            {
                                wildcard: {
                                    sku: {
                                        value: `PHN-*`,
                                    }
                                }
                            },
                            {
                                wildcard: {
                                    brand: {
                                        value: `*Pro*`,
                                    }
                                }
                            }
                        ]
                    }
                }
            })
            return {
                success: true,
                data: result
            }
        } catch (err) {
            console.error('Error searching: ', err)
            return {
                success: false,
                data: null
            }
        }
    }

    async matchPhraseQuery() {
        try {
            const result = await this.elasticsearchService.search({
                index: this.INDEX_NAME,
                query: {
                    match_phrase: {
                        description: {
                            query: "Noise-cancelling headphones",
                            slop: 2
                        },
                    }
                }
            })
            return {
                success: true,
                data: result
            }
        } catch (err) {
            console.error('Error searching: ', err)
            return {
                success: false,
                data: null
            }
        }
    }
}

