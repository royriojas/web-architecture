import React, { useCallback, useState } from "react";
import { Observer } from "mobx-react-lite";
import { createLoginModel, LoginModel } from "../mobx/models/login-model";
import { IField } from "mobx-form";
import { useStores } from "../mobx/use-stores";

export type FormFieldProps = {
  field: IField<string>;
  type: string;
  label: string;
  readOnly: boolean;
  onEnter?(): void;
};

export const FormField: React.FC<FormFieldProps> = ({
  type,
  label,
  field,
  readOnly,
  onEnter,
}: FormFieldProps) => {
  return (
    <div>
      <label>{label}</label>
      <Observer>
        {() => (
          <>
            <input
              readOnly={readOnly}
              type={type}
              value={field.value}
              onChange={(e) => field.setValue(e.target.value)}
              onBlur={() => field.markBlurredAndValidate()}
              onKeyPress={ e => e.key === 'Enter' && onEnter?.() }
            />
            {field.errorMessage && field.blurred && (
              <p style={{ color: "red" }}>{field.errorMessage}</p>
            )}
          </>
        )}
      </Observer>
    </div>
  );
};

export const LoginForm: React.FC = () => {
  const { auth } = useStores();
  const [loginModel] = useState<LoginModel>(() =>
    createLoginModel({ email: "", password: "" })
  );

  const submit = useCallback(() => {
    const doSubmit = async () => {
      await loginModel.validate();
      const isValid = loginModel.valid;

      if (isValid) {
        const { serializedData } = loginModel;
        auth.login(serializedData.email, serializedData.password);
      }
    };

    doSubmit();
  }, [loginModel, auth]);

  const logout = useCallback(() => {
    loginModel.reset();
    auth.logout();
  }, [loginModel, auth]);

  return (
    <div style={{ padding: '1rem' }}>
      <Observer>
        {() => (
          <>
            {auth.loginInProgress && <p>Login in...</p>}
            {auth.loginError && (
              <p style={{ color: "red" }}>{auth.loginError}</p>
            )}
            {!auth.authenticated && (
              <div>
                <FormField
                  readOnly={auth.loginInProgress}
                  field={loginModel.fields.email}
                  type="text"
                  label="email"
                />
                <FormField
                  readOnly={auth.loginInProgress}
                  field={loginModel.fields.password}
                  type="password"
                  label="password"
                  onEnter={submit}
                />
                <button onClick={submit}>Login</button>
              </div>
            )}
            {auth.authenticated && (
              <div>
                Welcome {auth.user.name}.{" "}
                <button onClick={logout}>Logout</button>
              </div>
            )}
            <hr />
          </>
        )}
      </Observer>
    </div>
  );
};
