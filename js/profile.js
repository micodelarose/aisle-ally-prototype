document
  .getElementById("generateTargetsBtn")
  .addEventListener("click", () => {

    alert("Nutrition targets generated!");

});


document.getElementById("generateTargetsBtn").addEventListener("click", generateTargets);

document
.getElementById("generateTargetsBtn")
.addEventListener("click", generateTargets);

let generatedTargets = {
  dailyCalories: 0,
  minCalories: 0,
  maxCalories: 0,
  protein: 0,
  fiber: 0,
  fat: 0
};

function generateTargets() {

    // =========================
    // GET USER INPUTS
    // =========================

    const age = parseInt(document.getElementById("age").value);

    const weight = parseFloat(
        document.getElementById("weight").value
    );

    const height = parseFloat(
        document.getElementById("height").value
    );

    const sex =
        document.getElementById("sex").value;

    const activity =
        document.getElementById("activity").value;

    // =========================
    // ACTIVITY MULTIPLIERS
    // =========================

    const activityMultipliers = {
        "Sedentary": 1.2,
        "Light": 1.375,
        "Moderate": 1.55,
        "Very Active": 1.725
    };

    const multiplier =
        activityMultipliers[activity];

    // =========================
    // BMR
    // =========================

    let bmr;

    if (sex === "Male") {

        bmr =
            (10 * weight) +
            (6.25 * height) -
            (5 * age) +
            5;

    } else {

        bmr =
            (10 * weight) +
            (6.25 * height) -
            (5 * age) -
            161;
    }

    // =========================
    // TDEE
    // =========================

    const tdee =
        Math.round(bmr * multiplier);

    // =========================
    // TARGETS
    // =========================

    const minCalories =
        Math.round(tdee * 0.9);

    const maxCalories =
        Math.round(tdee * 1.1);

    const protein =
        Math.round(1.2 * weight);

    const fiber =
        Math.round(
            14 * (tdee / 1000)
        );

    const fat =
        Math.round(
            (0.30 * tdee) / 9
        );

    // =========================
    // PROFILE TAB DISPLAY
    // =========================

    document.getElementById(
        "dailyCalories"
    ).textContent =
        tdee + " kcal";

    document.getElementById(
        "minCaloriesTarget"
    ).textContent =
        minCalories + " kcal";

    document.getElementById(
        "maxCaloriesTarget"
    ).textContent =
        maxCalories + " kcal";

    document.getElementById(
        "proteinTarget"
    ).textContent =
        protein + " g";

    document.getElementById(
        "fiberTarget"
    ).textContent =
        fiber + " g";

    document.getElementById(
        "fatTarget"
    ).textContent =
        fat + " g";

    // =========================
    // OPTIMIZE TAB INPUTS
    // =========================

    document.getElementById(
        "minCalories"
    ).value =
        minCalories;

    document.getElementById(
        "maxCalories"
    ).value =
        maxCalories;

    document.getElementById(
        "proteinTargetInput"
    ).value =
        protein;

    document.getElementById(
        "fiberTargetInput"
    ).value =
        fiber;

    document.getElementById(
        "fatTargetInput"
    ).value =
        fat;

        generatedTargets.dailyCalories = tdee;
        generatedTargets.minCalories = minCalories;
        generatedTargets.maxCalories = maxCalories;
        generatedTargets.protein = protein;
        generatedTargets.fiber = fiber;
        generatedTargets.fat = fat;
        
    }
    

