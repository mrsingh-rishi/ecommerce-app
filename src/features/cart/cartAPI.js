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
    const response = await fetch("http://localhost:8080/cart/"+item.id, {
      method: "PATCH",
      body: JSON.stringify(item),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchItemsByUserId(id){
  return new Promise(async (resolve) => {
    const response = await fetch('http://localhost:8080/cart?user='+id);
    const data = await response.json();
    resolve({ data });
  });
}

export function deleteItem(id){
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8080/cart/"+id, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    resolve({ data:{id:id} });
  });
}