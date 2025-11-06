# Fun with Elasticsearch - Advanced Queries Branch

## 📋 Overview

This branch (`03/advanced-queries-and-text-analysis`) implements **8 advanced Elasticsearch query types** as part of a hands-on learning project. The implementation demonstrates various query patterns including range queries, full-text search, fuzzy matching, boolean logic, and more.

## 🎯 What This Branch Does

This branch adds a comprehensive set of Elasticsearch query endpoints that demonstrate:

1. **Range Queries** - Filtering by numeric and date ranges
2. **Exists Queries** - Finding documents with missing fields
3. **Term(s) Queries** - Exact keyword matching
4. **Multi-Match Queries** - Full-text search across multiple fields with boosting
5. **Bool Queries** - Complex filtering with must, should, must_not logic
6. **Fuzzy Queries** - Typo-tolerant search
7. **Wildcard Queries** - Pattern-based matching on keyword fields
8. **Match Phrase Queries** - Exact phrase matching

Each query type is implemented as a RESTful API endpoint that can be tested independently. The implementation includes a seeded Elasticsearch index with 24 sample products covering various categories (Electronics, Sports, Kitchen, Health) to provide realistic test data.

## 📚 Reference to Tasks

All query implementations correspond to the tasks defined in [`Tasks.md`](./Tasks.md). The file contains detailed specifications for 10 query tasks:

- **Task 1**: Range Query — Filter by Price & Creation Date
- **Task 2**: Exists Query — Find Documents with Missing Fields
- **Task 3**: Term(s) Query — Exact Keyword Filtering
- **Task 4**: Multi-Match Query — Search Across Multiple Text Fields
- **Task 5**: Bool Query — Complex Filtering
- **Task 6**: Fuzzy Query — Handling Misspellings
- **Task 7**: Wildcard Query — Partial Keyword Matching
- **Task 8**: Match Phrase Query — Exact Ordered Phrase
- **Task 9**: Sorting + Pagination (not yet implemented)
- **Task 10**: Combined Complex Query (not yet implemented)

For detailed task specifications, expected results, and learning concepts, refer to [`Tasks.md`](./Tasks.md).

## 🏗️ Project Structure

```
├── src/
│   ├── elasticsearch/
│   │   ├── elasticsearch.module.ts    # Elasticsearch module configuration
│   │   └── elasticsearch.service.ts   # Index creation & data seeding
│   ├── products/
│   │   ├── products.module.ts         # Products module
│   │   ├── products.controller.ts     # API endpoints for queries
│   │   └── products.service.ts        # Query implementations
│   ├── search/                         # Basic search functionality
│   ├── app.module.ts                   # Main application module
│   └── main.ts                         # Application entry point
├── docker-compose.yml                  # Docker Compose configuration
├── Tasks.md                            # Detailed task specifications
└── README.md                           # This file
```

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **Docker** and **Docker Compose** (for running Elasticsearch)
- **npm** or **yarn** package manager

### Step-by-Step Setup

#### 1. Clone the Repository and Checkout Branch

```bash
git clone <repository-url>
cd fun-with-elasticsearch
git checkout 03/advanced-queries-and-text-analysis
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Configure Environment Variables

Create a `.env` file in the root directory (you can use `example.env` as a template):

```bash
cp example.env .env
```

The `.env` file should contain:

```env
ELASTICSEARCH_NODE=http://localhost:9200
PORT=3000
```

**Note:** If using Docker Compose (recommended), the Elasticsearch URL will be `http://elasticsearch:9200` inside the container, but `http://localhost:9200` from your host machine.

#### 4. Start Elasticsearch with Docker Compose

```bash
docker-compose up -d elasticsearch
```

This will:
- Start Elasticsearch container on port `9200`
- Configure it with single-node discovery (no security for development)
- Create a persistent volume for data

Wait for Elasticsearch to be ready (usually 10-30 seconds). You can verify it's running by visiting:
```
http://localhost:9200
```

You should see a JSON response with cluster information.

#### 5. Start the NestJS Application

**Option A: Run locally (without Docker)**

```bash
npm run start:dev
```

**Option B: Run with Docker Compose (includes both API and Elasticsearch)**

```bash
docker-compose up
```

The API will be available at `http://localhost:3000`.

#### 6. Initialize Elasticsearch Index and Seed Data

After the application starts, you need to create the index and seed sample data. Make a POST request to the setup endpoint:

**Using curl:**
```bash
curl -X POST http://localhost:3000/setup
```

**Using PowerShell (Windows):**
```powershell
Invoke-RestMethod -Uri http://localhost:3000/setup -Method Post
```

**Using a REST client (Postman, Insomnia, etc.):**
- Method: `POST`
- URL: `http://localhost:3000/setup`

This will:
- Delete the existing `products` index (if it exists)
- Create a new `products` index with proper field mappings
- Seed 24 sample products with diverse data

You should receive a response like:
```json
{
  "success": true,
  "message": "Index 'products' created and seeded with 24 documents",
  "count": 24
}
```

#### 7. Verify Setup

Test that everything is working by making a simple request:

```bash
curl http://localhost:3000
```

You should see `Hello World!` response.

## 🧪 Testing the Query Endpoints

All query endpoints are available under the `/products` route. Here are examples for each endpoint:

### 1. Range Query
**Endpoint:** `GET /products/range-query`

**Query Parameters:**
- `priceLowerBound` (number): Minimum price
- `priceUpperBound` (number): Maximum price
- `createdAfter` (date string): ISO date string

**Example:**
```bash
curl "http://localhost:3000/products/range-query?priceLowerBound=100&priceUpperBound=300&createdAfter=2024-02-01"
```

### 2. Exists Query
**Endpoint:** `GET /products/exists-query`

Finds products missing `description` or `discount` fields.

**Example:**
```bash
curl http://localhost:3000/products/exists-query
```

### 3. Terms Query
**Endpoint:** `GET /products/terms-query`

**Query Parameters:**
- `category` (string): Product category
- `brands` (string): Comma-separated list of brands

**Example:**
```bash
curl "http://localhost:3000/products/terms-query?category=Sports&brands=RunFast,FitGear,BallPro"
```

### 4. Full-Text Search with Boosting
**Endpoint:** `GET /products/full-text-search-with-boosting`

**Query Parameters:**
- `text` (string): Search term

**Example:**
```bash
curl "http://localhost:3000/products/full-text-search-with-boosting?text=wireless"
```

### 5. Complex Bool Query
**Endpoint:** `GET /products/complex-bool-query`

Finds featured Electronics products with specific conditions.

**Example:**
```bash
curl http://localhost:3000/products/complex-bool-query
```

### 6. Fuzzy Query
**Endpoint:** `GET /products/fuzzy-query`

**Query Parameters:**
- `text` (string): Search term (can include typos)

**Example:**
```bash
curl "http://localhost:3000/products/fuzzy-query?text=iphine"
```

### 7. Wildcard Query
**Endpoint:** `GET /products/wildcard-query`

Finds products with SKU starting with "PHN-" or brand containing "Pro".

**Example:**
```bash
curl http://localhost:3000/products/wildcard-query
```

### 8. Match Phrase Query
**Endpoint:** `GET /products/match-phrase-query`

Searches for exact phrase "Noise-cancelling headphones" in description.

**Example:**
```bash
curl http://localhost:3000/products/match-phrase-query
```

## 📊 Data Schema

The `products` index uses the following schema (as defined in [`Tasks.md`](./Tasks.md)):

```typescript
{
  title: { type: 'text', analyzer: 'standard' },
  description: { type: 'text', analyzer: 'standard' },
  content: { type: 'text', analyzer: 'standard' },
  tags: { type: 'keyword' },
  category: { type: 'keyword' },
  brand: { type: 'keyword' },
  status: { type: 'keyword' },
  price: { type: 'float' },
  rating: { type: 'float' },
  views: { type: 'integer' },
  stock: { type: 'integer' },
  isActive: { type: 'boolean' },
  featured: { type: 'boolean' },
  inStock: { type: 'boolean' },
  createdAt: { type: 'date' },
  updatedAt: { type: 'date' },
  publishedAt: { type: 'date' },
  discount: { type: 'integer' },
  sku: { type: 'keyword' },
}
```

## 🛠️ Development

### Available Scripts

- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build the application
- `npm run start:prod` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run unit tests

### Hot Reload

The development server supports hot reload. Changes to TypeScript files will automatically restart the server.

### Docker Commands

```bash
# Start all services
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f api
docker-compose logs -f elasticsearch

# Rebuild containers
docker-compose up --build
```

## 🔍 Troubleshooting

### Elasticsearch Connection Issues

1. **Verify Elasticsearch is running:**
   ```bash
   curl http://localhost:9200
   ```

2. **Check Docker containers:**
   ```bash
   docker ps
   ```

3. **Check Elasticsearch logs:**
   ```bash
   docker-compose logs elasticsearch
   ```

### Index Not Found Errors

If you get errors about missing index, make sure you've run the setup endpoint:
```bash
curl -X POST http://localhost:3000/setup
```

### Port Already in Use

If port 3000 or 9200 is already in use:
- Change the port in `.env` file for the API
- Change the port mapping in `docker-compose.yml` for Elasticsearch

## 📝 Notes

- The setup endpoint (`POST /setup`) will **delete and recreate** the index each time it's called. This ensures fresh data for testing.
- All queries are implemented as separate endpoints for easy testing and learning.
- The sample data includes edge cases like products with missing fields for testing `exists` queries.
- Task 9 (Sorting + Pagination) and Task 10 (Combined Complex Query) are not yet implemented in this branch.

## 🎓 Learning Resources

- [Elasticsearch Query DSL Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html)
- [NestJS Documentation](https://docs.nestjs.com/)
- Refer to [`Tasks.md`](./Tasks.md) for detailed explanations of each query type and expected results

## 📄 License

This project is for educational purposes.

---

**Happy Querying! 🚀**

