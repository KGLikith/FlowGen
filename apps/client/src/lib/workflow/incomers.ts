import { AppNode } from "@/schema/appNode";
import { Edge } from "@xyflow/react";

function getIncomers (node: AppNode, nodes: AppNode[], edges: Edge[]) {
    if(!node.id) return [];


    const incomerIds = new Set();

    edges.forEach((edge) => {
        if(edge.target === node.id){
            incomerIds.add(edge.source);
        }
    })
    return nodes.filter((nd) => incomerIds.has(nd.id));
}