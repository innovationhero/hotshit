var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

var width = 960;
var height = 300;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(32,"+(height/2)+")");

var unames = ["may", "mazen"];
function usernames(){

  return names;
}

function update(data) {
  var text = svg.selectAll("text")
      .data(data, function (d) { return d });

  text.attr("class","update")
   .transition()
    .attr("x", function(d,i) { return i*32 });

  text.enter().append("text")
    .attr("class","enter")
    .attr("dy", ".35em")
    .attr("y", -60)
    .attr("x", function(d,i) { return i*32; })
    .style("fill-opacity",1e-6)
    .text(function(d) { return d; })
   .transition()
    .duration(750)
    .attr("y",0)
    .style("fill-opacity",1);

  text.exit()
    .attr("class", "exit")
   .transition()
    .duration(750)
    .attr("y", 60)
    .style("fill-opacity",1e-6)
    .remove();
}

update(alphabet);

setInterval(function () {
  update(shuffle(alphabet)
         .slice(0,Math.floor(Math.random()*26))
         .sort());
},1500);

function shuffle(array) {
  var m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random()*m--);
    t = array[m], array[m] = array[i], array[i] = t;
  }
  return array;
}
