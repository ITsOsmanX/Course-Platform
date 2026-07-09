export type Course = {
  id: number;
  title: string;
  instructor: string;
  category: string;
  rating: number;
  students: number;
  price: number;
  image: string;
};

export type PricingTier = {
  name: string;
  priceMonthly: number;
  priceYearly: number;
  popular?: boolean;
  description: string;
  features: string[];
};

export type Testimonial = {
  id: number;
  name: string;
  role: string;
  image: string;
  quote: string;
};

export const courses: Course[] = [
  {
    id: 1,
    title: "Modern React",
    instructor: "John Doe",
    category: "Frontend",
    rating: 4.9,
    students: 1850,
    price: 59,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
  },
  {
    id: 2,
    title: "Next.js Masterclass",
    instructor: "Sarah Smith",
    category: "Frontend",
    rating: 4.8,
    students: 2400,
    price: 79,
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
  },
  {
    id: 3,
    title: "Node.js API Bootcamp",
    instructor: "Alex Brown",
    category: "Backend",
    rating: 4.7,
    students: 1600,
    price: 69,
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
  },
  {
    id: 4,
    title: "UI/UX Fundamentals",
    instructor: "Emily Clark",
    category: "Design",
    rating: 4.9,
    students: 1200,
    price: 49,
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
  },
  {
    id: 5,
    title: "Python Complete Course",
    instructor: "David Wilson",
    category: "Programming",
    rating: 5,
    students: 3100,
    price: 89,
    image:
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800",
  },
  {
    id: 6,
    title: "AI Engineering",
    instructor: "Sophia Taylor",
    category: "AI",
    rating: 4.8,
    students: 950,
    price: 99,
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
  },
];

export const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    priceMonthly: 9,
    priceYearly: 90,
    description: "Perfect for beginners starting their journey.",
    features: [
      "5 Premium Courses",
      "Certificates",
      "Community Access",
      "Email Support",
    ],
  },
  {
    name: "Pro",
    priceMonthly: 19,
    priceYearly: 190,
    popular: true,
    description: "Everything you need to become job-ready.",
    features: [
      "Unlimited Courses",
      "Certificates",
      "Projects",
      "Priority Support",
      "Download Resources",
    ],
  },
  {
    name: "Enterprise",
    priceMonthly: 49,
    priceYearly: 490,
    description: "Best for organizations and teams.",
    features: [
      "Unlimited Everything",
      "Analytics",
      "Team Dashboard",
      "Dedicated Mentor",
      "24/7 Support",
    ],
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Emily Carter",
    role: "Frontend Developer",
    image: "https://i.pravatar.cc/150?img=32",
    quote:
      "Waypoint completely transformed how I learn. Every lesson is practical and beautifully designed.",
  },
  {
    id: 2,
    name: "Michael Ross",
    role: "Backend Engineer",
    image: "https://i.pravatar.cc/150?img=14",
    quote:
      "The project-based approach helped me land my first software engineering role.",
  },
  {
    id: 3,
    name: "Sophia Lee",
    role: "UI Designer",
    image: "https://i.pravatar.cc/150?img=44",
    quote:
      "The best online learning experience I've ever had. Highly recommended.",
  },
];