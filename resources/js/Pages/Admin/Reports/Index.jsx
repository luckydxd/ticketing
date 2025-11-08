import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React from "react";
import { Status, StatusIndicator, StatusLabel } from "@/Components/ui/status";

const formatCurrency = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(number);
};
const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};
const getStatusDetails = (status) => {
    switch (status) {
        case "pending":
            return { kiboStatus: "degraded", text: "Pending" };
        case "confirmed":
            return { kiboStatus: "maintenance", text: "Terkonfirmasi" };
        case "invoiced":
            return { kiboStatus: "online", text: "Dibayar" };
        case "checked_in":
            return { kiboStatus: "offline", text: "Check-in" };
        default:
            return { kiboStatus: "offline", text: "Unknown" };
    }
};

export default function Index({ auth, allBookings }) {
    const totalRevenue = allBookings
        .filter((b) => b.status === "invoiced" || b.status === "checked_in")
        .reduce((sum, b) => sum + parseFloat(b.total_price), 0);

    const totalPassengers = allBookings
        .filter((b) => b.status === "invoiced" || b.status === "checked_in")
        .reduce((sum, b) => sum + b.booking_details.length, 0);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Laporan Pemesanan Tiket
                </h2>
            }
        >
            <Head title="Laporan Pemesanan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-sm font-medium text-gray-500 uppercase">
                                Total Pendapatan (Lunas)
                            </h3>
                            <p className="text-3xl font-bold text-gray-900 mt-1">
                                {formatCurrency(totalRevenue)}
                            </p>
                        </div>
                        <div className="bg-white shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-sm font-medium text-gray-500 uppercase">
                                Total Penumpang (Lunas)
                            </h3>
                            <p className="text-3xl font-bold text-gray-900 mt-1">
                                {totalPassengers} Orang
                            </p>
                        </div>
                        <div className="bg-white shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-sm font-medium text-gray-500 uppercase">
                                Total Transaksi
                            </h3>
                            <p className="text-3xl font-bold text-gray-900 mt-1">
                                {allBookings.length} Transaksi
                            </p>
                        </div>
                    </div>

                    <div className="bg-white shadow-sm sm:rounded-lg overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Kode
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Jadwal
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Penumpang/Kursi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Petugas
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {allBookings.map((booking) => {
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
                                                {booking.booking_code}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {booking.user.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {
                                                    booking.schedule.route
                                                        .origin_city
                                                }{" "}
                                                →{" "}
                                                {
                                                    booking.schedule.route
                                                        .destination_city
                                                }
                                                <br />
                                                <span className="text-xs text-gray-400">
                                                    {formatDate(
                                                        booking.schedule
                                                            .departure_time
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {booking.booking_details
                                                    .map(
                                                        (d) =>
                                                            `${d.passenger_name} (${d.seat_number})`
                                                    )
                                                    .join(", ")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                                                {formatCurrency(
                                                    booking.total_price
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {booking.admin &&
                                                    `Admin: ${booking.admin.name}`}
                                                <br />
                                                {booking.checker &&
                                                    `Checker: ${booking.checker.name}`}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {allBookings.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-4 text-center text-gray-500"
                                        >
                                            Belum ada data laporan.
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
