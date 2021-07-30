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
    const novoFile = await readFile("novo.ldif");
    const antigoFile = await readFile("antigo.ldif");
    const NOVO = novoFile.split("\n");
    const ANTIGO = antigoFile.split("\n");

    let matchCount = 0;


    let mailLine = null;
    let oldHome = null;
    let oldPassword = null;
    let matchNewHome = false;
    let passwordSum = false;

    for (let i = 0; i < NOVO.length; i++) {
        if (i < 150) {
            fs.appendFileSync('merged.ldif', NOVO[i] + "\n");
        } else {
            if (NOVO[i].startsWith("mail: ")) {
                //match = true;
                mailLine = NOVO[i];
                const [account, domain] = (mailLine.split(" ")[1]).split("@");

                //check if NOVO password follows as pattern
                if (!NOVO[i + 1].startsWith("userPassword:: ") ||
                    !NOVO[i + 2].startsWith(" ") ||
                    !NOVO[i + 3].startsWith(" ")) {
                    console.log("NOVO, next line not userPassword:: " + i);
                    console.log("STOPED due ERROR");
                    break;
                }

                //check if NOVO homeDirectory follows as pattern
                for (let count = 1; count < 50; count++) {
                    if (NOVO[i + count].startsWith("homeDirectory: ")) {
                        const singleLine = NOVO[i + count];
                        const mergedLines = NOVO[i + count] + (NOVO[i + count + 1]).trim();

                        if (singleLine.includes(account) && singleLine.includes(domain)) {
                            matchNewHome = true;
                            break;
                        } else if (mergedLines.includes(account) && mergedLines.includes(domain)) {
                            matchNewHome = true;
                            break;
                        }
                    }
                }
                if (!matchNewHome) {
                    console.log("NOVO, next line not userPassword:: " + i);
                    console.log("STOPED due ERROR");
                    break;
                }


                //get OLD homeDirectory
                for (let x = 0; x < ANTIGO.length; x++) {
                    if (ANTIGO[x].startsWith("homeDirectory: ") &&
                        ANTIGO[x].includes(account) && ANTIGO[x].includes(domain)) {
                        oldHome = ANTIGO[x];
                        if (ANTIGO[x + 1].startsWith(" ")) {
                            oldHome = oldHome + "\n" + ANTIGO[x + 1];
                        }
                        break;
                    } else if (ANTIGO[x].startsWith("homeDirectory: ")) {
                        const mergedLines = ANTIGO[x] + (ANTIGO[x + 1]).trim();
                        if (mergedLines.includes(account) && mergedLines.includes(domain)) {
                            oldHome = ANTIGO[x] + "\n" + ANTIGO[x + 1];
                            break;
                        }
                    }
                }

                //gget passwords in old file
                for (let x = 0; x < ANTIGO.length; x++) {
                    if (ANTIGO[x].includes(mailLine)) {
                        for (let count = 1; count < 50; count++) {
                            if (ANTIGO[x + count].startsWith("userPassword:: ")) {
                                oldPassword = ANTIGO[x + count];
                                if (ANTIGO[x + count + 1].startsWith(" ")) {
                                    oldPassword = oldPassword + "\n" + ANTIGO[x + count + 1];
                                }
                                break;
                            }
                        }
                    }
                }

                //check if old password is not found
                if (!oldPassword) {
                    console.log(mailLine);
                    console.log("NOVO, null password " + i);
                    console.log("STOPED due ERROR");
                    break;
                }

                //check if old directory is not found
                if (!oldHome) {
                    console.log(mailLine);
                    console.log("NOVO, null homeDirectory " + i);
                    console.log("STOPED due ERROR");
                    break;
                }

                fs.appendFileSync('merged.ldif', NOVO[i] + "\n");
                if (!mailLine || !oldHome || !oldPassword || !matchNewHome) {
                    console.log("error ");
                    break;
                }
            } else if (mailLine) {
                if (NOVO[i].startsWith("userPassword:: ")) {
                    fs.appendFileSync('merged.ldif', oldPassword + "\n");
                    passwordSum = true;
                } else if (NOVO[i].startsWith("homeDirectory: ")) {
                    fs.appendFileSync('merged.ldif', oldHome + "\n");
                    if (NOVO[i + 1].startsWith(" ")) {
                        i++;
                    }
                    matchCount++;
                    console.log("Match: " + matchCount);
                    mailLine = null;
                    oldHome = null;
                    oldPassword = null;
                    matchNewHome = false;
                } else {
                    fs.appendFileSync('merged.ldif', NOVO[i] + "\n");
                }
            } else {
                fs.appendFileSync('merged.ldif', NOVO[i] + "\n");
            }
        }

        if (passwordSum) {
            passwordSum = false;
            i = i + 2;
        }
    }
};

run();
