<template>
    <div>
      <p>This is the default page for map {{ id }}</p>
      <div ref="chart"></div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import * as d3 from 'd3';
  
  interface Node extends d3.SimulationNodeDatum {
    id: string;
    group: number;
  }
  
  interface Link extends d3.SimulationLinkDatum<Node> {
    source: string;
    target: string;
    value: number;
  }
  
  interface Data {
    nodes: Node[];
    links: Link[];
  }
  
  const route = useRoute();
  const id = route.params.id as string;
  
  definePageMeta({
    layout: 'maps'
  });
  
  const chart = ref<HTMLElement | null>(null);
  
  onMounted(() => {
    const data: Data = {
      nodes: [
        { id: '1', group: 1 },
        { id: '2', group: 1 },
        { id: '3', group: 1 },
      ],
      links: [
        { source: '1', target: '2', value: 1 },
        { source: '2', target: '3', value: 1 },
      ]
    };
  
    const width = 928;
    const height = 600;
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const links = data.links.map(d => ({ ...d }));
    const nodes = data.nodes.map(d => ({ ...d }));
  
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", ticked);
  
    const svg = d3.select(chart.value)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");
  
    const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke-width", d => Math.sqrt(d.value));
  
    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .attr("r", 5)
      .attr("fill", d => color(d.group.toString()))
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
  
    function ticked() {
      link
        .attr("x1", d => (d.source as Node).x!)
        .attr("y1", d => (d.source as Node).y!)
        .attr("x2", d => (d.target as Node).x!)
        .attr("y2", d => (d.target as Node).y!);
  
      node
        .attr("cx", d => d.x!)
        .attr("cy", d => d.y!);
    }
  
    function dragstarted(event: any, d: Node) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
  
    function dragged(event: any, d: Node) {
      d.fx = event.x;
      d.fy = event.y;
    }
  
    function dragended(event: any, d: Node) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  });
  </script>