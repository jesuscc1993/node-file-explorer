import { Request, RouteParameters } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

export type FileRequest = Request<
  RouteParameters<'/path'>,
  unknown,
  FileRequestDto,
  ParsedQs,
  Record<string, any>
>;

export type FileRequestDto = {
  path: string;
};

export type PathRequestDto = {
  path: string;
  options?: PathReadOptions;
};

export type PathReadOptions = {
  hiddenFiles?: boolean;
};

export type PathRequest = Request<
  RouteParameters<'/path'>,
  PathResponseDto,
  PathRequestDto,
  ParsedQs,
  Record<string, any>
>;

export type PathStats = {
  absolutePath: string;
  accessTime: number;
  changeTime: number;
  creationTime: number;
  isDirectory: boolean;
  isFile: boolean;
  isSymbolicLink: boolean;
  modificationTime: number;
  name: string;
  size: number;
};

export type PathResponseDto = PathStats[];
