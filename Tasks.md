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

### **1. Range Query — Filter by Price & Creation Date**

**Goal:** Practice numeric and date-based range queries.
**Task:**
Fetch all products that:

* Have a `price` between **100 and 300**
* Were `createdAt` **on or after 2024-02-01**
* Sort results by `price` ascending

**Expected matches:**
Products like *Fitness Tracker Smart Watch*, *Wireless Charging Pad*, *Stainless Steel Water Bottle*, etc.

👉 *Concepts:* `range`, sorting on numeric/date fields.

---

### **2. Exists Query — Find Documents with Missing Fields**

**Goal:** Identify incomplete or draft data.
**Task:**
Find all documents that:

* **Do not have** the field `description`
* OR **do not have** `discount`

**Expected matches:**

* `Item Without Description`
* `Product Missing Fields`

👉 *Concepts:* `exists`, `must_not`, handling missing/nullable fields.

---

### **3. Term(s) Query — Exact Keyword Filtering**

**Goal:** Match exact categorical values.
**Task:**
Find all products that:

* Have `category` = `"Sports"`
* AND `brand` is either `"RunFast"`, `"FitGear"`, or `"BallPro"`

**Expected matches:**

* `Professional Running Shoes`, `Dumbbell Set Adjustable`, `Basketball Official Size`

👉 *Concepts:* `term`, `terms` (exact match on keyword fields).

---

### **4. Multi-Match Query — Search Across Multiple Text Fields**

**Goal:** Perform full-text search with field weighting.
**Task:**
Search for `"wireless"` across `title`, `description`, and `content`.

* Give higher weight (`^2`) to `title`.
* Only include documents where `isActive = true`.

**Expected matches:**

* `Bluetooth Headphones`, `Wireless Ergonomic Mouse`, `Wireless Charging Pad`, `Smartphone X Pro Max`

👉 *Concepts:* `multi_match`, boosting (`^`), combining full-text search with boolean filters.

---

### **5. Bool Query — Complex Filtering**

**Goal:** Combine must, should, and must_not logic.
**Task:**
Find all **featured** products that:

* **Must** belong to category `"Electronics"`
* **Should** have a `rating >= 4.8` OR `discount >= 10`
* **Must_not** have `status = "draft"`
* **Filter** to only products priced below `1000`

**Expected matches:**

* `Smartphone X Pro Max`, `Gaming Monitor 4K`, `Bluetooth Headphones`, `Action Camera 4K`

👉 *Concepts:* `bool` queries with `must`, `should`, `must_not`, and `filter` clauses.

---

### **6. Fuzzy Query — Handling Misspellings**

**Goal:** Make search tolerant to typos.
**Task:**
Search for the term `"iphine"` (misspelling of “iPhone”) in the `title` field using a fuzzy query.
You should still match:

* `Smartphone X Pro Max`

👉 *Concepts:* `fuzzy` query, `fuzziness: AUTO`, typo-tolerant search.

---

### **7. Wildcard Query — Partial Keyword Matching**

**Goal:** Perform flexible pattern matching on keyword fields.
**Task:**
Find all products where:

* `sku` starts with `"PHN-"`
* OR `brand` contains `"Pro"` anywhere (e.g., `AudioPro`, `TechBrand`, `ChefPro`)

**Expected matches:**

* `Smartphone X Pro Max`, `Bluetooth Headphones`, `Premium Laptop Pro 15`, `Stand Mixer Kitchen`

👉 *Concepts:* `wildcard` queries, keyword field matching, pattern-based search.

---

### **8. Match Phrase Query — Exact Ordered Phrase**

**Goal:** Ensure precise phrase-level matching.
**Task:**
Search for documents whose `description` contains the **exact phrase** `"noise cancelling headphones"`.
Compare with `match` query to see looser results.

**Expected match:**

* `Bluetooth Headphones`

👉 *Concepts:* `match_phrase` vs `match`, positional matching in analyzed fields.

---

### **9. Sorting + Pagination — Paginate Sorted Results**

**Goal:** Implement result pagination like a real search API.
**Task:**
Retrieve all `Electronics` products sorted by:

* `rating` (descending)
* Then by `price` (ascending)
  Return **page 2**, **5 results per page** (i.e., `from: 5`, `size: 5`).

**Expected results (approximate):**
Second page of electronics sorted by best rating and lowest price.

👉 *Concepts:* Pagination using `from` & `size`, multi-level sorting.

---

### **10. Combined Complex Query — Realistic Product Search**

**Goal:** Build a full e-commerce search query.
**Task:**
Find all **in-stock**, **active** electronics products that:

* Match `"gaming laptop"` in `title` or `description`
* Have `price` between **100 and 1500**
* Have `rating >= 4.5`
* Prefer products where `brand` is `"TechBrand"` or `"MonitorTech"` (use `should` for scoring)
* Sort by `views` (desc), then `rating` (desc)
* Limit to 10 results

**Expected matches:**

* `Premium Laptop Pro 15`, `Gaming Monitor 4K`, possibly `Bluetooth Headphones` (if keywords overlap)

👉 *Concepts:* Combining `multi_match`, `range`, `bool`, `should`, sorting, and scoring in one query.

---

## ⚙️ Bonus Practice Ideas

Once you’re comfortable with the above:

* Add **aggregations** (avg price per category, top brands).
* Compare **match vs term** queries on the same field (`brand`).
* Filter vs query context experiment: check how `_score` changes.

---

Would you like me to now provide the **exact Elasticsearch JSON queries** (ready to paste into Kibana or Postman) for each of these 10 tasks — with the actual field names and realistic values based on this dataset?
That way you can execute them one by one and directly see the results.
