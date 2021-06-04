import { exec } from 'child_process';
import fse from 'fs-extra';

import { getCommandLine } from '../domain/system.domain';
import { PathReadOptions, PathStats } from '../types/path.types';

const reservedCharacters = /[\/\\]+/g;

const getStats = (path: string, name: string) => {
  const absolutePath = `${path}/${name}`;
  const rawStats = fse.statSync(absolutePath);

  const stats: PathStats = {
    absolutePath,
    accessTime: rawStats.atimeMs,
    changeTime: rawStats.ctimeMs,
    creationTime: rawStats.birthtimeMs,
    isDirectory: rawStats.isDirectory(),
    isFile: rawStats.isFile(),
    isSymbolicLink: rawStats.isSymbolicLink(),
    modificationTime: rawStats.mtimeMs,
    name: name,
    size: rawStats.size,
  };
  return stats;
};

const openFile = (path: string) => {
  exec(`${getCommandLine()} "${path}"`);
};

const readPath = (path: string, options?: PathReadOptions) => {
  let pathNames = filterReservedNames(fse.readdirSync(path));
  if (options?.hiddenFiles !== true) pathNames = filterHiddenNames(pathNames);
  const pathStats = pathNames.map((name) => getStats(path, name));
  return sortPathStats(pathStats);
};

const filterReservedNames = (names: string[]) => {
  return names.filter((name) => !reservedCharacters.test(name));
};

const filterHiddenNames = (names: string[]) => {
  return names.filter((name) => !name.startsWith('.'));
};

const sortPathStats = (pathStats: PathStats[]) => {
  return pathStats.sort((a, b) => +b.isDirectory - +a.isDirectory);
};

export const fileSystemService = {
  getStats,
  openFile,
  readPath,
};
