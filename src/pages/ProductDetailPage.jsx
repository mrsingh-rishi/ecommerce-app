import React from "react";
import Navbar from "../features/navbar/Navbar";
import ProductDetail from '../features/product/component/ProductDetail';
const ProductDetailPage = () => {
  return (
    <div>
      <Navbar>
        <ProductDetail></ProductDetail>
      </Navbar>
    </div>
  );
};

export default ProductDetailPage;
