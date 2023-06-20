var zxVals = [];
var zyVals = [];
var hasDrawnz = false;
var fzxVals = [];
var fzyVals = [];
var hasDrawnFz = false;

function inputSubmitHandle(event){
	xVals = [];
	yVals = [];
	event.preventDefault();
	if(hasDrawnz) {
		document.getElementById("z-input").innerHTML = "";
		hasDrawnz = false;
	}
	const domain = document.getElementById("input-domain").value;
	const scope = { x: 0 };
	const parsedEq = math.parse(domain,scope);
	const compiledEq = parsedEq.compile();
	for(let x = -50; x <= 50; ++x){
		scope.x = x;
		const y = compiledEq.evaluate(scope);
		zxVals.push(x);
		zyVals.push(y);
	}
	document.getElementById("input-eq").innerHTML = "y = "+domain.toString();
	let inputData = [{
		x: zxVals,
		y: zyVals,
		type:"scatter",
		mode: "markers"
	}];
	let inputLayout = {
		title: "Complex Domain",
		xaxis: {
			rangemode: 'tozero'
		},
		yaxis: {
			rangemode: 'tozero'
		}
	};
	Plotly.react('z-input',inputData,inputLayout);
	hasDrawnz = true;
}

function fzEntryHandle(event){
	fzxVals = [];
	fzyVals = [];
	event.preventDefault();
	if(hasDrawnFz) {
		document.getElementById("z-output").innerHTML = "";
		hasDrawnFz = false;
	}
	let fz_string = document.getElementById("function-string").value;
	if(fz_string === ""){ return; }
	document.getElementById("function-display").innerHTML = "f(z) = "+fz_string;
	const parsed_expr = math.parse(fz_string);
	for(let i = 0; i < zxVals.length; ++i){
		console.log(typeof zxVals[i]);
		console.log(typeof zyVals[i]);
		let z = math.complex(zxVals[i],zyVals[i]);
		console.log(typeof z);
		console.log(z.toString());
		let scope = {
		  z: z,
		  re: z.re,
		  im: z.im,
		  i: math.complex(0, 1),
		  math: math
		};
		let result = parsed_expr.evaluate(scope);
		console.log(typeof result);
		console.log(result.toString());
		fzxVals.push(result.re);
		fzyVals.push(result.im);
	}
	const outputData = [{
		x: fzxVals,
		y: fzyVals,
		type:"scatter",
		mode: "markers"
	}];
	let outputLayout = {
		title: "Complex Range",
		xaxis: {
			rangemode: 'tozero'
		},
		yaxis: {
			rangemode: 'tozero'
		}
	};
	Plotly.newPlot("z-output",outputData,outputLayout);
	hasDrawnFz = true;
}