import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteItemAsync, selectItems, updateCartAsync } from "./cartSlice";
import { discountedPrice } from "../../app/constants";

export default function Cart() {
  const [open, setOpen] = useState(true);
  const dispatch = useDispatch();
  const products = useSelector(selectItems);
  const totalAmountDiscounted = products.reduce(
    (amount, item) => discountedPrice(item.product) * item.quantity + amount,
    0
  );
  const totalAmount = products.reduce(
    (amount, item) => item.product.price * item.quantity + amount,
    0
  );

  const totalItems = products.reduce((total, item) => item.quantity + total, 0);

  const handleQuantity = (quantity, item) => {
    if (quantity <= 0) {
      handleRemove(item.product.id);
    } else {
      const updatedItem = {
        id: item.id,
        quantity: quantity,
      };
      // console.log(updatedItem);
      dispatch(updateCartAsync(updatedItem));
    }
  };

  const handleRemove = (id) => {
    dispatch(deleteItemAsync(id));
  };
  return (
    <>
      <div className="mx-auto mt-12 max-w-3xl px-4 sm:px-6 lg:px-8 bg-white">
        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Cart
          </h1>

          <div className="flow-root mt-8">
            {totalItems > 0 ? (
              <ul role="list" className="-my-6 divide-y divide-gray-200">
                {products.map((product) => (
                  <li key={product.product.id} className="flex py-6">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={product.product.thumbnail}
                        alt={product.product.title}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <a href={product.product.href}>
                              {product.product.title}
                            </a>
                          </h3>
                          <p className="ml-4 inline">
                            ${discountedPrice(product.product)}{" "}
                            <span className="text-red-500 line-through">
                              ${product.product.price}
                            </span>
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {product.product.color}
                        </p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="text-gray-500">
                          <label
                            htmlFor="quantity"
                            className="inline mr-5 text-sm font-medium leading-6 text-gray-900"
                          >
                            Qty :{" "}
                            <div
                              onClick={(e) =>
                                handleQuantity(product.quantity - 1, product)
                              }
                              className="relative cursor-pointer inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                              -
                            </div>
                            <div className="inline ml-3">
                              {product.quantity}
                            </div>
                            <div
                              onClick={(e) =>
                                handleQuantity(product.quantity + 1, product)
                              }
                              className="relative cursor-pointer ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                              +
                            </div>
                          </label>
                        </div>

                        <div className="flex">
                          <button
                            onClick={() => handleRemove(product.product.id)}
                            type="button"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <h1 className="text-2xl flex justify-center font-bold tracking-tight text-gray-900">
                Your Cart is Empty
              </h1>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
          <div className="flex justify-between my-3 text-base font-medium text-gray-900">
            <p>Subtotal :</p>
            <p className="ml-4 inline">
              ${totalAmountDiscounted}{" "}
              <span className="text-red-500 line-through">${totalAmount}</span>
            </p>
          </div>
          <div className="flex justify-between my-3 text-base font-medium text-gray-900">
            <p>Total Items :</p>
            <p className="ml-4 inline">{totalItems}</p>
          </div>
          <p className="mt-0.5 text-sm text-gray-500">
            Shipping and taxes calculated at checkout.
          </p>
          <div className="mt-6">
            <Link
              to="/checkout"
              className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Checkout
            </Link>
          </div>
          <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
            <p>
              or{" "}
              <Link to="/">
                <button
                  type="button"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                  onClick={() => setOpen(false)}
                >
                  Continue Shopping
                  <span aria-hidden="true"> &rarr;</span>
                </button>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
