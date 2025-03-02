import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Images, Star } from "lucide-react";

export function CardSkeleton() {
  return (
    <div className="flex flex-col items-left w-[268px] h-[400px] bg-[#fff] p-[10px] justify-between  rounded-[10px]">
      <div className="flex flex-col items-left gap-[10px]">
        <div>
          <div className="absolute flex flex-col items-start justify-between w-[248px] h-[248px] p-[10px]">
            <div className="flex items-start justify-between w-[100%]">
              <div className="flex flex-col items-start gap-[5px]">
                <Badge className="rounded-[15px] w-[auto] h-[27px] text-center p-[6px] bg-[#274c5b] text-[#fff] cursor-default text-[15px] outline-none">
                  Wireless
                </Badge>
                <Badge className="rounded-[15px] w-[auto] h-[27px] text-center p-[12px] bg-[#f5f5f5] text-[#274c5b] cursor-default text-[15px] outline-none">
                  Нет в наличии
                </Badge>
              </div>
            </div>
            <Badge className="rounded-[15px] w-[auto] h-[27px] text-center p-[7px] bg-[#efd372] text-[#274c5b] cursor-default text-[15px] outline-none">
              Sale
            </Badge>
          </div>
          <Skeleton className="w-[248px] h-[248px] rounded-[10px] flex justify-center items-center">
            <Images color="#333" size={64} />
          </Skeleton>
        </div>
        <div className="flex gap-[8px] text-[18px] font-medium">
          <h2 className="text-[18px] font-[700] text-[#F20D0D]">
            <Skeleton className="h-[27px] w-[70px]" />
          </h2>
          <h2 className="line-through text-[13px] font-[700] text-[#274C5B]">
            <Skeleton className="h-[18px] w-[52px]" />
          </h2>
        </div>
      </div>
      <div className="flex flex-col gap-[5px] text-[18px] font-medium">
        <h2>
          <Skeleton className="h-[50px] w-[100%]" />
        </h2>
        <div className="flex gap-[5px] text-[18px] font-medium">
          <Star color="#ff9d00" fill="#ff9d00" />
          <h2>
            <Skeleton className="h-[27px] w-[27px]" />
          </h2>
        </div>
      </div>
    </div>
  );
}
