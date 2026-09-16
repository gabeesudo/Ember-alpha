import fs from 'node:fs';
import path from 'node:path';
const root=path.dirname(new URL(import.meta.url).pathname.slice(1));
const rows=fs.readFileSync(path.join(root,'import-source.ndjson'),'utf8').trim().split(/\r?\n/).map(JSON.parse);
if(rows.length!==94) throw Error('Incomplete transfer: '+rows.length);
for(const row of rows){
 const target=path.resolve(root,row.path);
 if(!target.startsWith(path.resolve(root)+path.sep)) throw Error('Invalid path');
 if(fs.existsSync(target)) throw Error('Refusing to overwrite '+row.path);
 fs.mkdirSync(path.dirname(target),{recursive:true});
 fs.writeFileSync(target,row.content);
}
fs.mkdirSync(path.join(root,'.ember'),{recursive:true});
fs.renameSync(path.join(root,'import-source.ndjson'),path.join(root,'.ember','original-source.ndjson'));
console.log('Imported '+rows.length+' original source files.');
