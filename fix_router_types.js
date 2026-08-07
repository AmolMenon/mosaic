const fs = require('fs');
const path = require('path');

const routersDir = path.join(__dirname, 'apps/api/src/api/v1/routers');
const mainPath = path.join(__dirname, 'apps/api/src/api/main.ts');

// Fix routers
const routers = fs.readdirSync(routersDir).filter(f => f.endsWith('.ts'));
for (const router of routers) {
  const p = path.join(routersDir, router);
  let content = fs.readFileSync(p, 'utf-8');
  content = content.replace(/export const (\w+) =\s*(express\.)?Router\(\);/, 'export const $1: import("express").Router = $2Router();');
  fs.writeFileSync(p, content);
}

// Fix main.ts
let mainContent = fs.readFileSync(mainPath, 'utf-8');
mainContent = mainContent.replace(/export const app = express\(\);/, 'export const app: import("express").Application = express();');
fs.writeFileSync(mainPath, mainContent);

console.log('Fixed types');
