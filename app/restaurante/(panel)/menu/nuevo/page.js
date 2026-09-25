import MenuItemForm from "@/components/MenuItemForm";

export default function NuevoMenuItemPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Nuevo plato</h1>
      <div className="mt-6">
        <MenuItemForm />
      </div>
    </div>
  );
}
