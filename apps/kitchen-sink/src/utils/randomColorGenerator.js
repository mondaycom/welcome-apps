import { ITEMS_BACKGROUND_COLORS } from "../utils/boardUtil";

export default function randomColorGenerator() {
  return ITEMS_BACKGROUND_COLORS[Math.floor(Math.random() * ITEMS_BACKGROUND_COLORS.length)];
}
