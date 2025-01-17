import { useCallback, useEffect, useState } from "react";
import type { Dispatch, FC, SetStateAction } from "react";
import { FullscreenControl, GeolocationControl, ZoomControl } from "@pbe/react-yandex-maps";
import { Link, useNavigate } from "@remix-run/react";
import clsx from "clsx";
import isEmpty from "lodash/isEmpty";
import { zodResolver } from "@hookform/resolvers/zod";
import { ERoutes } from "~/enums";
import { EFormFields } from "~/pages/Shipping/enums";
import type { TForm } from "~/pages/Shipping/types";
import { formSchema } from "~/pages/Shipping/schemas";
import type { TGeoSearchSuggestion } from "~/pages/Shipping/YMap/GeoSearch";
import type { TPickMapState } from "~/pages/Shipping/YMap/PickMap";
import PickMap from "~/pages/Shipping/YMap/PickMap/PickMap";
import { YMapFormField, yMapFormFieldLinks } from "~/pages/Shipping/YMapFormField";
import { Marker } from "~/pages/Shipping/YMap/Marker";
import { yMapLinks } from "~/pages/Shipping/YMap/YMap";
import { EFormMethods, Form, Input, useInitForm } from "~/shared/form";
import type { TParams } from "~/types";
import { Button, ETypographyVariant, Icon, Typography } from "~/uikit";
import styles from "./Shipping.module.css";

type TProps = {
  searchState: {
    value: string;
    suggestions: TGeoSearchSuggestion[];
    showSuggestions: boolean;
  };
  setSearchState: Dispatch<
    SetStateAction<{
      value: string;
      suggestions: TGeoSearchSuggestion[];
      showSuggestions: boolean;
    }>
  >;
  mapState?: TPickMapState;
  setMapState: Dispatch<SetStateAction<TPickMapState>>;
};

export const Shipping: FC<TProps> = ({ searchState, setSearchState, mapState, setMapState }) => {
  const form = useInitForm<TForm>({
    resolver: zodResolver(formSchema),
  });

  const [address, setAddress] = useState(searchState?.value ?? "");
  const [isDragging, setDragging] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    searchState && setAddress(searchState.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchState?.value]);

  const handleSubmit = (params: TParams) => {
    console.log("Form params: ", params);
    navigate(ERoutes.Recipient);
  };

  const handleDragStart = useCallback(() => {
    setDragging(true);
  }, [setDragging]);

  const handleDragEnd = useCallback(() => {
    setDragging(false);
  }, [setDragging]);

  return (
    <section className="Shipping">
      <div className="Shipping-Step">
        <Typography variant={ETypographyVariant.TextB4Regular}>Шаг 1 из 3</Typography>
      </div>
      <h1 className="Shipping-Title">
        <Typography variant={ETypographyVariant.TextH1Bold}>
          Где Вы хотите получить заказ?
        </Typography>
      </h1>
      <Form<TForm>
        className="Shipping-Form"
        form={form}
        handleSubmit={handleSubmit}
        method={EFormMethods.Post}
      >
        <div className="Shipping-FormContent">
          <div className="Shipping-FormFieldGroup">
            <YMapFormField
              label="Адрес"
              name={EFormFields.Address}
              searchState={searchState}
              type="text"
              isFocused={true}
              onBlur={() => {}}
              onFocus={() => {}}
              onStateChange={setSearchState}
              onSearch={setMapState}
            />
            {/*<Input label="Адрес" name={EFormFields.Address} type="text" />*/}
          </div>
          <div className={clsx("Shipping-FormFieldGroup", "Shipping-FormFieldCouple")}>
            <Input
              className="Shipping-FormFieldGroupItem"
              label="Квартира"
              name={EFormFields.Apartment}
              type="text"
            />
            <Input
              className="Shipping-FormFieldGroupItem"
              label="Этаж"
              name={EFormFields.Floor}
              type="text"
            />
          </div>
          <div className={clsx("Shipping-FormFieldGroup", "Shipping-FormFieldCouple")}>
            <Input
              className="Shipping-FormFieldGroupItem"
              label="Подъезд"
              name={EFormFields.Entrance}
              type="text"
            />
            <Input
              className="Shipping-FormFieldGroupItem"
              label="Домофон"
              name={EFormFields.Intercom}
              type="text"
            />
          </div>
          <div className="Shipping-FormFieldGroup">
            <Input
              className="Shipping-TextField"
              label="Комментарий для курьера"
              name={EFormFields.Comment}
              type="textarea"
            />
          </div>
        </div>
        <div className="Shipping-FormFooter">
          <div className="Shipping-Controls">
            <Link className="Shipping-ControlsLink" to={ERoutes.Cart}>
              <Icon type="ArrowBack" />
              <div className="Shipping-ControlsText">
                <Typography variant={ETypographyVariant.TextB3Regular}>В корзину</Typography>
              </div>
            </Link>
            <Button className="Shipping-Button" type="submit" isDisabled={isEmpty(address)}>
              <Typography variant={ETypographyVariant.TextB3Regular}>Продолжить</Typography>
            </Button>
          </div>
        </div>
      </Form>
      <div className="Shipping-Map">
        <PickMap
          defaultState={{
            zoom: 9,
            center: [55.725146, 37.64693],
          }}
          style={{
            height: "85vh",
            marginLeft: 20,
            flexGrow: 1,
          }}
          state={mapState}
          onStateChange={setMapState}
          onPick={(value) => {
            setSearchState({
              value,
              showSuggestions: false,
              suggestions: [],
            });
          }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          searchZoom={15}
          marker={<Marker isDragging={isDragging} />}
        >
          <FullscreenControl options={{ float: "left" }} />
          <GeolocationControl options={{ float: "left" }} />
          <ZoomControl />
        </PickMap>
      </div>
    </section>
  );
};

export function shippingLinks() {
  return [{ rel: "stylesheet", href: styles }, ...yMapLinks(), ...yMapFormFieldLinks()];
}
