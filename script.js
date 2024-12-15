const display = document.querySelector('.display');

function appendNumber(number) {
  const lastChar = display.value.slice(-1);

  // Prevent multiple consecutive decimal points
  if (number === '.' && lastChar === '.') return;

  display.value += number;
}

function appendOperator(operator) {
  const lastChar = display.value.slice(-1);

  // Prevent multiple consecutive operators and operators at the beginning
  if (isOperator(lastChar) || (operator !== '-' && display.value.length === 0)) return;

  display.value += operator;
}

function calculate() {
  try {
    display.value = eval(display.value);
  } catch (error) {
    display.value = "Error";
  }
}

function clearDisplay() {
  display.value = '';
}

function appendDecimal() {
  const lastChar = display.value.slice(-1);
  const lastOperatorIndex = findLastOperatorIndex(display.value);

  // Check if there's already a decimal point after the last operator
  if (display.value.substring(lastOperatorIndex).includes('.')) return;

  // If the last character is an operator, add a leading zero before the decimal point
  if (isOperator(lastChar)) {
    display.value += '0.';
  } else {
    display.value += '.';
  }
}

function isOperator(char) {
  return ['+', '-', '*', '/'].includes(char);
}

function findLastOperatorIndex(str) {
  const operators = ['+', '-', '*', '/'];
  let lastIndex = -1;

  operators.forEach((operator) => {
    const index = str.lastIndexOf(operator);
    if (index > lastIndex) {
      lastIndex = index;
    }
  });

  return lastIndex;
}

// Keyboard support
document.addEventListener('keydown', (event) => {
  const key = event.key;

  if (isOperator(key)) {
    appendOperator(key);
  } else if (key >= '0' && key <= '9') {
    appendNumber(key);
  } else if (key === '.') {
    appendDecimal();
  } else if (key === 'Enter' || key === '=') {
    calculate();
  } else if (key === 'Backspace' || key === 'Delete' || key === 'c' || key === 'C') {
    clearDisplay();
  }
});
