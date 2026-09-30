import fs from "fs";
import path from "path";

const filesToPatch = [
  path.join(process.cwd(), ".quartz", "plugins", "graph", "dist", "index.js"),
  path.join(process.cwd(), ".quartz", "plugins", "graph", "dist", "components", "index.js"),
];

for (const filePath of filesToPatch) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    continue;
  }

  let content = fs.readFileSync(filePath, "utf-8");

  // 1. Initial label alpha: keep labels visible like Obsidian
  content = content.replace(/Du\.alpha=[\d.]+,/g, "Du.alpha=0.85,");

  // 2. Zoom label alpha: ensure labels don't disappear when zooming out
  content = content.replace(/F=Math\.max\(\(l-1\)\/3\.75,[\d.]+\)/g, "F=Math.max((l-1)/3.75,0.85)");

  // 3. Node radius: scale nodes so hubs are distinct from leaves
  content = content.replace(/return [\d.]*\+?Math\.sqrt\(l\)(\*[\d.]+)+/g, "return 3.2+Math.sqrt(l)*1.3");
  content = content.replace(/return 2\+Math\.sqrt\(l\)/g, "return 3.2+Math.sqrt(l)*1.3");

  // 4. Node color: bright silver (#cbd5e1) for inactive nodes instead of dim gray
  content = content.replace(
    /ue=h\(Z\.getPropertyValue\("--(gray|darkgray)"\)\.trim\(\),".*?"\)/g,
    'ue=h(Z.getPropertyValue("--darkgray").trim(),"#cbd5e1")'
  );

  // 5. Link color: clear slate gray (#475569) for links instead of invisible lightgray
  content = content.replace(
    /ee=h\(Z\.getPropertyValue\("--(lightgray|gray)"\)\.trim\(\),".*?"\)/g,
    'ee=h(Z.getPropertyValue("--gray").trim(),"#475569")'
  );

  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`Successfully patched: ${filePath}`);
}
