var w = 1280,
    h = 500,
    rx = 200,
    ry = 130,
    m0,
    rotate = 0
    div_height = w/3;

var _div = document.createElement('div');
  _div.id="body";

 <!-- d3.xml("MITresults.svg", "image/svg+xml", function(xml) { -->
    <!-- _div.appendChild(xml.documentElement); -->

   <!-- d3.select("#svg2").attr("width",w/1.7) -->
        <!-- .attr("height",div_height/2.2) -->
        <!-- .attr("background-color","#fff"); -->
        
<!-- }); -->
 
document.getElementById('content').appendChild(_div);

var color = d3.scale.category20();


var colorinternal = d3.scale.linear()
    .domain([0, 1])
    .range(["white", "black"]);
    
function comparator(a, b) {

    if (a.id.charAt(0)=="D" || a.id.charAt(0)=="r" || b.id.charAt(0)=="D" || b.id.charAt(0)=="r") {
  return d3.descending(a.id, b.id);}
  else {
  return d3.descending(parseInt(a.id), parseInt(b.id));
  }
 
}

var cluster = d3.layout.cluster()
    .size([360, ry - 40])
    <!-- .sort(comparator); -->

var diagonal = d3.svg.diagonal.radial()
    .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });



// var svg = d3.select("#body").append("div")
    // .style("width", w + "px")
    // .style("height", div_height + "px");


// var svg=d3.selectAll(".SVG")
var vis = svg
  .append("g")
    .attr('transform', 'translate(1070,150)');

// vis.append("svg:path")
    // .attr("class", "arc")
    // .attr("d", d3.svg.arc().innerRadius(ry - 30).outerRadius(ry).startAngle(0).endAngle(2 * Math.PI))
	// .attr("fill","white")

    

var jsonfiles=[
            "2004-09-05_joint_s1-consensus.json","2004-09-05_joint_s1-consensus.json",
            "2004-09-12_joint_s1-consensus.json",
            "2004-09-19_joint_s1-consensus.json",
            "2004-10-10_joint_s1-consensus.json",
            "2004-10-10_joint_s1-consensus.json",
            "2004-10-10_joint_s1-consensus.json",
            "2004-10-17_joint_s1-consensus.json",
            "2004-10-24_joint_s1-consensus.json",
            "2004-10-31_joint_s1-consensus.json",
            "2004-11-14_joint_s1-consensus.json",
            "2004-11-14_joint_s1-consensus.json",
            "2004-11-28_joint_s1-consensus.json",
            "2004-11-28_joint_s1-consensus.json",
            "2004-12-05_joint_s1-consensus.json",
            "2004-12-12_joint_s1-consensus.json",
            "2004-12-19_joint_s1-consensus.json",
            "2005-01-02_joint_s1-consensus.json",
            "2005-01-02_joint_s1-consensus.json",
            "2005-01-16_joint_s1-consensus.json",
            "2005-01-16_joint_s1-consensus.json",
            "2005-01-30_joint_s1-consensus.json",
            "2005-01-30_joint_s1-consensus.json",
            "2005-03-06_joint_s1-consensus.json",
            "2005-03-06_joint_s1-consensus.json",
            "2005-03-06_joint_s1-consensus.json",
            "2005-03-06_joint_s1-consensus.json",
            "2005-03-06_joint_s1-consensus.json",
            "2005-03-20_joint_s1-consensus.json",
            "2005-03-20_joint_s1-consensus.json",
            "2005-04-03_joint_s1-consensus.json",
            "2005-04-03_joint_s1-consensus.json"];

var time = 0,
    start=0,
    duration=1000,
    hold=1500;
//~ while (i<jsonfiles.length) {
//~ updateconsensus("json/"+jsonfiles[i],start)
//~ i=i+1
//~ start=start+duration+hold
//~ };

// updateconsensus(time,dstart)

datetext=vis.append("text")
        .text("")
        .attr("y",-h/2.5)





function cross(a, b) {
  return a[0] * b[1] - a[1] * b[0];
}

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}