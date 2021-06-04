import cors from 'cors';
import express from 'express';

import { pathController } from './controllers/path.controller';

const port = 3140;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

pathController(app);

app.listen(port, () => {
  console.info(`Node explorer listening at http://localhost:${port}.`);
});
