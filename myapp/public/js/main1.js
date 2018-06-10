

var numDrawingPoints =10 ;
var drawingPoints;
var points;
var color;
var stroke;
var pane;
function draw(panel,data1,color1,stroke1){
	pane=panel;
	color=color1;
	stroke=stroke1;
	
	
	drawingPoints = [];
	points = [];



		var array=new Array();
		array[0]={x:data1.source.x,y:data1.source.y};
		array[1]={x:(data1.source.x+data1.target.x)/2,y:data1.source.y};
		array[2]={x:(data1.source.x+data1.target.x)/2,y:data1.target.y};
		array[3]={x:data1.target.x,y:data1.target.y};
		start(array);
		drawCurveFromPoints(drawingPoints);



}


	function start(array) {

		if ( array ) {
			
			for ( var i = 0; i < array.length; i++ ) {
					points.push(array[i]);
			}
		} 
		calculateDrawingPoints();
	}

	function calculateDrawingPoints(){
		var interval = 1 / numDrawingPoints;
		var t = interval;

		drawingPoints.push(calculateNewPoint(0));

		for( var i = 0; i < numDrawingPoints; i++ ) {
			drawingPoints.push(calculateNewPoint(t));
			t += interval;
		}

	}

	function calculateNewPoint(t) {
		// Coordinates calculated using the general formula are relative to 
		// origin at bottom left.
		var x = 0;
		var y = 0;
		var n = points.length - 1;
		for ( var i = 0; i <= n; i++ ) {
			var bin = C(n, i) * Math.pow((1-t), (n-i)) * Math.pow(t, i);
			x += bin * points[i].x;
			y += bin * points[i].y;
		}
		return ({x:x, y:y});
	}


/*
* Class : Graph(id of the svg container)
* -------------------------------------------
* Represents a graph and exports methods for 
* drawing lines and curves.
*/


function drawLine(point1, point2) {
	// var stroke = 2;
	// var color ='#000000';
		// document.getElementById("graph").insertAdjacentHTML('beforeend', "<line x1="${point1.x}" y1="${point1.y}" x2="${point2.x}" y2="${point2.y}" stroke="${color}" stroke-width="${stroke}" id="line"/>");
		// <line x1="${point1.x}" y1="${point1.y}" x2="${point2.x}" y2="${point2.y}" stroke="${color}" stroke-width="${stroke}" id="line"/>
		// console.log(gParallel);
		pane.append("line")
			.attr("x1",point1.x)
			.attr("y1",point1.y)
			.attr("x2",point2.x)
			.attr("y2",point2.y)
			.attr("stroke",color)
			.attr("stroke-width",stroke)
			.attr("border-color","white");
		
	}	

function drawCurveFromPoints(points) {
		for ( var i = 0; i < points.length; i++ ) {
			if ( i+1 < points.length )
				drawLine(points[i], points[i+1]);
			// drawLine();
		}
	}



// Utilty functions

// function drawHandles(graph, curve) {
	// if (curve.points.length === 1) {
		// curve.points[0].mark();
		// return;
	// }
	// for (var i = 1; i < curve.points.length; i++) {
		// if (i == 1 || i == curve.points.length-1) {
			// curve.points[i-1].mark();
			// curve.points[i].mark();
		// }
		// graph.drawLine(curve.points[i-1], curve.points[i], 1, (i==1||i==curve.points.length-1)?'#00FF00':'#AA4444');
	// }
	// if (curve.points.length === 1) {
		// curve.points[0].mark();
		// return;
	// }
// }

function C(n, k) {
	if ( (typeof n !== 'number') || (typeof k !== 'number') ) {
		return false;
	}
	var coeff = 1;
	for ( var x = n-k+1; x <= n; x++ ) coeff *= x;
	for ( x = 1; x <= k; x++ ) coeff /= x;
	return coeff;
}
