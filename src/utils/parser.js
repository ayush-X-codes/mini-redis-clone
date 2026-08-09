function readNextBytes(position, chunk) {
  const marker = chunk[position.numberOfBytes];

  if (marker === 42) {
    return parseArray(position, chunk);
  }

  if (marker === 36) {
    return bulkStringParser(position, chunk);
  }
}

function parseArray(position, chunk) {
  console.log("Parse array runs...");
  position.numberOfBytes++;

  const digit = Buffer.from([chunk[position.numberOfBytes]]).toString("utf-8");
  const num = parseInt(digit);

  const element = [];

  position.numberOfBytes += 2;

  for (let i = 0; i < num; i++) {
    if (i === 0) position.numberOfBytes++;
    const value = readNextBytes(position, chunk);
    element.push(value);
  }
 
  console.log("elements is: ", element)
  return element;
}

function bulkStringParser(position, chunk) {
  console.log("bulk string parser runs...");
  position.numberOfBytes++;

  let num;
  while (chunk[position.numberOfBytes] !== 13) {
    const digit = Buffer.from([chunk[position.numberOfBytes]]).toString(
      "utf-8",
    );
    num = parseInt(digit);
    position.numberOfBytes++;
  }

  position.numberOfBytes += 2;

  let word = "";
  for (let i = 0; i < num; i++) {
    const char = Buffer.from([chunk[position.numberOfBytes]]).toString("utf-8");

    word += char;
    position.numberOfBytes++;
  }

  position.numberOfBytes += 2;

  return word;
}

export { parseArray, bulkStringParser };
