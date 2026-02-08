import { AppDataSource } from '../data-source';
import { seedUsers } from './user.seed';
import { seedCategories } from './category.seed';

async function runSeed() {
  await AppDataSource.initialize();

  await seedUsers();
  await seedCategories();

  await AppDataSource.destroy();

  console.log('🌱 Database seeding completed');
}

runSeed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
