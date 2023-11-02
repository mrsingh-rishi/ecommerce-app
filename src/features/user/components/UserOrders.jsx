import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectLoggedInUser } from "../../auth/authSlice";
import { fetchLoggedInUserOrdersAsync, selectUserOrders } from "../userSlice";
import { discountedPrice } from "../../../app/constants";

export default function UserOrders() {
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);
  const orders = useSelector(selectUserOrders);
  useEffect(() => {
    dispatch(fetchLoggedInUserOrdersAsync(user.id));
  }, []);
  return (
    <div>
      {orders.map((order, index) => (
        <div className="mx-auto mt-12 max-w-3xl px-4 sm:px-6 lg:px-8 bg-white">
          <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Order #{order.id}
            </h1>
            <h3 className="text-xl font-bold tracking-tight text-red-900">
              Order staus : {order.status}
            </h3>
            <div className="flow-root mt-8">
              {order.totalItems > 0 ? (
                <ul role="list" className="-my-6 divide-y divide-gray-200">
                  {order.products.map((product) => (
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
                            <p className="ml-4">${discountedPrice(product)}</p>
                          </div>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <div className="text-gray-500">
                            <label
                              htmlFor="quantity"
                              className="inline mr-5 text-sm font-medium leading-6 text-gray-900"
                            >
                              Qty :{" "}
                              <div className="inline ml-3">
                                {product.quantity}
                              </div>
                            </label>
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
              <p className="ml-4 inline">${order.totalAmountDiscounted} </p>
            </div>
            <div className="flex justify-between my-3 text-base font-medium text-gray-900">
              <p>Total Items :</p>
              <p className="ml-4 inline">{order.totalItems}</p>
            </div>
            <p className="mt-0.5 mb-2 text-sm text-gray-500">
              Shipping Address:
            </p>
            <div className="flex justify-between gap-x-6 py-5 px-5 border-solid border-2 border-gray-200">
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {order.selectedAddress.name}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    {order.selectedAddress.street}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    {order.selectedAddress.pincode}
                  </p>
                </div>
              </div>
              <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                <p className="text-sm leading-6 text-gray-900">
                  Phone: {order.selectedAddress.phone}
                </p>
                <p className="text-sm leading-6 text-gray-500">
                  {order.selectedAddress.city}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
