import { detectDocType, isValidUrl, TYPES } from "./docs-service";

it("detects Google Drive URL", () => {
  expect(
    detectDocType("https://docs.google.com/presentation/d/1y2248b2RVIkhB39D8cJkLxH-MPnjl6fYTeJ4sAR46l0/edit#slide=id.g4dad63ff3a_0_0")
  ).toBe(TYPES.GOOGLE_DRIVE)
});

it("detects OneDrive URL", () => {
  expect(
    detectDocType("https://onedrive.live.com/embed?cid=EBE1258A7DC6BFC9&resid=EBE1258A7DC6BFC9%21142&authkey=AOGwqivlXQOzK_8&em=2&wdStartOn=1")
  ).toBe(TYPES.ONEDRIVE)
});

it("detects Figma URL", () => {
  expect(
    detectDocType("https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FuNFSKoBKxBFugNSYFdzrnH/Embeded-files?node-id=0%3A1")
  ).toBe(TYPES.FIGMA)
});

it("detects other URL", () => {
  expect(
    detectDocType("https://www.monday.com/")
  ).toBe(TYPES.OTHER)
});

it("recognizes Google Docs URL as valid", () => {
  expect(
    isValidUrl("https://docs.google.com/presentation/d/1y2248b2RVIkhB39D8cJkLxH-MPnjl6fYTeJ4sAR46l0/edit#slide=id.g4dad63ff3a_0_0")
  ).toBe(true);
});

it("recognizes iframe as invalid URL", () => {
  expect(
    isValidUrl("<iframe src=\"https://docs.google.com/presentation/d/1y2248b2RVIkhB39D8cJkLxH-MPnjl6fYTeJ4sAR46l0/edit#slide=id.g4dad63ff3a_0_0\">lalala</iframe>>")
  ).toBe(false);
});