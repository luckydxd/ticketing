import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Upload, Printer } from "@phosphor-icons/react";
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
    return new Date(dateString).toLocaleString("id-ID", {
        day: "numeric",
        month: "long",
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
            return { kiboStatus: "online", text: "Sudah Dibayar" };
        case "checked_in":
            return { kiboStatus: "offline", text: "Sudah Check-in" };
        default:
            return { kiboStatus: "offline", text: "Unknown" };
    }
};

export default function Index({ auth, bookings }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Booking Saya
                </h2>
            }
        >
            <Head title="Booking Saya" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-4">
                    {bookings.length === 0 ? (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 text-center">
                                Anda belum memiliki riwayat booking.
                            </div>
                        </div>
                    ) : (
                        bookings.map((booking) => {
                            const { kiboStatus, text } = getStatusDetails(
                                booking.status
                            );

                            return (
                                <div
                                    key={booking.id}
                                    className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6"
                                >
                                    <div className="flex flex-col md:flex-row justify-between md:items-start">
                                        <div className="flex-1">
                                            <Status
                                                status={kiboStatus}
                                                className="w-fit"
                                            >
                                                <StatusIndicator />
                                                <StatusLabel>
                                                    {text}
                                                </StatusLabel>
                                            </Status>

                                            <h3 className="text-xl font-bold text-indigo-700 mt-2">
                                                {
                                                    booking.schedule.route
                                                        .origin_city
                                                }{" "}
                                                →{" "}
                                                {
                                                    booking.schedule.route
                                                        .destination_city
                                                }
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Kode Booking:{" "}
                                                <span className="font-medium text-gray-900">
                                                    {booking.booking_code}
                                                </span>
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Jadwal:{" "}
                                                <span className="font-medium text-gray-900">
                                                    {formatDate(
                                                        booking.schedule
                                                            .departure_time
                                                    )}
                                                </span>
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Kursi:{" "}
                                                <span className="font-medium text-gray-900">
                                                    {booking.booking_details
                                                        .map(
                                                            (detail) =>
                                                                detail.seat_number
                                                        )
                                                        .join(", ")}
                                                </span>
                                            </p>
                                        </div>

                                        <div className="text-left md:text-right mt-4 md:mt-0">
                                            <p className="text-2xl font-bold text-gray-900">
                                                {formatCurrency(
                                                    booking.total_price
                                                )}
                                            </p>

                                            <div className="mt-2">
                                                {booking.status ===
                                                    "pending" && (
                                                    <Button
                                                        asChild
                                                        className="w-full md:w-auto"
                                                    >
                                                        <Link
                                                            href={route(
                                                                "customer.payment.show",
                                                                booking.id
                                                            )}
                                                        >
                                                            {" "}
                                                            <Upload
                                                                className="mr-2"
                                                                size={16}
                                                            />
                                                            Upload Bukti
                                                        </Link>
                                                    </Button>
                                                )}
                                                {booking.status ===
                                                    "invoiced" && (
                                                    <Button
                                                        asChild
                                                        variant="outline"
                                                        className="w-full md:w-auto"
                                                    >
                                                        <Link
                                                            href={route(
                                                                "customer.invoice.show",
                                                                booking.id
                                                            )}
                                                        >
                                                            {" "}
                                                            <Printer
                                                                className="mr-2"
                                                                size={16}
                                                            />
                                                            Cetak Invoice
                                                        </Link>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
