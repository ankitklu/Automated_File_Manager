let inputArr = process.argv.slice(2);
let fs = require("fs");
let path = require("path");

let types = {
    media: ["mp4", "mkv"],
    archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', "xz"],
    documents: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex'],
    app: ['exe', 'dmg', 'pkg', "deb"]
}

// node main.js tree "directoryPath"
// node main.js organize "directoryPath"
// node main.js help

let command = inputArr[0];
switch (command) {
    case "tree":
        treeFn(inputArr[1]);  // Use inputArr[1] for the directory path
        break;
    case "organize":
        organizeFn(inputArr[1]);
        break;
    case "help":
        helpFn();
        break;
    default:
        console.log("Please enter a valid command");
        break;
}

function treeFn(dirPath) {
    console.log("Tree command implemented");
}

function organizeFn(dirPath) {
    console.log("Organize command implemented");

    let destPath;

    if (dirPath == undefined) {
        console.log("Kindly enter a valid path");
        return;
    } else {
        let doesExist = fs.existsSync(dirPath);
        if (doesExist) {
            //2. create -> organized_file -> directory
            destPath = path.join(dirPath, "organized_files");
            if (fs.existsSync(destPath) == false) {
                fs.mkdirSync(destPath);
            }
        } else {
            console.log("Kindly enter the path");
            return;
        }
    }
    organizeHelper(dirPath, destPath)
}

function organizeHelper(src, dest) {
    //3. identify the categories of all the files present in that input directory
    let childNames = fs.readdirSync(src);

    for (let i = 0; i < childNames.length; i++) {
        let childAddress = path.join(src, childNames[i]);
        let isFile = fs.lstatSync(childAddress).isFile();
        if (isFile) {

            let category = getCategory(childNames[i]);

            console.log(childNames[i]);

            //4. copy/cut files to that organized directory inside of any of the category folders
            sendFiles(childAddress, dest, category);
        }
    }
}

function sendFiles(srcFilePath, dest, category) {
    let categoryPath = path.join(dest, category);
    if (fs.existsSync(categoryPath) == false) {
        fs.mkdirSync(categoryPath);
    }
    let fileName = path.basename(srcFilePath);
    let destFilePath = path.join(categoryPath, fileName);
    fs.copyFileSync(srcFilePath, destFilePath);
    fs.unlinkSync(srcFilePath);
    console.log(fileName, "is copied to", category);
}

function getCategory(name) {
    let ext = path.extname(name);
    ext = ext.slice(1); //to remove the initial "."
    for (let type in types) {
        let cTypeArray = types[type];
        for (let i = 0; i < cTypeArray.length; i++) {
            if (ext == cTypeArray[i]) {
                return type;
            }
        }
    }
    return "others";
}

function helpFn(dirPath) {
    console.log(`List of All commands 
                        node main.js tree "directoryPath"
                        node main.js organize "directoryPath"
                        node main.js help
        `);
}
