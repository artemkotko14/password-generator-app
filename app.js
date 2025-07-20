const passwordLength = document.getElementById("character-length-number");
const sliderRange = document.getElementById("myRange");
const generateButton = document.querySelector(".generate-button");
const password = document.getElementById("password");
const boxUppercase = document.getElementById("uppercase");
const boxLowercase = document.getElementById("lowercase");
const boxNumbers = document.getElementById("numbers");
const boxSymbols = document.getElementById("symbols");
const copyIcon = document.querySelector(".copy-icon");
const strengthLabel = document.querySelector(".strength-level");
const copiedText = document.getElementById("copied-text");
const checkboxes = document.querySelectorAll(".checkbox");
const bars = document.querySelectorAll(".bar");

let sliderValue = 0;
let passwordUpdated = false;
sliderRange.addEventListener("input", function () {
  sliderValue = parseInt(this.value);
  const min = parseInt(this.min);
  const max = parseInt(this.max);
  const percent = ((sliderValue - min) / (max - min)) * 100;

  passwordLength.textContent = sliderValue;
  sliderRange.style.background = `linear-gradient(to right, #A4FFAF ${percent}%, #18171F ${percent}%)`;
});

generateButton.addEventListener("click", function () {
  if (sliderValue !== 0) {
    let newPassword = "";
    let guaranteedChars = [];
    let arrayOfPossibilities = [];

    // Helper to get a random char from a range
    function getRandomCharFromRange(start, end) {
      const code = Math.floor(Math.random() * (end - start + 1)) + start;
      return String.fromCharCode(code);
    }

    // Uppercase
    if (boxUppercase.checked) {
      guaranteedChars.push(getRandomCharFromRange(65, 90));
      for (let i = 65; i <= 90; i++) arrayOfPossibilities.push(i);
    }

    // Lowercase
    if (boxLowercase.checked) {
      guaranteedChars.push(getRandomCharFromRange(97, 122));
      for (let i = 97; i <= 122; i++) arrayOfPossibilities.push(i);
    }

    // Numbers
    if (boxNumbers.checked) {
      guaranteedChars.push(getRandomCharFromRange(48, 57));
      for (let i = 48; i <= 57; i++) arrayOfPossibilities.push(i);
    }

    // Symbols
    if (boxSymbols.checked) {
      const symbolRanges = [
        [33, 33],
        [35, 38],
        [40, 41],
        [42, 43],
        [45, 46],
        [58, 59],
        [60, 63],
        [64, 64],
        [91, 91],
        [93, 93],
        [94, 94],
        [95, 95],
        [123, 123],
        [125, 125],
      ];

      // Add one guaranteed symbol
      const [randStart, randEnd] =
        symbolRanges[Math.floor(Math.random() * symbolRanges.length)];
      guaranteedChars.push(getRandomCharFromRange(randStart, randEnd));

      // Fill the full array of possibilities
      symbolRanges.forEach(([start, end]) => {
        for (let i = start; i <= end; i++) {
          arrayOfPossibilities.push(i);
        }
      });
    }

    // If nothing selected, do nothing
    if (arrayOfPossibilities.length === 0) return;

    // Add guaranteed characters first
    newPassword = guaranteedChars.join("");

    // Fill the rest of the password
    for (let i = guaranteedChars.length; i < sliderValue; i++) {
      const code =
        arrayOfPossibilities[
          Math.floor(Math.random() * arrayOfPossibilities.length)
        ];
      newPassword += String.fromCharCode(code);
    }

    // Shuffle to avoid guaranteed characters always being first
    newPassword = newPassword
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    copiedText.style.display = "none";
    password.textContent = newPassword;
    password.style.color = "hsl(252 11% 91%)";
    passwordUpdated = true;
  }
});

async function copyPassword() {
  const passwordText = password.textContent;
  try {
    await navigator.clipboard.writeText(passwordText);
    console.log("Password copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy:", err);
  }
}

copyIcon.addEventListener("click", function () {
  if (passwordUpdated) {
    copiedText.style.display = "initial";
    copyPassword();
  }
});

// Copy password if it's focused with Enter
copyIcon.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    copyIcon.click();
  }
});

let checkedCount = 0;

function checkedBoxes() {
  checkedCount = 0;
  checkboxes.forEach((box) => {
    if (box.checked) {
      checkedCount++;
    }
  });
}

function updateBars() {
  bars.forEach((bar, index) => {
    if (index < checkedCount) {
      bar.style.background = "hsl(42 91% 68%)";
      bar.style.borderColor = "hsl(42 91% 68%)";
    } else {
      bar.style.background = "#18171F";
      bar.style.borderColor = "hsl(252 11% 91%)";
    }
  });
}
function updateStrengthLabel() {
  switch (checkedCount) {
    case 1:
      strengthLabel.textContent = "too weak";
      break;
    case 2:
      strengthLabel.textContent = "weak";
      break;
    case 3:
      strengthLabel.textContent = "medium";
      break;
    case 4:
      strengthLabel.textContent = "strong";
      break;
    default:
      strengthLabel.textContent = "";
      break;
  }
}

checkboxes.forEach((box) => {
  box.addEventListener("change", () => {
    checkedBoxes();
    updateBars();
    updateStrengthLabel();
  });
});
