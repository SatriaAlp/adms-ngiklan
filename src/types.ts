export type UserRole = 'USER' | 'MERCHANT' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  merchantId?: string;
  createdAt: string;
}

export interface Merchant {
  id: string;
  name: string;
  slug: string;
  logo: string;
  banner: string;
  description: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  totalProducts: number;
  totalSales: number;
  joinedDate: string;
  location: string;
  contactWhatsapp: string;
  ownerId: string;
}

export type CategorySlug = 
  | 'template' 
  | 'ebook' 
  | 'software' 
  | 'website' 
  | 'design' 
  | 'video' 
  | 'audio' 
  | 'course' 
  | 'social-media' 
  | 'digital-marketing' 
  | 'business' 
  | 'education' 
  | 'tools' 
  | 'jasa' 
  | 'lainnya';

export interface Category {
  id: string;
  name: string;
  slug: CategorySlug;
  iconName: string;
  description: string;
  productCount: number;
}

export interface ProductPackage {
  id: string;
  name: string;
  price: number;
  description?: string;
  features: string[];
  deliveryTime?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  category: string;
  categoryName: string;
  merchantId: string;
  merchantName: string;
  merchantLogo?: string;
  priceType: 'FIXED' | 'STARTING_FROM' | 'CONTACT_US';
  price: number;
  discountPrice?: number;
  packages?: ProductPackage[];
  rating: number;
  reviewCount: number;
  salesCount: number;
  thumbnail: string;
  images: string[];
  shortDescription: string;
  fullDescription: string;
  features: string[];
  specifications: Record<string, string>;
  downloadUrl?: string;
  fileSize?: string;
  fileType?: string;
  isBestSeller?: boolean;
  isNew?: boolean;
  isPromo?: boolean;
  isTrending?: boolean;
  stock?: number;
  status: 'published' | 'pending' | 'rejected' | 'draft';
  createdAt: string;
}

export type AdType = 'free' | 'basic' | 'featured' | 'premium';
export type AdStatus = 'draft' | 'pending' | 'published' | 'rejected' | 'expired';

export interface Advertisement {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  description: string;
  price: number;
  images: string[];
  location: string;
  contactName: string;
  whatsapp: string;
  websiteUrl?: string;
  condition: 'baru' | 'bekas' | 'jasa' | 'lisensi';
  tags: string[];
  durationDays: number;
  type: AdType;
  status: AdStatus;
  merchantId?: string;
  merchantName: string;
  viewsCount: number;
  clicksCount: number;
  createdAt: string;
  expiresAt: string;
  packageName?: string;
}

export interface AdPackage {
  id: string;
  name: string;
  type: AdType;
  price: number;
  durationDays: number;
  priority: number;
  maxImages: number;
  isFeaturedPlacement: boolean;
  isSearchBoost: boolean;
  isHomepagePlacement: boolean;
  hasAnalytics: boolean;
  badge?: string;
  description: string;
  isActive: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedPackageId?: string;
}

export type PaymentMethod = 
  | 'qris' 
  | 'bank_transfer_bca' 
  | 'bank_transfer_mandiri' 
  | 'e_wallet_gopay' 
  | 'e_wallet_ovo' 
  | 'custom_afifah_gateway';

export type TransactionType = 
  | 'product_purchase' 
  | 'advertising' 
  | 'boost' 
  | 'subscription' 
  | 'merchant_fee';

export type PaymentStatus = 
  | 'pending' 
  | 'processing' 
  | 'paid' 
  | 'failed' 
  | 'expired' 
  | 'refunded';

export interface OrderItem {
  productId: string;
  packageId?: string;
  productTitle: string;
  productThumbnail: string;
  price: number;
  quantity: number;
  downloadUrl?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  platformFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionType: TransactionType;
  createdAt: string;
  paidAt?: string;
  downloadKey?: string;
}

export interface PaymentGatewayConfig {
  enabled: boolean;
  apiKey: string;
  merchantSecret?: string;
  environment: 'sandbox' | 'production';
}

export interface PlatformSettings {
  transactionFeePercent: number; // e.g. 5%
  merchantCommissionPercent: number; // e.g. 10%
  baseAdvertisingFee: number; // e.g. 10000
  withdrawalFee: number; // e.g. 5000
  featuredListingFee: number; // e.g. 25000
  boostFee: number; // e.g. 15000
  currency: string;
  allowFreeAds: boolean;
  maxFreeAdsPerUser: number;
  paymentGatewayConfig: PaymentGatewayConfig;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  quickReplies?: string[];
}
