import { makeAutoObservable } from "mobx";
import { AppService } from "../../services/service";
import { MobxRequestor } from "../helpers/mobx-requestor";

export type User = {
  name: string;
  id: string;
  email: string;
}

export class Auth {

  rq: MobxRequestor<User>;

  get user(): User {
    return this.rq.response;
  }

  get authenticated() {
    return !!this.user;
  }

  constructor(service: AppService) {
    makeAutoObservable(this);

    this.rq = new MobxRequestor<User>({ call: service.login, defaultResponse: null });
  }

  login = async (email: string, password: string) => {
    await this.rq.execCall({ email, password });
  };

  logout = async () => {
    this.rq.clearResponse();
  };

  get loginInProgress() {
    return this.rq.loading;
  }

  get loginSuccess() {
    return this.rq.success;
  }

  get loginError() {
    return this.rq.error?.message;
  }
}