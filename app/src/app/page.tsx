"use client";

import dynamic from 'next/dynamic';

// Dynamically import the FlowChart component with SSR disabled
// This ensures it only runs on the client side
const FlowChart = dynamic(() => import('@/components/FlowChart'), {
  ssr: false,
});

export default function Home() {
  return (
    <main>
      <FlowChart />
    </main>
  );
}
