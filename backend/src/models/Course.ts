import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  instructor: mongoose.Types.ObjectId;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  tags: string[];
  isFeatured: boolean;
  videoUrl?: string;
}

const CourseSchema: Schema<ICourse> = new Schema(
  {
    title: { 
      type: String, 
      required: [true, 'Course title is required'], 
      trim: true 
    },
    description: { 
      type: String, 
      required: [true, 'Course description is required'] 
    },
    instructor: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: [true, 'Instructor reference is required'] 
    },
    category: { 
      type: String, 
      required: [true, 'Category is required'],
      lowercase: true,
      trim: true 
    },
    price: { 
      type: Number, 
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'] 
    },
    rating: { 
      type: Number, 
      default: 5.0,
      min: 0,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    imageUrl: { 
      type: String, 
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3' 
    },
    tags: [{
      type: String,
      lowercase: true
    }],
    isFeatured: {
      type: Boolean,
      default: false
    },
    videoUrl: {
      type: String,
      trim: true
    }
  },
  { 
    timestamps: true 
  }
);

// Create indexes for high-performance searching and filtering later (essential for Dashboard & RAG context matching)
CourseSchema.index({ title: 'text', description: 'text' });
CourseSchema.index({ category: 1 });

export const Course = mongoose.model<ICourse>('Course', CourseSchema);