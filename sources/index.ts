import { CommandContext, Plugin } from '@yarnpkg/core';
import { Command } from 'clipanion';
import * as fs from 'fs';
import path from 'path';
import globby from 'globby';
import yaml from 'js-yaml';
import execa from 'execa';
import chalk from 'chalk';

// yarn scripts <namespace=package_folder_name> <command=file_name>
class ScriptsCommand extends Command<CommandContext> {
  @Command.String({ required: false })
  namespace!: string;

  @Command.String({ required: true })
  command!: string;

  private scriptsFolderName = '.scripts'

  @Command.Path(`scripts`)
  async execute() {
    // read package.json `.scripts` and `workspaces` array
    // find path from <root>/<namespace_path>/namespace
    // find .scripts folder
    // execute each command from the .scripts/<command>.yaml

    const packageJSON = JSON.parse(
        fs.readFileSync(
            path.resolve(this.context.cwd, 'package.json'),
            'utf8'
        )
    );
    const targetFolders = []
        .concat(packageJSON[this.scriptsFolderName])
        .concat(packageJSON['workspaces'])
        .filter(Boolean);

    const paths = await globby(targetFolders, {
      cwd: this.context.cwd,
      onlyFiles: false,
      expandDirectories: true,
    });

    const namespacePath = this.namespace ? paths.find((p) => p.endsWith(this.namespace)) : '';
    if (this.namespace && !namespacePath) {
      throw new Error(`No such namespace '${this.namespace}' exists on the disk. Please check correctness of your namespace name.`);
    }

    const cmds = yaml.load(
        fs.readFileSync(
            path.resolve(path.join(this.context.cwd, namespacePath, this.scriptsFolderName, `${this.command}.yml`)),
            'utf8'
        )
    );

    cmds.forEach((cmd) => {
      this.context.stdout.write(`> Executing ${chalk.cyan(cmd)}\n`);
      this.context.stdout.write(`> Using cwd: ${chalk.blue(path.resolve(this.context.cwd, namespacePath))}\n\n`);
      execa.commandSync(cmd.trim(), {
        cwd: path.resolve(this.context.cwd, namespacePath),
        stdout: this.context.stdout,
        stderr: this.context.stderr,
      });
    });
  }
}

const plugin: Plugin = {
  commands: [
    ScriptsCommand,
  ],
};

export default plugin;
