import type { FC } from "react";
import { Link } from "@remix-run/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "~/constants";
import { ERoutes } from "~/enums";
import { EFormMethods, Form, Input, useInitForm } from "~/shared/form";
import { EFormFields } from "~/pages/Auth/Login/enums";
import { formSchema } from "~/pages/Auth/Login/schemas";
import { TForm, TOptionsSubmitForm } from "~/pages/Auth/Login/types";
import { TParams } from "~/types";
import { Button } from "~/uikit";
import { createPath } from "~/utils";
import styles from "./Login.module.css";

export const Login: FC = () => {
  const form = useInitForm<TForm>({
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = (params: TParams, { fetcher }: TOptionsSubmitForm) => {
    console.log("Form params: ", params);
    fetcher.submit(params, {
      method: EFormMethods.Post,
      action: createPath({
        route: ERoutes.Login,
        withIndex: true,
      }),
    });
  };

  return (
    <section className="Login">
      <div className="Login-Center">
        <div className="Login-CenterContent">
          <h1 className="Login-CenterContentTitle">Вход</h1>
          <Form<TForm> form={form} handleSubmit={handleSubmit} method={EFormMethods.Post}>
            <div className="Login-FormFieldGroup">
              <Input label="Электронная почта" name={EFormFields.Email} type="text" />
              <Input label="Пароль" name={EFormFields.Password} type="text" />
            </div>
            <div className="Login-Control">
              <Button className="Login-Button" type="submit">
                Войти
              </Button>
            </div>
          </Form>
          <div className="Login-Signup">
            <span>Нет аккаунта?</span>
            <Link to={ROUTES.SIGNUP}>Зарегистрироваться</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export function loginLinks() {
  return [{ rel: "stylesheet", href: styles }];
}
