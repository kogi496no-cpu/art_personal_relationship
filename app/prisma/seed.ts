import { PrismaClient } from '../src/generated/prisma';
import nodesJson from '../src/data/nodes.json';
import edgesJson from '../src/data/edges.json';

// JSONファイルのデータ構造に合わせて型を定義
type NodeJson = {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    era?: string;
    description?: string;
    masterpieces?: any[];
  };
  width?: number;
  height?: number;
  parentNode?: string;
};

type EdgeJson = {
  id: string;
  source: string;
  target: string;
  label: string;
  type: string;
  data?: any;
};

const nodes: NodeJson[] = nodesJson;
const edges: EdgeJson[] = edgesJson;

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // 0. DataSetの作成
  console.log(`Upserting default DataSet...`);
  const defaultDataSet = await prisma.dataSet.upsert({
    where: { name: 'Default Set' },
    update: {},
    create: {
      name: 'Default Set',
      description: 'Default set for all historical periods',
    },
  });
  console.log(`Finished upserting default DataSet.`);

  // 1. Era（時代）の作成 (Upsertを使用)
  console.log(`Upserting eras...`);
  const eraNames = [...new Set(nodes.map(node => node.data.era).filter((era): era is string => !!era))];
  for (const name of eraNames) {
    await prisma.era.upsert({
      where: { name },
      update: {},
      create: {
        name: name,
        dataSetId: defaultDataSet.id, // ここでDataSetに紐付ける
      },
    });
  }
  console.log(`Finished upserting eras.`);
  const eras = await prisma.era.findMany();
  const eraMap = new Map(eras.map(e => [e.name, e.id]));

  // 2. Node（人物・グループ）の作成
  // Pass 1: 親子関係なしで、まず全てのノードを作成 (Upsertを使用)
  console.log(`Upserting nodes (pass 1/2)...`);
  for (const node of nodes) {
    // 時代がなくてもnodeは作成する（eraIdはnullになる）
    const eraId = node.data.era ? eraMap.get(node.data.era) : null;

    const nodeData = {
      id: node.id,
      type: node.type,
      label: node.data.label,
      description: node.data.description,
      masterpieces: node.data.masterpieces || [],
      position_x: node.position.x,
      position_y: node.position.y,
      width: node.width,
      height: node.height,
      eraId: eraId,
    };

    await prisma.node.upsert({
      where: { id: node.id },
      update: nodeData, // 親情報はここでは更新しない
      create: nodeData,
    });
  }
  console.log(`Finished upserting nodes (pass 1/2).`);

  // Pass 2: 親子関係を設定
  console.log(`Setting parent-child relationships (pass 2/2)...`);
  for (const node of nodes) {
    if (node.parentNode) {
      await prisma.node.update({
        where: { id: node.id },
        data: { parentNodeId: node.parentNode },
      });
    }
  }
  console.log(`Finished setting parent-child relationships (pass 2/2).`);

  // 3. Edge（関係性）の作成 (Upsertを使用)
  console.log(`Upserting edges...`);
  // edgeのeraはsource nodeに合わせる
  const nodeEraMap = new Map(nodes.map(n => [n.id, n.data.era ? eraMap.get(n.data.era) : null]));
  for (const edge of edges) {
    const eraId = nodeEraMap.get(edge.source);

    const edgeData = {
        id: edge.id,
        label: edge.label,
        type: edge.type,
        data: edge.data || {},
        eraId: eraId, // eraIdがnullの場合もある
        sourceNodeId: edge.source,
        targetNodeId: edge.target,
    };

    await prisma.edge.upsert({
        where: { id: edge.id },
        update: edgeData,
        create: edgeData,
    });
  }
  console.log(`Finished upserting edges.`);

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
