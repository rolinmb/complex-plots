var z_in;
var z_out;

function inputSubmitHandle(event){
	event.preventDefault();
	const x = document.getElementById("x-input").value;
	const y = document.getElementById("y-input").value;
	let X = parseFloat(x) || 0;
	let Y = parseFloat(y) || 0;
	z_in = math.complex(X,Y);
	console.log("z = "+z_in.toString());
	document.getElementById("input-display").innerHTML = "INPUT: z = "+z_in.toString();
	// update "z-input" div
}

function fzEntryHandle(event){
	event.preventDefault();
	let fz_string = document.getElementById("function-string").value;
	if(fz_string === ""){ return; }
	document.getElementById("function-display").innerHTML = "* f(z) = "+fz_string;
	const parsed_expr = math.parse(fz_string);
	if(typeof z_in === 'undefined'){
		z_in = math.complex(0,0);
	}
	const z = math.complex(z_in.re,z_in.im);
	const scope = { z };
	const result = parsed_expr.evaluate(scope);
	z_out = math.complex(result.re,result.im);
	console.log("f("+z_in.toString()+") = "+z_out.toString());
	let new_text = "* f("+z_in.toString()+") = "+z_out.toString();
	document.getElementById("function-eval").innerHTML = new_text;
	// update "z-output" div
}