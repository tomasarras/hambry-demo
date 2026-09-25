import { ClipboardCheck, ChefHat, CookingPot, Bike, PartyPopper, XCircle } from "lucide-react";
import { STATUS_FLOW, STATUS_LABELS, STATUS_DESCRIPTIONS } from "@/lib/orderStatus";

const ICONS = {
  RECEIVED: ClipboardCheck,
  CONFIRMED: ChefHat,
  PREPARING: CookingPot,
  ON_THE_WAY: Bike,
  DELIVERED: PartyPopper,
};

export default function OrderStatusTimeline({ status }) {
  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
        <XCircle size={24} />
        <div>
          <p className="font-semibold">{STATUS_LABELS.CANCELLED}</p>
          <p className="text-sm">{STATUS_DESCRIPTIONS.CANCELLED}</p>
        </div>
      </div>
    );
  }

  const currentIndex = STATUS_FLOW.indexOf(status);

  return (
    <ol className="space-y-0">
      {STATUS_FLOW.map((step, index) => {
        const Icon = ICONS[step];
        const done = index < currentIndex;
        const active = index === currentIndex;
        const isLast = index === STATUS_FLOW.length - 1;

        return (
          <li key={step} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  done || active ? "bg-accent text-accent-foreground" : "bg-black/5 text-black/30"
                }`}
              >
                <Icon size={18} />
              </span>
              {!isLast && <span className={`w-0.5 flex-1 ${done ? "bg-accent" : "bg-black/10"}`} style={{ minHeight: 24 }} />}
            </div>
            <div className={`pb-6 ${active ? "" : done ? "opacity-70" : "opacity-40"}`}>
              <p className="font-semibold">{STATUS_LABELS[step]}</p>
              {active && <p className="text-sm text-black/60">{STATUS_DESCRIPTIONS[step]}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
