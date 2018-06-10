var firstDrawSun=true;
function drawSunburst(sunburstG,root){
	// d3.select(".sunburstG").remove();
	// sunburstG=svg.append("g")
				// .attr("class","sunburstG")
				// .attr("transform","translate("+700+","+140+")");
	var width = 960,
    height = 700,
    radius = 130;

var x = d3.scale.linear()
    .range([0, 2 * Math.PI]);

var y = d3.scale.sqrt()
    .range([0, 130]);

var color = d3.scale.category20c();

var partition = d3.layout.partition()
    .sort(null)
    .value(function(d) { return parseFloat(d.size); });

var arc = d3.svg.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

// Keep track of the node that is currently being displayed as the root.
var node;


  node = root;
  if(firstDrawSun){
  var path = sunburstG.datum(root).selectAll("path")
      .data(partition.nodes)
    .enter().append("path")
      .attr("d", arc)
      .style("fill", 
		// function(d) { return color((d.children ? d : d.parent).name); 
		function(d){
			if(d.children){
				if(d.name=="gdp1")
					// return d3.rgb(252,141,98);
					return textcolorClass[9];
				else if(d.name=="gdp2")
					// return d3.rgb(102,194,165);
					return textcolorClass[10];
				else if(d.name=="gdp3")
					// return d3.rgb(141,160,203);
					return textcolorClass[11];
				else return "white";
			}else{
				// if(d.parent.name=="gdp1")
					// return d3.rgb(252,141,98);
				// else if(d.parent.name=="gdp2")
					// return d3.rgb(102,194,165);
				// else if(d.parent.name=="gdp3")
					// return d3.rgb(141,160,203);
				// else return "white";
				// return "white";
				if(d.name=="Gdp0102") return textcolorClass[0];
				else if(d.name=="Gdp0104") return textcolorClass[1];
				else if(d.name=="Gdp0105") return textcolorClass[2];
				else if(d.name=="Gdp0107") return textcolorClass[3];
				else if(d.name=="Gdp0108") return textcolorClass[4];
				else if(d.name=="Gdp0109") return textcolorClass[5];
				else if(d.name=="Gdp0110") return textcolorClass[6];
				else if(d.name=="Gdp0111") return textcolorClass[7];
				else if(d.name=="Gdp0112") return textcolorClass[8];
			// else if(d.name=="gdp1") name="第一产业";
			// else if(d.name=="gdp2") name="第二产业";
			// else if(d.name=="gdp3") name="第三产业";
			// else name="全部GDP";
			}
			
	   })
	   
	  .attr("stroke-width",1)
	  .attr("stroke","white")
      // .on("click", click)
	  .on("mouseover",function(d,i){
		 var name;
		if(d.name=="Gdp0102") name="农业";
		else if(d.name=="Gdp0104") name="工业";
		else if(d.name=="Gdp0105") name="建筑业";
		else if(d.name=="Gdp0107") name="交通运输、仓储和邮政业";  
		else if(d.name=="Gdp0108") name="批发和零售业";  
		else if(d.name=="Gdp0109") name="住宿和餐饮业";  
		else if(d.name=="Gdp0110") name="金融业";  
		else if(d.name=="Gdp0111") name="房地产业";  
		else if(d.name=="Gdp0112") name="其他服务业";  
		else if(d.name=="gdp1") name="第一产业";
		else if(d.name=="gdp2") name="第二产业";
		else if(d.name=="gdp3") name="第三产业";
		else name="全部GDP";
		if(name!="全部GDP"){
			tooltip.html(name+":"+parseFloat(d.value).toFixed(2)+"元") 
								.style("left",(d3.event.pageX)+"px")  
								.style("top",(d3.event.pageY+40)+"px")  
								.style("opacity",1.0)
								.style("color",textcolorClass[9]);
		}
	  })
	  .on("mouseout",function(){
		  tooltip.style("opacity",0);
	  })
      .each(stash);
	}
	else{
		var value =function(d) { return d.size; };
		d3.select(".sunburstG").datum(root).selectAll("path")
		.data(partition.value(value).nodes)
      .attr("d", arc)
      .style("fill", 
		// function(d) { return color((d.children ? d : d.parent).name); 
		function(d){
			if(d.children){
				if(d.name=="gdp1")
					// return d3.rgb(252,141,98);
					return textcolorClass[9];
				else if(d.name=="gdp2")
					// return d3.rgb(102,194,165);
					return textcolorClass[10];
				else if(d.name=="gdp3")
					// return d3.rgb(141,160,203);
					return textcolorClass[11];
				else return "white";
			}else{
				if(d.name=="Gdp0102") return textcolorClass[0];
				else if(d.name=="Gdp0104") return textcolorClass[1];
				else if(d.name=="Gdp0105") return textcolorClass[2];
				else if(d.name=="Gdp0107") return textcolorClass[3];
				else if(d.name=="Gdp0108") return textcolorClass[4];
				else if(d.name=="Gdp0109") return textcolorClass[5];
				else if(d.name=="Gdp0110") return textcolorClass[6];
				else if(d.name=="Gdp0111") return textcolorClass[7];
				else if(d.name=="Gdp0112") return textcolorClass[8];
			}
			
	   })
	   
	  .attr("stroke-width",1)
	  .attr("stroke","white")
      
	}
  
   

  function click(d) {
    node = d;
    path.transition()
      .duration(1000)
      .attrTween("d", arcTweenZoom(d));
  }


d3.select(self.frameElement).style("height", height + "px");

// Setup for switching data: stash the old values for transition.
function stash(d) {
  d.x0 = d.x;
  d.dx0 = d.dx;
}

// When switching data: interpolate the arcs in data space.
function arcTweenData(a, i) {
  var oi = d3.interpolate({x: a.x0, dx: a.dx0}, a);
  function tween(t) {
    var b = oi(t);
    a.x0 = b.x;
    a.dx0 = b.dx;
    return arc(b);
  }
  if (i == 0) {
   // If we are on the first arc, adjust the x domain to match the root node
   // at the current zoom level. (We only need to do this once.)
    var xd = d3.interpolate(x.domain(), [node.x, node.x + node.dx]);
    return function(t) {
      x.domain(xd(t));
      return tween(t);
    };
  } else {
    return tween;
  }
}

function arcTweenZoom(d) {
  var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
      yd = d3.interpolate(y.domain(), [d.y, 1]),
      yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
  return function(d, i) {
    return i
        ? function(t) { return arc(d); }
        : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
  };
}
firstDrawSun=false;
}