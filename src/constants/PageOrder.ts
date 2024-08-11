export const PageOrders = {
  gotoRestaurantListPage: '1-1',
  gotoTargetRestaurantPage: '2-1',
  gotoAvailableSeats: '2-2',
  afterRecaptchaPassed: '3-1',
};
export type PageOrder = keyof typeof PageOrders;
