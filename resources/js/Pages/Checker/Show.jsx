import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "@phosphor-icons/react";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import React, { useEffect } from "react";
import { Status, StatusIndicator, StatusLabel } from "@/Components/ui/status";

const getStatusDetails = (status) => {
    switch (status) {
        case "pending":
            return { kiboStatus: "degraded", text: "Pending" };
        case "confirmed":
            return { kiboStatus: "maintenance", text: "Terkonfirmasi" };
        case "invoiced":
            return { kiboStatus: "online", text: "Sudah Dibayar" };
        case "checked_in":
            return { kiboStatus: "offline", text: "Sudah Check-in" };
        default:
            return { kiboStatus: "offline", text: "Unknown" };
    }
};

export default function Show({ auth, schedule, passengers }) {
    const { flash, errors } = usePage().props;
    const { patch, processing } = useForm({});

    useEffect(() => {
        if (flash.message) Notify.success(flash.message);
        if (errors.error) Notify.failure(errors.error);
    }, [flash, errors]);

    const handleCheckIn = (bookingId) => {
        patch(route("checker.scan.update", bookingId), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Pengecekan: {schedule.route.origin_city} →{" "}
                    {schedule.route.destination_city}
                </h2>
            }
        >
            <Head title="Pengecekan Penumpang" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Penumpang
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Kursi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Kode Booking
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {passengers.map((booking) => {
                                    const { kiboStatus, text } =
                                        getStatusDetails(booking.status);

                                    return (
                                        <tr key={booking.id}>
                                            <td className="px-6 py-4">
                                                <Status
                                                    status={kiboStatus}
                                                    className="w-fit"
                                                >
                                                    <StatusIndicator />
                                                    <StatusLabel>
                                                        {text}
                                                    </StatusLabel>
                                                </Status>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {booking.booking_details
                                                    .map(
                                                        (pax) =>
                                                            pax.passenger_name
                                                    )
                                                    .join(", ")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {booking.booking_details
                                                    .map(
                                                        (pax) => pax.seat_number
                                                    )
                                                    .join(", ")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {booking.booking_code}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {booking.status ===
                                                    "invoiced" && (
                                                    <Button
                                                        onClick={() =>
                                                            handleCheckIn(
                                                                booking.id
                                                            )
                                                        }
                                                        disabled={processing}
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        <CheckCircle
                                                            size={16}
                                                            className="mr-1"
                                                        />
                                                        Check-in
                                                    </Button>
                                                )}
                                                {booking.status ===
                                                    "checked_in" && (
                                                    <span className="text-sm font-medium text-green-700">
                                                        Sudah Masuk
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {passengers.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-4 text-center text-gray-500"
                                        >
                                            Tidak ada penumpang terverifikasi
                                            untuk jadwal ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
