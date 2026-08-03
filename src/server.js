import net from "net";
import { bulkStringParser, parseArray } from "./utils/parser.js";
import HashTable from "./utils/commands.js";

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
    const method = new HashTable();

    switch (commandName) {
      case "SET":
        const key = command[1];
        const value = command[2];
        method.set(key, value);
        break;

      case "GET":
        getCommand();
        break;

      case "EXPIRE":
        expireCommand();

      case "TTL":
        ttlCommand();
        break;
    }
  }

  c.on("end", () => {
    console.log("client disconnected");
    c.end();
  });

  c.write("Hello\r\n");
});

server.on("error", (err) => {
  throw err;
});

server.listen(8124, () => {
  console.log("server bound.");
});
