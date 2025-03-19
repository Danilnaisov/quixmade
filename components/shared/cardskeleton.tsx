import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Images, Star } from "lucide-react";

export function CardSkeleton() {
  return (
    <div className="card-item flex flex-col items-start bg-white p-4 rounded-[10px] shadow-md w-full h-full min-w-[220px]">
      <div className="relative w-full aspect-square">
        <Skeleton className="w-full h-full rounded-[10px] flex justify-center items-center">
          <Images color="#333" size={64} />
        </Skeleton>
        <div className="absolute inset-0 flex flex-col justify-between p-3">
          <div className="flex flex-col gap-2">
            <Badge className="rounded-full px-3 py-1 bg-gray-200 text-gray-700 text-xs w-fit">
              Нет в наличии
            </Badge>
            <Badge className="rounded-full px-3 py-1 bg-[#274c5b] text-white text-xs w-fit">
              Wireless
            </Badge>
          </div>
          <Badge className="absolute top-2 right-2 rounded-full px-3 py-1 bg-[#efd372] text-[#274c5b] text-xs w-fit">
            Sale
          </Badge>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-3 w-full">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-5 w-full" />
        <div className="flex items-center gap-1">
          <Star color="#ff9d00" fill="#ff9d00" size={16} />
          <Skeleton className="h-4 w-8" />
        </div>
      </div>
    </div>
  );
}
