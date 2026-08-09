import net from "net";
import { bulkStringParser, parseArray } from "./utils/parser.js";
import HashTable, { expire } from "./utils/commands.js";

const method = new HashTable();

const server = net.createServer((c) => {
  console.log("client connected");

  const buf = Buffer.alloc(10);
  console.log(buf);

  let totalBytesRead = { numberOfBytes: 0 };
  let count = 0;

  c.on("data", (chunk) => {
    // 'chunk' is a Buffer containing raw bytes (Uint8Array)
    for (const byte of chunk) {
      if (byte === 42) {
        console.log("byte is: ", byte);
        const command = parseArray(totalBytesRead, chunk);
        console.log("command is: ", command);
        type(command);

        console.log("total bytes reads at arrayParser: ", totalBytesRead);
      }

      console.log(`Byte #${count++}: ${byte} (0x${byte.toString(16)})`);
    }
  });

  function type(command) {
    const commandName = command[0];
    console.log("command name is: ", commandName);

    switch (commandName) {
      case "SET":
        const key = command[1];
        const value = command[2];
        method.set(key, value);
        c.write("+OK\r\n");
        break;

      case "GET":
        const keyGetCommand = command[1];
        console.log("get key is: ", keyGetCommand);
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
        expire(valueExpire, valueStrToNum);
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


const hz = 10;
const delay = 1000 / hz;

setInterval(() => {
  serverCron()
}, delay);

server.on("error", (err) => {
  throw err;
});

server.listen(8124, () => {
  console.log("server bound.");
});
