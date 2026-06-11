export type UserRole = "rabatteur" | "admin" | "backoffice" | "agence";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  createdAt: Date;
}

export interface RabatteurProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  passportNumber: string;
  agencyIds: string[];
  password: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export type ClientStatus = "pending" | "confirmed" | "cancelled";

export interface PassportDoc {
  type: "passport";
  number: string;
  expiryDate: string;
  nationality: string;
  scanImageUri?: string;
}
export interface CinDoc {
  type: "cin";
  cinNumber: string;
  cinImageUri?: string;
}
export type ClientDocument = PassportDoc | CinDoc;

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  document: ClientDocument | null;
  dateOfBirth?: string;
  gender?: "M" | "F";
  hasPackage: boolean;
  forecastId?: number;
  priceOptionId?: number;
  selectedForecastLabel?: string;
  selectedPriceLabel?: string;
  selectedPrice?: number;
  sansVisa?: boolean;
  sansBillet?: boolean;
  agencyId?: string;
  notes?: string;
  rabatteurId: string;
  rabatteurName: string;
  status: ClientStatus;
  deductionAmount?: number;
  commission?: number;
  createdAt: Date;
  updatedAt: Date;
  confirmedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
}

export interface RabatteurSeatAllocation {
  rabatteurId: string;
  rabatteurName: string;
  seatsAllocated: number;
  seatsUsed: number;
}

export interface PackageAllocation {
  id: string;
  forecastId: number;
  agencyId: string;
  isOpen: boolean;
  allocations: RabatteurSeatAllocation[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Airline {
  id: number;
  name: string;
  fullName: string;
  iata: string | null;
  logo: string;
}
export interface Disponibility {
  id: number;
  date: string;
  returnDate: string;
  onStock: number;
  packageUmrahId: number;
  airline: Airline;
  airlineId: number;
  commission: number;
  b2Bcommission: number;
  pnr: string | null;
}
export interface UmrahPriceOption {
  id: number;
  packageUmrahId: number;
  designation: string | null;
  baseCost: number;
  hotelMadinahName: string;
  hotelMakkahName: string;
  arrangementMadinahDesignation: string;
  arrangementMakkahDesignation: string;
  price: number;
  isHidden: boolean;
}
export interface UmrahForecast {
  id: number;
  packageUmrahId: number;
  virtualStock: number;
  note: string;
  seasonId: number;
  disponibilityId: number;
  disponibility: Disponibility;
  prices: {
    id: number;
    priceUmrahId: number;
    priceUmrah: UmrahPriceOption;
    forcastUmrahId: number;
  }[];
}
export interface Agency {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  managerName: string;
  active: boolean;
}

// Request types
export interface LoginRequest {
  username: string;
  password: string;
}

// Response types
export interface LoginResponse {
  success: boolean;
  token?: string;
  fullName?: string;
  role?: string;
  userName?: string;
  id?: string;
  checkoutId?: number | null;
  ccaId?: number | null;
  childCheckoutId?: number;
  message?: string;
}

export interface AuthError {
  message: string;
  statusCode?: number;
}

// User type (extend your existing User type)
export interface AuthUser {
  id: string;
  fullName: string;
  userName: string;
  role: string;
  checkoutId?: number | null;
  ccaId?: number | null;
  childCheckoutId?: number;
  token: string;
}

// Store state
export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}
