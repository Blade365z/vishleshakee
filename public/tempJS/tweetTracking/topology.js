export const render_graph_twt_tracking = () => {

    // create an array with nodes
var nodes = new vis.DataSet([
    { id: 1, label: "Node 1" },
    { id: 2, label: "Node 2" },
    { id: 3, label: "Node 3" },
    { id: 4, label: "Node 4" },
    { id: 5, label: "Node 5" },
    { id: 6, label: "Node 6" },
    { id: 7, label: "Node 7" },
    { id: 8, label: "Node 8" },
    { id: 9, label: "Node 9" },
    { id: 10, label: "Node 10" },
  ]);
  
  // create an array with edges
  var edges = new vis.DataSet([
    
    { from: 1, to: 3 },
    { from: 1, to: 4 },
    { from: 1, to: 5 },
    { from: 1, to: 6 },
    { from: 1, to: 7 },
  ]);
  
  // create a network
  var container = document.getElementById("trackTopology");
  var data = {
    nodes: nodes,
    edges: edges,
  };
  var options = {
    layout: {
      hierarchical: {
        direction: "UD",
      },
    },
  };
  var network = new vis.Network(container, data, options);

    // var scaleOption = {scale:0.2};
    // network_global.moveTo(scaleOption);
    
}

export const render_first =   (tracking_network,raw,response) => {

    console.log("Printing raw");
    console.log(raw);

    console.log("Printing Response");
    console.log(response);

    
    let dates_arr = [];
    let edges_arr = [];
    dates_arr.push( { id: raw.tid,"shape":"circularImage","image":raw.author_profile_image,"label":raw.author});


    response.data.forEach( Element => {
        dates_arr.push({"id":Element[0],"shape":"box","label":Element[0]});
        edges_arr.push({"from":raw.tid,"to":Element[0],"label":"'"+Element[1]+"'"})
    });


    var nodes = new vis.DataSet(dates_arr);


      
      // create an array with edges
      var edges = new vis.DataSet(edges_arr);
      
      // create a network
      var container = document.getElementById("trackTopology");
      var data = {
        nodes: nodes,
        edges: edges,
      };
      var options = {
        layout: {
          hierarchical: {
            direction: "UD",
          },
        },
      };
      tracking_network = new vis.Network(container, data, options);


      tracking_network.on('doubleClick', function(properties) {
        alert(properties.nodes[0]);
        //TODO::Use some alternative! instead of getConnectedNodes
        console.log(tracking_network.getConnectedNodes(properties.nodes[0]));
    });
    
}