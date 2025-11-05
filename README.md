# Book Library Management System - Branch: 02/crud-and-querying

This branch implements a **Book Library Management System** using NestJS and Elasticsearch. It focuses on CRUD operations and basic querying capabilities for managing books in an Elasticsearch index.

## Overview

This branch introduces a complete books management module with the following capabilities:

- **CRUD Operations**: Create, Read, Update, and Delete books in Elasticsearch
- **Search Queries**: Match queries for full-text search
- **Term Queries**: Exact match filtering by genre and ISBN
- **Range Queries**: Filter books by year and price ranges
- **Bool Queries**: Complex filtering combining multiple conditions
- **Pagination & Sorting**: Retrieve books with pagination and sorting support

## Features Implemented

### 1. Index Management
- Create Elasticsearch index for books (`library_books`)

### 2. CRUD Operations
- **Create Book**: Index a new book (POST with auto-generated ID or PUT with specific ID)
- **Read Book**: Retrieve a book by its document ID
- **Bulk Insert**: Insert multiple books at once
- **Get All Books**: List all books with pagination and sorting

### 3. Search & Filter Operations
- **Search by Title**: Full-text search using match queries (case-insensitive, partial matches)
- **Filter by Genre**: Exact match filtering using term queries
- **Filter by ISBN**: Exact match filtering for ISBN lookups
- **Filter by Year Range**: Find books published between specific years
- **Filter by Price Range**: Find books within a price range
- **Advanced Filtering**: Combine genre and year filters using bool queries

## Prerequisites

Before setting up this project, ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- **Docker** and **Docker Compose** (for running Elasticsearch)

## Step-by-Step Setup Instructions

### Step 1: Clone and Checkout the Branch

```bash
git checkout 02/crud-and-querying
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- `@nestjs/elasticsearch` - NestJS Elasticsearch integration
- `@elastic/elasticsearch` - Elasticsearch client
- `@nestjs/config` - Configuration management

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory (you can copy from `example.env`):

```bash
cp example.env .env
```

The `.env` file should contain:

```env
ELASTICSEARCH_NODE=http://localhost:9200
```

**Note**: If running with Docker Compose, the Elasticsearch node URL will be automatically configured as `http://elasticsearch:9200` inside the container.

### Step 4: Start the app

```bash
docker-compose up --build
```

This will start Elasticsearch on port `9200` with:
- Single-node discovery mode
- Security disabled (for development)
- 512MB heap size

And nestjs backend app will also start on port 3000

### Step 5: Create the Books Index

Before adding books, create the Elasticsearch index:

```bash
POST http://localhost:3000/books/index
Content-Type: application/json

{
  "name": "library_books"
}
```

Or using curl:

```bash
curl -X POST http://localhost:3000/books/index \
  -H "Content-Type: application/json" \
  -d '{"name": "library_books"}'
```

## API Endpoints Reference

### Index Management

#### Create Index
```http
POST /books/index
Content-Type: application/json

{
  "name": "library_books"
}
```

### Book CRUD Operations

#### Create Book (Auto-generated ID)
```http
POST /books/
Content-Type: application/json

{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "isbn": "978-0743273565",
  "publishedYear": 1925,
  "genre": "Fiction",
  "price": 15.99,
  "inStock": true
}
```

#### Create Book (With Specific ID)
```http
PUT /books/:id
Content-Type: application/json

{
  "title": "1984",
  "author": "George Orwell",
  "isbn": "978-0451524935",
  "publishedYear": 1949,
  "genre": "Dystopian",
  "price": 13.99,
  "inStock": true
}
```

#### Get Book by ID
```http
GET /books/:id
```

#### Get All Books (with pagination and sorting)
```http
GET /books/?page=1&size=10&sort=[{"publishedYear":{"order":"desc"}}]
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `size` (optional): Number of results per page (default: 5)
- `sort` (optional): JSON array of sort objects, e.g., `[{"publishedYear":{"order":"desc"}},{"price":{"order":"asc"}}]`

#### Bulk Insert Books
```http
POST /books/bulkInsert
Content-Type: application/json

[
  {
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "isbn": "978-0743273565",
    "publishedYear": 1925,
    "genre": "Fiction",
    "price": 15.99,
    "inStock": true
  },
  {
    "title": "1984",
    "author": "George Orwell",
    "isbn": "978-0451524935",
    "publishedYear": 1949,
    "genre": "Dystopian",
    "price": 13.99,
    "inStock": true
  }
]
```

### Search & Filter Operations

#### Search by Title
```http
GET /books/search?title=great
```

#### Filter by Genre
```http
GET /books/genre/Fiction
```

#### Filter by ISBN
```http
GET /books/isbn/978-0743273565
```

#### Filter by Year Range
```http
GET /books/year-range?from=2000&to=2020
```

#### Filter by Price Range
```http
GET /books/price-range?min=10&max=50
```

#### Advanced Filter (Genre + Year Range)
```http
GET /books/advanced?genre=Fiction&from=1900&to=2000
```

## Sample Data

You can use the following sample data to test the API:

```json
[
  {
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "isbn": "978-0743273565",
    "publishedYear": 1925,
    "genre": "Fiction",
    "price": 15.99,
    "inStock": true
  },
  {
    "title": "1984",
    "author": "George Orwell",
    "isbn": "978-0451524935",
    "publishedYear": 1949,
    "genre": "Dystopian",
    "price": 13.99,
    "inStock": true
  },
  {
    "title": "To Kill a Mockingbird",
    "author": "Harper Lee",
    "isbn": "978-0061120084",
    "publishedYear": 1960,
    "genre": "Fiction",
    "price": 18.99,
    "inStock": false
  },
  {
    "title": "The Hobbit",
    "author": "J.R.R. Tolkien",
    "isbn": "978-0547928227",
    "publishedYear": 1937,
    "genre": "Fantasy",
    "price": 14.99,
    "inStock": true
  },
  {
    "title": "Pride and Prejudice",
    "author": "Jane Austen",
    "isbn": "978-0141439518",
    "publishedYear": 1813,
    "genre": "Romance",
    "price": 12.99,
    "inStock": true
  }
]
```

### Quick Start: Insert Sample Data

1. Create the index:
```bash
curl -X POST http://localhost:3000/books/index \
  -H "Content-Type: application/json" \
  -d '{"name": "library_books"}'
```

2. Bulk insert sample data:
```bash
curl -X POST http://localhost:3000/books/bulkInsert \
  -H "Content-Type: application/json" \
  -d '[
    {
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "isbn": "978-0743273565",
      "publishedYear": 1925,
      "genre": "Fiction",
      "price": 15.99,
      "inStock": true
    },
    {
      "title": "1984",
      "author": "George Orwell",
      "isbn": "978-0451524935",
      "publishedYear": 1949,
      "genre": "Dystopian",
      "price": 13.99,
      "inStock": true
    },
    {
      "title": "To Kill a Mockingbird",
      "author": "Harper Lee",
      "isbn": "978-0061120084",
      "publishedYear": 1960,
      "genre": "Fiction",
      "price": 18.99,
      "inStock": false
    },
    {
      "title": "The Hobbit",
      "author": "J.R.R. Tolkien",
      "isbn": "978-0547928227",
      "publishedYear": 1937,
      "genre": "Fantasy",
      "price": 14.99,
      "inStock": true
    },
    {
      "title": "Pride and Prejudice",
      "author": "Jane Austen",
      "isbn": "978-0141439518",
      "publishedYear": 1813,
      "genre": "Romance",
      "price": 12.99,
      "inStock": true
    }
  ]'
```

3. Test search:
```bash
curl "http://localhost:3000/books/search?title=gatsby"
curl "http://localhost:3000/books/genre/Fiction"
curl "http://localhost:3000/books/year-range?from=1900&to=1950"
```

## Project Structure

```
src/
├── books/
│   ├── books.controller.ts    # REST API endpoints
│   ├── books.service.ts        # Business logic
│   ├── books.module.ts         # Module configuration
│   ├── types.ts                # TypeScript interfaces
│   └── utils/                  # Utility functions
├── elasticsearch/
│   ├── elasticsearch.module.ts # Elasticsearch module config
│   └── elasticsearch.service.ts # Custom Elasticsearch service
├── app.module.ts               # Root module
└── main.ts                     # Application entry point
```

## Technologies Used

- **NestJS** - Progressive Node.js framework
- **Elasticsearch** - Distributed search and analytics engine
- **TypeScript** - Type-safe JavaScript
- **Docker** - Containerization for Elasticsearch

## Response Format

All API endpoints return responses in the following format:

```json
{
  "success": true,
  "data": {
    // Elasticsearch response data
  }
}
```

Or in case of an error:

```json
{
  "success": false,
  "data": null
}
```

## Troubleshooting

### Elasticsearch Connection Issues

1. **Check if Elasticsearch is running:**
   ```bash
   curl http://localhost:9200
   ```

2. **Verify the ELASTICSEARCH_NODE environment variable** matches your Elasticsearch instance URL.

3. **If using Docker Compose**, ensure both containers are running:
   ```bash
   docker-compose ps
   ```

### Index Already Exists Error

If you get an error that the index already exists, you can either:
- Use a different index name
- Delete the existing index using Kibana Dev Tools or Elasticsearch API:
  ```bash
  curl -X DELETE http://localhost:9200/library_books
  ```

### Port Already in Use

If port 3000 is already in use, you can change it by setting the `PORT` environment variable:
```bash
PORT=3001 npm run start:dev
```

## Next Steps

This branch implements Tasks 1-2 from the project roadmap (CRUD operations and simple search queries). Future enhancements may include:
- Update and Delete operations (currently endpoints are commented)
- More complex bool queries (OR, NOT)
- Sorting and pagination improvements
- Aggregations for analytics

## Development Commands

```bash
# Start development server
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod

# Run linter
npm run lint

# Run tests
npm run test
```

## License

UNLICENSED


