import net from "node:net";

const client = net.createConnection({ port: 8124 }, () => {
  // 'connect' listener.
  console.log("connected to server!");
  client.write("*3\r\n$3\r\nSET\r\n$4\r\ncity\r\n$5\r\ndelhi\r\n");
  client.write("*3\r\n$6\r\nEXPIRE\r\n$4\r\ncity\r\n$2\r\n20\r\n"); 
  client.write("*2\r\n$3\r\nGET\r\n$4\r\ncity\r\n");
  client.write("*2\r\n$3\r\nTTL\r\n$4\r\ncity\r\n");  
 

  // setTimeout(() => client.end(), 500);
});  
 
client.on("data", (data) => {
  console.log("Raw Reply: ", JSON.stringify(data.toString()));
}); 

client.on("error", (err) => {
  console.error(err);
});

client.on("end", () => {
  console.log("disconnected from server");
});

// Remove the subject name from the sentence. If the sentence is still true,
// it fails because the answer is still too general. You need to ask another question and go deeper.
