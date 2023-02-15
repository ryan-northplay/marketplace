import { forwardRef, memo } from "react";
import { useGetColumns } from "~/pages/Admin/Products/ProductsTable/hooks";
import { TProducts, TProduct } from "~/shared/api/products";
import { createColumnHelper, Table as UiTable } from "~/uikit";

type TProps = {
  products: TProducts;
  onChangePage: ({ selected }: { selected: number }) => void;
  onChangePageSize: (pageSize: number) => void;
};

const TableComponent = forwardRef<HTMLDivElement, TProps>(
  ({ products, onChangePage, onChangePageSize }, ref) => {
    const columnHelper = createColumnHelper<TProduct>();
    const columns = useGetColumns(columnHelper);

    const { content, countOfPage, countOfResult, currentPage, pageSize } = products;

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
          totalItems={countOfResult}
          totalItemsTitle={"Всего продуктов"}
        />
      </div>
    );
  },
);

TableComponent.displayName = "ProductsTableComponent";

export const ProductsTable = memo(TableComponent);
