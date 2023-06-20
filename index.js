var zxVals;
var zyVals;
var hasDrawnz = false;
var fzxVals;
var fzyVals;
var hasDrawnFz = false;
var colorValuesIn;
var colorValuesOut;

function inputSubmitHandle(event){
	zxVals = [];
	zyVals = [];
	colorValuesIn = [];
	document.getElementById("z-input").innerHTML = "";
	event.preventDefault();
	if(hasDrawnz) {
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
		colorValuesIn.push(math.sqrt((x**2)+(y**2)));
	}
	document.getElementById("input-eq").innerHTML = "y = "+domain.toString();
	let inputData = [{
		x: zxVals,
		y: zyVals,
		type:"scatter",
		mode: "markers",
		marker: {
			color: colorValuesIn,
			colorscale: 'Viridis'
		}
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
	colorValuesOut = [];
	document.getElementById("z-output").innerHTML = "";
	event.preventDefault();
	if(hasDrawnFz) {
		hasDrawnFz = false;
	}
	let fz_string = document.getElementById("function-string").value;
	if(fz_string === ""){ return; }
	document.getElementById("function-display").innerHTML = "f(z) = "+fz_string;
	const parsed_expr = math.parse(fz_string);
	for(let i = 0; i < zxVals.length; ++i){
		let z = math.complex(zxVals[i],zyVals[i]);
		let scope = {
		  z: z,
		  re: z.re,
		  im: z.im,
		  i: math.complex(0, 1),
		  math: math
		};
		let result = parsed_expr.evaluate(scope);
		fzxVals.push(result.re);
		fzyVals.push(result.im);
		colorValuesOut.push(math.sqrt((result.re**2)+(result.im**2)));
	}
	const outputData = [{
		x: fzxVals,
		y: fzyVals,
		type:"scatter",
		mode: "markers",
		marker: {
			color: colorValuesOut,
			colorscale: 'Viridis'
		}
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
	Plotly.react("z-output",outputData,outputLayout);
	hasDrawnFz = true;
}