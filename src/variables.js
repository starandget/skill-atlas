export const operations = {add:'加固定值',subtract:'减固定值',addPercent:'增加百分比（基准值）',subtractPercent:'减少百分比（基准值）',multiplyPercent:'乘百分比',setTrue:'设为 true',setFalse:'设为 false'};
export function calculate(variable,nodes){
 let value=variable.base;
 for(const node of nodes){if(node.level<=0)continue;const effect=(node.effects||[])[0];if(!effect||effect.variableId!==variable.id)continue;
 if(variable.type==='boolean'){if(effect.op==='setTrue')value=true;if(effect.op==='setFalse')value=false;continue;}
 const amount=Number(effect.amount),rank=Math.floor(node.level);if(!Number.isFinite(amount))continue;
 value+=amount*rank;
 }return value;
}
export function validateVariables(data){
 const vars=data.variables??[];if(!Array.isArray(vars)||new Set(vars.map(v=>v.id)).size!==vars.length)throw Error();
 for(const v of vars)if(typeof v.id!=='string'||typeof v.name!=='string'||!['number','boolean'].includes(v.type)||(v.type==='number'?!Number.isFinite(v.base):typeof v.base!=='boolean'))throw Error();
 for(const n of data.nodes){if(n.effects!==undefined&&!Array.isArray(n.effects))throw Error();for(const e of (n.effects||[]).slice(0,1)){const v=vars.find(v=>v.id===e.variableId);if(!v||typeof e.id!=='string'||!(e.op in operations)||(v.type==='boolean'?!['setTrue','setFalse'].includes(e.op):!['add','subtract','addPercent','subtractPercent','multiplyPercent'].includes(e.op)||!Number.isFinite(e.amount)))throw Error();}}
 return {...data,variables:vars,nodes:data.nodes.map(n=>{const effects=(n.effects||[]).slice(0,1);return effects.length&&vars.find(v=>v.id===effects[0].variableId)?.type==='number'?{...n,effects:[{...effects[0],op:'add'}]}:effects.length>1?{...n,effects}:n;})};
}

export function validateResources(data){
 const resources=data.resources??[];if(!Array.isArray(resources)||new Set(resources.map(r=>r.id)).size!==resources.length)throw Error();
 for(const r of resources)if(typeof r.id!=='string'||typeof r.name!=='string'||!Number.isFinite(r.amount)||r.amount<0)throw Error();
 for(const n of data.nodes){const cost=n.resourceCost;if(cost!==undefined&&cost!==null){if(typeof cost.resourceId!=='string'||!resources.some(r=>r.id===cost.resourceId)||!Number.isFinite(cost.amount)||cost.amount<=0)throw Error();}}
 return {...data,resources};
}

