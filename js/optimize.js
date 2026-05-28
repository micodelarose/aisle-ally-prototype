document
  .getElementById("optimizeBtn")
  .addEventListener("click", () => {

    alert("Optimization started!");

});

let optimizationConstraints = {
  budget: 0,
  days: 0,

  minCalories: 0,
  maxCalories: 0,

  proteinTarget: 0,
  fiberTarget: 0,
  fatTarget: 0,

  categoryLimits: {
    protein: {
      min: 0,
      max: 0
    },

    vegetables: {
      min: 0,
      max: 0
    },

    carbohydrates: {
      min: 0,
      max: 0
    },

    fats: {
      min: 0,
      max: 0
    }
  }
};

document
  .getElementById("updateTargetsBtn")
  .addEventListener("click", updateOptimizeTargets);

function updateOptimizeTargets() {

  const days =
    Number(document.getElementById("days").value);

  if (!days || days <= 0) {
    alert("Please enter valid days.");
    return;
  }

  document.getElementById("minCalories").value =
    Math.round(generatedTargets.minCalories * days);

  document.getElementById("maxCalories").value =
    Math.round(generatedTargets.maxCalories * days);

  document.getElementById("proteinTargetInput").value =
    Math.round(generatedTargets.protein * days);

  document.getElementById("fiberTargetInput").value =
    Math.round(generatedTargets.fiber * days);

  document.getElementById("fatTargetInput").value =
    Math.round(generatedTargets.fat * days);

}

function storeOptimizationConstraints() {

  optimizationConstraints.budget =
    Number(document.getElementById("budget").value);

  optimizationConstraints.days =
    Number(document.getElementById("days").value);

  optimizationConstraints.minCalories =
    Number(document.getElementById("minCalories").value);

  optimizationConstraints.maxCalories =
    Number(document.getElementById("maxCalories").value);

  optimizationConstraints.proteinTarget =
    Number(document.getElementById("proteinTargetInput").value);

  optimizationConstraints.fiberTarget =
    Number(document.getElementById("fiberTargetInput").value);

  optimizationConstraints.fatTarget =
    Number(document.getElementById("fatTargetInput").value);

  optimizationConstraints.categoryLimits.protein.min =
    Number(document.getElementById("proteinMin").value);

  optimizationConstraints.categoryLimits.protein.max =
    Number(document.getElementById("proteinMax").value);

  optimizationConstraints.categoryLimits.vegetables.min =
    Number(document.getElementById("vegetableMin").value);

  optimizationConstraints.categoryLimits.vegetables.max =
    Number(document.getElementById("vegetableMax").value);

  optimizationConstraints.categoryLimits.carbohydrates.min =
    Number(document.getElementById("carbMin").value);

  optimizationConstraints.categoryLimits.carbohydrates.max =
    Number(document.getElementById("carbMax").value);

  optimizationConstraints.categoryLimits.fats.min =
    Number(document.getElementById("fatMin").value);

  optimizationConstraints.categoryLimits.fats.max =
    Number(document.getElementById("fatMax").value);

  console.log(optimizationConstraints);

  optimizationConstraints.categoryLimits = {

  protein: {
    min: Number(
      document.getElementById("proteinMin").value
    ) || 0,

    max: Number(
      document.getElementById("proteinMax").value
    ) || Infinity
  },

  vegetables: {
    min: Number(
      document.getElementById("vegetableMin").value
    ) || 0,

    max: Number(
      document.getElementById("vegetableMax").value
    ) || Infinity
  },

  carbohydrates: {
    min: Number(
      document.getElementById("carbMin").value
    ) || 0,

    max: Number(
      document.getElementById("carbMax").value
    ) || Infinity
  },

  fats: {
    min: Number(
      document.getElementById("fatMin").value
    ) || 0,

    max: Number(
      document.getElementById("fatMax").value
    ) || Infinity
  }

    };
}

function runOptimization() {

  /*
    STORE USER CONSTRAINTS
  */

  storeOptimizationConstraints();

  const categoryLimits =
    optimizationConstraints.categoryLimits;

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
    BUILD NUTRITION SCORE
  */

  ITEMS.forEach(item => {

    const proteinScore =
      item.protein / proteinTarget;

    const fiberScore =
      item.fiber / fiberTarget;

    /*
      Fat acts as penalty
    */

    const fatPenalty =
      item.fat / fatTarget;

    item.nutritionScore =
      proteinScore +
      fiberScore -
      fatPenalty;

  });

  /*
    SORT BY SCORE EFFICIENCY
  */

  const items = [...ITEMS].sort((a, b) => {

    const aEfficiency =
      a.nutritionScore / a.price;

    const bEfficiency =
      b.nutritionScore / b.price;

    return bEfficiency - aEfficiency;

  });

  /*
    BINARY BOUNDED DECOMPOSITION

    Example:
    13 becomes:
    1, 2, 4, 6
  */

  const expandedItems = [];

  items.forEach(item => {

    let remaining =

      item.maxQuantity -
      (item.forcedQuantity || 0);

    let power = 1;

    while (remaining > 0) {

      const groupQuantity =

        Math.min(power, remaining);

      expandedItems.push({

        ...item,

        quantityGroup:
          groupQuantity,

        groupedPrice:
          item.price *
          groupQuantity,

        groupedCalories:
          item.calories *
          groupQuantity,

        groupedProtein:
          item.protein *
          groupQuantity,

        groupedFiber:
          item.fiber *
          groupQuantity,

        groupedFat:
          item.fat *
          groupQuantity

      });

      remaining -=
        groupQuantity;

      power *= 2;

    }

  });

  /*
    VALIDATE QUANTITIES
  */

  for (const item of items) {

    if (
      item.forcedQuantity >
      item.maxQuantity
    ) {

      alert(
        `${item.name}: Forced quantity cannot exceed max quantity.`
      );

      return;

    }

  }

  /*
    FEASIBILITY CHECK
  */

  let totalPossibleCalories = 0;

  items.forEach(item => {

    totalPossibleCalories +=

      item.calories *
      item.maxQuantity;

  });

  if (totalPossibleCalories < minCalories) {

    alert(
      "No possible combination can reach minimum calories."
    );

    return;

  }

  /*
    CHECK CHEAPEST ITEM
  */

  const cheapestItem =

    Math.min(
      ...items.map(item => item.price)
    );

  if (budget < cheapestItem) {

    alert(
      "Budget too low for any possible solution."
    );

    return;

  }

  /*
    PRELOAD FORCED ITEMS
  */

  let startingItems = [];

  let startingPrice = 0;

  let startingCalories = 0;

  let startingProtein = 0;

  let startingFiber = 0;

  let startingFat = 0;

  let proteinCount = 0;

  let vegetableCount = 0;

  let carbCount = 0;

  let fatCount = 0;

  items.forEach(item => {

    const quantity =
      item.forcedQuantity || 0;

    if (quantity <= 0) {
      return;
    }

    startingItems.push({

      ...item,

      quantity: quantity

    });

    startingPrice +=
      item.price * quantity;

    startingCalories +=
      item.calories * quantity;

    startingProtein +=
      item.protein * quantity;

    startingFiber +=
      item.fiber * quantity;

    startingFat +=
      item.fat * quantity;

    /*
      CATEGORY COUNTS
    */

    if (item.category === "protein") {

      proteinCount += quantity;

    }

    else if (
      item.category === "vegetables"
    ) {

      vegetableCount += quantity;

    }

    else if (
      item.category === "carbohydrates"
    ) {

      carbCount += quantity;

    }

    else if (
      item.category === "fats"
    ) {

      fatCount += quantity;

    }

  });

  /*
    CHECK FORCED ITEM VIOLATIONS
  */

  if (startingPrice > budget) {

    alert(
      "Forced items already exceed budget."
    );

    return;

  }

  if (startingCalories > maxCalories) {

    alert(
      "Forced items already exceed maximum calories."
    );

    return;

  }

  /*
    BEST SOLUTION
  */

  let bestSolution = [];

  let bestScore = -Infinity;

  /*
    BRANCH AND BOUND
  */

  function branch(

    index,

    currentItems,

    currentPrice,

    currentCalories,

    currentProtein,

    currentFiber,

    currentFat,

    proteinCount,

    vegetableCount,

    carbCount,

    fatCount

  ) {

    /*
      BUDGET PRUNING
    */

    if (currentPrice > budget) {
      return;
    }

    /*
      CALORIE PRUNING
    */

    if (currentCalories > maxCalories) {
      return;
    }

    /*
      CATEGORY MAXIMUMS
    */

    if (
      proteinCount >
      categoryLimits.protein.max
    ) {
      return;
    }

    if (
      vegetableCount >
      categoryLimits.vegetables.max
    ) {
      return;
    }

    if (
      carbCount >
      categoryLimits.carbohydrates.max
    ) {
      return;
    }

    if (
      fatCount >
      categoryLimits.fats.max
    ) {
      return;
    }

    /*
      CURRENT SCORE
    */

    const currentScore =

      (currentProtein / proteinTarget) +

      (currentFiber / fiberTarget) -

      (currentFat / fatTarget);

    /*
      UPPER BOUND
    */

    let upperBound =
      currentScore;

    let remainingBudget =
      budget - currentPrice;

    for (

      let i = index;

      i < expandedItems.length;

      i++

    ) {

      const item =
        expandedItems[i];

      const itemScore =

        (item.groupedProtein / proteinTarget) +

        (item.groupedFiber / fiberTarget) -

        (item.groupedFat / fatTarget);

      /*
        FULL TAKE
      */

      if (
        remainingBudget >=
        item.groupedPrice
      ) {

        upperBound += itemScore;

        remainingBudget -=
          item.groupedPrice;

      }

      /*
        FRACTIONAL TAKE
      */

      else {

        upperBound +=

          itemScore *

          (
            remainingBudget /
            item.groupedPrice
          );

        remainingBudget = 0;

        break;

      }

      if (remainingBudget <= 0) {
        break;
      }

    }

    /*
      TRUE PRUNING
    */

    if (
      upperBound <= bestScore
    ) {

      return;

    }

    /*
      END OF TREE
    */

    if (
      index >= expandedItems.length
    ) {

      if (currentCalories < minCalories) {
        return;
      }

      /*
        CATEGORY MINIMUMS
      */

      if (
        proteinCount <
        categoryLimits.protein.min
      ) {
        return;
      }

      if (
        vegetableCount <
        categoryLimits.vegetables.min
      ) {
        return;
      }

      if (
        carbCount <
        categoryLimits.carbohydrates.min
      ) {
        return;
      }

      if (
        fatCount <
        categoryLimits.fats.min
      ) {
        return;
      }

      /*
        FINAL SCORE
      */

      const totalScore =

        (currentProtein / proteinTarget) +

        (currentFiber / fiberTarget) -

        (currentFat / fatTarget);

      /*
        UPDATE BEST
      */

      if (totalScore > bestScore) {

        bestScore =
          totalScore;

        bestSolution =
          [...currentItems];

      }

      return;

    }

    /*
      CURRENT GROUPED ITEM
    */

    const item =
      expandedItems[index];

    /*
      INCLUDE BRANCH
    */

    let updatedItems =

      currentItems.map(item => ({
        ...item
      }));

    const existingItem =

      updatedItems.find(
        i => i.id === item.id
      );

    if (existingItem) {

      existingItem.quantity +=
        item.quantityGroup;

    }

    else {

      updatedItems.push({

        ...item,

        quantity:
          item.quantityGroup

      });

    }

    /*
      CATEGORY COUNTS
    */

    let nextProteinCount =
      proteinCount;

    let nextVegetableCount =
      vegetableCount;

    let nextCarbCount =
      carbCount;

    let nextFatCount =
      fatCount;

    if (
      item.category === "protein"
    ) {

      nextProteinCount +=
        item.quantityGroup;

    }

    else if (
      item.category === "vegetables"
    ) {

      nextVegetableCount +=
        item.quantityGroup;

    }

    else if (
      item.category === "carbohydrates"
    ) {

      nextCarbCount +=
        item.quantityGroup;

    }

    else if (
      item.category === "fats"
    ) {

      nextFatCount +=
        item.quantityGroup;

    }

    /*
      RECURSIVE INCLUDE
    */

    branch(

      index + 1,

      updatedItems,

      currentPrice +
        item.groupedPrice,

      currentCalories +
        item.groupedCalories,

      currentProtein +
        item.groupedProtein,

      currentFiber +
        item.groupedFiber,

      currentFat +
        item.groupedFat,

      nextProteinCount,

      nextVegetableCount,

      nextCarbCount,

      nextFatCount

    );

    /*
      RECURSIVE EXCLUDE
    */

    branch(

      index + 1,

      currentItems,

      currentPrice,

      currentCalories,

      currentProtein,

      currentFiber,

      currentFat,

      proteinCount,

      vegetableCount,

      carbCount,

      fatCount

    );

  }

  /*
    START RECURSION
  */

  branch(

    0,

    startingItems,

    startingPrice,

    startingCalories,

    startingProtein,

    startingFiber,

    startingFat,

    proteinCount,

    vegetableCount,

    carbCount,

    fatCount

  );

  /*
    NO VALID SOLUTION
  */

  if (bestSolution.length === 0) {

    alert(
      "No valid solution found."
    );

    return;

  }

  /*
    DISPLAY RESULTS
  */

  console.log(bestSolution);

  console.log(bestScore);

  renderResults(
    bestSolution,
    bestScore
  );

}