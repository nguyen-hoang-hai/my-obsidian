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

  // 6. Smart link resolution: resolve slug variants (folder/, index, relative paths)
  const s1 = "Ju=new Set(uu.keys());";
  const e1 = "eu.push({source:l,target:C})";
  const p1 = content.indexOf(s1);
  const p2 = content.indexOf(e1, p1);
  if (p1 !== -1 && p2 !== -1) {
    const xuCode =
      'Ju=new Set(uu.keys());function __xu(t){if(!t)return null;var c1=t.endsWith("/")?t:t+"/",c2=t.endsWith("/")?t.slice(0,-1):t;if(Ju.has(c1))return c1;if(Ju.has(c2))return c2;if(Ju.has(c2+"/index"))return c2+"/index";for(var k of Ju){var kC=k.endsWith("/")?k.slice(0,-1):k;if(kC===c2||kC.endsWith("/"+c2)||kC===c2+"/index"||kC.endsWith("/"+c2+"/index"))return k;}return null;}uu.forEach(function(i,l){for(var F=i.links||[],v=0;v<F.length;v++){var C=__xu(cu(F[v]));C&&eu.push({source:l,target:C})';
    content = content.substring(0, p1) + xuCode + content.substring(p2 + e1.length);
  }

  // 7. Auto-hierarchy tree connection: guarantees 100% interconnected graph view regardless of content links
  const s2 = "hu.indexOf(J)===-1&&hu.push(J),eu.push({source:l,target:J})}}});";
  const e2 = "var tu=new Set;";
  const q1 = content.indexOf(s2);
  const q2 = content.indexOf(e2, q1);
  if (q1 !== -1 && q2 !== -1) {
    const autoCode =
      'hu.indexOf(J)===-1&&hu.push(J),eu.push({source:l,target:J})}}});var __autoHierarchyDone=!0;Ju.forEach(function(k){if(k==="/"||k.startsWith("tags/"))return;var cl=k.endsWith("/")?k.slice(0,-1):k,ps=cl.split("/"),pr="/";if(ps.length>1){var pp=ps.slice(0,-1).join("/")+"/";if(Ju.has(pp))pr=pp;}if(pr&&Ju.has(pr)&&pr!==k){var al=!1;for(var li=0;li<eu.length;li++){if((eu[li].source===pr&&eu[li].target===k)||(eu[li].source===k&&eu[li].target===pr)){al=!0;break;}}!al&&eu.push({source:pr,target:k});}});';
    content = content.substring(0, q1) + autoCode + content.substring(q2);
  }

  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`Successfully patched: ${filePath}`);
}

// 8. Patch crawl-links so that wikilinks to folder notes (e.g. [[Circuit Breaker & Cable]]) resolve to their proper nested path
const crawlLinksDist = path.join(
  process.cwd(),
  "node_modules",
  "@quartz-community",
  "crawl-links",
  "dist",
  "index.js"
);
if (fs.existsSync(crawlLinksDist)) {
  let clContent = fs.readFileSync(crawlLinksDist, "utf-8");
  clContent = clContent.replace(
    /const parts = slug2\.split\("\/"\);[\s\S]*?return targetCanonical === fileName;[\s\S]*?if \(matchingFileNames\.length === 1\) \{[\s\S]*?const matchedSlug = matchingFileNames\[0\];/,
    `const parts = slug2.split("/");
        const fileName = parts.at(-1) === "index" && parts.length > 1 ? parts.at(-2) : parts.at(-1);
        return targetCanonical === fileName;
      });
      if (matchingFileNames.length >= 1) {
        const matchedSlug = matchingFileNames.find((s) => s.includes("/")) ?? matchingFileNames[0];`
  );
  fs.writeFileSync(crawlLinksDist, clContent, "utf-8");
  console.log(`Successfully patched: ${crawlLinksDist}`);
}

// 9. Patch @quartz-community/utils transformLink so folder notes are correctly resolved
const utilsDist = path.join(
  process.cwd(),
  "node_modules",
  "@quartz-community",
  "utils",
  "dist",
  "index.js"
);
if (fs.existsSync(utilsDist)) {
  let utContent = fs.readFileSync(utilsDist, "utf-8");
  utContent = utContent.replace(
    /const parts = slug\.split\("\/"\);[\s\S]*?return targetCanonical === fileName;[\s\S]*?if \(matchingFileNames\.length === 1\) \{[\s\S]*?const matchedSlug = matchingFileNames\[0\];/,
    `const parts = slug.split("/");
        const fileName = parts.at(-1) === "index" && parts.length > 1 ? parts.at(-2) : parts.at(-1);
        return targetCanonical === fileName;
      });
      if (matchingFileNames.length >= 1) {
        const matchedSlug = matchingFileNames.find((s) => s.includes("/")) ?? matchingFileNames[0];`
  );
  fs.writeFileSync(utilsDist, utContent, "utf-8");
  console.log(`Successfully patched: ${utilsDist}`);
}
