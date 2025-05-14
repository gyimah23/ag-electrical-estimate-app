const fs = require("fs");

const fontPath = "../assets/Roboto-Italic.woff"; // Adjust the path
const base64 = fs.readFileSync(fontPath).toString("base64");

console.log(`data:font/woff;base64,${base64}`);
