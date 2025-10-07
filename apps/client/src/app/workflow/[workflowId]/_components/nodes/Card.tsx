'use client'
import { useNodeDialog } from '@/components/context/nodeDialogContext';
import useFlowValidation from '@/hooks/useFlowValidation';
import { cn } from '@/lib/utils';
import { useReactFlow } from '@xyflow/react';
import React from 'react'

type Props = {
  children: React.ReactNode;
  nodeId: string;
  isSelected: boolean;
}

export default function NodeCard({ children, nodeId, isSelected }: Props) {

  const { getNode, setCenter } = useReactFlow();
  const { setCurrentNodeId } = useNodeDialog();
  const { invalidInputs, invalidNodes } = useFlowValidation();
  const hasInvalidInputs = invalidInputs.some(input => input.nodeId === nodeId);
  const hasInvalidNodes = invalidNodes.some(node => node.nodeId === nodeId);

  return (
    <div
      // onClick={() => {
      //   const node = getNode(nodeId);
      //   if (!node) return;
      //   const {position, measured } = node;
      //   if(!position || !measured) return;
      //   const {width, height } = measured;
      //   const x = position.x + width! / 2;
      //   const y = position.y + height! / 2;
      //   if (x === undefined || y === undefined) return;
      //   setCenter(x, y , {
      //     zoom: 1, 
      //     duration: 500
      //   });
      // }}
      onClick={() => {
        console.log("hello", nodeId)
        setCurrentNodeId(nodeId)
      }}
      className={cn(`rounded-lg rounded-b-none cursor-pointer bg-background border-2 border-separate w-[400px] text-xs  flex flex-col `,
        { "border-primary": isSelected, "border-border": !isSelected },
        { "border-destructive border-2": hasInvalidInputs || hasInvalidNodes },
      )}>
      {children}
    </div>
  )
}