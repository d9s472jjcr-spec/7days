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

export const outerwearOptions = [
  choice("none", "無し", ""),
  choice("bolero", "ボレロ", "クロップド丈のボレロ"),
  choice("cropped_jacket", "クロップドジャケット", "ウエスト上丈のクロップドジャケット"),
  choice("short_jacket", "ショートジャケット", "ウエスト丈のショートジャケット"),
  choice("tailored_jacket", "テーラードジャケット", "テーラードカラーのジャケット"),
  choice("short_coat", "ショートコート", "ヒップ上丈のショートコート"),
  choice("long_coat", "ロングコート", "太もも丈のロングコート"),
  choice("stage_vest", "ステージベスト", "ウエスト丈のステージベスト"),
  choice("long_vest", "ロングベスト", "太もも丈のロングベスト"),
  choice("cardigan", "カーディガン", "ウエスト丈のカーディガン"),
  choice("cape", "ケープ", "肩を覆うショートケープ"),
];

export const shoeOptions = [
  choice("barefoot", "裸足", ""),
  choice("ballet", "バレエシューズ", "バレエシューズ"),
  choice("flat_pumps", "フラットパンプス", "フラットパンプス"),
  choice("pumps", "パンプス", "パンプス"),
  choice("high_heels", "ハイヒールパンプス", "ハイヒールパンプス"),
  choice("loafers", "ローファー", "ローファー"),
  choice("sneakers", "スニーカー", "スニーカー"),
  choice("sports_shoes", "スポーツシューズ", "スポーツシューズ"),
  choice("sandals", "サンダル", "サンダル"),
  choice("heel_sandals", "ヒールサンダル", "ヒールサンダル"),
  choice("platform_shoes", "厚底シューズ", "厚底シューズ"),
  choice("platform_boots", "厚底ブーツ", "厚底ブーツ"),
  choice("ankle_boots", "アンクルブーツ", "アンクルブーツ"),
  choice("short_boots", "ショートブーツ", "ショートブーツ"),
  choice("long_boots", "ロングブーツ", "ロングブーツ"),
  choice("thigh_high_boots", "ニーハイブーツ", "ニーハイブーツ"),
  choice("stage_boots", "ステージブーツ", "装飾を備えたステージブーツ"),
];

export const outfitDecorationOptions = [
  "無し",
  "内容は衣装に合わせておまかせ、装飾量は控えめ",
  "内容は衣装に合わせておまかせ、装飾量は華美",
];

const stageTops = [
  choice("stage_top_01", "シャツ", "シャツカラーのステージシャツ"),
  choice("stage_top_02", "ブラウス", "柔らかなシルエットのステージブラウス"),
  choice("stage_top_03", "アシメブラウス", "アシンメトリーデザインのブラウス"),
  choice("stage_top_04", "セーラートップ", "セーラーカラーのステージトップ"),
  choice("stage_top_05", "ニットトップ", "身体に沿うステージニットトップ"),
  choice("stage_top_06", "チュニック", "ヒップ上丈のステージチュニック"),
  choice("stage_top_07", "フーディー", "フード付きステージトップ"),
  choice("stage_top_08", "スポーツトップ", "身体に沿うスポーティーなステージトップ"),
  choice("stage_top_09", "ペプラムトップ", "ウエストから裾が広がるペプラムトップ"),
  choice("stage_top_10", "ビスチェトップ", "ストラップレスのビスチェトップ"),
  choice("stage_top_11", "コルセットトップ", "ボーン構造と編み上げを備えたコルセットトップ"),
  choice("stage_top_12", "ボディストップ", "上半身に沿う構築的なボディストップ"),
];

const stageBottoms = [
  choice("stage_bottom_01", "フレアミニスカート", "ハイウエスト・ミニ丈 フレアスカート"),
  choice("stage_bottom_02", "サーキュラーミニスカート", "ハイウエスト・ミニ丈 サーキュラースカート"),
  choice("stage_bottom_03", "プリーツミニスカート", "ハイウエスト・ミニ丈 プリーツスカート"),
  choice("stage_bottom_04", "ティアードミニスカート", "ハイウエスト・ミニ丈 ティアードスカート"),
  choice("stage_bottom_05", "パネルミニスカート", "ハイウエスト・ミニ丈 パネルスカート"),
  choice("stage_bottom_06", "ラップアシメスカート", "ハイウエスト・ミニ丈 アシンメトリーラップスカート"),
  choice("stage_bottom_07", "マーメイドスカート", "ハイウエスト・ロング丈 マーメイドスカート"),
  choice("stage_bottom_08", "トレーンスカート", "ハイウエスト・ロング丈 バックトレーンスカート"),
  choice("stage_bottom_09", "スカパン", "ハイウエスト・ミニ丈 スカート風ショートパンツ"),
  choice("stage_bottom_10", "キュロット", "ハイウエスト・ショート丈 キュロット"),
  choice("stage_bottom_11", "フィットショーツ", "ハイウエスト・ショート丈 フィットショーツ"),
  choice("stage_bottom_12", "フレアショーツ", "ハイウエスト・ショート丈 フレアショーツ"),
  choice("stage_bottom_13", "バルーンショーツ", "ハイウエスト・ショート丈 バルーンショーツ"),
  choice("stage_bottom_14", "スリムパンツ", "ハイウエスト・フルレングス スリムパンツ"),
  choice("stage_bottom_15", "テーパードパンツ", "ハイウエスト・フルレングス テーパードパンツ"),
  choice("stage_bottom_16", "ストレートパンツ", "ハイウエスト・フルレングス ストレートパンツ"),
  choice("stage_bottom_17", "セミフレアパンツ", "ハイウエスト・フルレングス セミフレアパンツ"),
  choice("stage_bottom_18", "フレアパンツ", "ハイウエスト・フルレングス フレアパンツ"),
  choice("stage_bottom_19", "ワイドパンツ", "ハイウエスト・フルレングス ワイドパンツ"),
  choice("stage_bottom_20", "パラッツォパンツ", "ハイウエスト・フルレングス パラッツォパンツ"),
  choice("stage_bottom_21", "カーゴパンツ", "ハイウエスト・フルレングス カーゴパンツ"),
  choice("stage_bottom_22", "ジョガーパンツ", "ハイウエスト・フルレングス ジョガーパンツ"),
];

const stageOnepiece = [
  choice("stage_one_01", "フィット＆フレアドレス", "ハイウエスト・ミニ丈 フィット＆フレアドレス"),
  choice("stage_one_02", "プリーツドレス", "ハイウエスト・ミニ丈 プリーツドレス"),
  choice("stage_one_03", "ティアードドレス", "ハイウエスト・ミニ丈 ティアードドレス"),
  choice("stage_one_04", "クラシカルドレス", "ジャストウエスト・ミニ丈 クラシカルドレス"),
  choice("stage_one_05", "アシメドレス", "ハイウエスト・ミニ丈 アシンメトリードレス"),
  choice("stage_one_06", "ボディスフレアドレス", "構築的な上身頃を持つフレアドレス"),
  choice("stage_one_07", "ペプラムドレス", "ペプラムウエストのドレス"),
  choice("stage_one_08", "ボディラインドレス", "身体に沿うロング丈コラムドレス"),
  choice("stage_one_09", "マーメイドドレス", "身体に沿い裾が広がるマーメイドドレス"),
  choice("stage_one_10", "トレーンドレス", "後ろ裾にトレーンを備えたロングドレス"),
  choice("stage_one_11", "ショートジャンプスーツ", "ハイウエスト・ショート丈 ジャンプスーツ"),
  choice("stage_one_12", "ロングジャンプスーツ", "ハイウエスト・フルレングス ジャンプスーツ"),
];

const casualTops = [
  choice("casual_top_01", "Tシャツ", "半袖・クルーネック・ヒップ上丈 ベーシックTシャツ"),
  choice("casual_top_02", "シャツ", "長袖・レギュラーカラー・ヒップ丈 ベーシックシャツ"),
  choice("casual_top_03", "ブラウス", "長袖・シャツカラー・ヒップ上丈 ブラウス"),
  choice("casual_top_04", "クルーネックニット", "長袖・クルーネック・ウエスト丈 ニットトップ"),
  choice("casual_top_05", "クロップドトップ", "半袖・スクエアネック・クロップド丈 コンパクトトップ"),
  choice("casual_top_06", "パーカー", "長袖・フード付き・ヒップ丈 パーカー"),
  choice("casual_top_07", "ブラジャー", "ベーシックなブラジャー"),
  choice("casual_top_08", "フルカップブラ", "バスト全体を覆うフルカップブラ"),
  choice("casual_top_09", "バルコネットブラ", "水平に近いカップラインのバルコネットブラ"),
  choice("casual_top_10", "プランジブラ", "中央が深く開いたプランジブラ"),
  choice("casual_top_11", "ストラップレスブラ", "肩紐のないストラップレスブラ"),
  choice("casual_top_12", "ブラレット", "ワイヤー感を抑えたブラレット"),
  choice("casual_top_13", "スポーツブラ", "身体に沿うスポーツブラ"),
  choice("casual_top_14", "ビキニトップ", "ベーシックなビキニトップ"),
  choice("casual_top_15", "トライアングルビキニトップ", "三角形カップのビキニトップ"),
  choice("casual_top_16", "バンドゥビキニトップ", "肩紐のないバンドゥビキニトップ"),
  choice("casual_top_17", "ホルタービキニトップ", "ホルターネックのビキニトップ"),
  choice("casual_top_18", "タンキニトップ", "胴を覆うタンキニトップ"),
  choice("casual_top_19", "長袖ラッシュガード", "身体に沿う長袖ラッシュガード"),
];

const casualBottoms = [
  choice("casual_bottom_01", "ミディフレアスカート", "ハイウエスト・ミディ丈 フレアスカート"),
  choice("casual_bottom_02", "ミディプリーツスカート", "ハイウエスト・ミディ丈 プリーツスカート"),
  choice("casual_bottom_03", "ナロースカート", "ハイウエスト・ミディ丈 ナロースカート"),
  choice("casual_bottom_04", "スカパン", "ハイウエスト・ミニ丈 スカート風ショートパンツ"),
  choice("casual_bottom_05", "キュロット", "ハイウエスト・ショート丈 キュロット"),
  choice("casual_bottom_06", "フィットショーツ", "ハイウエスト・ショート丈 フィットショーツ"),
  choice("casual_bottom_07", "フレアショーツ", "ハイウエスト・ショート丈 フレアショーツ"),
  choice("casual_bottom_08", "バルーンショーツ", "ハイウエスト・ショート丈 バルーンショーツ"),
  choice("casual_bottom_09", "スリムパンツ", "ハイウエスト・フルレングス スリムパンツ"),
  choice("casual_bottom_10", "テーパードパンツ", "ハイウエスト・フルレングス テーパードパンツ"),
  choice("casual_bottom_11", "ストレートスラックス", "ジャストウエスト・フルレングス ストレートスラックス"),
  choice("casual_bottom_12", "ストレートデニムパンツ", "ジャストウエスト・フルレングス ストレートデニム"),
  choice("casual_bottom_13", "セミフレアパンツ", "ハイウエスト・フルレングス セミフレアパンツ"),
  choice("casual_bottom_14", "フレアパンツ", "ハイウエスト・フルレングス フレアパンツ"),
  choice("casual_bottom_15", "ワイドパンツ", "ハイウエスト・フルレングス ワイドパンツ"),
  choice("casual_bottom_16", "パラッツォパンツ", "ハイウエスト・フルレングス パラッツォパンツ"),
  choice("casual_bottom_17", "カーゴパンツ", "ジャストウエスト・フルレングス カーゴパンツ"),
  choice("casual_bottom_18", "ジョガーパンツ", "ジャストウエスト・フルレングス ジョガーパンツ"),
  choice("casual_bottom_19", "ショーツ", "ベーシックなショーツ"),
  choice("casual_bottom_20", "ハイウエストショーツ", "ウエストを深く覆うハイウエストショーツ"),
  choice("casual_bottom_21", "ヒップハンガーショーツ", "腰位置が低いヒップハンガーショーツ"),
  choice("casual_bottom_22", "ボーイレッグショーツ", "脚口を広く覆うボーイレッグショーツ"),
  choice("casual_bottom_23", "ビキニボトム", "ベーシックなビキニボトム"),
  choice("casual_bottom_24", "ハイウエストビキニボトム", "ウエストを深く覆うビキニボトム"),
  choice("casual_bottom_25", "サイドリボンビキニボトム", "両脇をリボンで結ぶビキニボトム"),
  choice("casual_bottom_26", "ボーイレッグビキニボトム", "脚口を広く覆うビキニボトム"),
  choice("casual_bottom_27", "スカート付きビキニボトム", "短いスカートを備えたビキニボトム"),
  choice("casual_bottom_28", "スイムショーツ", "ショート丈のスイムショーツ"),
  choice("casual_bottom_29", "ロングスイムパンツ", "身体に沿うフルレングスのスイムパンツ"),
];

const casualOnepiece = [
  choice("casual_one_01", "ミニワンピース", "半袖・ラウンドネック・ジャストウエスト・ミニ丈 フレアワンピース"),
  choice("casual_one_02", "ミディワンピース", "五分袖・Vネック・ジャストウエスト・ミディ丈 フレアワンピース"),
  choice("casual_one_03", "ロングワンピース", "長袖・ラウンドネック・ハイウエスト・ロング丈 ワンピース"),
  choice("casual_one_04", "シャツワンピース", "長袖・シャツカラー・ジャストウエスト・ミディ丈 シャツワンピース"),
  choice("casual_one_05", "ニットワンピース", "長袖・ハイネック・ジャストウエスト・ミディ丈 ニットワンピース"),
  choice("casual_one_06", "サロペットワンピ", "ノースリーブ・スクエアネック・ハイウエスト・ミディ丈 サロペットワンピース"),
  choice("casual_one_07", "ショートオールインワン", "半袖・開襟・ハイウエスト・ショート丈 オールインワン"),
  choice("casual_one_08", "ロングオールインワン", "ノースリーブ・Vネック・ハイウエスト・フルレングス オールインワン"),
  choice("casual_one_09", "ベーシックワンピース水着", "ベーシックなワンピース水着"),
  choice("casual_one_10", "ホルターワンピース水着", "ホルターネックのワンピース水着"),
  choice("casual_one_11", "ハイネックワンピース水着", "ハイネックのワンピース水着"),
  choice("casual_one_12", "カットアウトワンピース水着", "ウエストにカットアウトを備えたワンピース水着"),
  choice("casual_one_13", "モノキニ", "トップとボトムが胴部分でつながったモノキニ"),
  choice("casual_one_14", "競技用水着", "身体に密着するベーシックな競技用水着"),
  choice("casual_one_15", "ハイネック競技用水着", "ハイネックで身体に密着する競技用水着"),
  choice("casual_one_16", "長袖ワンピース水着", "身体に沿う長袖ワンピース水着"),
];

export const outfitCatalogs = {
  stage_separate: { tops: stageTops, bottoms: stageBottoms },
  stage_onepiece: { outfits: stageOnepiece },
  casual_separate: { tops: casualTops, bottoms: casualBottoms },
  casual_onepiece: { outfits: casualOnepiece },
};

export function outfitCatalogFor(type, structure) { return outfitCatalogs[`${type}_${structure}`] || null; }
export function outfitLabel(options, value) { return options.find((option) => option.value === value)?.label || ""; }
export function outfitChoice(options, value) { return options?.find((option) => option.value === value) || null; }

export function firstOutfitSelection(type, structure) {
  const common = { outerwear: "none", topDesign: "", bottomDesign: "", outfitDesign: "", shoe: "pumps" };
  const catalog = outfitCatalogFor(type, structure);
  if (!catalog) return common;
  if (structure === "separate") return { ...common, topDesign: catalog.tops[0].value, bottomDesign: catalog.bottoms[0].value };
  return { ...common, outfitDesign: catalog.outfits[0].value };
}
