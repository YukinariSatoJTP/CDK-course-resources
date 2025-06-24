import { Fn, Stack } from "aws-cdk-lib";


export function getSuffixFromStack(Stack: Stack){
  const shortStackId = Fn.select(2, Fn.split("/", Stack.stackId));
  const suffix = Fn.select(4, Fn.split("-", shortStackId));
  return suffix;
}