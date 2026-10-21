import { Star } from "lucide-react";

export function StarRating({
  rating,
  count,
  size = 14,
  showValue = true,
  className = "",
}: {
  rating: number;
  count?: number;
  size?: number;
  showValue?: boolean;
  className?: string;
}) {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <span
      className={`nt-rating ${className}`}
      aria-label={`Rated ${rating.toFixed(1)} out of 5${count ? ` from ${count} reviews` : ""}`}
    >
      <span aria-hidden="true" style={{ display: "inline-flex", gap: 1 }}>
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rounded >= star;
          const half = !filled && rounded >= star - 0.5;
          return (
            <Star
              key={star}
              size={size}
              strokeWidth={2}
              fill={filled || half ? "currentColor" : "none"}
              style={{ color: "#ffc107" }}
            />
          );
        })}
      </span>
      {showValue ? <span>{rating.toFixed(1)}</span> : null}
      {typeof count === "number" ? (
        <span className="nt-muted" style={{ fontWeight: 400 }}>
          ({count})
        </span>
      ) : null}
    </span>
  );
}
