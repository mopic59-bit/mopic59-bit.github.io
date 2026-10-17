// Read an original from a source ZIP, retaining its exact bytes.
export async function extractOriginal(buffer,name,expectedSha){
 const bytes=new Uint8Array(buffer),view=new DataView(buffer);let end=-1;
 for(let i=bytes.length-22;i>=Math.max(0,bytes.length-65557);i--)if(view.getUint32(i,true)===0x06054b50){end=i;break}
 if(end<0)throw Error('원본 묶음의 ZIP 형식을 확인할 수 없습니다.');
 let offset=view.getUint32(end+16,true),entry;
 for(let i=0;i<view.getUint16(end+10,true);i++){
  if(view.getUint32(offset,true)!==0x02014b50)throw Error('ZIP 목록이 손상되었습니다.');
  const n=view.getUint16(offset+28,true),extra=view.getUint16(offset+30,true),comment=view.getUint16(offset+32,true);
  const filename=new TextDecoder().decode(bytes.subarray(offset+46,offset+46+n));
  if(filename===name){entry={method:view.getUint16(offset+10,true),compressed:view.getUint32(offset+20,true),size:view.getUint32(offset+24,true),local:view.getUint32(offset+42,true)};break}
  offset+=46+n+extra+comment;
 }
 if(!entry)throw Error('묶음에서 요청한 원본 파일을 찾지 못했습니다.');
 const p=entry.local;if(view.getUint32(p,true)!==0x04034b50)throw Error('원본 파일 헤더가 올바르지 않습니다.');
 const start=p+30+view.getUint16(p+26,true)+view.getUint16(p+28,true),compressed=bytes.slice(start,start+entry.compressed);
 let output;if(entry.method===0)output=compressed;else if(entry.method===8){const stream=new Blob([compressed]).stream().pipeThrough(new DecompressionStream('deflate-raw'));output=new Uint8Array(await new Response(stream).arrayBuffer())}else throw Error('이 압축 형식은 지원하지 않습니다. ZIP 묶음을 내려받아 주세요.');
 if(output.byteLength!==entry.size)throw Error('원본 파일 크기 검증에 실패했습니다.');
 const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',output)),x=>x.toString(16).padStart(2,'0')).join('');
 if(hash!==expectedSha)throw Error('원본 무결성 검증에 실패했습니다. 다운로드를 중단합니다.');
 return output;
}
