class cNum {
	constructor(x,y){
		this.real = x;
		this.imag = y;
	}
	toString(){
		let parity = parseFloat(this.imag) >= 0 ? "+" : "";
		return this.real+parity+this.imag+"i";
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
	if(z.real > 0){
		return Math.atan(z.imag/z.real);
	}else if(z.real < 0 && z.imag >= 0){
		return Math.arctan(z.imag/z.real)+Math.PI;
	}else if(z.real < 0 && z.imag < 0){
		return Math.arctan(z.imag/z.real)-Math.PI;
	}else if(z.real == 0 && z.imag > 0){
		return Math.PI/2;
	}else if(z.real == 0 && z.imag < 0){
		return -0.5*Math.PI;
	}else if(z.real == 0 && z.imag == 0){
		return Nan;
	}
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
	return new cNum(ex*Math.cos(argu),ex*Math.sin(argu));
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
	console.log("z = "+z_in.toString());
	sign = parseFloat(y) >= 0 ? "+" : "";
	document.getElementById("input-display").innerHTML = "INPUT: z = "+x+sign+y+"i";
	// update "z-input" div
}

function fzEntryHandle(event){
	event.preventDefault();
	let fz_string = document.getElementById("function-string").value;
	if(fz_string === ""){ return; }
	document.getElementById("function-display").innerHTML = "* f(z) = "+fz_string;
	const parsed_expr = math.parse(fz_string);
	if(typeof z_in === 'undefined'){
		z_in = new cNum(0,0);
	}
	const z = math.complex(z_in.real,z_in.imag);
	const scope = { z };
	const result = parsed_expr.evaluate(scope);
	z_out = new cNum(result.re,result.im);
	console.log("f("+z_in.toString()+") = "+z_out.toString());
	fsign = z_out.imag >= 0 ? "+" : "";
	let new_text = "* f("+z_in.toString()+") = "+z_out.toString();
	document.getElementById("function-eval").innerHTML = new_text;
	// update "z-output" div
}