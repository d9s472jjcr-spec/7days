const choice = (value, label, fullName) => ({ value, label, fullName });

export const outfitTypeOptions = [
  { value: "", label: "選択してください" },
  { value: "stage", label: "ステージ衣装" },
  { value: "casual", label: "私服・その他衣装" },
];

export const outfitStructureOptions = [
  { value: "", label: "選択してください" },
  { value: "separate", label: "上下分離" },
  { value: "onepiece", label: "上下一体" },
];

export const outfitDecorationOptions = [
  "無し",
  "内容は容姿の印象に合わせておまかせ、装飾量は控えめ",
  "内容は容姿の印象に合わせておまかせ、装飾量は華美",
];

export const outfitCatalogs = {
  stage_separate: {
    tops: [
      choice("stage_top_01", "ショートジャケット", "長袖・スタンドカラー・ウエスト丈 ショートジャケット"),
      choice("stage_top_02", "パフ袖ボレロ", "パフ半袖・ラウンドカラー・クロップド丈 ボレロ"),
      choice("stage_top_03", "ステージベスト", "ノースリーブ・Vネック・ウエスト丈 ステージベスト"),
      choice("stage_top_04", "ビスチェトップ", "パフ半袖・スクエアネック・クロップド丈 ビスチェトップ"),
      choice("stage_top_05", "ペプラムトップ", "キャップスリーブ・スタンドカラー・ヒップ上丈 ペプラムトップ"),
      choice("stage_top_06", "ケープトップ", "ケープスリーブ・ハイネック・ウエスト丈 ケープトップ"),
      choice("stage_top_07", "アシメトップ", "ワンショルダー・アシンメトリーネック・クロップド丈 アシンメトリートップ"),
      choice("stage_top_08", "ロングベスト", "長袖・シャツカラー・太もも丈 ロングベストトップ"),
    ],
    bottoms: [
      choice("stage_bottom_01", "フレアミニスカート", "ハイウエスト・ミニ丈 フレアスカート"),
      choice("stage_bottom_02", "プリーツミニスカート", "ハイウエスト・ミニ丈 プリーツスカート"),
      choice("stage_bottom_03", "パネルミニスカート", "ハイウエスト・ミニ丈 パネルスカート"),
      choice("stage_bottom_04", "バルーンショーツ", "ハイウエスト・ショート丈 バルーンショーツ"),
      choice("stage_bottom_05", "キュロット", "ハイウエスト・ショート丈 キュロット"),
      choice("stage_bottom_06", "フレアショーツ", "ハイウエスト・ショート丈 フレアショーツ"),
      choice("stage_bottom_07", "ラップミニスカート", "ハイウエスト・ミニ丈 ラップスカート"),
      choice("stage_bottom_08", "ティアードミニスカート", "ジャストウエスト・ミニ丈 ティアードスカート"),
    ],
  },
  stage_onepiece: {
    outfits: [
      choice("stage_one_01", "フィット＆フレアドレス", "半袖・スクエアネック・ハイウエスト・ウエスト丈上身頃・ミニ丈 フィット＆フレアドレス"),
      choice("stage_one_02", "プリーツドレス", "パフ半袖・シャツカラー・ジャストウエスト・ウエスト丈上身頃・ミニ丈 プリーツドレス"),
      choice("stage_one_03", "ティアードドレス", "ノースリーブ・ラウンドネック・ハイウエスト・ウエスト丈上身頃・ミニ丈 ティアードドレス"),
      choice("stage_one_04", "クラシカルドレス", "パフ半袖・スタンドカラー・ジャストウエスト・ウエスト丈上身頃・ミニ丈 クラシカルドレス"),
      choice("stage_one_05", "ケープドレス", "ケープスリーブ・ハイネック・ハイウエスト・ウエスト丈上身頃・ミニ丈 ケープドレス"),
      choice("stage_one_06", "アシメドレス", "ワンショルダー・アシンメトリーネック・ハイウエスト・クロップド丈上身頃・ミニ丈 アシンメトリードレス"),
      choice("stage_one_07", "ショートジャンプスーツ", "半袖・開襟・ハイウエスト・ウエスト丈上身頃・ショート丈 ジャンプスーツ"),
      choice("stage_one_08", "ロングジャンプスーツ", "ノースリーブ・Vネック・ハイウエスト・ウエスト丈上身頃・フルレングス ジャンプスーツ"),
    ],
  },
  casual_separate: {
    tops: [
      choice("casual_top_01", "Tシャツ", "半袖・クルーネック・ヒップ上丈 ベーシックTシャツ"),
      choice("casual_top_02", "ブラウス", "長袖・シャツカラー・ヒップ上丈 ブラウス"),
      choice("casual_top_03", "クルーネックニット", "長袖・クルーネック・ウエスト丈 ニットトップ"),
      choice("casual_top_04", "シャツ", "長袖・レギュラーカラー・ヒップ丈 ベーシックシャツ"),
      choice("casual_top_05", "カーディガン", "長袖・Vネック・ウエスト丈 カーディガン"),
      choice("casual_top_06", "テーラードジャケット", "長袖・テーラードカラー・ヒップ丈 ジャケット"),
      choice("casual_top_07", "パーカー", "長袖・フード付き・ヒップ丈 パーカー"),
      choice("casual_top_08", "クロップドトップ", "半袖・スクエアネック・クロップド丈 コンパクトトップ"),
    ],
    bottoms: [
      choice("casual_bottom_01", "ストレートデニムパンツ", "ジャストウエスト・フルレングス ストレートデニム"),
      choice("casual_bottom_02", "ミディフレアスカート", "ハイウエスト・ミディ丈 フレアスカート"),
      choice("casual_bottom_03", "ナロースカート", "ハイウエスト・ミディ丈 ナロースカート"),
      choice("casual_bottom_04", "スラックス", "ジャストウエスト・フルレングス ストレートスラックス"),
      choice("casual_bottom_05", "ミディプリーツスカート", "ハイウエスト・ミディ丈 プリーツスカート"),
      choice("casual_bottom_06", "ワイドパンツ", "ハイウエスト・フルレングス ワイドパンツ"),
      choice("casual_bottom_07", "ジョガーパンツ", "ジャストウエスト・フルレングス ジョガーパンツ"),
      choice("casual_bottom_08", "セミフレアパンツ", "ハイウエスト・フルレングス セミフレアパンツ"),
    ],
  },
  casual_onepiece: {
    outfits: [
      choice("casual_one_01", "ミニワンピース", "半袖・ラウンドネック・ジャストウエスト・ウエスト丈上身頃・ミニ丈 フレアワンピース"),
      choice("casual_one_02", "ミディワンピース", "五分袖・Vネック・ジャストウエスト・ウエスト丈上身頃・ミディ丈 フレアワンピース"),
      choice("casual_one_03", "ロングワンピース", "長袖・ラウンドネック・ハイウエスト・ウエスト丈上身頃・ロング丈 ワンピース"),
      choice("casual_one_04", "シャツワンピース", "長袖・シャツカラー・ジャストウエスト・ウエスト丈上身頃・ミディ丈 シャツワンピース"),
      choice("casual_one_05", "ニットワンピース", "長袖・ハイネック・ジャストウエスト・ウエスト丈上身頃・ミディ丈 ニットワンピース"),
      choice("casual_one_06", "サロペットワンピ", "ノースリーブ・スクエアネック・ハイウエスト・クロップド丈上身頃・ミディ丈 サロペットワンピース"),
      choice("casual_one_07", "ショートオールインワン", "半袖・開襟・ハイウエスト・ウエスト丈上身頃・ショート丈 オールインワン"),
      choice("casual_one_08", "ロングオールインワン", "ノースリーブ・Vネック・ハイウエスト・ウエスト丈上身頃・フルレングス オールインワン"),
    ],
  },
};

export function outfitCatalogFor(type, structure) {
  return outfitCatalogs[`${type}_${structure}`] || null;
}

export function outfitLabel(options, value) {
  return options.find((option) => option.value === value)?.label || "";
}

export function outfitChoice(options, value) {
  return options?.find((option) => option.value === value) || null;
}

export function firstOutfitSelection(type, structure) {
  const catalog = outfitCatalogFor(type, structure);
  if (!catalog) return { topDesign: "", bottomDesign: "", outfitDesign: "" };
  if (structure === "separate") {
    return { topDesign: catalog.tops[0].value, bottomDesign: catalog.bottoms[0].value, outfitDesign: "" };
  }
  return { topDesign: "", bottomDesign: "", outfitDesign: catalog.outfits[0].value };
}
