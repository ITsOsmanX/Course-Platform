import Image from "next/image";
import { Star, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import type { Course } from "@/lib/data";

type Props = {
  course: Course;
};

export default function CourseCard({ course }: Props) {
  return (
    <Card className="group overflow-hidden rounded-3xl border-white/10 bg-slate-900/70 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/40">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <Badge className="absolute left-4 top-4 bg-blue-600">
          {course.category}
        </Badge>
      </div>

      <CardContent className="space-y-4 p-6">
        <div>
          <h3 className="text-xl font-bold">
            {course.title}
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            by {course.instructor}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-400">
          <div className="flex items-center gap-1">
            <Star
              className="fill-yellow-400 text-yellow-400"
              size={16}
            />

            {course.rating}
          </div>

          <div className="flex items-center gap-2">
            <Users size={16} />
            {course.students.toLocaleString()}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <span className="text-2xl font-bold text-blue-400">
          ${course.price}
        </span>

        <Button>
          Enroll
        </Button>
      </CardFooter>
    </Card>
  );
}