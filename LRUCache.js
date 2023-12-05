class LRUCache {
    constructor(capacity) {
      this.capacity = capacity;
      this.cache = new Map();
    }
  
    get(key) {
      if (this.cache.has(key)) {
        // Move the accessed key to the end to represent it as the most recently used
        const value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value);
        return value;
      } else {
        return -1; // Key not found in the cache
      }
    }
  
    put(key, value) {
      if (this.cache.size >= this.capacity) {
        // Evict the least recently used key (first item in the Map)
        const oldestKey = this.cache.keys().next().value;
        this.cache.delete(oldestKey);
      }
      // Add the new key-value pair to the cache
      this.cache.set(key, value);
    }
  
    displayCache() {
      console.log("Cache Contents:");
      for (const [key, value] of this.cache) {
        console.log(`${key}: ${value}`);
      }
    }
  }
  
  // Example usage
  /*const cache = new LRUCache(3); // Capacity is set to 3
  
  cache.put("A", 1);
  cache.put("B", 2);
  cache.put("C", 3);
  cache.displayCache(); // Cache Contents: A: 1, B: 2, C: 3
  
  console.log(cache.get("A")); // 1
  cache.displayCache(); // Cache Contents: B: 2, C: 3, A: 1
  
  cache.put("D", 4); // Evicts B as it was the least recently used
  cache.displayCache();*/ // Cache Contents: C: 3, A: 1, D: 4 
  