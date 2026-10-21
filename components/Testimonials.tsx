import { Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/data";
import { StarRating } from "./StarRating";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Testimonials() {
  return (
    <div className="row">
      {TESTIMONIALS.map((item) => (
        <div className="col-lg-4 mb-4 mb-lg-0" key={item.id}>
          <div className="testimonial-2 nt-testimonial-2 h-100">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="nt-badge nt-badge-primary">
                {item.kind === "parent" ? "Parent" : "Student"}
              </span>
              <Quote size={20} aria-hidden="true" style={{ color: "#ccc" }} />
            </div>
            <StarRating rating={item.rating} showValue={false} className="mb-3" />
            <blockquote className="mb-4">
              <p>{item.quote}</p>
            </blockquote>
            <div className="d-flex v-card align-items-center">
              <span className="nt-testimonial-avatar mr-3">{initials(item.name)}</span>
              <div className="author-name">
                <span className="d-block">{item.name}</span>
                <span>{item.role}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
