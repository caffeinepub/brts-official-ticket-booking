import { Badge } from "@/components/ui/badge";

export type GameStatus =
  | "Pre-Alpha"
  | "Alpha"
  | "In Development"
  | "Available"
  | "Coming Soon";

interface StatusBadgeProps {
  status: GameStatus;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const getVariant = (status: GameStatus) => {
    switch (status) {
      case "Available":
        return "default";
      case "Pre-Alpha":
      case "Alpha":
        return "secondary";
      case "In Development":
      case "Coming Soon":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <Badge variant={getVariant(status)} className={className}>
      {status}
    </Badge>
  );
}
