import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Ticket } from "@phosphor-icons/react";

export default function Dashboard({ auth, schedules }) {
    const { roles } = usePage().props.auth;
    const isCustomer = roles.includes("customer");

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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {!isCustomer && "Anda login sebagai Admin/Checker."}
                            {isCustomer &&
                                "Selamat datang! Silakan pilih jadwal keberangkatan Anda."}
                        </div>
                    </div>

                    {isCustomer && (
                        <div className="mt-6 space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Jadwal Tersedia
                            </h3>
                            {schedules.length === 0 && (
                                <div className="bg-white p-6 shadow-sm sm:rounded-lg text-center text-gray-500">
                                    Saat ini belum ada jadwal yang tersedia.
                                </div>
                            )}

                            {schedules.map((schedule) => (
                                <div
                                    key={schedule.id}
                                    className="bg-white p-6 shadow-sm sm:rounded-lg flex justify-between items-center"
                                >
                                    <div>
                                        <div className="font-bold text-xl text-indigo-700">
                                            {schedule.route.origin_city} →{" "}
                                            {schedule.route.destination_city}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            Berangkat:{" "}
                                            {formatDate(
                                                schedule.departure_time
                                            )}
                                        </div>
                                        <div className="text-lg font-semibold text-gray-800 mt-2">
                                            {formatCurrency(schedule.price)}
                                        </div>
                                    </div>
                                    <div>
                                        <Link
                                            href={route("dashboard")}
                                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900"
                                        >
                                            <Ticket
                                                size={16}
                                                className="mr-2"
                                            />
                                            Pesan Tiket
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
