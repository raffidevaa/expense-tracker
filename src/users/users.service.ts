import { Injectable } from '@nestjs/common';
import { User } from './users.entities';

@Injectable()
export class UsersService {
  private readonly users = [
    {
      id: '1',
      username: 'john',
      email: 'john@example.com',
      password: 'changeme',
    },
    {
      id: '2',
      username: 'maria',
      email: 'maria@example.com',
      password: 'guess',
    },
  ];

  findOne(username: string): User | undefined {
    return this.users.find((user) => user.username === username);
  }
}
