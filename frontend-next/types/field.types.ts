export interface LocationCoordinates {
  latitude: number | null;
  longitude: number | null;
}

export interface CourtLocation {
  address: string;
  city: string;
  governorate: string;
  coordinates?: LocationCoordinates;
}

export interface CourtImage {
  url: string;
  isPrimary?: boolean;
  uploadedAt?: string;
}

export interface OperatingHours {
  start: string;
  end: string;
}

export type CourtSportType = 'Football' | 'Tennis' | 'Basketball' | 'Paddle';

export interface Court {
  _id: string;
  name: string;
  description: string;
  ownerId: string;
  sportType: CourtSportType;
  location: CourtLocation;
  pricePerHour: number;
  currency: 'EGP' | 'USD' | 'EUR';
  capacity: number;
  amenities: string[];
  images: CourtImage[];
  operatingHours: OperatingHours;
  availableDays?: string[];
  isActive: boolean;
  isVerified: boolean;
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourtsListParams {
  page?: number;
  limit?: number;
  sportType?: string;
  city?: string;
}

export interface CourtsListResponse {
  courts: Court[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
