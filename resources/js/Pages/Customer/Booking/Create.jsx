import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import TextInput from "@/Components/TextInput";

export default function Create({ auth, schedule, bookedSeats }) {
    const [selectedSeats, setSelectedSeats] = useState([]);

    const { data, setData, post, processing, errors } = useForm({
        schedule_id: schedule.id,
        seats: [],
        passengers: {},
        total_price: 0,
    });
    const formatCurrency = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(number);
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleSeatClick = (seatName) => {
        if (bookedSeats.includes(seatName)) {
            Notify.failure("Kursi ini sudah dipesan orang lain.");
            return;
        }

        // Tentukan data baru berdasarkan apakah kursi sudah dipilih
        const newSelectedSeats = selectedSeats.includes(seatName)
            ? selectedSeats.filter((s) => s !== seatName)
            : [...selectedSeats, seatName];

        setSelectedSeats(newSelectedSeats); // <-- Kita masih perlu ini untuk me-render UI

        // --- INI BAGIAN PENTING ---
        // Buat ulang objek 'passengers' berdasarkan 'newSelectedSeats'
        let newPassengers = {};
        for (const seat of newSelectedSeats) {
            // Pertahankan nama penumpang yang ada jika kursinya masih dipilih
            newPassengers[seat] = data.passengers[seat] || "";
        }

        // Perbarui seluruh form data dalam satu panggilan
        setData({
            ...data, // Pertahankan schedule_id
            seats: newSelectedSeats, // Perbarui 'seats'
            passengers: newPassengers, // Perbarui 'passengers'
            total_price: schedule.price * newSelectedSeats.length, // Perbarui 'total_price'
        });
    };

    const renderSeats = () => {
        const rows = 10;
        const cols = ["A", "B", "C", "D"];
        let seatMap = [];

        for (let i = 1; i <= rows; i++) {
            let rowSeats = [];
            for (const col of cols) {
                const seatName = `${i}${col}`;
                const isBooked = bookedSeats.includes(seatName);
                const isSelected = selectedSeats.includes(seatName);

                let seatClass =
                    "w-12 h-12 rounded border-2 flex items-center justify-center font-semibold";
                if (isBooked) {
                    seatClass +=
                        " bg-gray-300 text-gray-500 cursor-not-allowed";
                } else if (isSelected) {
                    seatClass += " bg-indigo-600 text-white border-indigo-800";
                } else {
                    seatClass +=
                        " bg-gray-50 text-gray-700 border-gray-300 hover:bg-indigo-100 cursor-pointer";
                }

                rowSeats.push(
                    <div
                        key={seatName}
                        onClick={() => handleSeatClick(seatName)}
                        className={seatClass}
                    >
                        {seatName}
                    </div>
                );
            }
            seatMap.push(
                <div key={i} className="flex justify-center gap-2">
                    {rowSeats}
                </div>
            );
        }
        return <div className="space-y-2">{seatMap}</div>;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validasi frontend (tetap sama)
        if (data.seats.length === 0) {
            Notify.failure("Silakan pilih minimal 1 kursi.");
            return;
        }

        // Cek jika ada nama penumpang yang kosong
        for (const seat of data.seats) {
            if (!data.passengers[seat] || data.passengers[seat].trim() === "") {
                Notify.failure(
                    `Nama penumpang untuk kursi ${seat} tidak boleh kosong.`
                );
                return;
            }
        }

        // --- INI BAGIAN PENTING ---
        // Ubah 'passengers' dari object { '1A': 'Udin' } menjadi array ['Udin']
        // Ini harus dilakukan tepat sebelum post
        const finalPassengersArray = data.seats.map(
            (seat) => data.passengers[seat]
        );

        // Kirim ke backend
        post(route("customer.booking.store"), {
            // Kita perlu 'transform' data sekali lagi untuk mengirim format yang benar
            data: {
                ...data,
                passengers: finalPassengersArray,
            },
            onSuccess: () => {
                // Sudah di-handle oleh redirect
            },
            onError: (e) => {
                if (e.seat) Notify.failure(e.seat);
                else if (e.error) Notify.failure(e.error);
                else Notify.failure("Terjadi kesalahan validasi.");
            },
        });
    };

    const handlePassengerNameChange = (seat, name) => {
        setData("passengers", {
            ...data.passengers,
            [seat]: name,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Pesan Tiket
                </h2>
            }
        >
            <Head title="Pesan Tiket" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <div className="p-6 bg-white shadow-sm sm:rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Data Penumpang
                            </h3>
                            {selectedSeats.length === 0 ? (
                                <p className="text-gray-500">
                                    Silakan pilih kursi untuk mengisi data
                                    penumpang.
                                </p>
                            ) : (
                                <form className="space-y-4">
                                    {selectedSeats.map((seat) => (
                                        <div key={seat}>
                                            <label
                                                htmlFor={`passenger-${seat}`}
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Nama Penumpang (Kursi {seat})
                                            </label>
                                            <TextInput
                                                id={`passenger-${seat}`}
                                                type="text"
                                                value={
                                                    data.passengers[seat] || ""
                                                }
                                                onChange={(e) =>
                                                    handlePassengerNameChange(
                                                        seat,
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full"
                                                placeholder={`Nama untuk kursi ${seat}`}
                                                required
                                            />
                                            {errors[
                                                `passengers.${selectedSeats.indexOf(
                                                    seat
                                                )}`
                                            ] && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {
                                                        errors[
                                                            `passengers.${selectedSeats.indexOf(
                                                                seat
                                                            )}`
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </form>
                            )}
                        </div>
                    </div>

                    <div className="p-6 bg-white shadow-sm sm:rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Pilih Kursi
                        </h3>
                        {renderSeats()}{" "}
                    </div>

                    <div className="md:col-span-3">
                        <div className="p-6 bg-white shadow-sm sm:rounded-lg space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Rangkuman Pesanan
                            </h3>

                            <div>
                                <h4 className="font-semibold">
                                    Kursi Dipilih:
                                </h4>
                                {selectedSeats.length === 0 ? (
                                    <span className="text-gray-500">
                                        Belum ada kursi dipilih
                                    </span>
                                ) : (
                                    <div className="font-bold text-indigo-700 text-xl">
                                        {selectedSeats.join(", ")}
                                    </div>
                                )}
                            </div>

                            <hr />

                            <div className="text-xl font-bold flex justify-between">
                                <span>Total:</span>
                                <span>
                                    {formatCurrency(
                                        schedule.price * selectedSeats.length
                                    )}
                                </span>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <Button
                                    className="w-full justify-center"
                                    disabled={
                                        processing || selectedSeats.length === 0
                                    }
                                >
                                    Booking Sekarang
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
