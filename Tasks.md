## Schema
```
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

### **1. Range Query (Numeric & Date Fields)**

**Goal:** Get all products within a specific price range and recently created.
**Task:**
Find all products where:

* `price` is between **500 and 1500**
* `createdAt` is **within the last 30 days**
* Sort by `price` ascending

👉 *Learned concepts:* `range`, sorting on numeric/date fields.

---

### **2. Exists Query (Check for Missing Fields)**

**Goal:** Find products missing optional metadata.
**Task:**
Retrieve all documents that:

* **Do not have** the field `discount` (i.e., discount info missing)
* OR have a `null`/missing `brand` field

👉 *Learned concepts:* `exists` + negation via `must_not`.

---

### **3. Term(s) Query (Exact Match Filtering)**

**Goal:** Filter by keyword fields.
**Task:**
Fetch all products where:

* `category` is exactly `"electronics"`
* `brand` is any of `"Samsung"`, `"Apple"`, or `"Sony"`
* `status` equals `"ACTIVE"`

👉 *Learned concepts:* `term`, `terms`, exact matching behavior of keyword fields.

---

### **4. Full-Text Search with Multi-Match**

**Goal:** Search across multiple text fields.
**Task:**
Search for the phrase **"wireless earbuds"** in both `title`, `description`, and `content`, giving **higher weight to title**.
Also, only include results where `isActive = true`.

👉 *Learned concepts:* `multi_match`, field boosting, text relevance scoring, combining with filters.

---

### **5. Bool Query (Combining Must, Should, Must_Not, Filter)**

**Goal:** Build a complex filtered query.
**Task:**
Get all **featured** products that:

* **Must** belong to `category = "home-appliances"`
* **Should** have `rating > 4.5` OR `discount >= 20`
* **Must_not** have `status = "DISCONTINUED"`
* **Filter** by `price < 5000` (not affecting score)

👉 *Learned concepts:* Combining multiple clauses with `bool`.

---

### **6. Fuzzy Query (Typos & Misspellings)**

**Goal:** Handle user typos.
**Task:**
Search for `"iphine"` (typo for “iPhone”) in the `title` field using a fuzzy match so results like “iPhone 14 Pro” still appear.

👉 *Learned concepts:* `fuzzy`, `fuzziness` parameter, typo-tolerant search.

---

### **7. Wildcard Query (Pattern-Based Keyword Search)**

**Goal:** Partial keyword pattern matching.
**Task:**
Find all products where:

* The `sku` starts with `"ELEC-"`
* The `brand` contains `"son"` (e.g., “Sony”, “Emerson”)

👉 *Learned concepts:* `wildcard` queries, `keyword` pattern syntax, performance implications.

---

### **8. Match Phrase Query (Ordered Word Match)**

**Goal:** Retrieve exact phrase matches.
**Task:**
Search for products whose `description` contains the **exact phrase** `"noise cancelling headphones"`, maintaining word order.
Bonus: Compare results to a `match` query to see differences in scoring.

👉 *Learned concepts:* `match_phrase`, phrase-level precision.

---

### **9. Sorting + Pagination**

**Goal:** Implement frontend-friendly search result pagination.
**Task:**
Search all active products in `category = "laptops"`,

* Sort primarily by `rating` (desc), then by `price` (asc).
* Return page 3 with 10 items per page.

👉 *Learned concepts:* `from`, `size`, multi-level `sort`.

---

### **10. Combined Query — Realistic Product Search**

**Goal:** Simulate a real-world search flow.
**Task:**
Find all **in-stock**, **active** products that:

* Match the text `"gaming laptop"` in `title` or `description`
* Have `price` between **₹60,000–₹120,000**
* Have `rating >= 4`
* Prefer results from `brand = "Asus"` or `brand = "MSI"` (higher score if matches)
* Sort by `views` (desc), `rating` (desc)
* Return top 20 results

👉 *Learned concepts:* Complex `bool` query mixing `multi_match`, `range`, `should` scoring boost, filters, and sorting.

---

## ⚙️ Bonus Challenges

Once you finish the above:

* Add **aggregations** for average price or category counts (next step after queries).
* Experiment with **query vs filter** context and how it affects `_score`.
* Compare `match` vs `term` on analyzed vs keyword fields.

---

Would you like me to provide **Elasticsearch JSON query examples** for each of these 10 tasks (ready to paste into Kibana or Postman)?
That would help you run and test them directly.
