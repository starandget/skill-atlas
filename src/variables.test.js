import {test} from 'node:test';
import assert from 'node:assert/strict';
import {calculate,validateVariables} from './variables.js';
const variable={id:'speed',name:'速度',type:'number',base:100};
const effect=(op,amount,level=1)=>({level,effects:[{id:op,variableId:'speed',op,amount}]});
test('percentage changes scale from base per rank and level zero is inactive',()=>{assert.equal(calculate(variable,[effect('addPercent',5,2),effect('subtractPercent',5),effect('add',999,0)]),105);});
test('fixed and multiplicative effects preserve creation order',()=>{assert.equal(calculate(variable,[effect('add',10),effect('multiplyPercent',50,2),effect('subtract',5)]),22.5);assert.equal(calculate(variable,[effect('multiplyPercent',5)]),5);});
test('boolean assignment respects inactive nodes and last active assignment',()=>{const v={...variable,type:'boolean',base:false};assert.equal(calculate(v,[effect('setTrue',0)]),true);assert.equal(calculate(v,[effect('setTrue',0),effect('setFalse',0)]),false);assert.equal(calculate(v,[effect('setTrue',0,0)]),false);});
test('old files migrate and invalid bindings are rejected',()=>{assert.deepEqual(validateVariables({nodes:[],edges:[]}).variables,[]);assert.throws(()=>validateVariables({variables:[variable],nodes:[effect('setTrue',0)]}));assert.throws(()=>validateVariables({variables:[],nodes:[effect('add',5)]}));assert.equal(validateVariables({variables:[variable],nodes:[effect('add',5)]}).variables.length,1);});
