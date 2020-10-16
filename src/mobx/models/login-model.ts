import { action } from 'mobx';
import { IField, IFormModel, IFields, createModel } from 'mobx-form';

export interface LoginData {
  email: string;
  password: string;
}

interface LoginModelFields extends IFields {
  email: IField<string>;
  password: IField<string>;
}

export interface LoginModel extends IFormModel<LoginData> {
  fields: LoginModelFields;
  reset(): void;
}

export const createLoginModel = (loginData: LoginData): LoginModel => {
  const model: IFormModel<LoginData> = createModel<LoginData>({
    descriptors: {
      email: {
        required: 'The email is required',
        validator: async (field: IField<string>) => {
          const val = (field.value || '').trim();

          if (val.indexOf('@') === -1) {
            throw new Error('Enter a valid email');
          }
        }
      },
      password: {
        required: 'Password is required',
      },
    },
    initialState: loginData,
  });

  (model as LoginModel).reset = action(() => {
    model.updateFrom({ email: '', password: '' });
  });

  return model as LoginModel;
};
