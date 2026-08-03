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

        let string = key.toString();

        for (let i = 0; i < string.length; i++) {
            let letterCode = string.charCodeAt(i);
            hash = (hash << 5) - hash + letterCode;
        }

        return Math.abs(hash % this.max);
    };

    // given a key, return the index after hashing
    getIndex = (key) => {
        console.log("getIndex key is: ",  key)
        console.log("key is: ", typeof key)
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
        console.log("key is: ", key);
        console.log("type of key is: ", typeof key)
        const index = this.getIndex(key);
        console.log("index is: ", index)

        if (!this.getBucket(key)) this.buckets[index] = [];

        const bucket = this.getBucket(key);
        console.log("bucket value is: ", bucket)

        let overwritten = false;

        for (let i = 0; i < bucket.length; i++) {
            let node = bucket[i];

            if (node[0] === key) {
                node[1] = value;
                overwritten = true;
            }
        }

        if (!overwritten) {
            bucket.push([key, value]);
            console.log("value added in buckeet", bucket)
            this.size++;
        }
    };
}



