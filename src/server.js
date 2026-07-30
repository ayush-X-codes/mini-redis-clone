import net from "net";
import { bulkStringParser, parseArray } from "./utils/parser.js";

const server = net.createServer((c) => {
  console.log("client connected");

  let totalBytesRead = { numberOfBytes: 0 };
  let count = 0;

  let command;
  c.on("data", (chunk) => {
    // 'chunk' is a Buffer containing raw bytes (Uint8Array)
    for (const byte of chunk) {
      if (byte === 42) {
        console.log("byte is: ", byte);
        command = parseArray(totalBytesRead, chunk);
        console.log("total bytes reads at arrayParser: ", totalBytesRead);
        console.log("array element is: ", arrElememt);
      }

      console.log(`Byte #${count++}: ${byte} (0x${byte.toString(16)})`);
    }
  });

  const commandName = command[0];

  switch (commandName) {
    case "SET":
      setCommand(command);
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
