# フロントエンドテスト方針

## 位置づけ

この文書は、Letteraのフロントエンドテストを人間とエージェントが作成・レビューするときのsource of truthである。テストは、React UIの利用者から観察できる振る舞いを説明し、変更による回帰を早く発見し、Reactとテスト技法の学習を支えるために書く。

対象はVitest、React Testing Library、jsdomを使うReact／TypeScriptのテストである。Rustの実装・Rustテスト・Tauri Command・ネイティブファイル操作の詳細レビューは対象外とし、必要になった時点で将来の`review-lettera-rust`スキルへ分離する。

現在の構成は`package.json`、`vitest.config.ts`、`src/test/setup.ts`を正本とする。2026-07-23時点ではVitest、React Testing Library、DOM Testing Library、jsdomを導入済みで、テスト環境はjsdom、共通の後処理は`cleanup()`である。`@testing-library/jest-dom`と`@testing-library/user-event`は未導入である。導入前にそれらのAPIやmatcherを使用してはならない。追加が有益な場合も、依存関係は変更せず、必要性とトレードオフを提案して開発者の合意を得る。

## テストの構造と名前

Vitestでは`test`と`it`は機能的に同じで、`it`は`test`のaliasである。Letteraではテスト群を`describe`、個々のテストを`it`に統一する。

テスト名は、対象が行う振る舞いを英語の現在形で書く。たとえば次の組み合わせは、`MarkdownPreview renders a level-one heading`という英文として読める。

```tsx
describe("MarkdownPreview", () => {
  it("renders a level-one heading", () => {
    // ...
  });
});
```

よく使う形は次のとおりである。

- `renders ...`
- `shows ...`
- `returns ...`
- `preserves ...`
- `calls ... when ...`
- `does not ...`

`should render ...`も文法的には正しいが、Letteraでは原則として`should`を省略し、短い現在形にする。`should renders ...`は、助動詞`should`の後に原形ではなく三人称単数形を置いているため誤りである。否定形は`does not generate ...`のように、`does`の後を原形にする。

名前は実装手段ではなく、入力、操作、表示、保持、呼び出しなどの観察可能な結果を述べる。一つのテストは一つの振る舞いに焦点を当てる。同じ振る舞いを説明するために複数のassertionが必要なことはあるが、失敗したときに何が壊れたか一つの名前で説明できないなら分割する。

## 利用者から見える振る舞いを検証する

コンポーネントの内部state、非公開関数、CSS class、子コンポーネントの実装形状ではなく、利用者が見つけて操作できる要素と、その結果を検証する。アクセシブルなrole、name、labelを持つUIは利用者にも支援技術にも理解しやすく、同時に壊れにくいテストを書きやすい。テストしづらさを感じたら、先にUIの意味付けやアクセシビリティに不足がないか確認する。

原則として`screen`を使い、Testing Libraryの推奨順に近いクエリを選ぶ。

1. `getByRole`とaccessible nameを第一候補にする。
2. フォームでは`getByLabelText`、表示内容では必要に応じて`getByText`など、利用者が認識する情報を使う。
3. semantic queryで表現できない場合だけ`getByTestId`を使う。`data-testid`を設計の既定にしない。

クエリの接頭辞は期待するタイミングと存在条件で選ぶ。

- `getBy...`：要素が現在一つ存在することを期待する。見つからない、または複数ならthrowする。
- `queryBy...`：要素が存在しないことを検証する。見つからなければ`null`を返す。
- `findBy...`：要素が非同期に現れることを待つ。Promiseを返すため`await`する。

DOMの`querySelector`などによる直接検査は原則として避ける。ただし、raw HTMLから危険な`script`要素が生成されないことなど、DOM構造そのものが安全要件でsemantic queryでは確認できない場合は許容する。その場合は、なぜ構造検査が要件に対応するかをテスト名とコードから分かるようにする。

## 操作、構成、matcher

ユーザー操作には、リポジトリで利用可能なら`userEvent`を`fireEvent`より優先する。`userEvent`は一つの操作に伴うfocusや複数イベントを利用者の操作に近い形で扱う。ただし現在は`@testing-library/user-event`が未導入なので使用しない。導入までは、必要なイベントをTesting Libraryの現在利用可能なAPIで最小限に表現する。

テストではArrange（準備）、Act（操作）、Assert（確認）を意識する。短く自明なテストへ`// Arrange`などの区切りコメントを強制しない。準備が長い場合は、意味のあるfixtureや小さなsetup helperを検討する。

matcherは意図が読み取れるものを選ぶ。現在利用可能な例では、値に`toBe(...)`、文字列に`toContain(...)`、要素がないことに`toBeNull()`を使う。単にtruthyであることしか示さない`toBeTruthy()`より、期待する値や状態を明示する。jest-dom導入後に利用できる`toBeInTheDocument()`などは、導入前には使用しない。

モックは、外部境界の失敗や制御困難な副作用を切り離すために必要な最小範囲にする。子コンポーネントやライブラリを広くモックして、利用者が実際に受け取る統合された振る舞いを消さない。モックの呼び出し自体が要件でない場合は、画面上の結果を優先して確認する。

## 非同期テスト

ユーザー操作などPromiseを返すAPIは`await`する。後から現れる要素には`await screen.findBy...`を使う。任意のsleepや手動pollingは使わない。特定のassertionが成立するまで待つ必要があり、`findBy`で表現できない場合だけ`waitFor`を使い、callback内で期待するassertionが成功するまで再試行させる。要素が消える要件では`waitForElementToBeRemoved`も検討する。

非同期でない表示に`findBy`を使って問題を隠したり、非同期更新の直後に同期的な`getBy`で競合したりしない。テストが返すPromiseをVitestが待てるよう、`async`と`await`を対応させる。

## Letteraでの短い例

既存の`MarkdownPreview`の見出しテストは、role、level、accessible nameによって利用者から見える結果を確認できる。現在利用可能なmatcherだけで方針に合わせると、次のように書ける。

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MarkdownPreview } from "./MarkdownPreview";

describe("MarkdownPreview", () => {
  it("renders a level-one heading", () => {
    render(<MarkdownPreview body="# Hello" />);

    const heading = screen.getByRole("heading", {
      level: 1,
      name: "Hello",
    });
    expect(heading.tagName).toBe("H1");
  });

  it("does not generate a link element", () => {
    render(<MarkdownPreview body="[Example](https://example.com)" />);

    expect(screen.getByText("Example").textContent).toBe("Example");
    expect(screen.queryByRole("link")).toBeNull();
  });
});
```

最初の`getByRole`自体が見出しの存在を検証し、`tagName`がlevel-oneというDOM要件を明示する。二つ目は、リンク文字列を表示することと移動可能なリンクを生成しないことを、同じ安全上の振る舞いとして確認している。要件や失敗原因を独立させたい場合は二つのテストへ分割する。

## レビュー用チェックリスト

- 関連する機能仕様の利用者から見える振る舞いと受け入れ条件に対応しているか。
- `describe`と`it`を使い、テスト名が英語の現在形で自然な振る舞いになっているか。
- 一つのテストが一つの振る舞いに焦点を当てているか。
- 原則として`screen`とrole/nameなどのsemantic queryを使っているか。
- `getBy`、`queryBy`、`findBy`の選択が存在条件とタイミングに合っているか。
- matcherが`toBeTruthy()`より具体的な意図を示しているか。
- 非同期APIと更新を正しく`await`し、任意の待ち時間に依存していないか。
- 内部state、CSS class、非公開関数などの実装詳細へ依存していないか。
- DOM直接検査、test id、モックに要件上の理由があり、範囲が最小か。
- 正常系だけでなく、関連する境界値と失敗系を扱っているか。
- アクセシビリティ上の意味と、テストが利用するrole/name/labelが一致しているか。
- 現在の`package.json`にないライブラリやmatcherを使用していないか。
- `pnpm format`、`pnpm lint`、`pnpm build`、`pnpm test`が通るか。

## 公式資料

- [Vitest: Writing Tests](https://vitest.dev/guide/learn/writing-tests.html)
- [Vitest: Test API](https://vitest.dev/api/test)
- [Testing Library: Guiding Principles](https://testing-library.com/docs/guiding-principles/)
- [Testing Library: About Queries](https://testing-library.com/docs/queries/about/)
- [Testing Library: Async Methods](https://testing-library.com/docs/dom-testing-library/api-async/)
- [Testing Library: user-event Introduction](https://testing-library.com/docs/user-event/intro/)

外部の記事は補助的な参考資料として扱う。方針を更新するときは、公式ドキュメントとLetteraの現在の依存関係・設定・機能仕様を根拠にする。
