var fs = require("fs"),
  readline = require("readline");
const util = require("util");

async function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", function(err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

async function getData() {
  const cdrData = await readFile("Master.csv");
  const cdrLines = cdrData.split("\n");

  let cdr = [];

  let x = 0;
  cdrLines.forEach(element => {
    x++;
    if (x < 20) {
      let ol = element.replace(/"/g, "'")
      ol = ol.replace(/'''/g, "\'\"")
      ol = ol.replace(/''/g, "\"")
      const objs = ol.split(',')
      cdr.push(`(\'\',${objs[1]},${objs[2]},${objs[3]},${objs[4]},${objs[5]},${objs[6]},${objs[7]},${objs[8]}${objs[9]}${objs[10]},${objs[11]},${objs[14]},${objs[15]},${objs[16]},0,${objs[18]},${objs[19]})\n`);
    }
  });

  return cdr;
}

async function main() {
  const cdr = await getData();
  fs.writeFile("final.csv", cdr, err => {
    if (err) throw err;
  });
}

main();
