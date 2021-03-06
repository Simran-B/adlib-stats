"use strict";

console.time("Total time");

let fs = require("fs");
let path = require("path");
let readline = require("readline");
let bomstrip = require("./bomstrip-stream");

let outFilePath = "stats.txt";
let outFile = fs.createWriteStream(outFilePath);
console.log(`Writing to ${outFilePath}...\n`);

for (let entry of process.argv.entries()) {
    let index = entry[0];
    let filePath = entry[1];
    if (index < 2) continue;

    processFile(filePath, outFile).then(function() {
        console.log(`${index-1}. ${path.basename(filePath)}`);
    });
}

console.log();
console.timeEnd("Total time");
console.log();

function processFile(filePath, outFile) {
    return new Promise(function() {
        let inFile = fs.createReadStream(filePath).pipe(new bomstrip());

        let lineReader = readline.createInterface({
            input: inFile
        });
        let tagCounts = {};
        let recordCount = 0;
        
        lineReader.on("line", function(line) {
            let tag = line.slice(0, 2);
            tag.trim();
            if (!tag) {
                return;
            }
            else if (tag == "**") {
                recordCount++;
            } else {
                tagCounts[tag] = tagCounts[tag] + 1 || 1;
            }
        });
        
        // must wait for close event to access the final states of the variables
        lineReader.on("close", function() {
            let basename = path.basename(filePath);
            outFile.write(basename + "\r\n");
            outFile.write("-".repeat(basename.length) + "\r\n");
            outFile.write(`Path: ${path.resolve(filePath)}\r\n`)
            outFile.write(`Total records: ${recordCount}\r\n\r\n`);
            
            let tagCountsArray = [];
            for (let elem in tagCounts) {
                tagCountsArray.push([tagCounts[elem], elem]);
            }
            tagCountsArray.sort(function(a, b) {
                return b[0] - a[0]
            });
            for (let elem of tagCountsArray) {
                let count = elem[0];
                let tag = elem[1];
                outFile.write(`${" ".repeat(8 - count.toString().length)}${count} ${tag}\r\n`);
            }
            outFile.write("\r\n\r\n");
        });
    });
}