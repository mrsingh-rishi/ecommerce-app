// A mock function to mimic making an async request for data
export function addToCart(item) {
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8080/cart", {
      method: "POST",
      body: JSON.stringify(item),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function updateItem(item) {
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8080/cart/" + item.id, {
      method: "PATCH",
      body: JSON.stringify(item),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchItemsByUserId(id) {
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8080/cart/" + id);
    const data = await response.json();
    resolve({ data });
  });
}

export function deleteItem(id) {
  return new Promise(async (resolve) => {
    const newId = id;
    const response = await fetch("http://localhost:8080/cart/" + newId, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    resolve({ data: { id: id } });
  });
}

export function resetCart(id) {
  return new Promise(async (resolve) => {
    const response = await fetchItemsByUserId(id);
    const items = response.data;
    // console.log(items);
    for (let item of items) {
      await deleteItem(item.product.id);
    }
    resolve({ status: "success" });
  });
}
