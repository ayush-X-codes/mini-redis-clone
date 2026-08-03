import net from "node:net";

const client = net.createConnection({ port: 8124 }, () => {
  // 'connect' listener.
  console.log("connected to server!");
  client.write("*3\r\n$3\r\nSET\r\n$5\r\nhello\r\n$5\r\nworld\r\n");
});

client.on("data", (data) => {
  console.log(data.toString());
  client.end();
}); 

client.on("error", (err) => {
  console.error(err);
}); 
 
client.on("end", () => {
  console.log("disconnected from server");
});

 