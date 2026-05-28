

let editingItemId = null;

function renderItems() {

  const container =
    document.getElementById("itemsContainer");

  container.innerHTML = "";

  ITEMS.forEach(item => {

    const div = document.createElement("div");

    div.className = "item-row";

    div.innerHTML = `

      <div class="item-info">

        <div class="item-name">
          ${item.name}
        </div>

        <div class="item-meta">
          ₱${item.price} |
          ${item.calories} kcal |
          ${item.protein}g protein |
          ${item.fiber}g fiber |
          ${item.fat}g fat
        </div>

      </div>

      <div class="item-actions">

        <!-- MAX QUANTITY -->

        <div class="quantity-control">

          <label>Max Qty</label>

          <input
            type="number"
            min="0"
            value="${item.maxQuantity}"
            onchange="
              updateMaxQuantity(
                '${item.id}',
                this.value
              )
            "
          >

        </div>

        <!-- FORCED QUANTITY -->

        <div class="quantity-control">

          <label>Forced Qty</label>

          <input
            type="number"
            min="0"
            max="${item.maxQuantity}"
            value="${item.forcedQuantity || 0}"
            onchange="
              updateForcedQuantity(
                '${item.id}',
                this.value
              )
            "
          >

        </div>

        <!-- EDIT BUTTON -->

        <button
          class="edit-btn"
          onclick="editItem('${item.id}')"
          title="Edit Item"
        >
          ✎
        </button>

      </div>

    `;

    container.appendChild(div);

  });

}

function saveItem() {

  const name = document.getElementById("itemName").value;
  const price = document.getElementById("itemPrice").value;
  const calories = document.getElementById("itemCalories").value;
  const protein = document.getElementById("itemProtein").value;
  const fiber = document.getElementById("itemFiber").value;
  const fat = document.getElementById("itemFat").value;

  if (
    !name ||
    !price ||
    !calories ||
    !protein ||
    !fiber ||
    !fat
  ) {
    alert("Please fill in all fields.");
    return;
  }

  const newItem = {
    id: Date.now().toString(),
    name: name,
    price: Number(price),
    calories: Number(calories),
    protein: Number(protein),
    fiber: Number(fiber),
    fat: Number(fat)
  };

  if (editingItemId) {

  const index = ITEMS.findIndex(
    item => item.id === editingItemId
  );

  if (index !== -1) {

    ITEMS[index] = {
      ...newItem,
      id: editingItemId
    };

  }

  editingItemId = null;

} else {

  ITEMS.push(newItem);

}

  renderItems();

  document.getElementById("itemName").value = "";
  document.getElementById("itemPrice").value = "";
  document.getElementById("itemCalories").value = "";
  document.getElementById("itemProtein").value = "";
  document.getElementById("itemFiber").value = "";
  document.getElementById("itemFat").value = "";
}



function editItem(id) {

  const item = ITEMS.find(i => i.id === id);

  if (!item) return;

  editingItemId = id;

  document.getElementById("itemName").value = item.name;
  document.getElementById("itemPrice").value = item.price;
  document.getElementById("itemCalories").value = item.calories;
  document.getElementById("itemProtein").value = item.protein;
  document.getElementById("itemFiber").value = item.fiber;
  document.getElementById("itemFat").value = item.fat;

}

function updateMaxQuantity(itemId, value) {

  const item = ITEMS.find(
    i => i.id == itemId
  );

  if (!item) return;

  item.maxQuantity = Number(value);

  console.log(
    item.name,
    "max quantity updated to",
    item.maxQuantity
  );
}

function updateForcedQuantity(id, value) {

    const item = ITEMS.find(
        item => item.id == id
    );

    if (!item) return;

    const forcedQuantity =
        Number(value);

    /*
      Prevent invalid quantity
    */

    if (
        forcedQuantity >
        item.maxQuantity
    ) {

        alert(
            "Forced quantity cannot exceed max quantity."
        );

        renderItems();

        return;
    }

    item.forcedQuantity =
        forcedQuantity;

}