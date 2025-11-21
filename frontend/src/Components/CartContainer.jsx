import CartCard from "./CartCard";
export default function CartContainer({
  cartList,
  handleRemoveFromCart,
  handleAddQuantity,
  handleRemoveQuantity,
  handleClearCart,
}) {
  return (
    <div className="CartContainer">
      <h2>Cart items: {cartList.length}</h2>
      {cartList.length > 0 ? (
        <>
          {console.log(cartList)}
          {cartList.map((product) => (
            <CartCard
              key={product._id}
              id={product._id}
              {...product}
              handleRemoveFromCart={handleRemoveFromCart}
              handleAddQuantity={handleAddQuantity}
              handleRemoveQuantity={handleRemoveQuantity}
            />
          ))}
          <div className="CartListBtns">
            <button onClick={() => handleClearCart()} className="RemoveButton">
              Empty Cart
            </button>
            <button id="BuyButton">
              Checkout:{" $"}
              {cartList
                .reduce(
                  (total, item) => {
                    const rawPrice = item.price ?? "0";
                    const numericPrice = parseFloat(
                      typeof rawPrice === "string" ? rawPrice.replace("$", "") : rawPrice
                    );
                    const quantity = item.quantity ?? 0;
                    return total + numericPrice * quantity;
                  }, 0
                )
                .toFixed(2)}
            </button>
          </div>
        </>
      ) : (
        <h3>No items in cart</h3>
      )}
    </div>
  );
}
