import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Printer } from "@phosphor-icons/react";

// --- Helper Functions (Boleh copy-paste) ---
const formatCurrency = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(number);
};
const formatDate = (dateString, options = {}) => {
    const defaultOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };
    return new Date(dateString).toLocaleString("id-ID", {
        ...defaultOptions,
        ...options,
    });
};
// --- Batas Helper ---

export default function Invoice({ auth, booking }) {
    // Fungsi untuk memicu print browser
    const handlePrint = () => {
        window.print();
    };

    return (
        // 'print:bg-white' membuat latar belakang putih saat dicetak
        <AuthenticatedLayout
            user={auth.user}
            // 'print:hidden' menyembunyikan header saat dicetak
            header={
                <div className="flex justify-between items-center print:hidden">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Invoice Pemesanan
                    </h2>
                    <Button onClick={handlePrint}>
                        <Printer size={16} className="mr-2" />
                        Cetak
                    </Button>
                </div>
            }
        >
            <Head title={`Invoice ${booking.booking_code}`} />

            {/* Konten Invoice */}
            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    {/* 'print:shadow-none' & 'print:border-none' menghapus hiasan saat cetak */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg print:shadow-none print:border-none">
                        <div className="p-8 border-b border-gray-200">
                            {/* Header Invoice */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        INVOICE
                                    </h2>
                                    <p className="text-lg font-semibold text-indigo-700">
                                        {booking.booking_code}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">
                                        Diterbitkan pada:
                                    </p>
                                    <p className="font-medium text-gray-700">
                                        {formatDate(new Date(), {
                                            hour: undefined,
                                            minute: undefined,
                                        })}
                                    </p>
                                    <p className="font-medium text-gray-700">
                                        Status:{" "}
                                        <span className="text-green-600">
                                            LUNAS
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Info Customer & Admin */}
                            <div className="grid grid-cols-2 gap-6 mt-8">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 uppercase">
                                        Dibayar Oleh:
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {booking.user.name}
                                    </p>
                                    <p className="text-gray-700">
                                        {booking.user.email}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-500 uppercase">
                                        Dikonfirmasi Oleh:
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {booking.admin.name}
                                    </p>
                                    <p className="text-gray-700">
                                        Petugas Admin
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Detail Perjalanan */}
                        <div className="p-8 border-b border-gray-200">
                            <p className="text-sm font-semibold text-gray-500 uppercase mb-3">
                                Detail Perjalanan
                            </p>
                            <h3 className="text-xl font-bold text-gray-900">
                                {booking.schedule.route.origin_city} →{" "}
                                {booking.schedule.route.destination_city}
                            </h3>
                            <p className="text-gray-700 mt-1">
                                {formatDate(booking.schedule.departure_time)}
                            </p>
                        </div>

                        {/* Detail Penumpang & Kursi */}
                        <div className="p-8">
                            <p className="text-sm font-semibold text-gray-500 uppercase mb-3">
                                Detail Penumpang
                            </p>
                            <table className="min-w-full">
                                <thead className="border-b border-gray-300">
                                    <tr>
                                        <th className="py-2 text-left text-sm font-medium text-gray-600">
                                            Nama Penumpang
                                        </th>
                                        <th className="py-2 text-right text-sm font-medium text-gray-600">
                                            Nomor Kursi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {booking.booking_details.map((detail) => (
                                        <tr
                                            key={detail.id}
                                            className="border-b border-gray-200"
                                        >
                                            <td className="py-3 text-gray-800">
                                                {detail.passenger_name}
                                            </td>
                                            <td className="py-3 text-right font-mono text-gray-800">
                                                {detail.seat_number}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                {/* Total */}
                                <tfoot className="border-t-2 border-gray-900">
                                    <tr>
                                        <td className="pt-4 text-right text-lg font-bold text-gray-900">
                                            Total Pembayaran
                                        </td>
                                        <td className="pt-4 text-right text-lg font-bold text-gray-900">
                                            {formatCurrency(
                                                booking.total_price
                                            )}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
