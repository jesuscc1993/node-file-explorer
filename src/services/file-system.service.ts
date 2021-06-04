import { exec } from 'child_process';
import fse from 'fs-extra';

import { directorySeparator } from '../constants/explorer.constants';
import { getCommandLine } from '../domain/system.domain';
import { PathReadOptions, PathStats } from '../types/path.types';

const reservedCharacters = /[\/\\]+/g;

const getStats = (path: string, name: string) => {
  const separator = path.endsWith(directorySeparator) ? '' : directorySeparator;
  const absolutePath = `${path}${separator}${name}`;
  let rawStats;

  try {
    rawStats = fse.statSync(absolutePath);
  } catch (_) {
    return undefined;
  }

  const stats: PathStats = {
    absolutePath,
    name,
    accessTime: rawStats.atimeMs,
    changeTime: rawStats.ctimeMs,
    creationTime: rawStats.birthtimeMs,
    isDirectory: rawStats.isDirectory(),
    isFile: rawStats.isFile(),
    isSymbolicLink: rawStats.isSymbolicLink(),
    modificationTime: rawStats.mtimeMs,
    size: rawStats.size,
  };
  return stats;
};

const openFile = (path: string) => {
  const runCommand = getCommandLine().replace('$1', path);
  exec(runCommand);
};

const readPath = (path: string, options?: PathReadOptions) => {
  let pathNames = filterReservedNames(fse.readdirSync(path));
  if (options?.hiddenFiles !== true) pathNames = filterHiddenNames(pathNames);

  const pathStats = sortPathStats(
    pathNames
      .map((name) => getStats(path, name))
      .filter((stats) => !!stats) as PathStats[],
  );
  console.log(pathStats);

  return pathStats;
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
