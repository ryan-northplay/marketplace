import React, { useCallback, useEffect, useState } from "react";
import type { FC } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useFetcher } from "@remix-run/react";
import IsNull from "lodash/isNull";
import { usePaging } from "~/hooks";
import { attributeItemLinks } from "~/pages/Catalog/AttributeItem";
import { filterLinks } from "~/pages/Catalog/Filter";
import { panelLinks } from "~/pages/Catalog/Panel";
import { productListLinks } from "~/pages/Catalog/ProductList";
import { productListItemLinks } from "~/pages/Catalog/ProductListItem";
import { TCatalogDetail } from "~/shared/api/catalogs";
import {TProduct, TProducts} from "~/shared/api/products";
import { TParams } from "~/types";
import { transformObjectToURLParams } from "~/utils";
import { Filter } from "./Filter";
import { Panel } from "./Panel";
import { ProductList } from "./ProductList";
import styles from "./Catalog.module.css";

type TProps = {
  catalog: TCatalogDetail;
  products: TProducts;
};

export const Catalog: FC<TProps> = (props) => {
  const fetcher = useFetcher();
  const isLoading = fetcher.state !== "idle";
  const fetcherResponse = fetcher.data;
  const catalog: TCatalogDetail = fetcherResponse?.catalog ?? props.catalog;
  const products: TProducts = fetcherResponse?.products ?? props.products;
  const hasContent = !!products?.content.length;

  const [isClickedDisplayLine, setIsClickedDisplayLine] = useState(false);
  const [productList, setProductList] = useState<TProduct[]>(products.content);
  console.log("productList: ", productList);

  const onDisplayLine = () => {
    setIsClickedDisplayLine((prev) => !prev);
  };

  const onLoadProducts = useCallback(
    (params?: TParams) => {
      if (catalog) {
        fetcher.load(
          `/catalog/${catalog.alias}?index&${transformObjectToURLParams({ ...params })}`,
        );
      }
    },
    [fetcher],
  );

  const initialPageSize = IsNull(products.pageSize) ? 5 : products.pageSize;

  const { onChangePage } = usePaging(onLoadProducts, {
    page: products.currentPage,
    pageSize: fetcher.data?.products.pageSize ?? initialPageSize,
  });

  useEffect(() => {
    if (fetcher.data && fetcher.data.products.content.length > 0) {
      setProductList((prevPhotos: TProduct[]) => [...prevPhotos, ...fetcher.data.products.content]);
    }
  }, [fetcher.data]);

  const getMoreProducts = async () => {
    if (productList.length >= products.countOfResult) return;
    onChangePage(products.currentPage + 1);
  }

  return (
    <>
      <div className="Catalog">
        <div className="Catalog-Row">
          <h1 className="Catalog-Title">{catalog?.name}</h1>
        </div>
        <div className="Catalog-Inner">
          {catalog && <Filter catalog={catalog} />}
          <div className="Catalog-Wrapper">
            <Panel isClickedDisplayLine={isClickedDisplayLine} onDisplayLine={onDisplayLine} />
            <InfiniteScroll
                dataLength={productList.length}
                next={getMoreProducts}
                hasMore={true}
                loader={isLoading ? <h4>Loading...</h4> : null}
                endMessage={
                  <p style={{ textAlign: 'center' }}>
                    <b>Yay! You have seen it all</b>
                  </p>
                }
            >
              <ProductList
                  products={productList}
                  isClickedDisplayLine={isClickedDisplayLine}
              />
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </>
  );
};

export function catalogLinks() {
  return [
    { rel: "stylesheet", href: styles },
    ...attributeItemLinks(),
    ...filterLinks(),
    ...panelLinks(),
    ...productListLinks(),
    ...productListItemLinks(),
  ];
}