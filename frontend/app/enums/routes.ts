export enum ERoutes {
  Root = "/",
  Login = "/auth/login",
  Signup = "/auth/signup",

  AdminAttributes = "/admin/attributes",
  AdminAttributeAdd = "/admin/attributes/add",

  AdminCatalogs = "/admin/catalogs",
  AdminCatalogEdit = "/admin/catalogs/:alias/edit",

  AdminProducts = "/admin/products",
  AdminProductEdit = "/admin/products/:alias/edit",

  AttributeEdit = "/admin/attributes/:alias/edit",

  Cart = "/cart",
  CatalogAdd = "/admin/catalogs/add",
  CatalogDetail = "/catalog/:alias",
  Order = "/order",
  ProductDetail = "/product/:alias",
  Recipient = "/recipient",
  Shipping = "/shipping",

  ResourcesCatalogs = "/resources/catalogs",
  ResourcesCart = "/resources/cart",
  ResourcesCartItemIncrement = "/resources/cart/increment",
  ResourcesLogout = "/resources/logout",
  ResourcesSearch = "/resources/search",
}
