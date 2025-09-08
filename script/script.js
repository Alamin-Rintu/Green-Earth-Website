let allPlants = [];
let cart = [];

const loadCategory = () => {
  fetch('https://openapi.programming-hero.com/api/categories')
    .then(res => res.json())
    .then(json => displayCategory(json.categories));
};

const loadAllPlants = () => {
  fetch('https://openapi.programming-hero.com/api/plants')
    .then(res => res.json())
    .then(json => {
      allPlants = json.plants;
    });
};

const loadTreeDetail = async(id) => {
  const url = `https://openapi.programming-hero.com/api/plant/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayTreeDetails(details.plants);
}

const displayTreeDetails = (tree) => {
  const detailsBox = document.getElementById('tree-details-container');
  detailsBox.innerHTML = `
    <h2 class="text-2xl font-bold mb-3">${tree.name}</h2>
    <img src="${tree.image}" alt="" class="w-full h-48 object-cover rounded-lg mb-4" />
    <p class="text-sm"><span class="font-semibold">Category:</span> ${tree.category}</p>
    <p class="text-sm"><span class="font-semibold">Price:</span> ৳${tree.price}</p>
    <p class="text-sm mt-2"><span class="font-semibold">Description:</span> ${tree.description}</p>
  `;
  document.getElementById('my_modal_5').showModal();
}

const displayCategory = (categories) => {
  const categoryContainer = document.getElementById("category-list");
  categoryContainer.innerHTML = "";

  categories.forEach(category => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div onclick="loadTrees('${category.category_name}')"
           class="hover:bg-green-700 px-3 py-2 rounded-lg cursor-pointer">
        ${category.category_name}
      </div>
    `;
    categoryContainer.append(li);
  });
}

const loadTrees = (categoryName) => {
  const filteredPlants = allPlants.filter(plant => plant.category === categoryName);
  const cardContainer = document.getElementById("cards");
  cardContainer.innerHTML = "";

  filteredPlants.forEach(plant => {
    const card = document.createElement('div');
    card.className = "bg-white shadow-md rounded-2xl overflow-hidden border border-gray-200 max-w-xs";

    card.innerHTML = `
      <img src="${plant.image}" alt="" class="w-full h-40 object-cover" />
      <div class="p-4">
        <h3 onclick="loadTreeDetail(${plant.id})" class="text-lg font-semibold cursor-pointer">${plant.name}</h3>
        <p class="text-sm text-gray-600 mt-1">${plant.description}</p>
        <div class="flex justify-between items-center mt-3">
          <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">${plant.category}</span>
          <span class="font-semibold">৳${plant.price}</span>
        </div>
        <button onclick="addToCart(${plant.id})" class="w-full mt-4 bg-green-600 text-white py-2 rounded-full hover:bg-green-700 transition">
          Add to Cart
        </button>
      </div>
    `;
    cardContainer.append(card);
  });
}

const addToCart = (id) => {
  const selectedPlant = allPlants.find(plant => plant.id === id);
  if (!selectedPlant) return;

  cart.push(selectedPlant);
  updateCartUI();
}

const updateCartUI = () => {
  const cartList = document.getElementById("cart-list");
  const totalPriceEl = document.getElementById("total-price");
  cartList.innerHTML = "";

  cart.forEach((plant, index) => {
    const li = document.createElement('li');
    li.className = "flex justify-between items-center bg-gray-100 p-2 rounded-lg";
    li.innerHTML = `
      <span>${plant.name} - ৳${plant.price}</span>
      <span class="cursor-pointer text-red-500 font-bold" onclick="removeFromCart(${index})">❌</span>
    `;
    cartList.append(li);
  });

  const total = cart.reduce((sum, plant) => sum + plant.price, 0);
  totalPriceEl.textContent = total;
}

const removeFromCart = (index) => {
  cart.splice(index, 1);
  updateCartUI();
}

loadCategory();
loadAllPlants();
