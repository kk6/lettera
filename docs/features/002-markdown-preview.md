# Markdown preview

## 状態

Implemented

## 目的

利用者が編集中のMarkdownソースを保ったまま、表示結果をSource editorの横で確認できるようにする。この機能では、一つのReact stateから編集用表示と導出表示を作る方法、およびMarkdownからHTMLを表示するときの安全性を学ぶ。

## 利用者から見える振る舞い

- アプリの起動時はSourceモードで、Source editorだけを表示する。
- 利用者は画面上の最小限の切り替え操作からSourceまたはSplitを選べる。
- Splitモードでは、Source editorとMarkdownプレビューを横に並べる。
- SplitモードでもSource editorから本文を編集でき、確定した変更をプレビューへ反映する。
- SourceとSplitを切り替えても、本文を失わず編集を続けられる。
- Markdownとして解釈できない部分があっても、元の本文を変更しない。

切り替え操作の最終的な外観やツールバーへの統合はこのPhaseでは決めず、Phase 6で扱う。

## 受け入れ条件

1. 初期表示はSourceモードである。
2. SourceからSplitへ切り替えると、同じ本文を参照するSource editorとプレビューを横に並べて表示する。
3. Splitで本文を編集すると、確定した本文の変更後にプレビューも更新する。
4. SplitからSourceへ戻しても、本文と編集を継続できる状態を保持する。
5. 空の本文では空のプレビューを表示し、エラーにしない。
6. 少なくとも見出し、段落、強調、リスト、引用、インラインコード、コードフェンス、リンクを表示用の結果へ変換できる。
7. 対応できない、または不完全なMarkdownが含まれてもアプリを停止させず、元の本文を保持する。
8. Markdownに含まれる`script`、イベントハンドラー、危険なURLなどを、利用者の環境で実行しない。
9. Phase 2ではプレビュー内のリンクからアプリ外へ移動せず、Letteraの編集画面を保持する。

## 対象外

- ファイルを開く、保存する、新規作成する
- Previewだけを表示するモード
- プレビュー上での本文編集
- SourceとPreviewのスクロール同期
- SourceとPreviewの幅変更
- シンタックスハイライト
- ツールバー、メニューバー、キーボードショートカットへの統合
- プレビューの最終的なタイポグラフィと装飾
- Storybookの導入
- RustまたはTauri CommandによるMarkdown変換
- Milkdownの導入とSeamless editorへの移行
- 将来のMilkdown移行だけを目的とした抽象化
- プレビュー内のリンクからの画面遷移
- Markdown画像の読み込みと表示
- raw HTMLの解釈と表示

## 文書状態と導出データ

React stateとして保持するのは、Phase 1から引き継ぐ本文と、現在の表示モードだけである。

- `body`：Source editorが編集するMarkdown本文
- `view mode`：SourceまたはSplit

プレビューは本文から再導出できるため、本文とは別の正本としてstateへ複製しない。モード切り替えは表示領域だけを変え、本文を作り直さない。

## 実装方針

Phase 2では、Phase 1の`textarea`をSource editorとして維持し、`react-markdown`で同じ本文からプレビューを導出する。この段階では編集とプレビューの責務を分け、一つのReact stateから二つの表示を作ることに集中する。

MilkdownはPhase 2へ導入しない。将来Seamless editorへ着手するときに候補として試し、既存Markdownの往復保持、日本語IME、カーソル位置、Undo履歴への影響を確認してから移行するか判断する。移行を前提に、Phase 2で不要な抽象化は追加しない。

`react-markdown`はproduction dependencyになるため、追加前に現在の保守状況と安全な表示方法を公式情報で確認する。この実装方針は開発者本人が2026-07-23に選択した。

## 実装前の決定

開発者本人が2026-07-23に次の方針を選択した。

- CommonMarkに加えて、`remark-gfm`が提供するGFM拡張を扱う。
- raw HTMLは解釈しない。`rehype-raw`と`rehype-sanitize`は導入しない。
- Markdownリンクはリンク文字列を表示するが、`href`を持つ要素を生成せず、画面を移動できないようにする。
- Markdown画像は外部リソースを読み込まず、代替テキストだけを表示する。`src`を持つ要素を生成しない。
- raw HTML、リンク、画像をプレビューへ反映できない場合も、Source editorの本文は変更しない。
- 自動確認にはVitest、React Testing Library、jsdomを使い、Markdown変換後のDOMとSource／Splitの利用者操作を確認する。

外部リンク、Markdown画像、raw HTMLへの対応はPhase 2へ含めない。将来のMarkdownプレビュー拡張として、外部リソースの読み込み、Tauriアプリからの画面遷移、許可するHTML要素と属性の安全性を確認してから仕様化する。

## 学習目標

実装後、次を自分の言葉で説明できること。

- Source editorとプレビューが同じ本文を参照する理由
- 本文とプレビュー結果のどちらが正本か
- React stateで保持する本文・表示モードと、本文を入力として毎回生成するMarkdownプレビューの違い
- Markdownが表示可能な結果へ変換される流れ
- raw HTMLや危険なURLをそのまま表示してはいけない理由
- この段階でRust Commandを必要としない理由

## 検証

### 自動確認

既存の品質チェックを実行する。

```sh
pnpm format
pnpm lint
pnpm build
```

選定した最小限のテスト方法で、少なくとも次を自動確認する。

- 代表的なCommonMarkとGFMを期待するDOMへ変換できる。
- 空の本文と不完全なMarkdownを処理できる。
- raw HTMLから`script`やイベントハンドラーを持つ実行可能なDOMを生成しない。
- Markdownリンクに`href`を生成せず、プレビューから画面を移動できない。
- Markdown画像に`src`を生成せず、外部リソースを読み込まない一方で代替テキストは表示する。
- Source／Splitを切り替えて編集しても、本文とプレビューが同じ本文を参照し、本文を失わない。

### 手動確認

- SourceからSplitへ切り替え、本文とプレビューが横に並ぶことを確認する。
- Splitで日本語とMarkdownを編集し、確定後に表示結果が更新されることを確認する。
- SourceとSplitを繰り返し切り替え、本文が失われないことを確認する。
- 見出し、段落、強調、リスト、引用、インラインコード、コードフェンス、リンクを確認する。
- 空の本文、不完全なMarkdown、raw HTMLを入力しても編集を続けられることを確認する。
- プレビュー内のリンクを操作しても、Letteraの編集画面から移動しないことを確認する。
- Markdown画像を入力しても外部画像を読み込まず、代替テキストを確認できる。

手動確認で問題が見つかった場合は、再現手順を残してから修正する。

## 完了確認

- 対象実装：2026-07-25時点の作業ツリーに、Source／Splitの切り替え、同じ本文stateから導出するMarkdownプレビュー、GFM対応、raw HTML・リンク・画像の安全な表示、VitestとReact Testing Libraryによる自動テストを実装した。実装コミットはまだ作成していない。
- 自動確認：2026-07-25に`mise exec -- pnpm format`、`mise exec -- pnpm lint`、`mise exec -- pnpm build`、`mise exec -- pnpm test`を実行し、すべて成功した。テストは2ファイル、13件が成功した。
- アプリ確認：2026-07-25に現在のソースからデバッグ用macOSアプリをビルドし、Source／Splitの左右表示、Split中の本文更新、Sourceへ戻った後の本文保持、代表的なMarkdown、raw HTML、リンク、画像の表示方針を確認した。
- 開発者手動確認：2026-07-25に、仕様の手動確認項目を実機で確認し、問題がないことを開発者本人が確認した。
- 学習目標：2026-07-25に、本文が正本であること、本文と表示モードだけをReact stateへ保持してプレビューは本文から毎回生成すること、`onChange`からReactの再レンダーとMarkdown表示へ至る流れ、安全でない入力を実行させない理由、Phase 2ではRust Commandが不要な理由を、開発者本人が説明した。
- 未実施項目：なし。
