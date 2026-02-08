import { AppDataSource } from '../data-source';
import { Category } from '../../categories/categories.entities';

export async function seedCategories() {
  const repo = AppDataSource.getRepository(Category);

  const categories = [
    'Food',
    'Transportation',
    'Entertainment',
    'Health',
    'Shopping',
    'Income',
  ];

  const saved: Category[] = [];

  for (const name of categories) {
    let category = await repo.findOne({
      where: { category_name: name },
    });

    if (!category) {
      category = repo.create({ category_name: name });
      category = await repo.save(category);
    }

    saved.push(category);
  }

  return saved;
}
