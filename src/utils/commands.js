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
    console.log("getIndex key is: ", key)
    if (typeof key !== "string") {
      throw new Error("Key must be a string!");
    }
    const index = this.hashFunction(key);
    console.log("index of hash is: ", index);
    return index;
  };

  // given a key, return the bucket
  getBucket = (key) => {
    const index = this.getIndex(key);
    console.log("index is: ", index)
    const bucketValue = this.buckets[index];
    console.log("the bucket is: ", bucketValue);
    return bucketValue
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



  get = (key) => {
    const bucket = this.getBucket(key);
    console.log("bucket is: ", bucket)

    // if there is no bucket return undefine
    if (!bucket) return;

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) return bucket[i][1];
    }
  }
}


const expireDictionery = new HashTable();
function expire(key, timeInSec) {
  if (!key || !timeInSec) return;

  const currentTime = Date.now();
  console.log("current time is: ", currentTime);

  const durationMs = timeInSec * 1000;
  const expireAt = currentTime + durationMs;
  console.log("expire at is: ", expireAt);

  expireDictionery.set(key, expireAt);
  console.log("expire dictionery is: ", expireDictionery)
}






export { expire }