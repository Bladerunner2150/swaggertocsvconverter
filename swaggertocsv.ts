import data from './csv-inputs/swagger.json';
import moment from 'moment';
import fs from 'fs';
import readline from 'readline';

var reader = readline.createInterface(fs.createReadStream("csv-outputs/history.txt"));
var history: string[] = [];
let commaString: string = 'Tag,Action,Path,Dataseeder,Automation,Active\n';

reader.on("line", (line: string) => {
    history.push(line);
});
reader.on("close", () => {
    for (var key1 in data.paths) {
        if (data.paths.hasOwnProperty(key1)) {
            const action = data.paths[key1];
            for (const key2 in action) {
                if (action.hasOwnProperty(key2)) {
                    const newLine: string = `${action[key2].tags[0]},${key2},${key1},,,`;
                    if (!history.includes(newLine)) {
                        commaString = commaString.concat(`${newLine}\n`);
                        fs.appendFile('csv-outputs/history.txt', `${newLine}\n`, err => {
                            if (err) throw err;
                            console.log(`Line ${newLine} added to history`);
                        });
                    }
                }
            }
        }
    }
    fs.writeFile(
        `csv-outputs/${moment().format('YYYY-MM-DD---HH-mm-SSS-')}new-endpoints.csv`,
        commaString,
        err => {
            if (err) throw err;
            console.log('CSV saved!');
        }
    );
});