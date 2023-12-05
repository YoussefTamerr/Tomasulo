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
  