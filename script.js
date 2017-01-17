//Menu script
function toggleSlide(x){
    var el = document.getElementById(x);
    el.classList.toggle('hide');
}
//TODO correct menu

// Calculator

// Keys and Operators
var keys = document.querySelectorAll('span'),
// Following code is not the most elegant, but allows future expansion of keys
operators = [].slice.call(document.querySelectorAll('.operators'))
  .map(tagValues),
maxLength = 18;
operators.push('nroot');

// Helper function for mapping of dom elements values.
function tagValues (element) {
	return element.innerHTML;
}

// Variables used for calculation
var screen = document.querySelector('#screen'),
result = document.querySelector('#result'),
decimal = false, //only on point per number allowed
expression = '', // evaluated on 'operators' or 'equals'
ready = true, //identify when calculator is ready for the next expression
equated = false; // detect that equals is pressed
screen.innerHTML = '0';


// Mouse events

// Assigning onlick for each keys
for (var i = 0; i < keys.length; i++) {
	keys[i].onclick = clicker;
}

// Handling any mouse click
function clicker(e) {
	calculations(this.innerHTML);
}

// Key identifiers
var dictionary = {
	65: 'AC', 8: '&lt;', 190: '.', 189: '-', 187: '=', 13: '=', 191: '\u00F7',
	83: '&radic;'
};
// Key identifiers in combination with SHIFT
var combos = {53: '%', 56: '\u00D7', 187: '+'};

// Key events
document.addEventListener('keydown', function (event) {
  if (event.defaultPrevented) {
		// Avoid event duplication
    return;
  }

	if (event.shiftKey && combos.hasOwnProperty(event.which)) {
	  calculations(combo[event.which]);
	} else {
		if (dictionary.hasOwnProperty(event.which))
      calculations(dictionary[event.which]);

		if (!event.shiftKey && 47 < event.which && event.which < 58)
			calculations(String(parseInt(event.which) - 48));
	}

}, true);

// Calculations

function calculations(pressed) {
	if (!pressed)
	  return false;

	last = expression.slice(-1);

	// Check if clears are pressed
	if (pressed == 'AC') {
		insert('', '0', false);
		ready = true;
	}
	else if (pressed == '&lt;'){
		//check if deleted symbol is decimal point
		if(screen.innerHTML.slice(-1) == '.')
		decimal = false;
		var forS = screen.innerHTML.length > 1 ? screen.innerHTML.slice(0,-1) : '0';
		insert(expression.slice(0,-1), forS, decimal);
	} else if (operators.indexOf(pressed) > -1) {
		if (pressed.match(/<math><msqrt>/)) {
			pressed = '&radic;'; //the way to preserve formating
		}
		operations(pressed, last);
	} else if (pressed == '.') {
		// Decimal point
		if (!decimal) {
			if(expression == '' || expression == '0')
			insert('0.', '0.', true);
			else
			add(pressed, true, true);
		}
	} else if (!(pressed =='0' && expression =='0')) {
		if (equated) {
			insert(pressed, pressed, decimal);
			equated = false;
		} else if (screen.innerHTML.length < maxLength) //Maximum length
		  add(pressed, true, decimal);
		ready = false;
	}
}

// Operators helper function
function operations(pressed, last) {
	// Directly return result of the last expression
	var reg = /^(-?\d+(?:\.\d+)?)(\D+)(\d+(?:\.\d+)?)$/,
	equation;
	if (expression.match(reg)) {
		var groups = reg.exec(expression),
		num1 = parseFloat(groups[1]),
		num2 = parseFloat(groups[3]);

		if (groups[2] !== '&radic;') {
			equation = expression.replace('÷', '/')
			.replace('\u00F7', '/').replace('\u00D7', '*');
		} else {
			 equation = Math.pow(num1, 1/num2);
			 console.log(num1, 1/num2); //TODO fraction root
		}
		if (pressed === '%') {
			var calculated = percentage(num2, num1);
			equation = num1 + groups[2] + calculated;
			pressed = '';
		}
		var finalResult = eval(equation).toString();
		insert(finalResult, finalResult, false);
	} else if (pressed === '%'){
		//absolute percentage
		var res = percentage(parseFloat(expression, 2), false).toString();
		insert(res, res, false);
		pressed = '';
	}
	//Replace last operator if necessary
	if(operators.indexOf(last) > -1 || last == '.'){
		expression = expression.slice(0, -1);
	}
	if (screen.innerHTML == '0' && expression == '' && pressed == '-')
	  insert(pressed, pressed, false);
	else if (pressed != '=')
	  insert(expression+pressed, '0', false);
	else if (pressed == '='){
		if (last === '×' || last === '\u00D7'){
			var num = parseFloat(expression, 5);
			var res = (num * num).toString();
			insert(res, res, false);
		}
		equated = true;
	}
	ready = true;
}

// Helpers
function percentage (num1, num2) {
	return num2 ? (num1 * num2 / 100 ): (num1 / 100);
}

// Insert or add to screen
function add(key, current, decValue){
	// allow calculations with result of previous calculations
	if (current)
	  screen.innerHTML = ready? key: (screen.innerHTML+key);

	expression += key;
	result.innerHTML = expression;
	decimal = decValue;
}

function insert(forE, forS, decValue){
	screen.innerHTML = forS.length <= maxLength ? forS : '0';
	expression = forE;

	result.innerHTML = expression;
	decimal = decValue;
}

//TODO document square  9*=,
