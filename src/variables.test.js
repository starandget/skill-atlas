import {test} from 'node:test';
import assert from 'node:assert/strict';
import {calculate,validateVariables} from './variables.js';
const variable={id:'speed',name:'速度',type:'number',base:100};
const effect=(op,amount,level=1)=>({level,effects:[{id:op,variableId:'speed',op,amount}]});
test('fixed values add once per rank and level zero is inactive',()=>{assert.equal(calculate(variable,[effect('add',5,2),effect('add',5),effect('add',999,0)]),115);});
test('each node contributes only its fixed per-level amount',()=>{assert.equal(calculate(variable,[effect('add',10,2),effect('add',5)]),125);});
test('boolean assignment respects inactive nodes and last active assignment',()=>{const v={...variable,type:'boolean',base:false};assert.equal(calculate(v,[effect('setTrue',0)]),true);assert.equal(calculate(v,[effect('setTrue',0),effect('setFalse',0)]),false);assert.equal(calculate(v,[effect('setTrue',0,0)]),false);});
test('old numeric operators migrate to fixed addition and excess effects are removed',()=>{assert.deepEqual(validateVariables({nodes:[],edges:[]}).variables,[]);assert.throws(()=>validateVariables({variables:[variable],nodes:[effect('setTrue',0)]}));assert.throws(()=>validateVariables({variables:[],nodes:[effect('add',5)]}));const migrated=validateVariables({variables:[variable],nodes:[{level:1,effects:[{id:'percent',variableId:'speed',op:'addPercent',amount:5},{id:'extra',variableId:'speed',op:'subtract',amount:3}]}]});assert.equal(migrated.variables.length,1);assert.equal(migrated.nodes[0].effects.length,1);assert.equal(migrated.nodes[0].effects[0].op,'add');assert.equal(calculate(variable,migrated.nodes),105);});
