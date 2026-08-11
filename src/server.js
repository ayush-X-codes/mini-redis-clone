import net from "net";
import { bulkStringParser, parseArray } from "./utils/parser.js";
import HashTable, {
  expireDictionery,
  passiveExpiration,
} from "./utils/commands.js";
import { expire, serverCron } from "./utils/commands.js";
import EventEmitter from "events";

const timeEmitter = new EventEmitter();
const method = new HashTable(10);

const server = net.createServer((c) => {
  console.log("client connected");

  const buf = Buffer.alloc(10);

  let count = 0;

  c.on("data", (chunk) => {
    let position = { numberOfBytes: 0 };

    try {
      while (position.numberOfBytes < chunk.length) {
        const command = parseArray(position, chunk);
        type(command);
      }
    } catch (error) {
      console.error(
        "Failed to parse command, closing this connection",
        error.message,
      );
      c.end();
    }
  });

  function type(command) {
    const commandName = command[0];

    switch (commandName) {
      case "SET":
        const key = command[1];
        const value = command[2];
        method.set(key, value);
        c.write("+OK\r\n");
        break;

      case "GET":
        const keyGetCommand = command[1];
        passiveExpiration(keyGetCommand, expireDictionery, method);
        const getValue = method.get(keyGetCommand);
        if (getValue === null || getValue === undefined) {
          c.write(`$-1\r\n`);
        } else {
          const valueLength = getValue.length;
          c.write(`*${valueLength}\r\n${getValue}\r\n`);
        }
        break;

      case "EXPIRE":
        const keyExpire = command[1];
        const valueExpire = command[2];
        const valueStrToNum = Number(valueExpire);
        expire(keyExpire, valueStrToNum);
        break;
      case "TTL":
        ttlCommand();
        break;
    }
  }

  c.on("end", () => {
    console.log("client disconnected");
  });
});

const currentMonotonicTime = performance.now();

const hz = 10;
const delay = 1000 / hz;
const scheduledTime = currentMonotonicTime + delay;

// setInterval(() => {
//   console.log("schdeuler runs...")
//   serverCron(expireDictionery.buckets, method.buckets)
// }, scheduledTime);

server.on("error", (err) => {
  throw err;
});

server.listen(8124, () => {
  console.log("server bound.");
});

export default method;
