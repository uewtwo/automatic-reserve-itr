export type Restaurant = 'oukarou' | 'alfaro' | 'kotoritei' | 'sushi';
export const Restaurants = {
  oukarou: 0,
  alfaro: 1,
  kotoritei: 2,
  sushi: 3,
} as const;
export type RestaurantOf<R extends Restaurant> = {
  [K in R]: (typeof Restaurants)[K];
}[R];
export const ServiceIndexByRestaurant: { [K in Restaurant]: number } = {
  oukarou: 1, // ディナー・フロア
  alfaro: 999, // 未定義
  kotoritei: 999, // 未定義
  sushi: 4, // 19:00~
} as const;

export function isRestaurant(restaurant: string): restaurant is Restaurant {
  return ['oukarou', 'alfaro', 'kotoritei', 'sushi'].includes(restaurant);
}
