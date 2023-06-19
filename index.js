class cNum {
	constructor(x,y){
		this.real = x;
		this.imag = y;
	}
}

const i = new cNum(0,1);

function modulus(z){ // real number output, r in exponential formula
	return Math.sqrt((z.real**2)+(z.imag**2));
}

function ngtv(z){ // negation
	return new cNum(-1*z.real,-1*z.imag);
}

function cAdd(z,w){
	return new cNum(z.real+w.real,z.imag+w.imag);
}

function cSub(z,w){
	return cAdd(z,ngtv(w));
}

function argument(z){ // real number output
	if(x.imag != 0 || x > 0){
		let q = z.imag/(modulus(z)+z.real);
		return 2*Math.atan(q);
	}else if(x > 0 && y == 0){
		return Math.PI;
	}else if(x == 0 && y == 0){
		return 0;
	}// not sure if it'll ever execute below here
	return 0;
}

function cMult(z,w){
	let resr = (z.real*w.real)-(z.imag*w.imag);
	let resi = (z.real*w.imag)+(z.imag*w.real);
	return new cNum(resr,resi);
}

function cLn(z){
	return new cNum(Math.log(modulus(z)),argument(z));
}

function cDiv(z,w){
	let n1 = (z.real*w.real)+(z.imag*w.imag);
	let n2 = (z.imag*w.real)-(z.real*w.imag);
	let d = (w.real**2)+(w.imag**2);
	return new cNum(n1/d,n2/d);
}

function cInverse(z){
	let ri = (1/modulus(z));
	let nargu = -1*argument(z);
	return new cNum(ri*Math.cos(nargu),ri*Math.sin(nargu));
}

function cExp(z){
	let ex = Math.exp(z.real);
	let argu = argument(z);
	return new cNum(ex*Math.cos(agru),ex*Math.sin(argu));
}

function cPower(z,w){
	return cExp(cMult(w,cLn(z)));
}

var z_in;
var sign;
var z_out;
var fsign;

function inputSubmitHandle(event){
	event.preventDefault();
	const x = document.getElementById("x-input").value;
	const y = document.getElementById("y-input").value;
	let X = parseFloat(x) || 0;
	let Y = parseFloat(y) || 0;
	z_in = new cNum(X,Y);
	console.log("z x: ",z_in.real);
	console.log("z y: ",z_in.imag);
	sign = parseFloat(y) >= 0 ? "+" : "";
	document.getElementById("input-display").innerHTML = "INPUT: z = "+x+sign+y+"i";
	// update "z-input" div
}

function parseExpression(expression) {
	const numberPattern = /[+\-]?\d+(\.\d+)?/g; // caputre constants
	const variablePattern = /[a-zA-Z][a-zA-Z0-9]*/g; // capture z
	const operatorPattern = /[+\-*/^]/g; // caputre operations
	const parenthesesPattern = /[()]/g; // capture nestings
	const numbers = expression.match(numberPattern);
	const variables = expression.match(variablePattern);
	const operators = expression.match(operatorPattern);
	const parentheses = expression.match(parenthesesPattern);
	if(!numbers || !operators){
		throw new Error('Invalid expression');
	}
	let evalExpression = expression.replace(variablePattern, 'z').replace(/i/g, 'i.real'); // capture i
	evalExpression = evalExpression.replace(/\^/g, '**'); // capture exponents
	const parsedExpression = {
		numbers: numbers.map(Number),
		variables: variables || [],
		operators: operators,
		parentheses: parentheses || [],
		evaluate: (z, i) => {
			const stack = [];
			const operatorPrecedence = {
				'^': 3,
				'*': 2,
				'/': 2,
				'+': 1,
				'-': 1
			};
			function applyOperator(operator){
				const [b,a] = [stack.pop(),stack.pop()];
				switch(operator){
					case '^':
						stack.push(cExponent(a,b));
						break;
					case '*':
						stack.push(cMult(a,b));
						break;
					case '/':
						stack.push(cDiv(a,b));
						break;
					case '+':
						stack.push(cAdd(a,b));
						break;
					case '-':
						stack.push(cSub(a,b));
						break;
				}
			}
			const tokens = evalExpression.split(' ');
			for(const token of tokens){
				if(token in operatorPrecedence){
					while (stack.length > 0 && stack[stack.length - 1] in operatorPrecedence && operatorPrecedence[token] <= operatorPrecedence[stack[stack.length - 1]]) {
						applyOperator(stack.pop());
					}
					stack.push(token);
				}else if (token === '('){
					stack.push(token);
				}else if(token === ')'){
					while (stack.length > 0 && stack[stack.length - 1] !== '(') {
						applyOperator(stack.pop());
					}					
					stack.pop();
				}else{
					stack.push(new cNum(Number(token), 0));
				}
			}
			while(stack.length > 1) {
				applyOperator(stack.pop());
			}
			return stack[0];
		}
	};
	return parsedExpression;
}

function fzEntryHandle(event){
	event.preventDefault();
	let fz_string = document.getElementById("function-string").value;
	if(fz_string === ""){ return; }
	document.getElementById("function-display").innerHTML = "* f(z) = "+fz_string;
	const parsed_expr = parseExpression(fz_string);
	let result;
	if(typeof z_in === 'undefined'){
		z_in = new cNum(0,0);
		result = cAdd(
			cMult( // z^2
				cDiv(z_in,new cNum(2,2)),
				cDiv(z_in,new cNum(2,2))
			),
			i
		);
	}else{
		result = parsed_expr.evaluate(z_in);
	}
	console.log("f(z) x: ",result.real);
	console.log("f(z) y: ",result.imag);
	z_out = new cNum(result.real,result.imag);
	fsign = result.imag >= 0 ? "+" : "";
	let new_text = "* f("+z_in.real+sign+z_in.imag+"i) = "+z_out.real+fsign+z_out.imag+"i";
	document.getElementById("function-eval").innerHTML = new_text;
	// update "z-output" div
}