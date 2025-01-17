import { forwardRef, memo, useMemo, useState } from "react";
import type { FetcherWithComponents } from "@remix-run/react";
import { ModalDelete } from "~/components/modal";
import { useGetColumns } from "~/pages/Admin/Products/ProductsTable/hooks";
import type { TProducts, TProduct } from "~/shared/api/products";
import { createColumnHelper, Table as UiTable } from "~/uikit";
import type { TTableSortingProps } from "~/uikit";
import styles from "./ProductsTable.module.css";

type TProps = {
  fetcher: FetcherWithComponents<any>;
  fieldsSortState: TTableSortingProps;
  isOpenDeleteModal: boolean;
  products: TProducts;
  onChangePage: ({ selected }: { selected: number }) => void;
  onChangePageSize: (pageSize: number) => void;
  onClickDeleteIcon: (alias: string) => void;
  onCloseModal: () => void;
  onSubmitDelete: () => void;
};

const TableComponent = forwardRef<HTMLDivElement, TProps>(
  (
    {
      fetcher,
      fieldsSortState,
      isOpenDeleteModal,
      products,
      onChangePage,
      onChangePageSize,
      onCloseModal,
      onClickDeleteIcon,
      onSubmitDelete,
    },
    ref,
  ) => {
    const columnHelper = createColumnHelper<TProduct>();
    const columns = useGetColumns(columnHelper, onClickDeleteIcon);
    const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);

    const { content, countOfPage, countOfResult, currentPage, pageSize } = products;

    const settingsProps = useMemo(
      () => ({
        options: {
          hiddenColumns,
          setHiddenColumns,
          optionsChangeText: "Показать",
          optionsFieldHeader: "Поля таблицы",
          optionsModalHeader: "Настройка таблицы",
          optionsSorting: {
            ascText: "Сортировать по возрастанию",
            defaultText: "По умолчанию",
            descText: "Сортировать по убыванию",
            hideColumnText: "Скрыть столбец",
          },
        },
      }),
      [hiddenColumns, setHiddenColumns],
    );

    return (
      <div ref={ref}>
        <UiTable<TProduct>
          columns={columns}
          currentPage={currentPage}
          data={content}
          defaultPageSize={pageSize}
          getId={(row) => row.alias}
          onChangePageSize={onChangePageSize}
          onPageChange={onChangePage}
          pagesCount={countOfPage}
          settings={settingsProps}
          sorting={fieldsSortState}
          totalItems={countOfResult}
          totalItemsTitle={"Всего продуктов"}
        />
        <ModalDelete isOpen={isOpenDeleteModal} onClose={onCloseModal} onSubmit={onSubmitDelete} />
      </div>
    );
  },
);

TableComponent.displayName = "ProductsTableComponent";

export const ProductsTable = memo(TableComponent);

export function productsTableLinks() {
  return [{ rel: "stylesheet", href: styles }];
}
