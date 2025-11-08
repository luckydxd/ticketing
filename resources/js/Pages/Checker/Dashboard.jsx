import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { QrCode } from "@phosphor-icons/react";

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

export default function Dashboard({ auth, schedulesToday }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Jadwal Keberangkatan Hari Ini
                </h2>
            }
        >
            <Head title="Dasbor Checker" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-4">
                    {schedulesToday.length === 0 ? (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 text-center">
                                Tidak ada jadwal keberangkatan hari ini.
                            </div>
                        </div>
                    ) : (
                        schedulesToday.map((schedule) => (
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
                                        Berangkat Pukul:{" "}
                                        {formatDate(schedule.departure_time)}
                                    </div>
                                </div>
                                <div>
                                    <Link
                                        href={route(
                                            "checker.scan.show",
                                            schedule.id
                                        )}
                                        className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700"
                                    >
                                        <QrCode size={16} className="mr-2" />
                                        Lihat Penumpang
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
