import { exec } from 'child_process';
import fse from 'fs-extra';

import { directorySeparator, extensionSeparator } from '../constants/explorer.constants';
import { getCommandLine } from '../domain/system.domain';
import { FileSystemItem, PathReadOptions } from '../types/path.types';

const reservedCharacters = /[/\\]+/g;

const getStats = (path: string, name: string) => {
  const separator = path.endsWith(directorySeparator) ? '' : directorySeparator;
  const absolutePath = `${path}${separator}${name}`;
  let rawStats;

  try {
    rawStats = fse.statSync(absolutePath);
  } catch (_) {
    return undefined;
  }

  const stats: FileSystemItem = {
    absolutePath,
    name,
    accessTime: rawStats.atimeMs,
    changeTime: rawStats.ctimeMs,
    creationTime: rawStats.birthtimeMs,
    extension: rawStats.isFile() ? getFileExtension(name) : undefined,
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

  const items = sortFileSystemItems(
    pathNames
      .map((name) => getStats(path, name))
      .filter((stats) => !!stats) as FileSystemItem[],
  );

  return items;
};

const filterReservedNames = (names: string[]) => {
  return names.filter((name) => !reservedCharacters.test(name));
};

const filterHiddenNames = (names: string[]) => {
  return names.filter((name) => !name.startsWith('.'));
};

const getFileExtension = (name: string) => {
  return name.includes(extensionSeparator)
    ? name.split(extensionSeparator).pop()?.toUpperCase()
    : undefined;
};

const sortFileSystemItems = (items: FileSystemItem[]) => {
  return items.sort((a, b) => +b.isDirectory - +a.isDirectory);
};

export const fileSystemService = {
  getStats,
  openFile,
  readPath,
};
