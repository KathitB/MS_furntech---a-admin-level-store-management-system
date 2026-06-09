const key = require('./serviceAccountKey.json').private_key;
const lines = key.split('\n');
console.log("Total lines:", lines.length);
lines.forEach((line, idx) => {
  console.log(`Line ${idx}: length=${line.length}, content=${JSON.stringify(line)}`);
});
