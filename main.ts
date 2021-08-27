import simpleGit from "simple-git";
import dateFormat from "dateformat";
import * as fs from "fs";
import mkdirp from "mkdirp";
import stringify from "csv-stringify-as-promised";
import yargs from 'yargs'
import {hideBin} from 'yargs/helpers'

interface Diff {
    date: Date
    files: [{
        name: string
        module: string
        extension: string
    }]
}

interface Args {
    target: string
    out: string
    range: string
}

const argv = yargs(hideBin(process.argv))
    .option('out', {
        alias: 'o',
        description: 'output dir',
        default: './out/csv'
    })
    .option('target', {
        alias: 't',
        description: 'target analyze dir',
        demandOption: true
    })
    .option('range', {
        alias: 'r',
        description: 'git --since option (ex 1 months ago...)',
        default: '1 months ago'
    })
    .help()
    .argv as Args


const main = async () => {
    const baseDir = `${__dirname}/${argv.target}`
    const git = simpleGit(baseDir);

    const log = await git.raw([
        'log',
        '--name-only',
        '--pretty=$%ad',
        `--since="${argv.range}"`,
        '--no-merges'
    ])
    const split = log.replace(/\n\n/g, '\n').split("\$");
    const row = split
        .filter(x => x)
        .map(x => x.split('\n').filter(y => y))
        .map(x => {
            const date = dateFormat(x[0], "yyyy-mm-dd HH:MM")
            x.shift();
            const files = x.map(y => {
                return {
                    name: y,
                    module: y.split('/')[0],
                    exception: y.split('.')[1]
                }
            })
            return {
                date: date,
                files: files
            }
        })
    const flat = row.map(x => {
        return x.files.map(y => {
            return [
                x.date,
                y.name,
                y.module,
                y.exception,
            ]
        })
    }).flat()
    const csvRow = await stringify(flat, {});
    const dataDir = `${__dirname}/${argv.out}`;
    fs.rmSync(dataDir + '/git_log.csv', {force: true})
    mkdirp.sync(dataDir);
    fs.appendFileSync(dataDir + '/git_log.csv', csvRow)
}

main()