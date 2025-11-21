import ProductCard from "./ProductCard";

export default function ProductsContainer({
  products,
  handleAddQuantity,
  handleRemoveQuantity,
  handleAddToCart,
  productQuantity,
  handleOnDelete,
  handleOnEdit,
}) {
  //console.log("ProductsContainer products:", products);

  return (
    <div className="ProductsContainer">
      {products.map((product) => (
  

        <ProductCard
          key={product._id}
          {...product}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleAddToCart={handleAddToCart}
          handleOnDelete={handleOnDelete}
          handleOnEdit={handleOnEdit}
          productQuantity={
            productQuantity.find((p) => p._id === product._id).quantity
          }
        />
      ))}
    </div>
  );
}
