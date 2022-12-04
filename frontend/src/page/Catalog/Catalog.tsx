"use client";

import { useRouter } from "next/navigation";
import { FC, useCallback, useEffect, useState } from "react";
import { TCatalog } from "src/entities/catalogs";
import { TProduct, TProducts } from "src/entities/products";
import { TParams } from "src/types";
import { transformObjectToURLParams } from "src/utils";
import { Filter } from "./Filter";
import { Panel } from "./Panel";
import { ProductList } from "./ProductList";
import classes from "./Catalog.module.scss";

type TProps = {
  catalog?: TCatalog;
  products?: TProducts;
};

export const Catalog: FC<TProps> = ({ catalog, products }) => {
  const initialProducts = products?.content ?? [];
  const totalElements = products?.countOfResult ?? 0;

  const [isClickedDisplayLine, setIsClickedDisplayLine] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [fetching, setFetching] = useState(false);
  const [productList, setProductList] = useState<TProduct[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (fetching) {
      onLoad({
        page: currentPage + 1,
        size: 5,
      });
      setProductList([...productList, ...initialProducts]);
      setCurrentPage(prevState => prevState + 1);
      setTotalCount(totalElements);
    }
    setFetching(false);
  }, [fetching]);

  useEffect(() => {
    document.addEventListener("scroll", onScroll);
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  const handleDisplayLine = () => {
    setIsClickedDisplayLine(prev => !prev);
  };

  const onLoad = useCallback((params?: TParams) => {
    if (catalog) {
      router.push(
        `/catalog/${catalog.alias}?${transformObjectToURLParams({ ...params })}`
      );
    }
  }, []);

  const onScroll = (event: any) => {
    const element = event.target.documentElement;
    const documentRect = document.documentElement.getBoundingClientRect();
    if (documentRect.bottom < document.documentElement.clientHeight + 150) {
      setFetching(true);
    }
    // if (element.scrollHeight - (element.scrollTop + window.innerHeight) < 180 && productList.length < totalCount) {
    //   setFetching(true);
    // }
  };

  return (
    <div className={classes.Catalog}>
      <div className={classes.Row}>
        <h1 className={classes.Title}>{catalog?.name}</h1>
      </div>
      <div className={classes.Inner}>
        {catalog && <Filter catalog={catalog} />}
        <div className={classes.Wrapper}>
          <Panel
            isClickedDisplayLine={isClickedDisplayLine}
            onDisplayLine={handleDisplayLine}
          />
          <ProductList
            products={productList}
            isClickedDisplayLine={isClickedDisplayLine}
          />
        </div>
      </div>
    </div>
  );
};
