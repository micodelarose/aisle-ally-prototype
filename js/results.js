document
  .getElementById("addItemBtn")
  .addEventListener("click", () => {

    alert("Add Item clicked!");

});

function renderResults(solution, score) {

  /*
    SELECTED ITEMS CONTAINER
  */

  const container =
    document.getElementById(
      "selectedItemsContainer"
    );

  container.innerHTML = "";

  /*
    TOTALS
  */

  let totalCost = 0;

  let totalCalories = 0;

  let totalProtein = 0;

  let totalFiber = 0;

  let totalFat = 0;

  let totalItems = 0;

  /*
    RENDER ITEMS
  */

  solution.forEach(item => {

    const itemTotalPrice =
      item.price * item.quantity;

    const itemTotalCalories =
      item.calories * item.quantity;

    const itemTotalProtein =
      item.protein * item.quantity;

    const itemTotalFiber =
      item.fiber * item.quantity;

    const itemTotalFat =
      item.fat * item.quantity;

    /*
      ADD TO TOTALS
    */

    totalCost += itemTotalPrice;

    totalCalories += itemTotalCalories;

    totalProtein += itemTotalProtein;

    totalFiber += itemTotalFiber;

    totalFat += itemTotalFat;

    totalItems += item.quantity;

    /*
      CREATE RESULT CARD
    */

    const div =
      document.createElement("div");

    div.className = "selected-item";

    div.innerHTML = `

      <div class="item-info">

        <div class="item-name">
          ${item.quantity}x ${item.name}
        </div>

        <div class="item-details">

          ₱${item.price} each

          <br>

          ${item.calories} kcal each

        </div>

      </div>

      <div class="item-price">
        ₱${itemTotalPrice}
      </div>

    `;

    container.appendChild(div);

  });

  /*
    GET TARGETS
  */

  const budget =
    optimizationConstraints.budget;

  const minCalories =
    optimizationConstraints.minCalories;

  const maxCalories =
    optimizationConstraints.maxCalories;

  const proteinTarget =
    optimizationConstraints.proteinTarget;

  const fiberTarget =
    optimizationConstraints.fiberTarget;

  const fatTarget =
    optimizationConstraints.fatTarget;

  /*
    UPDATE SUMMARY
  */

  document.getElementById("totalCost")
    .textContent =
    `₱${totalCost} / ₱${budget}`;

  document.getElementById("avgCalories")
    .textContent =
    `${totalCalories} / ${minCalories}-${maxCalories}`;

  document.getElementById("avgProtein")
    .textContent =
    `${totalProtein}g / ${proteinTarget}g`;

  document.getElementById("avgFiber")
    .textContent =
    `${totalFiber}g / ${fiberTarget}g`;

  document.getElementById("avgFat")
    .textContent =
    `${totalFat}g / ${fatTarget}g`;

  document.getElementById("itemCount")
    .textContent =
    totalItems;

}