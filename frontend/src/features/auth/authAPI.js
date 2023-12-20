export function createUser(userData) {
  return new Promise(async (resolve) => {
    const response = await fetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function updateUser(userData) {
  return new Promise(async (resolve) => {
    const response = await fetch("/users", {
      method: "PATCH",
      body: JSON.stringify(userData),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchUserInfo() {
  return new Promise(async (resolve) => {
    const response = await fetch(`/auth/check`);
    const data = await response.json();
    resolve({ data });
  });
}

export function checkUser(loginInfo) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(loginInfo),
        headers: { "content-type": "application/json" },
      });
      if (response.ok) {
        const userInfo = await fetchUserInfo();
        const data = await response.json();
        resolve({ data: { data, userInfo } });
      } else {
        const error = await response.json();
        reject({ error });
      }
    } catch (error) {}
  });
}

export function signOut() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("/auth/logout");
      if (response.ok) {
        resolve({ data: "success" });
      } else {
        const error = await response.text();
        reject(error);
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}
