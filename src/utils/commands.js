import method from "../server.js";

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
    const index = this.hashFunction(key);
    return index;
  };

  // given a key, return the bucket
  getBucket = (key) => {
    const index = this.getIndex(key);
    const bucketValue = this.buckets[index];
    return bucketValue;
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

      this.size++;
    }
  };

  get = (key) => {
    const bucket = this.getBucket(key);

    // if there is no bucket return undefine
    if (!bucket) return;

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) return bucket[i][1];
    }
  };

  remove = (key) => {
    if (!this.getBucket(key)) return;

    let bucket = this.getBucket(key);

    for (let i = 0; i < bucket.length; i++) {
      let node = bucket[i];

      if (node[0] === key) {
        bucket.splice(i, 1);
      }

      if (bucket.length < 1) bucket = undefined;
      this.size--;

      return node[1];
    }
  };
}



class HashTableIterator {
  constructor(table) {
    this.table = table;
    this.bucketIndex = 0;
    this.nodeIndex = 0;
  }

  next() {
    while (this.bucketIndex < this.table.length) {
      const bucket = this.table[this.bucketIndex];

      if (bucket && this.nodeIndex < bucket.length) {
        const entery = bucket[this.nodeIndex];
        this.nodeIndex++;
        return { value: entery, done: false };
      }

      this.bucketIndex++;
      this.nodeIndex = 0;
    }

    return { value: undefined, done: true };
  }

  [Symbol.iterator]() {
    return this;
  }
}

const expireDictionery = new HashTable(10);

function expire(key, timeInSec) {
  if (!key || !timeInSec) return;

  const currentTime = Date.now();
  const durationMs = timeInSec * 1000;
  const expireAt = currentTime + durationMs;

  expireDictionery.set(key, expireAt);
}


function serverCron(table1, table2) {
  const expDicIterator = new HashTableIterator(table1);
  const mainDicIterator = new HashTableIterator(table2);
  const entery1 = expDicIterator.next();
  const entery2 = mainDicIterator.next();

  if (!entery1) return;

  const current_time = Date.now();
  const expiredTime1 = entery1.value[1];
  const expiredTime2 = entery2.value[1];

  if (current_time >= entery1.value[1]) {
    const key = entery.value[0];
    const deletedValue1 = method.remove(key);
    const deletedValue2 = method.remove(key);
  }

  const hz = 10;
  const delay = 1000 / hz;

  return delay
}

function passiveExpiration(key, expDicTable, mainDicTable) {
  const expDicValue = expDicTable.get(key);
  if (!expDicValue) return;

  const mainDicValue = mainDicTable.get(key);

  const current_time = Date.now();

  if (current_time >= expDicValue) {
    const deletedValue1 = method.remove(key);
    const deletedValue2 = method.remove(key);
  }
}



function ttl(key) {
  const valueTime = expireDictionery.get(key);
  if (!valueTime) {
    return '-2';
  }

  const currnetTime = Date.now();
  const timeLeft = valueTime - currnetTime;
  const timeInSec = timeLeft / 1000;
  console.log("time in sec is: ", timeInSec)

  return timeInMs
}

export { expire, serverCron, expireDictionery, passiveExpiration, ttl };
