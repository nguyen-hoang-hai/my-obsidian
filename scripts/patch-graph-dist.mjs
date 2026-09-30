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

  // 6. Smart link resolution: resolve slug variants (folder/index, relative paths)
  if (!content.includes("function __xu(t)")) {
    content = content.replace(
      "Ju=new Set(uu.keys());uu.forEach(function(i,l){for(var F=i.links||[],v=0;v<F.length;v++){var C=cu(F[v]);Ju.has(C)&&eu.push({source:l,target:C})}",
      'Ju=new Set(uu.keys());function __xu(t){if(Ju.has(t))return t;if(Ju.has(t+"/index"))return t+"/index";for(var k of Ju){if(k===t||k===t+"/index"||k.endsWith("/"+t)||k.endsWith("/"+t+"/index"))return k;}return null;}uu.forEach(function(i,l){for(var F=i.links||[],v=0;v<F.length;v++){var C=__xu(cu(F[v]));C&&eu.push({source:l,target:C})}'
    );
  }

  // 7. Auto-hierarchy tree connection: guarantees 100% interconnected graph view regardless of content links
  if (!content.includes("__autoHierarchyDone")) {
    const afterLoop = "hu.indexOf(J)===-1&&hu.push(J),eu.push({source:l,target:J})}}});";
    const hierarchyCode =
      'hu.indexOf(J)===-1&&hu.push(J),eu.push({source:l,target:J})}}});var __autoHierarchyDone=!0;Ju.forEach(function(k){if(k==="index"||k.startsWith("tags/"))return;var p=k.split("/"),pr="index";if(p.length>2){var fp=p.slice(0,-1).join("/")+"/index";if(Ju.has(fp))pr=fp}else if(p.length===2&&p[1]!=="index"){var fp2=p[0]+"/index";if(Ju.has(fp2))pr=fp2}if(pr&&Ju.has(pr)&&pr!==k){var al=!1;for(var li=0;li<eu.length;li++){if((eu[li].source===pr&&eu[li].target===k)||(eu[li].source===k&&eu[li].target===pr)){al=!0;break}}!al&&eu.push({source:pr,target:k})}});';
    content = content.replace(afterLoop, hierarchyCode);
  }

  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`Successfully patched: ${filePath}`);
}
