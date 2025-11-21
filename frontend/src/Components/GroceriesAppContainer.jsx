import { useState, useEffect } from "react";
import axios from "axios";
import CartContainer from "./CartContainer";
import ProductsContainer from "./ProductsContainer";
import NavBar from "./NavBar";
import ProductForm from "./ProductForm";

export default function GroceriesAppContainer() {
  //States
  const [productQuantity, setProductQuantity] = useState();
  const [productsData, setProductsData] = useState([]);
  const [formData, setFormData] = useState({
    productName: "",
    brand: "",
    image: "",
    price: "",
  });
  const [postResponse, setPostResponse] = useState("");
  const [isEditing, setisEditing] = useState(false);
  const [cartList, setCartList] = useState([]);

  //useEffect
  useEffect(() => {
      handleProductsDB();
  }, [postResponse]);


  
  //handlers
  //GET data from DB handler
  const handleProductsDB = async() => {
    try{
      const response = await axios.get("http://localhost:3000/products");
      setProductsData([... response.data]);
      setProductQuantity(
        response.data.map((product) => ({_id: product._id, quantity: 0}))
      )
    } catch(error){
      console.log(error.message);
    }
  }

  //handle to reset the form
  const handleResetForm = () => {
    setFormData({
      productName: "",
      brand: "",
      image: "",
      price: "",
    });
  }
  // Handle the submission of Data
  const handleOnSubmit = async(e) => {
    e.preventDefault();
    try{
      if(isEditing){
        await handleOnUpdate(formData._id);
        await handleProductsDB();
        handleResetForm();
        setisEditing(false);
      } else{
        const formattedPrice = formData.price.startsWith("$")
        ? formData.price : `$${formData.price}`;
        const newProduct = {... formData, price: formattedPrice };
        await axios
        .post("http://localhost:3000/products", newProduct)
        .then((response) => setPostResponse(response.data.message))
        .then(() =>
        handleResetForm());
      }

    } catch(error){
      console.log(error.message)
    }
  };

  //Handle the onChange event for the form
  const handleOnChange = (e) => {
      setFormData((prevData) => {
        return {...prevData, [e.target.name]: e.target.value}
      })
  };

  //Handle to delete one product by _id
  const handleOnDelete = async(id) => {
    try{
      const response = await axios.delete(
        `http://localhost:3000/products/${id}`
      );
      setPostResponse(response.data.message);
    } catch(error){
      console.log(error.message);
    }
  }

  //Handle the edition of one product by its ID
  const handleOnEdit = async(id) => {
    try {
      const productToEdit = await axios.get(
        `http://localhost:3000/products/${id}`
      );
      setFormData({
        productName: productToEdit.data.productName,
        brand: productToEdit.data.brand,
        image: productToEdit.data.image,
        price: productToEdit.data.price,
        _id: productToEdit.data._id,
      });
      setisEditing(true);
    } catch(error){
      console.log(error);
    }
  }

  //Handle updating the API patch route
  const handleOnUpdate = async (id) => {
    try{
      const result = await axios.patch(
        `http://localhost:3000/products/${id}`,
        formData
      );
      setPostResponse(result.data.message)
    } catch(error){
      console.log(error)
    }
  }



  const handleAddQuantity = (productId, mode) => {
    if (mode === "cart") {
      const newCartList = cartList.map((product) => {
        if (product._id === productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });
      setCartList(newCartList);
      return;
    } else if (mode === "product") {
      const newProductQuantity = productQuantity.map((product) => {
        if (product._id === productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });
      setProductQuantity(newProductQuantity);
      return;
    }
  };

  const handleRemoveQuantity = (productId, mode) => {
    if (mode === "cart") {
      const newCartList = cartList.map((product) => {
        if (product._id === productId && product.quantity > 1) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });
      setCartList(newCartList);
      return;
    } else if (mode === "product") {
      const newProductQuantity = productQuantity.map((product) => {
        if (product._id === productId && product.quantity > 0) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });
      setProductQuantity(newProductQuantity);
      return;
    }
  };

  const handleAddToCart = (productId) => {
    const product = productsData.find((product) => product._id === productId);
    const pQuantity = productQuantity.find(
      (product) => product._id === productId
    );
    const newCartList = [...cartList];
    const productInCart = newCartList.find(
      (product) => product._id === productId
    );
    if (productInCart) {
      productInCart.quantity += pQuantity.quantity;
    } else if (pQuantity.quantity === 0) {
      alert(`Please select quantity for ${product.productName}`);
    } else {
      newCartList.push({ ...product, quantity: pQuantity.quantity });
    }
    setCartList(newCartList);
  };

  const handleRemoveFromCart = (productId) => {
    const newCartList = cartList.filter((product) => product._id !== productId);
    setCartList(newCartList);
  };

  const handleClearCart = () => {
    setCartList([]);
  };

  return (
    <div>
      <NavBar quantity={cartList.length} />
      <div className="GroceriesApp-Container">
        <ProductForm
        productName={formData.productName}
        brand={formData.brand}
        image={formData.image}
        price={formData.price}
        handleProductsDB={handleProductsDB}
        handleOnSubmit={handleOnSubmit}
        handleOnChange={handleOnChange}
        isEditing={isEditing}
        />
        <ProductsContainer
          products={productsData}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleAddToCart={handleAddToCart}
          productQuantity={productQuantity}
          handleOnDelete={handleOnDelete}
          handleOnEdit={handleOnEdit}
        />
        <CartContainer
          cartList={cartList}
          handleRemoveFromCart={handleRemoveFromCart}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleClearCart={handleClearCart}
        />
      </div>
    </div>
  );
}
