// ─── Backend API Types ────────────────────────────────────────────────────────

/** A course as returned by GET /courses and GET /courses/:id */
export interface ApiCourse {
  _id: string;
  title: string;
  description: string;
  instructor: { _id: string; name: string; email: string } | string;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  tags: string[];
  isFeatured: boolean;
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/** Slim course shape returned inside purchaseHistory from GET /users/profile */
export interface PurchasedCourse {
  _id: string;
  title: string;
  category: string;
  price: number;
  imageUrl: string;
}

/** Full user profile returned by GET /users/profile */
export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  isBlocked: boolean;
  purchaseHistory: PurchasedCourse[];
  createdAt: string;
  updatedAt: string;
}

/** Transaction record */
export interface Transaction {
  _id: string;
  user: { _id: string; name: string; email: string } | string;
  course: { _id: string; title: string; price: number } | string;
  stripeSessionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

/** Contact message */
export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  isReplied: boolean;
  createdAt: string;
}

// ─── Admin Stats ──────────────────────────────────────────────────────────────

export interface AdminStats {
  metrics: {
    totalUsers: number;
    totalCourses: number;
    totalMessages: number;
    totalRevenue: number;
    totalSales: number;
  };
  charts: {
    userGrowth: { month: string; students: number }[];
    monthlyRevenue: { month: string; revenue: number; sales: number }[];
  };
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  createdAt: string;
}

// ─── AI Chat ──────────────────────────────────────────────────────────────────

export interface ChatRecommendedCourse {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  recommendedCourses?: ChatRecommendedCourse[];
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  courseId: string;
  title: string;
  price: number;
  imageUrl: string;
  category: string;
}
