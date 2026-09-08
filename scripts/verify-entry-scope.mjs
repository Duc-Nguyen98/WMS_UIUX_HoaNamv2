import {execFileSync} from 'node:child_process';import {readFileSync} from 'node:fs';import assert from 'node:assert/strict';
const baseline='21a96b0',old=execFileSync('git',['show',baseline+':components/scanner-auth.tsx'],{encoding:'utf8'}),current=readFileSync('components/scanner-auth.tsx','utf8');
const hook=s=>s.slice(s.indexOf('export function useScannerAccess'),s.indexOf('export function ScannerAuthScreen')).replaceAll('\r\n','\n');assert.equal(hook(current),hook(old));
for(const file of ['lib/scanner-auth.ts','lib/scanner-auth-preview.ts','lib/scanner-policy.ts','lib/scanner-model.ts','components/scanner-mobile-layout.css','components/scanner-mobile-layout.tsx','components/scanner-preview.css']){
 const original=execFileSync('git',['show',baseline+':'+file],{encoding:'utf8'});assert.equal(readFileSync(file,'utf8').replaceAll('\r\n','\n'),original.replaceAll('\r\n','\n'));}
console.log('PASS: access hook, auth/session/mock, policy/domain and global/footer layout unchanged from '+baseline);
