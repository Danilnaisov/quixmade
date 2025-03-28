"use client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function Toast() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast("Event has been created", {
          description: "Sunday, December 03, 2023 at 9:00 AM",
          action: {
            label: "Ок",
            onClick: () => console.log("Ок"),
          },
        })
      }
    >
      Show Toast
    </Button>
  );
}
