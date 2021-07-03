#!/usr/bin/env node
import fs from 'fs';

import program from 'commander';
import  download from 'download-git-repo';
import logSymbols from 'log-symbols';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import handlebars from 'handlebars'


const questions = [
    {
        name: 'description',
        message: '请输入项目描述'
    },
    {
        name: 'author',
        default: 'HUA',
        message: '请输入作者'
    }
]


program.version('1.0.0', '-v, --version')
    .command('init <name>')
    .action(name => {
        if(!fs.existsSync(name)) {
            inquirer.prompt(questions).then(answers => {
                const spinner = ora('Downloading...')
                spinner.start()
                download('github:Hugohui/top_left_menu_demo#main', name, (err) => {
                    if (err) {
                        spinner.fail()
                        console.log(logSymbols.error, chalk.red(err));
                    } else {
                        spinner.succeed()
                        const fileName = `${name}/package.json`
                        const meta = {
                            name,
                            description: answers.description,
                            author: answers.author
                        }
                        if (fs.existsSync(fileName)) {
                            const content = fs.readFileSync(fileName).toString()
                            const result = handlebars.compile(content)(meta);
                            fs.writeFileSync(fileName, result)
                        }
                        console.log(logSymbols.success, chalk.green('项目创建成功'));
                    }
                })
            })
        } else {
            console.log(logSymbols.error, chalk.red(`项目创建失败：${name}已存在`))
        }
    })

program.parse(process.argv)