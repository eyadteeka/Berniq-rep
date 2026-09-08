import { readFileSync, writeFileSync } from "node:fs";

// السكربت مبني بصيغة IIFE، لذا يمكن تشغيله كسكربت كلاسيكي مع تأجيله
// حتى يتم إنشاء عنصر root عند فتح الملف مباشرة من القرص أو نشره.
const path = "dist/index.html";
const html = readFileSync(path, "utf8").replace(/<script type="module" crossorigin>/g, "<script defer>");
writeFileSync(path, html);
console.log("postbuild: inline module script converted to deferred classic script");
