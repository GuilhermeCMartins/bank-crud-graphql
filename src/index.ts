import { Application } from '@application';
import dotenv from 'dotenv';

dotenv.config();

const main = async () => {
  const server = new Application();
  await server.start();
};

main();
