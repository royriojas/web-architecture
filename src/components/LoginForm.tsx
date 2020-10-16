import React, { useCallback, useState } from "react";
import { Observer } from "mobx-react-lite";
import { createLoginModel, LoginModel } from "../mobx/models/login-model";
import { IField } from "mobx-form";

export type FormFieldProps = {
  field: IField<string>;
  type: string;
  label: string;
};

export const FormField: React.FC<FormFieldProps> = ({
  type,
  label,
  field,
}: FormFieldProps) => {
  return (
    <div>
      <label>{label}</label>
      <Observer>
        {() => (
          <>
            <input
              type={type}
              value={field.value}
              onChange={(e) => field.setValue(e.target.value)}
              onBlur={() => field.markBlurredAndValidate()}
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
  const [loginModel] = useState<LoginModel>(() =>
    createLoginModel({ email: "", password: "" })
  );

  const submit = useCallback(async () => {
    await loginModel.validate();
    const isValid = loginModel.valid;

    console.log(">>> log.valid", isValid);
  }, [loginModel]);

  return (
    <div>
      <FormField field={loginModel.fields.email} type="text" label="email" />
      <FormField
        field={loginModel.fields.password}
        type="password"
        label="password"
      />
      <button onClick={submit}>Login</button>
      <hr />
      <pre>
        <code>
          <Observer>
            {() => <>{JSON.stringify(loginModel.serializedData, null, 2)}</>}
          </Observer>
        </code>
      </pre>
    </div>
  );
};
