import React from 'react';
const testObj={};
export function testProps(id){
  if(!id) return null;
  testObj['testID'] = id ;
  testObj['accessibilityLabel'] = id ;
  return testObj;
}