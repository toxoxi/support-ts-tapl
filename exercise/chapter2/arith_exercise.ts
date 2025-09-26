// deno-lint-ignore-file no-case-declarations

/**
 * TypeScript と同じように、条件演算子の条件式が任意の型の値でも OK とするよう に arith.ts を改変してみてください。
 * 基本的には cond の型を確認するのをやめればよいのですが、typecheck(t.cond) を丸ごと削除すると問題があります。どのような問題が起きるでしょうか。
 *
 * => (1+true) ? true : false のようなプログラムが許容されてしまう
 */

import { parseArith } from "../../article/utils.ts";

type Term =
  | { tag: "true" }
  | { tag: "false" }
  | { tag: "if"; cond: Term; thn: Term; els: Term }
  | { tag: "number"; n: number }
  | { tag: "add"; left: Term; right: Term };

type Type = { tag: "Boolean" } | { tag: "Number" };

function typecheck(t: Term): Type {
  switch (t.tag) {
    case "true":
      return { tag: "Boolean" };
    case "false":
      return { tag: "Boolean" };
    case "if":
      typecheck(t.cond);
      const thnTy = typecheck(t.thn);
      const elsTy = typecheck(t.els);
      if (thnTy.tag !== elsTy.tag) {
        throw "then and else have different types";
      }
      return thnTy;
    case "number":
      return { tag: "Number" };
    case "add":
      const leftTy = typecheck(t.left);
      if (leftTy.tag !== "Number") throw "number expected";
      const rightTy = typecheck(t.right);
      if (rightTy.tag !== "Number") throw "number expected";
      return { tag: "Number" };
  }
}

console.log(typecheck(parseArith("(1 + true) ? false : true")));
