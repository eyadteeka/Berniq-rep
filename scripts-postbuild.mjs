import { readFileSync, writeFileSync } from "node:fs";

// السكربت مبني بصيغة IIFE، فلا حاجة إلى type="module" — إزالته
// تضمن عمل الملف عند فتحه مباشرة من القرص (بروتوكول file://).
const path = "dist/index.html";
const html = readFileSync(path, "utf8").replace(/<script type="module" crossorigin>/g, "<script>");
writeFileSync(path, html);
console.log("postbuild: inline module script converted to classic script");
