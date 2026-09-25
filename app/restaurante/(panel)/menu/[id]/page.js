"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import MenuItemForm from "@/components/MenuItemForm";

export default function EditMenuItemPage({ params }) {
  const { id } = use(params);
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetch(`/api/menu-items/${id}`)
      .then((res) => res.json())
      .then(setItem);
  }, [id]);

  if (!item) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold">Editar plato</h1>
      <div className="mt-6">
        <MenuItemForm item={item} />
      </div>
    </div>
  );
}
