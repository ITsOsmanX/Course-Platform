import mongoose, { Schema, Document } from 'mongoose';
import bcryptjs from 'bcryptjs';

// Define User roles based on project requirements
export type UserRole = 'student' | 'instructor' | 'admin';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isBlocked: boolean;
  purchaseHistory: mongoose.Types.ObjectId[];
  passwordResetToken?: string;      // Added for forgot-password hashing match
  passwordResetExpires?: Date;       // Added for token lifespan tracking
  createdAt: Date;                   // Explicitly typed for aggregation metrics
  updatedAt: Date;
  comparePassword: (password: string) => Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Name is required'], 
      trim: true 
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'], 
      unique: true, 
      lowercase: true, 
      trim: true 
    },
    passwordHash: { 
      type: String, 
      required: [true, 'Password is required'] 
    },
    role: { 
      type: String, 
      enum: ['student', 'instructor', 'admin'], 
      default: 'student' 
    },
    isBlocked: { 
      type: Boolean, 
      default: false 
    },
    purchaseHistory: [
      { 
        type: Schema.Types.ObjectId, 
        ref: 'Course' 
      }
    ],
    passwordResetToken: { 
      type: String 
    },
    passwordResetExpires: { 
      type: Date 
    }
  },
  { 
    timestamps: true // Gives us createdAt and updatedAt for Admin Panel user growth tracking
  }
);

// Pre-save hook: Automatically hash password before saving to database
UserSchema.pre('save', async function (this: IUser) {
  // If the password field hasn't changed, just return out of the function early
  if (!this.isModified('passwordHash')) return;
  
  try {
    const salt = await bcryptjs.genSalt(10);
    this.passwordHash = await bcryptjs.hash(this.passwordHash, salt);
  } catch (err: any) {
    // Instead of calling next(err), we explicitly throw the error so Mongoose catches it
    throw err;
  }
});

// Instance method: Securely check passwords during login
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcryptjs.compare(password, this.passwordHash);
};

export const User = mongoose.model<IUser>('User', UserSchema);