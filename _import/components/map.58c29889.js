
import * as d3 from "../../_node/d3@7.9.0/index.8946009e.js";

export function phl_map(data, geoids, geoid_property_name="GEOID"){
  const chartWidth = 550;
  const chartHeight = 550;
  const backgroundColor = "#FFFFFF";
  const landColor = "#F2F2F2";
  const landStroke = "#B6B6B6";

  const points  = data.features.map(p => ({
                    geoid: p.properties.GEOID,
                    lat: Number(p.properties.Latitude),
                    long: Number(p.properties.Longitude),
                    hhnum: p.properties.hh_num_estimate,
                    color: p.properties.predom_colors,
                    predomGrp: p.properties.predom_inc_grp,
                    text: p.properties.predom_text
}));


  const projection = d3.geoTransverseMercator()
    .rotate([90 + 30 / 60, -40 - 50 / 60])
    .fitSize([chartWidth,chartHeight],data);

  const pathGenerator = d3.geoPath(projection);

  const svg = d3.create('svg')
                .attr('width', chartWidth)
                .attr('height', chartHeight);

  const div = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0)
    .style("width", "400px")
    .style("position", "absolute")
    .style("padding", "20px")
    .style("background-color", "#f1f1f1")
    .style("border-color", "#4c4c4c")
    .style("color", "#3e3e3e")
    .style("font-size", "20px")
    .style("font-family", "Helvetica Neue")
    .style("border-radius", "0px")
    .style("pointer-events", "none");

  svg.append("rect")
    .attr("width", chartWidth)
    .attr("height", chartHeight)
    .attr('fill', backgroundColor);

  svg.selectAll('path')
    .data(data.features)
    .join('path')
    .attr("class", "tract")
    .attr('d', pathGenerator)
    .style("fill", "#fafafa")
    .style("stroke", "#808080")
    .style("stroke-width", 0.5)
    .filter(d => geoids.includes(d.properties[geoid_property_name]))
  
  svg.append("g")
    .selectAll("myCircles")
    .data(points)
    .enter()
    .append("circle")
      .attr("cx", d => projection([d.long, d.lat])[0])
      .attr("cy", d => projection([d.long, d.lat])[1])
      .attr("r", d  => d.hhnum/500)
      .style("fill", (d) => d.color)
      .style("stroke", "#454545")
      .filter(d => geoids.includes(d.geoid))
    .on("mouseover", function(event, datum) {
      d3.selectAll("myCircles.highlighted").classed("highlighted", false);
      d3.select(this).classed("highlighted", true);
            const [x, y] = d3.pointer(event);
            div.transition().duration(200)
              .style("opacity", .98);
            div.html(`${datum.text}`)
              // .style("left", (x + -175) + "px")
              // .style("top", (y + 165) + "px");
              .style("left", (event.pageX - 125) + "px")
              .style("top", (event.pageY - 125) + "px"); 
          })
    .on("mouseout", function() {
        div.transition().duration(200)
          .style("opacity", 0);
        d3.select(this).classed("highlighted", false);
  });


  return svg.node()
    
 };