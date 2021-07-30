var fs = require("fs");

async function readFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, "utf8", function (err, data) {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
}

async function run() {
    const mergedFile = await readFile("merged.ldif");
    const MERGED = mergedFile.split("\n");

    let mailLine = null;
    let account = null;
    let domain = null;

    for (let i = 0; i < MERGED.length; i++) {
        if (MERGED[i].startsWith("mail: ")) {
            mailLine = MERGED[i];
            [account, domain] = (mailLine.split(" ")[1]).split("@");
        } else if (mailLine && MERGED[i].startsWith("homeDirectory: ")) {
            const singleLine = MERGED[i];
            const mergedLines = singleLine + (MERGED[i + 1]).trim();

            if (singleLine.includes(account) && singleLine.includes(domain)) {
                console.log("MATCH... ", mailLine);
            } else if (mergedLines.includes(account) && mergedLines.includes(domain)) {
                console.log("MATCH... ", mailLine);
            } else {
                console.log("ERROR... ", mailLine);
                break;
            }

            mailLine = null;
            account = null;
            domain = null;
        }
    }
};

run();
