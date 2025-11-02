import { Injectable, OnModuleInit } from "@nestjs/common";
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class CustomElasticsearchService implements OnModuleInit {
    private readonly indexName = 'products';
    constructor(private readonly esService: ElasticsearchService) { }

    async onModuleInit() {
        await this.createIndexIfNotExists();
        await this.seedSampleData();

    }

    private async createIndexIfNotExists() {
        try {
            console.log('Checking if index exists...')
            const indexExists = await this.esService.indices.exists({
                index: this.indexName,
            });
            console.log('Index exists: ', indexExists)

            if (!indexExists) {
                console.log('Creating index...')
                await this.esService.indices.create({
                    index: this.indexName,
                    mappings: {
                        properties: {
                            name: { type: 'text' },
                            description: { type: 'text' },
                            price: { type: 'float' },
                            category: { type: 'keyword' },
                            createdAt: { type: 'date' },
                        },
                    },
                });
                console.log(`Index '${this.indexName}' created successfully`);
            }
        } catch (err) {
            console.error('Error creating index: ', err)
        }
    }

    private async seedSampleData() {
        try {
            const count = await this.esService.count({ index: this.indexName });

            if (count.count === 0) {
                const sampleProducts = [
                    {
                        name: 'Laptop Pro',
                        description: 'High-performance laptop for professionals',
                        price: 1299.99,
                        category: 'Electronics',
                        createdAt: new Date(),
                    },
                    {
                        name: 'Wireless Mouse',
                        description: 'Ergonomic wireless mouse with long battery life',
                        price: 29.99,
                        category: 'Electronics',
                        createdAt: new Date(),
                    },
                    {
                        name: 'Coffee Maker',
                        description: 'Automatic coffee maker with timer',
                        price: 79.99,
                        category: 'Kitchen',
                        createdAt: new Date(),
                    },
                    {
                        name: 'Running Shoes',
                        description: 'Comfortable running shoes for daily exercise',
                        price: 89.99,
                        category: 'Sports',
                        createdAt: new Date(),
                    },
                    {
                        name: 'Smartphone X',
                        description: 'Latest smartphone with advanced camera',
                        price: 899.99,
                        category: 'Electronics',
                        createdAt: new Date(),
                    },
                ];

                for (const product of sampleProducts) {
                    await this.esService.index({
                        index: this.indexName,
                        document: product,
                    });
                }

                await this.esService.indices.refresh({ index: this.indexName });
                console.log('Sample data seeded successfully');

            }
        } catch (err) {
            console.error('Error seeding sample data: ', err)
        }
    }

    async search(text: string) {
        return this.esService.search({
            index: this.indexName,
            query: {
                match: {
                    name: text
                }
            }
        })
    }
}