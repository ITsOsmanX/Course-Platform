import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { ApiCourse } from "@/types";
import { useAuth } from "@/context/AuthContext";


type Props = {
  course: ApiCourse;
  /** base path for the detail link — defaults to /courses for public, pass /dashboard/courses for authenticated */
  basePath?: string;
};

export default function CourseCard({ course, basePath = "/courses" }: Props) {
  const { user } = useAuth();
  const isPurchased = user?.purchaseHistory?.some((p) => p._id === course._id) ?? false;
  const instructorName =

    typeof course.instructor === "object" ? course.instructor.name : "Instructor";

  return (
    <Card className="group overflow-hidden rounded-3xl border-0 bg-slate-900/70 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-900/20">
      <Link href={`${basePath}/${course._id}`} className="block">
        <div className="relative h-52 overflow-hidden">
          <Image
            src={
              course.imageUrl ||
              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"
            }
            alt={course.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
                    <Badge className="absolute left-4 top-4 bg-blue-600 capitalize">
            {course.category}
          </Badge>
          {isPurchased && (
            <Badge className="absolute right-4 top-4 bg-green-600 shadow-lg">
              <Check size={12} className="mr-1" /> Purchased
            </Badge>
          )}

        </div>
      </Link>

      <CardContent className="space-y-3 p-5">
        <Link href={`${basePath}/${course._id}`}>
          <h3 className="line-clamp-2 text-lg font-bold leading-snug transition-colors hover:text-blue-300">
            {course.title}
          </h3>
        </Link>

        <p className="text-sm text-slate-400">by {instructorName}</p>

        <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">
          {course.description}
        </p>

        <div className="flex items-center justify-between text-sm text-slate-400">
          <span className="flex items-center gap-1">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            {course.rating.toFixed(1)}
          </span>
          <span className="text-xs">{course.reviewCount.toLocaleString()} reviews</span>
        </div>
      </CardContent>

            <CardFooter className="flex items-center justify-between px-5 pb-5 pt-0">
        <span className="text-2xl font-bold text-blue-400">
          {isPurchased ? "Owned" : `$${course.price}`}
        </span>
        <Link
          href={`${basePath}/${course._id}`}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-white transition ${
            isPurchased ? "bg-slate-700 hover:bg-slate-600" : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          {isPurchased ? "Start Learning" : "View Course"} <ArrowRight size={14} />
        </Link>
      </CardFooter>

    </Card>
  );
}
