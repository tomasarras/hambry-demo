"use client";

import { useState } from "react";
import CuisineIcon from "@/components/CuisineIcon";

// Renders a static demo photo when one exists for this slug, falling back to
// the cuisine-colored icon (see lib/images.js) if the file is missing or fails
// to load — e.g. a menu item created through the admin panel, which has no
// upload flow.
export default function FoodImage({ src, alt, cuisine, className = "" }) {
  const [broken, setBroken] = useState(false);

  if (!src || broken) {
    return <CuisineIcon cuisine={cuisine} className={className} />;
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} onError={() => setBroken(true)} className={`object-cover ${className}`} />;
}
