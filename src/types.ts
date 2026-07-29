/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MealAddon {
  id: string;
  name: string;
  price: number;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  prepTime: string; // e.g. "20-25 mins"
  deliveryEstimate?: string; // e.g. "25-35 mins"
  restaurant?: string; // e.g. "Bibi Executive Kitchen"
  image: string;
  category: string;
  inStock: boolean;
  stockCount: number;
  ingredients?: string[];
  calories?: string; // e.g. "650 kcal"
  addons?: MealAddon[];
  isPopular?: boolean;
  isFeatured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  slug: string;
  image?: string;
  count?: string;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  mealName?: string;
}

export interface CartItem {
  cartItemId?: string;
  meal: Meal;
  quantity: number;
  specialInstructions?: string;
  selectedAddons?: MealAddon[];
  selectedOptions?: string[];
  unitPrice?: number;
}

export type OrderStatus = 'pending_payment' | 'preparing' | 'in_transit' | 'delivered' | 'canceled';

export type RiderDeliveryStage = 
  | 'new_order'
  | 'accepted'
  | 'heading_to_restaurant'
  | 'picked_up'
  | 'heading_to_customer'
  | 'delivered'
  | 'canceled';

export interface RiderProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  vehicleType: 'Motorcycle' | 'Bicycle' | 'E-Bike' | 'Scooter' | 'Car';
  licensePlate: string;
  rating: number;
  totalDeliveries: number;
  isOnline: boolean;
  verificationStatus: 'Verified Gold Partner' | 'Pending Verification' | 'Rejected';
  avatar?: string;
  joinedDate: string;
  city: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  payoutBank: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

export interface RiderNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'order' | 'payout' | 'system' | 'bonus';
  read: boolean;
  orderId?: string;
}

export interface DeliveryAddress {
  id: string;
  label: 'Home' | 'Office' | 'Other';
  customLabel?: string;
  street: string;
  city: string;
  phone: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: OrderStatus;
  riderStage?: RiderDeliveryStage;
  totalAmount: number;
  deliveryOption: 'home' | 'office' | 'pickup' | 'home_delivery';
  address: string;
  timestamp: string;
  riderId?: string;
  riderName?: string;
  riderPhone?: string;
  riderLocation?: { lat: number; lng: number };
  verificationPin?: string;
  cookingInstructions?: string;
  allergyNotes?: string;
  deliveryInstructions?: string;
  scheduledTime?: string;
  paymentMethod?: string;
  subtotal?: number;
  deliveryFee?: number;
  serviceFee?: number;
  discount?: number;
  estimatedEarnings?: number;
  estimatedDistanceKm?: number;
  pickupRestaurantName?: string;
  pickupAddress?: string;
  customerName?: string;
  customerPhone?: string;
  requestTimeRemainingSeconds?: number;
  ratingByCustomer?: number;
}
