import { createRootUser } from './RootUser';

export const seedData = async () => {
  await createRootUser();
};
