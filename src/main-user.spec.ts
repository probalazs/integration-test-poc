import { User } from './entities/user';
import { faker } from '@faker-js/faker';
import { dataSourceDecorator } from './test-decorators';

describe('Main', () => {
  it(
    'should create a new user',
    dataSourceDecorator(async ({ datasource }) => {
      const name = faker.person.fullName();
      const userRepository = datasource.getRepository(User);

      const user = new User();
      user.name = name;

      await userRepository.save(user);
      const savedUser = await userRepository.findOneBy({ name });

      expect(savedUser?.id).toBeDefined();
      expect(savedUser?.name).toBe(name);
    }),
  );
});
