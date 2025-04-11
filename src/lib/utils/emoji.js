// Phylocanvas.gl (https://phylocanvas.gl)
// Centre for Genomic Pathogen Surveillance.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

const isEmojiRegexp = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/i;

const Flags = {
  ad: "🇦🇩",
  ae: "🇦🇪",
  af: "🇦🇫",
  ag: "🇦🇬",
  ai: "🇦🇮",
  al: "🇦🇱",
  am: "🇦🇲",
  ao: "🇦🇴",
  aq: "🇦🇶",
  ar: "🇦🇷",
  as: "🇦🇸",
  at: "🇦🇹",
  au: "🇦🇺",
  aw: "🇦🇼",
  ax: "🇦🇽",
  az: "🇦🇿",
  ba: "🇧🇦",
  bb: "🇧🇧",
  bd: "🇧🇩",
  be: "🇧🇪",
  bf: "🇧🇫",
  bg: "🇧🇬",
  bh: "🇧🇭",
  bi: "🇧🇮",
  bj: "🇧🇯",
  bl: "🇧🇱",
  bm: "🇧🇲",
  bn: "🇧🇳",
  bo: "🇧🇴",
  bq: "🇧🇶",
  br: "🇧🇷",
  bs: "🇧🇸",
  bt: "🇧🇹",
  bv: "🇧🇻",
  bw: "🇧🇼",
  by: "🇧🇾",
  bz: "🇧🇿",
  ca: "🇨🇦",
  cc: "🇨🇨",
  cd: "🇨🇩",
  cf: "🇨🇫",
  cg: "🇨🇬",
  ch: "🇨🇭",
  ci: "🇨🇮",
  ck: "🇨🇰",
  cl: "🇨🇱",
  cm: "🇨🇲",
  cn: "🇨🇳",
  co: "🇨🇴",
  cr: "🇨🇷",
  cu: "🇨🇺",
  cv: "🇨🇻",
  cw: "🇨🇼",
  cx: "🇨🇽",
  cy: "🇨🇾",
  cz: "🇨🇿",
  de: "🇩🇪",
  dj: "🇩🇯",
  dk: "🇩🇰",
  dm: "🇩🇲",
  do: "🇩🇴",
  dz: "🇩🇿",
  ec: "🇪🇨",
  ee: "🇪🇪",
  eg: "🇪🇬",
  eh: "🇪🇭",
  er: "🇪🇷",
  es: "🇪🇸",
  et: "🇪🇹",
  eu: "🇪🇺",
  fi: "🇫🇮",
  fj: "🇫🇯",
  fk: "🇫🇰",
  fm: "🇫🇲",
  fo: "🇫🇴",
  fr: "🇫🇷",
  ga: "🇬🇦",
  gb: "🇬🇧",
  gd: "🇬🇩",
  ge: "🇬🇪",
  gf: "🇬🇫",
  gg: "🇬🇬",
  gh: "🇬🇭",
  gi: "🇬🇮",
  gl: "🇬🇱",
  gm: "🇬🇲",
  gn: "🇬🇳",
  gp: "🇬🇵",
  gq: "🇬🇶",
  gr: "🇬🇷",
  gs: "🇬🇸",
  gt: "🇬🇹",
  gu: "🇬🇺",
  gw: "🇬🇼",
  gy: "🇬🇾",
  hk: "🇭🇰",
  hm: "🇭🇲",
  hn: "🇭🇳",
  hr: "🇭🇷",
  ht: "🇭🇹",
  hu: "🇭🇺",
  id: "🇮🇩",
  ie: "🇮🇪",
  il: "🇮🇱",
  im: "🇮🇲",
  in: "🇮🇳",
  io: "🇮🇴",
  iq: "🇮🇶",
  ir: "🇮🇷",
  is: "🇮🇸",
  it: "🇮🇹",
  je: "🇯🇪",
  jm: "🇯🇲",
  jo: "🇯🇴",
  jp: "🇯🇵",
  ke: "🇰🇪",
  kg: "🇰🇬",
  kh: "🇰🇭",
  ki: "🇰🇮",
  km: "🇰🇲",
  kn: "🇰🇳",
  kp: "🇰🇵",
  kr: "🇰🇷",
  kw: "🇰🇼",
  ky: "🇰🇾",
  kz: "🇰🇿",
  la: "🇱🇦",
  lb: "🇱🇧",
  lc: "🇱🇨",
  li: "🇱🇮",
  lk: "🇱🇰",
  lr: "🇱🇷",
  ls: "🇱🇸",
  lt: "🇱🇹",
  lu: "🇱🇺",
  lv: "🇱🇻",
  ly: "🇱🇾",
  ma: "🇲🇦",
  mc: "🇲🇨",
  md: "🇲🇩",
  me: "🇲🇪",
  mf: "🇲🇫",
  mg: "🇲🇬",
  mh: "🇲🇭",
  mk: "🇲🇰",
  ml: "🇲🇱",
  mm: "🇲🇲",
  mn: "🇲🇳",
  mo: "🇲🇴",
  mp: "🇲🇵",
  mq: "🇲🇶",
  mr: "🇲🇷",
  ms: "🇲🇸",
  mt: "🇲🇹",
  mu: "🇲🇺",
  mv: "🇲🇻",
  mw: "🇲🇼",
  mx: "🇲🇽",
  my: "🇲🇾",
  mz: "🇲🇿",
  na: "🇳🇦",
  nc: "🇳🇨",
  ne: "🇳🇪",
  nf: "🇳🇫",
  ng: "🇳🇬",
  ni: "🇳🇮",
  nl: "🇳🇱",
  no: "🇳🇴",
  np: "🇳🇵",
  nr: "🇳🇷",
  nu: "🇳🇺",
  nz: "🇳🇿",
  om: "🇴🇲",
  pa: "🇵🇦",
  pe: "🇵🇪",
  pf: "🇵🇫",
  pg: "🇵🇬",
  ph: "🇵🇭",
  pk: "🇵🇰",
  pl: "🇵🇱",
  pm: "🇵🇲",
  pn: "🇵🇳",
  pr: "🇵🇷",
  ps: "🇵🇸",
  pt: "🇵🇹",
  pw: "🇵🇼",
  py: "🇵🇾",
  qa: "🇶🇦",
  re: "🇷🇪",
  ro: "🇷🇴",
  rs: "🇷🇸",
  ru: "🇷🇺",
  rw: "🇷🇼",
  sa: "🇸🇦",
  sb: "🇸🇧",
  sc: "🇸🇨",
  sd: "🇸🇩",
  se: "🇸🇪",
  sg: "🇸🇬",
  sh: "🇸🇭",
  si: "🇸🇮",
  sj: "🇸🇯",
  sk: "🇸🇰",
  sl: "🇸🇱",
  sm: "🇸🇲",
  sn: "🇸🇳",
  so: "🇸🇴",
  sr: "🇸🇷",
  ss: "🇸🇸",
  st: "🇸🇹",
  sv: "🇸🇻",
  sx: "🇸🇽",
  sy: "🇸🇾",
  sz: "🇸🇿",
  tc: "🇹🇨",
  td: "🇹🇩",
  tf: "🇹🇫",
  tg: "🇹🇬",
  th: "🇹🇭",
  tj: "🇹🇯",
  tk: "🇹🇰",
  tl: "🇹🇱",
  tm: "🇹🇲",
  tn: "🇹🇳",
  to: "🇹🇴",
  tr: "🇹🇷",
  tt: "🇹🇹",
  tv: "🇹🇻",
  tw: "🇹🇼",
  tz: "🇹🇿",
  ua: "🇺🇦",
  ug: "🇺🇬",
  um: "🇺🇲",
  us: "🇺🇸",
  uy: "🇺🇾",
  uz: "🇺🇿",
  va: "🇻🇦",
  vc: "🇻🇨",
  ve: "🇻🇪",
  vg: "🇻🇬",
  vi: "🇻🇮",
  vn: "🇻🇳",
  vu: "🇻🇺",
  wf: "🇼🇫",
  ws: "🇼🇸",
  ye: "🇾🇪",
  yt: "🇾🇹",
  za: "🇿🇦",
  zm: "🇿🇲",
  zw: "🇿🇼",
};

export default function emoji(shape) {
  if (shape in Flags) {
    return Flags[shape];
  }
  else if (isEmojiRegexp.test(shape)) {
    return shape;
  }
  else {
    return undefined;
  }
}
