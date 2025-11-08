import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils"; // Pastikan Anda punya fungsi 'cn' utility ini
import { Button } from "@/Components/ui/button"; // Sesuaikan path impor komponen shadcn Anda
import { Calendar } from "@/Components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { ScrollArea } from "@/Components/ui/scroll-area";

export function DateTimePicker({ date, setDate }) {
    const [selectedDate, setSelectedDate] = React.useState(
        date ? new Date(date) : undefined
    );
    const [selectedTime, setSelectedTime] = React.useState(
        date ? format(new Date(date), "HH:mm") : null
    );
    const [isOpen, setIsOpen] = React.useState(false);

    // Sinkronisasi state lokal dengan props dari luar (jika mode edit)
    React.useEffect(() => {
        if (date) {
            const d = new Date(date);
            setSelectedDate(d);
            setSelectedTime(format(d, "HH:mm"));
        }
    }, [date]);

    // Generate waktu per 30 menit (00:00 - 23:30)
    const availableTimes = [];
    for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 60; j += 30) {
            const hour = i.toString().padStart(2, "0");
            const minute = j.toString().padStart(2, "0");
            availableTimes.push(`${hour}:${minute}`);
        }
    }

    // Gabungkan Tanggal & Waktu saat keduanya dipilih
    const handleTimeSelect = (time) => {
        setSelectedTime(time);
        if (selectedDate) {
            const [hours, minutes] = time.split(":");
            const newDateTime = new Date(selectedDate);
            newDateTime.setHours(parseInt(hours), parseInt(minutes));

            // Kirim format ISO string lengkap ke parent component
            setDate(newDateTime.toISOString());
            setIsOpen(false); // Tutup popover setelah pilih waktu
        }
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        if (date && selectedTime) {
            const [hours, minutes] = selectedTime.split(":");
            const newDateTime = new Date(date);
            newDateTime.setHours(parseInt(hours), parseInt(minutes));
            setDate(newDateTime.toISOString());
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate && selectedTime ? (
                        format(
                            new Date(
                                selectedDate.setHours(
                                    ...selectedTime.split(":")
                                )
                            ),
                            "PPP HH:mm"
                        )
                    ) : (
                        <span>Pilih tanggal dan waktu</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <div className="flex divide-x overflow-hidden bg-white rounded-md">
                    {/* Kalender */}
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        initialFocus
                    />
                    {/* List Waktu */}
                    <div className="relative w-40">
                        <div className="absolute inset-0 grid gap-4">
                            <div className="p-3 text-center font-medium text-sm border-b">
                                Jam
                            </div>
                            <ScrollArea className="h-[300px]">
                                <div className="grid grid-cols-1 gap-1 p-2">
                                    {availableTimes.map((time) => (
                                        <Button
                                            key={time}
                                            variant={
                                                selectedTime === time
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            size="sm"
                                            onClick={() =>
                                                handleTimeSelect(time)
                                            }
                                            className="w-full"
                                        >
                                            {time}
                                        </Button>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
