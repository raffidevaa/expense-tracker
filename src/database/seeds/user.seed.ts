import { AppDataSource } from '../data-source';
import { User } from '../../users/users.entities';
import { hash } from 'bcrypt';

export async function seedUsers(): Promise<User> {
  const repo = AppDataSource.getRepository(User);

  const exists = await repo.findOne({
    where: { email: 'user1@gmail.com' },
  });

  if (exists) {
    return exists;
  }

  const hashedPassword = await hash('password', 10);

  const user = repo.create({
    username: 'user1',
    email: 'user1@gmail.com',
    password: hashedPassword,
  });

  return repo.save(user);
}
