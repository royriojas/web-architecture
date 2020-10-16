import { deferred } from "../helpers/deferred";
import { User } from "../mobx/stores/AuthStore";

const sleep = (time: number) => {
  const dfd = deferred<void>();

  setTimeout(dfd.resolve, time);

  return dfd;
};

export interface AppService {
  login({ email, password }: { email: string; password: string }): Promise<User>
}

export const service: AppService = {
  login: async ({ email, password }) => {
    await sleep(2000);

    if (password !== 'secret') {
      throw new Error('Credentials error');
    }

    return { email, name: 'dummy user', id: 'dummyId' };
  },
};
