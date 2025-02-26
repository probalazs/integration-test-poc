import { getInitializedDataSource } from './test-helpers';
import { User } from './entities/user';
import { faker } from '@faker-js/faker';
describe('Main', () => {
  it('should create a new user', async () => {
    const name = faker.person.fullName();
    const dataSource = await getInitializedDataSource();
    const userRepository = dataSource.getRepository(User);

    const user = new User();
    user.name = name;

    await userRepository.save(user);
    const savedUser = await userRepository.findOneBy({ name });

    expect(savedUser?.id).toBeDefined();
    expect(savedUser?.name).toBe(name);
  });
});
