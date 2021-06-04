import { Express } from 'express';

import { invalidRequestBodyError } from '../errors/invalid-request-body.error';
import { fileSystemService } from '../services/file-system.service';
import { FileRequest, PathRequest } from '../types/path.types';

export const pathController = (app: Express) => {
  app.post('/path', (req: PathRequest, res) => {
    const path = req.body?.path;
    if (!path) throw invalidRequestBodyError;

    const dir = fileSystemService.readPath(path, req.body.options);

    res.send(dir);
  });

  app.post('/file', (req: FileRequest, res) => {
    const path = req.body?.path;
    if (!path) throw invalidRequestBodyError;

    res.sendFile(path);
  });

  app.get('/file/:path', (req, res) => {
    const path = req.params?.path;
    if (!path) throw invalidRequestBodyError;

    res.sendFile(decodeURIComponent(path));
  });

  app.post('/open-file', (req: FileRequest, res) => {
    const path = req.body?.path;
    if (!path) throw invalidRequestBodyError;

    fileSystemService.openFile(path);

    res.send(undefined);
  });
};
