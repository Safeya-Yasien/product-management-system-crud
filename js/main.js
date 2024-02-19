//
//
//
//
//
//
//
//
//
//

let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let create = document.getElementById("create");
let search = document.getElementById("search");
let products;
let temp;
let mood = "create";
let searchMood = "title";

function getTotal() {
  if (price.value !== "") {
    let result = +price.value + +taxes.value + +ads.value - +discount.value;

    total.innerHTML = result;

    total.classList.add("result");
  } else {
    total.innerHTML = "";
    total.classList.remove("result");
  }
}

if (localStorage.getItem("product") !== null) {
  products = JSON.parse(localStorage.getItem("product"));
} else {
  products = [];
}

create.onclick = () => {
  let newProduct = {
    title: title.value.toLowerCase(),
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerHTML,
    count: count.value,
    category: category.value.toLowerCase(),
  };

  if (
    title.value !== "" &&
    price.value !== "" &&
    category.value !== "" &&
    newProduct.count <= 100
  ) {
    if (mood === "create") {
      if (count.value > 1) {
        for (let i = 0; i < count.value; i++) {
          products.push(newProduct);
        }
      } else {
        products.push(newProduct);
      }
    } else {
      products[temp] = newProduct;
      create.innerHTML = "Create";
      count.style.display = "block";
      mood = "create";
    }
    clearData();
  }

  localStorage.setItem("product", JSON.stringify(products));

  displayData();
};

function clearData() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  total.innerHTML = "";
  count.value = "";
  category.value = "";
}

function displayData() {
  getTotal();
  let table = "";
  for (let i = 0; i < products.length; i++) {
    table += createTable(i);
  }

  document.getElementById("tbody").innerHTML = table;

  let deleteAllButton = document.getElementById("delete-all");

  if (products.length > 0) {
    deleteAllButton.innerHTML = `
        <button onclick="deleteAll()">Delete All (${products.length})</button>
        `;
  } else {
    deleteAllButton.innerHTML = "";
  }
}

function createTable(index) {
  return `
      <tr>
        <td>${index + 1}</td>
        <td>${products[index].title}</td>
        <td>${products[index].price}</td>
        <td>${products[index].taxes}</td>
        <td>${products[index].ads}</td>
        <td>${products[index].discount}</td>
        <td>${products[index].category}</td>
        <td>${products[index].total}</td>
        <td><button onclick="updateProduct(${index})" id="update-button">update</button></td>
        <td><button onclick="deleteProduct(${index})" id="delete-button">delete</button></td>
      </tr>
    `;
}

function deleteProduct(index) {
  products.splice(index, 1);
  localStorage.setItem("product", JSON.stringify(products));
  displayData();
}

function deleteAll() {
  localStorage.clear();
  products.splice(0);
  displayData();
}

function updateProduct(index) {
  title.value = products[index].title;
  price.value = products[index].price;
  taxes.value = products[index].taxes;
  ads.value = products[index].ads;
  discount.value = products[index].discount;
  getTotal();
  count.style.display = "none";
  category.value = products[index].category;

  create.innerHTML = "Update";
  mood = "update";
  temp = index;

  scroll({
    top: 0,
    behavior: "smooth",
  });
}

function getSearchMood(id) {
  if (id === "search-title") {
    searchMood = "title";
  } else {
    searchMood = "category";
  }

  search.placeholder = `Search by ${searchMood}`;

  search.focus();
  search.value = "";
  displayData();
}

function searchProduct(value) {
  let table = "";
  for (let i = 0; i < products.length; i++) {
    if (searchMood === "title") {
      if (products[i].title.includes(value.toLowerCase())) {
        table += createTable(i);
      }
    } else {
      if (products[i].category.includes(value.toLowerCase())) {
        table += createTable(i);
      }
    }
  }
  document.getElementById("tbody").innerHTML = table;
}

displayData();
