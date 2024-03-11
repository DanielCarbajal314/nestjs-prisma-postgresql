import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const client = new PrismaClient();
const {
  ROOT_USER: username,
  ROOT_PASSWORD: password,
  ROOT_EMAIL: email,
  KEY_SECRET: salt,
  DATABASE_URL: dbUrl,
} = process.env;

const hash = (word: string) =>
  createHash('sha256')
    .update(word)
    .update(createHash('sha256').update(salt, 'utf8').digest('hex'))
    .digest('hex');

export const createRootUser = async () => {
  await client.$connect();
  const rootCount = await client.user.count({
    where: { username: { equals: username } },
  });
  console.debug(`Login into Database ${dbUrl}`);
  if (rootCount == 0) {
    console.debug(`Creating Root User: ${username}`);
    await client.user.create({
      data: {
        username,
        password: hash(password),
        email,
        roles: {
          create: [{ name: 'Admin' }, { name: 'Applicant' }],
        },
      },
    });
    console.info(`Root User ${username} created successfully`);
  } else {
    console.info(`Root User ${username} already exist`);
  }
  await client.$disconnect();
};
