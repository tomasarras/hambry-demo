import { getCuisineStyle } from "@/lib/cuisineStyle";

export default function CuisineIcon({ cuisine, className = "" }) {
  const { icon: Icon, className: styleClass } = getCuisineStyle(cuisine);
  return (
    <div className={`flex items-center justify-center ${styleClass} ${className}`}>
      <Icon size={28} strokeWidth={1.75} />
    </div>
  );
}
