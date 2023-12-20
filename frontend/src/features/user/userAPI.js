// A mock function to mimic making an async request for data
export function fetchLoggedInUserOrders() {
  return new Promise(async (resolve) => {
    const response = await fetch(`/orders`);
    const data = await response.json();
    resolve({ data });
  });
}

