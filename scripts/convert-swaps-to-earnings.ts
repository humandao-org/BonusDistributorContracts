import {program} from "commander";
import fs from "fs";
import {parseSwaps} from "../src/swap-parser";

program
    .version('0.0.0')
    .requiredOption(
        '-i, --input <path>',
        'input JSON file containing the export of the swaps'
    )

program.parse(process.argv)

const json = JSON.parse(fs.readFileSync(program.input, {encoding: 'utf8'}))
if (typeof json !== 'object') throw new Error('Invalid JSON')

console.log(parseSwaps(json.data.swaps));

