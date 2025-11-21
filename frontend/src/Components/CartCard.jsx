import QuantityCounter from "./QuantityCounter";

export default function CartCard({
  _id,
  image,
  productName,
  price,
  quantity,
  handleRemoveFromCart,
  handleAddQuantity,
  handleRemoveQuantity,
}) {
  return (
    <div className="CartCard">
      <div className="CartCardInfo">
        <img src={image} alt="" />
        <p>{productName}</p>
        <p>{price}</p>
        <QuantityCounter
          id={_id}
          productQuantity={quantity}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          mode="cart"
        />
        {/* <h3>x {quantity}</h3> */}
      </div>

      <div>
        <h3>
          Total: ${(
            parseFloat(typeof price === "string" ? price.replace("$", "") :
            price ?? "0") * (quantity ?? 0)
          ).toFixed(2)}
        </h3>
        <button
          onClick={() => handleRemoveFromCart(_id)}
          className="RemoveButton"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
