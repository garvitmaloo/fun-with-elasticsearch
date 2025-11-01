# Elasticsearch: Basics Notes

## What is Elasticsearch?

Elasticsearch is a distributed, open-source search and analytics engine built on top of **Apache Lucene**. At its core, it's designed to handle large volumes of data and provide near real-time search capabilities with incredibly fast response times.

Think of Elasticsearch as a highly sophisticated search engine that can index, search, and analyze massive amounts of structured and unstructured data at lightning speed. It stores data in a schema-flexible, JSON-document format and provides a RESTful API for all operations.

**Key characteristics:**
- **Distributed by nature**: Scales horizontally across multiple machines
- **Near real-time**: Data becomes searchable within ~1 second of indexing
- **Schema-free (mostly)**: Automatically detects data types and creates mappings
- **Full-text search powerhouse**: Advanced text analysis, relevance scoring, and complex queries
- **Analytics engine**: Aggregations for statistical analysis, metrics, and visualizations

## Elasticsearch's Role in the Modern Ecosystem

Elasticsearch sits at the heart of the **Elastic Stack** (formerly ELK Stack):

**1. Data Ingestion Layer**
- **Logstash**: Processes and transforms data from various sources
- **Beats**: Lightweight data shippers (Filebeat, Metricbeat, etc.)
- Ingests logs, metrics, traces, and business data

**2. Storage & Search Layer (Elasticsearch)**
- Stores all indexed data
- Provides search and analytics capabilities
- Handles complex queries across billions of documents

**3. Visualization Layer**
- **Kibana**: Web interface for visualizing data, creating dashboards, and managing Elasticsearch

**Common Use Cases:**
- **Log and event analytics**: Centralizing logs from servers, applications, network devices
- **Application search**: Powering search features in e-commerce, content management systems
- **Security analytics**: SIEM (Security Information and Event Management)
- **Business analytics**: Real-time metrics, KPIs, and operational intelligence
- **Observability**: Monitoring infrastructure, APM (Application Performance Monitoring)

## Elasticsearch vs Traditional Databases

This is crucial to understand because Elasticsearch is **NOT** a replacement for traditional databases—it complements them.

### Traditional Relational Databases (PostgreSQL, MySQL)

**Strengths:**
- ACID transactions (Atomicity, Consistency, Isolation, Durability)
- Strong consistency guarantees
- Complex joins across multiple tables
- Data integrity with foreign keys and constraints
- Perfect for transactional workloads

**Weaknesses:**
- Full-text search is limited and slow
- Poor horizontal scalability
- Complex queries can be expensive
- Not optimized for analytical workloads

### Elasticsearch

**Strengths:**
- Blazing fast full-text search with relevance scoring
- Excellent horizontal scalability
- Near real-time search and analytics
- Powerful aggregations for analytics
- Denormalized data structure optimized for reads
- Flexible schema (can handle semi-structured data)

**Weaknesses:**
- No true ACID transactions across documents
- Eventually consistent (not immediately consistent)
- No joins (data should be denormalized)
- Not ideal as a primary data store for critical transactional data
- Updates and deletes are more expensive than in RDBMS

### Key Differences

| Aspect | RDBMS | Elasticsearch |
|--------|-------|---------------|
| **Data Model** | Normalized tables with rows | Denormalized JSON documents |
| **Schema** | Strict, predefined | Flexible, dynamic |
| **Query Language** | SQL | Query DSL (JSON-based) |
| **Optimization** | Write-optimized | Read/search-optimized |
| **Consistency** | Strong (ACID) | Eventual consistency |
| **Scaling** | Vertical (primarily) | Horizontal |
| **Best for** | Transactional data | Search and analytics |

## When to Use Elasticsearch

**Use Elasticsearch when you need:**

1. **Full-text search with relevance**: Product catalogs, document repositories, knowledge bases
2. **Log aggregation and analysis**: Centralized logging from distributed systems
3. **Real-time analytics**: Dashboards showing live metrics and KPIs
4. **Fuzzy matching and typo tolerance**: User-facing search that handles misspellings
5. **Faceted search**: Filtering by multiple categories (e.g., e-commerce filters)
6. **Time-series data**: Metrics, events, IoT sensor data
7. **Geospatial queries**: Location-based search and filtering

**Don't use Elasticsearch as:**

1. **Primary transactional database**: Use PostgreSQL, MySQL for transactions
2. **Single source of truth**: Keep authoritative data in traditional databases
3. **Systems requiring immediate consistency**: Financial transactions, inventory management
4. **Applications needing complex joins**: Relational databases handle this better

**Typical Architecture Pattern:**
```
PostgreSQL (Primary DB) → Logstash/Application → Elasticsearch (Search/Analytics)
                                                         ↓
                                                      Kibana (Visualization)
```

## Core Concepts: The Building Blocks

Now let's dive deep into Elasticsearch's architecture.

### 1. Cluster

A **cluster** is a collection of one or more nodes (servers) that together hold your entire data and provide federated indexing and search capabilities.

**Key Points:**
- Identified by a unique name (default: "elasticsearch")
- All nodes with the same cluster name automatically join the cluster
- Provides high availability and fault tolerance
- Distributes data and workload across all nodes
- A single node also forms a cluster

**Why it matters:**
When a node joins a cluster, the cluster automatically redistributes data for balance and redundancy. If a node fails, the cluster automatically heals itself by redistributing shards.

**Production best practice:** Always run clusters with at least 3 master-eligible nodes to avoid split-brain scenarios.

### 2. Node

A **node** is a single server that is part of your cluster, stores data, and participates in indexing and search operations.

**Types of Nodes:**

**Master Node:**
- Manages cluster-wide operations: creating/deleting indices, tracking nodes, allocating shards
- Does NOT handle search or indexing requests
- Elected through a voting process
- Setting: `node.master: true`

**Data Node:**
- Stores actual data (documents)
- Executes CRUD operations, search, and aggregations
- Resource-intensive (needs good CPU, RAM, disk I/O)
- Setting: `node.data: true`

**Coordinating Node:**
- Routes requests to appropriate data nodes
- Gathers and merges results from multiple shards
- Every node is implicitly a coordinating node
- Can have dedicated coordinating nodes for load balancing

**Ingest Node:**
- Preprocesses documents before indexing
- Applies transformations via ingest pipelines
- Setting: `node.ingest: true`

**Machine Learning Node:**
- Runs machine learning jobs
- Setting: `node.ml: true`

**Real-world scenario:**
A production cluster might have:
- 3 dedicated master nodes (lightweight, stable)
- 10 data nodes (heavy resources, handle actual workload)
- 2 coordinating nodes (for load balancing client requests)

### 3. Index

An **index** is a collection of documents that have similar characteristics. Think of it as analogous to a database table, but remember—it's document-oriented, not relational.

**Structure:**
- Named with lowercase letters (e.g., "logs-2025-11", "products", "users")
- Contains multiple documents
- Has a mapping (schema) that defines field types
- Has settings that control behavior (number of shards, replicas, refresh interval)

**Example:**
```json
// An "orders" index might contain:
{
  "order_id": "12345",
  "customer": "John Doe",
  "items": ["laptop", "mouse"],
  "total": 1299.99,
  "timestamp": "2025-11-01T10:30:00"
}
```

**Index patterns:**
For time-series data, you typically create indices with date patterns:
- `logs-2025-11-01`
- `logs-2025-11-02`
- `logs-2025-11-03`

This allows efficient data retention policies (delete old indices) and optimized queries (search only relevant time ranges).

**Mapping:**
Defines how documents and their fields are stored and indexed:
```json
{
  "mappings": {
    "properties": {
      "title": { "type": "text" },      // Full-text search
      "price": { "type": "float" },      // Numeric
      "created": { "type": "date" },     // Date
      "tags": { "type": "keyword" }      // Exact matching
    }
  }
}
```

### 4. Document

A **document** is the basic unit of information that can be indexed. It's a JSON object containing your actual data.

**Characteristics:**
- Expressed in JSON format
- Self-contained (contains all related data—denormalized)
- Has a unique identifier (`_id`)
- Belongs to exactly one index
- Is immutable (updates create new versions)

**Example document in a "products" index:**
```json
{
  "_index": "products",
  "_id": "1",
  "_source": {
    "name": "Wireless Mouse",
    "description": "Ergonomic wireless mouse with 6 buttons",
    "price": 29.99,
    "category": "Electronics",
    "brand": "TechCorp",
    "in_stock": true,
    "tags": ["wireless", "ergonomic", "computer"],
    "specs": {
      "color": "Black",
      "battery": "2x AAA",
      "dpi": 1600
    }
  }
}
```

**Key concept—Denormalization:**
Unlike relational databases where you'd split this into multiple tables (products, categories, brands), Elasticsearch prefers denormalized documents. All related data lives together for fast retrieval.

**Document versioning:**
Each document has a `_version` field. When you update a document, Elasticsearch:
1. Retrieves the old document
2. Applies changes
3. Deletes the old document
4. Indexes the new document with incremented version

### 5. Shard

A **shard** is a fundamental unit of data distribution in Elasticsearch. It's a fully functional, independent index that can be hosted on any node in the cluster.

**Why shards exist:**
- **Horizontal scaling**: Split large indices across multiple nodes
- **Parallelization**: Distribute search/indexing operations for better performance
- **Data management**: No single node needs to hold all data

**Types of Shards:**

**Primary Shard:**
- Contains the original data
- Handles all write (index, update, delete) operations first
- Number set at index creation (cannot be changed without reindexing)
- Default: 1 primary shard per index (in Elasticsearch 7+)

**Replica Shard:**
- An exact copy of a primary shard
- Provides redundancy and high availability
- Handles read operations (search, get) to distribute load
- Number can be changed dynamically
- Default: 1 replica per primary shard

**Deep dive example:**

Let's say you create an index with 3 primary shards and 1 replica:

```
Index Settings:
- primary_shards: 3
- replica_shards: 1
```

**Physical distribution:**
```
Node 1: [P0] [R1] [R2]
Node 2: [P1] [R0] [R2]
Node 3: [P2] [R0] [R1]

P0, P1, P2 = Primary shards
R0, R1, R2 = Replica shards
```

**How data is distributed:**
When you index a document with `_id: "user123"`:

1. Elasticsearch hashes the document ID: `hash("user123") % 3 = 1`
2. Routes to primary shard P1 (on Node 2)
3. After indexing on P1, replicates to R1 (on Node 3)

**Search distribution:**
When you search:
1. Request goes to any node (coordinating node)
2. Coordinating node forwards request to one shard from each shard group:
   - Either P0 or R0
   - Either P1 or R1
   - Either P2 or R2
3. Gathers results from all 3 shards
4. Merges and ranks results
5. Returns to client

**Shard sizing best practices:**

**Too few shards:**
- Can't leverage multiple nodes fully
- Limited parallelization
- Harder to scale

**Too many shards:**
- Overhead in cluster management
- Each shard consumes resources (memory, file handles)
- Slower search (more shards to query)

**Rule of thumb:**
- Aim for shard size: 10GB - 50GB
- Maximum: ~200-300 shards per GB of heap memory
- For a 1TB index: 20-50 primary shards (20-50GB each)

### 6. Replica

**Replicas** are copies of your primary shards, serving two critical purposes:

**1. High Availability (Failover)**

If a node containing a primary shard fails, Elasticsearch automatically:
1. Promotes a replica shard to primary
2. Creates new replica shards on remaining nodes
3. Continues operating without data loss

**Scenario:**
```
Before failure:
Node 1: [P0] [R1]
Node 2: [P1] [R0]  ← Node 2 crashes
Node 3: [P2]

After automatic recovery:
Node 1: [P0] [R1] [P1-promoted]
Node 3: [P2] [R0-new]
```

**2. Increased Read Throughput**

Replicas can serve search and get requests simultaneously with primaries:
- 1 primary + 2 replicas = 3x read capacity
- Load balanced automatically across all copies
- Particularly important for read-heavy workloads

**Replica configuration:**

```json
PUT /my-index
{
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 2  // Each primary has 2 replicas
  }
}
```

**Total shards:** 3 primaries + (3 × 2 replicas) = 9 shards total

**Dynamic replica adjustment:**
Unlike primary shards, you can change replica count anytime:

```json
PUT /my-index/_settings
{
  "number_of_replicas": 1  // Reduce from 2 to 1
}
```

**Production considerations:**

**Development:** 0 replicas (single node is fine)
**Production:** At least 1 replica (minimum for HA)
**Critical systems:** 2+ replicas (can lose multiple nodes)

**Important:** Never store a primary and its replica on the same node. Elasticsearch prevents this by default—it's pointless for HA.

## How It All Works Together

Let's trace a complete workflow:

**Indexing a document:**

```json
POST /products/_doc
{
  "name": "Smart Watch",
  "price": 299.99
}
```

1. **Request arrives** at Node 1 (coordinating node)
2. **Routing**: Elasticsearch hashes the document ID and determines it belongs to shard 2
3. **Primary indexing**: Routes to Node 3 (has P2)
4. **Replica sync**: After successful primary write, replicates to R2 on Node 1 and Node 2
5. **Response**: Returns success to client
6. **Refresh**: After ~1 second, document becomes searchable

**Searching:**

```json
GET /products/_search
{
  "query": {
    "match": { "name": "watch" }
  }
}
```

1. **Request arrives** at Node 2 (coordinating node)
2. **Broadcast**: Sends query to one shard from each shard group (P0, P1, P2 or their replicas)
3. **Parallel execution**: Each shard searches its local data
4. **Score and fetch**: Each shard returns top matching document IDs and scores
5. **Merge**: Coordinating node merges results, ranks globally
6. **Fetch**: Retrieves full documents from relevant shards
7. **Response**: Returns sorted, scored results to client

## Summary: The Mental Model

Think of Elasticsearch as:

- **Cluster**: Your entire Elasticsearch deployment (the forest)
- **Nodes**: Individual servers (the trees)
- **Indices**: Collections of similar documents (libraries)
- **Documents**: Your actual data (books in the library)
- **Shards**: Split indices for distribution (library sections)
- **Replicas**: Backup copies for safety and speed (book copies)

**The power comes from:**
1. Horizontal distribution (sharding)
2. Redundancy (replication)
3. Parallel processing (distributed search)
4. Near real-time indexing
5. Sophisticated text analysis and relevance scoring

This architecture allows Elasticsearch to handle petabytes of data across hundreds of nodes while maintaining sub-second query response times—something traditional databases simply cannot achieve at this scale.