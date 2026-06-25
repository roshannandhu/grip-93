// Domain types for the GRIP 93 used-tyre marketplace (front-end / mock data).

export type VehicleType = "car" | "suv" | "bike" | "commercial";
export type Grade = "A" | "B" | "C" | "D";
export type SellerType = "individual" | "dealer";

export type TyreSize = {
  width: number; // section width mm, e.g. 195
  aspect: number; // aspect ratio %, e.g. 65
  rim: number; // rim diameter in, e.g. 15
};

export type Listing = {
  id: string;
  brand: string;
  model: string;
  size: TyreSize;
  sizeLabel: string; // "195/65 R15"
  vehicleType: VehicleType;
  loadIndex: number; // e.g. 91
  speedRating: string; // e.g. "V"
  treadMm: number; // remaining tread depth
  treadPct: number; // 0..100
  dotWeek: number; // 1..52
  dotYear: number; // manufacture year
  grade: Grade;
  priceINR: number;
  qty: number;
  city: string;
  photos: string[]; // placeholder image srcs
  defects: string[];
  reasonForSale: string;
  inspected12pt: boolean;
  sellerType: SellerType;
};

export type CartItem = { id: string; qty: number };

export type Address = {
  name: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  gstin?: string;
};

export type PaymentMethod = "upi" | "card" | "cod";

export type Order = {
  id: string;
  items: { listing: Listing; qty: number }[];
  address: Address;
  payment: PaymentMethod;
  subtotal: number;
  gst: number;
  shipping: number;
  total: number;
  placedAt: number; // epoch ms
  status: "Placed" | "Inspected" | "Shipped" | "Delivered";
};

export type Vehicle = {
  make: string;
  models: { name: string; years: number[]; sizes: string[] }[];
};
