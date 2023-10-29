import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import {
  deleteItemAsync,
  selectItems,
  updateCartAsync,
} from "../features/cart/cartSlice";
import { useForm } from "react-hook-form";
import {
  selectLoggedInUser,
  updateUserAsync,
} from "../features/auth/authSlice";
import { createOrderAsync, selectCurrentOrder } from "../features/order/orderSlice";

const CheckoutPage = () => {
  const [open, setOpen] = useState(true);
  const dispatch = useDispatch();
  const products = useSelector(selectItems);
  const user = useSelector(selectLoggedInUser);
  const currentOrder = useSelector(selectCurrentOrder);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const totalAmountDiscounted = products.reduce(
    (amount, item) =>
      Math.round(item.price * (1 - item.discountPercentage / 100)) *
        item.quantity +
      amount,
    0
  );
  const totalAmount = products.reduce(
    (amount, item) => item.price * item.quantity + amount,
    0
  );

  const totalItems = products.reduce((total, item) => item.quantity + total, 0);

  const handleQuantity = (quantity, item) => {
    if (quantity == 0) {
      handleRemove(item.id);
    } else if (quantity < 0) {
      return;
    } else {
      const updatedItem = { ...item, quantity: +quantity };
      dispatch(updateCartAsync(updatedItem));
      reset();
    }
  };

  const handleRemove = (id) => {
    dispatch(deleteItemAsync(+id));
  };

  const handleAddress = (e) => {
    console.log(e.target.value);
    const index = e.target.value;
    setSelectedAddress(user.addresses[index]);
  };

  const handlePayment = (e) => {
    const value = e.target.value;
    console.log(value);
    setPaymentMethod(value);
  };

  const handleOrder = (e) => {
    const order = {
      products,
      totalAmountDiscounted,
      totalItems,
      paymentMethod,
      selectedAddress,
      status:'pending'
    };
    dispatch(createOrderAsync(order));
  };
  if(!products.length){
    return <Navigate to = '/' replace={true} ></Navigate>
  }
  return (
    <>
    
    {currentOrder && <Navigate to={`/order-success/${currentOrder.id}`} replace={true} ></Navigate> }
    <div className="mx-auto max-w-7xl px-4 sm:px-0 lg:px-0">
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <form
            className="bg-white px-5 py-12 mt-12"
            onSubmit={handleSubmit((data) => {
              dispatch(
                updateUserAsync({
                  ...user,
                  addresses: [...user.addresses, data],
                })
              );
            })}
          >
            <div class="space-y-12">
              <div class="border-b border-gray-900/10 pb-12">
                <h2 class="text-2xl font-semibold leading-7 text-gray-900">
                  Personal Information
                </h2>
                <p class="mt-1 text-sm leading-6 text-gray-600">
                  Use a permanent address where you can receive mail.
                </p>

                <div class="mt-10 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div class="sm:col-span-3">
                    <label
                      for="name"
                      class="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Full Name
                    </label>
                    <div class="mt-2">
                      <input
                        type="text"
                        name="first-name"
                        {...register("name", { required: true })}
                        autocomplete="given-name"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div class="sm:col-span-4">
                    <label
                      for="email"
                      class="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email address
                    </label>
                    <div class="mt-2">
                      <input
                        id="email"
                        {...register("email", {
                          required: "email is required",
                        })}
                        type="email"
                        autocomplete="email"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div class="sm:col-span-3">
                    <label
                      for="country"
                      class="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Phone Number
                    </label>
                    <div class="mt-2">
                      <input
                        type="tel"
                        {...register("phone", {
                          required: "phone is required",
                        })}
                        id="stree"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div class="col-span-full">
                    <label
                      for="street-address"
                      class="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Street Address
                    </label>
                    <div class="mt-2">
                      <input
                        type="text"
                        {...register("street", {
                          required: "street is required",
                        })}
                        id="stree"
                        autocomplete="full-address"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div class="sm:col-span-2 sm:col-start-1">
                    <label
                      for="city"
                      class="block text-sm font-medium leading-6 text-gray-900"
                    >
                      City
                    </label>
                    <div class="mt-2">
                      <input
                        type="text"
                        {...register("city", { required: "city is required" })}
                        id="city"
                        autocomplete="address-level2"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div class="sm:col-span-2">
                    <label
                      for="region"
                      class="block text-sm font-medium leading-6 text-gray-900"
                    >
                      State / Province
                    </label>
                    <div class="mt-2">
                      <input
                        type="text"
                        {...register("state", {
                          required: "state is required",
                        })}
                        id="region"
                        autocomplete="address-level1"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div class="sm:col-span-2">
                    <label
                      for="postal-code"
                      class="block text-sm font-medium leading-6 text-gray-900"
                    >
                      ZIP / Postal code
                    </label>
                    <div class="mt-2">
                      <input
                        type="text"
                        {...register("pinCode", {
                          required: "pinCode is required",
                        })}
                        id="postal-code"
                        autocomplete="postal-code"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-6 flex items-center justify-end gap-x-6">
                <button
                  type="button"
                  class="text-sm font-semibold leading-6 text-gray-900"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Add Address
                </button>
              </div>
              <div class="border-b border-gray-900/10 pb-12">
                {user.addresses.length !== 0 && (
                  <div>
                    <h2 class="text-base font-semibold leading-7 text-gray-900">
                      Address
                    </h2>
                    <p class="mt-1 text-sm leading-6 text-gray-600">
                      Choose from Existing address
                    </p>
                    <ul role="list">
                      {user.addresses &&
                        user.addresses.map((address, index) => (
                          <li
                            key={index}
                            className="flex justify-between gap-x-6 py-5 px-5 border-solid border-2 border-gray-200"
                          >
                            <div className="flex min-w-0 gap-x-4">
                              <input
                                name="address"
                                onChange={handleAddress}
                                type="radio"
                                value={index}
                                class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                              />
                              <div className="min-w-0 flex-auto">
                                <p className="text-sm font-semibold leading-6 text-gray-900">
                                  {address.name}
                                </p>
                                <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                                  {address.street}
                                </p>
                                <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                                  {address.pincode}
                                </p>
                              </div>
                            </div>
                            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                              <p className="text-sm leading-6 text-gray-900">
                                Phone: {address.phone}
                              </p>
                              <p className="text-sm leading-6 text-gray-500">
                                {address.city}
                              </p>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
                <div class="mt-10 space-y-10">
                  <fieldset>
                    <legend class="text-sm font-semibold leading-6 text-gray-900">
                      Payment Methods
                    </legend>
                    <p class="mt-1 text-sm leading-6 text-gray-600">
                      Choose One
                    </p>
                    <div class="mt-6 space-y-6">
                      <div class="flex items-center gap-x-3">
                        <input
                          id="cash"
                          checked={paymentMethod === "cash"}
                          name="payments"
                          type="radio"
                          onChange={handlePayment}
                          value="cash"
                          class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <label
                          for="cash"
                          class="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Cash
                        </label>
                      </div>
                      <div class="flex items-center gap-x-3">
                        <input
                          id="card"
                          checked={paymentMethod === "card"}
                          name="payments"
                          type="radio"
                          onChange={handlePayment}
                          value="card"
                          class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <label
                          for="card"
                          class="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Card Payment
                        </label>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="lg:col-span-2">
          <div className="mx-auto mt-12 max-w-3xl px-4 sm:px-6 lg:px-8 bg-white">
            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                Cart
              </h1>

              <div className="flow-root mt-8">
                {totalItems > 0 ? (
                  <ul role="list" className="-my-6 divide-y divide-gray-200">
                    {products.map((product) => (
                      <li key={product.id} className="flex py-6">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img
                            src={product.thumbnail}
                            alt={product.imageAlt}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>

                        <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3>
                                <a href={product.href}>{product.title}</a>
                              </h3>
                              <p className="ml-4 inline">
                                $
                                {Math.round(
                                  product.price *
                                    (1 - product.discountPercentage / 100)
                                )}{" "}
                                <span className="text-red-500 line-through">
                                  ${product.price}
                                </span>
                              </p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              {product.color}
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
                                    handleQuantity(
                                      product.quantity - 1,
                                      product
                                    )
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
                                    handleQuantity(
                                      product.quantity + 1,
                                      product
                                    )
                                  }
                                  className="relative cursor-pointer ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                  +
                                </div>
                              </label>
                            </div>

                            <div className="flex">
                              <button
                                onClick={() => handleRemove(product.id)}
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
                  <span className="text-red-500 line-through">
                    ${totalAmount}
                  </span>
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
                <div
                  onClick={handleOrder}
                  className="flex cursor-pointer items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                  Order Now
                </div>
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
        </div>
      </div>
    </div>
    </>
  );
};

export default CheckoutPage;
