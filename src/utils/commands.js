export default class HashTable {
  constructor(max = 1000) {
    // maximun numbers of bucket in the hash table
    this.max = max;
    // current number of buckets filled in the hash table
    this.size = 0;
    // initialize the buckets
    this.buckets = new Array(max);
  }

  hashFunction = (key) => {
    let hash = 0;

    const string = key.toString();

    for (let i = 0; i < string.length; i++) {
      let letterCode = string.charCodeAt(i);

      hash = (hash << 5) - hash + letterCode;

      hash = hash & hash;
    }

    return Math.abs(hash % this.max);
  };

  // given a key, return the index after hashing
  getIndex = (key) => {
    if (typeof key !== "string") {
      throw new Error("Key must be a string!");
    }
    return this.hashFunction(key);
  };

  // given a key, return the bucket
  getBucket = (key) => {
    return this.buckets[this.getIndex(key)];
  };

  set = (key, value) => {
    const index = this.getIndex(key);

    if (!this.getBucket(key)) this.buckets[index] = [];

    const bucket = this.getBucket(key);

    let overWritten = false;

    for (let i = 0; i < bucket.length; i++) {
      let node = bucket[i];

      if (node[0] === key) {
        node[1] = value;
        overWritten = true;
      }
    }

    if (!overWritten) {
      bucket.push([key, value]);
      console.log("bucket value: ", bucket);
      this.size++;
    }
  };
}
