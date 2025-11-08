import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import React, { useEffect } from "react";
import { FileText } from "@phosphor-icons/react";

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export default function Index({
    auth,
    availableSchedules,
    createdSuratJalan,
    buses,
    drivers,
}) {
    const { flash, errors } = usePage().props;

    const { data, setData, post, processing, reset } = useForm({
        schedule_id: "",
        bus_id: "",
        driver_id: "",
    });

    useEffect(() => {
        if (flash.message) {
            Notify.success(flash.message);
        }
    }, [flash]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.suratjalan.store"), {
            onSuccess: () => reset(),
            onError: (e) => {
                if (e.schedule_id)
                    Notify.failure("Jadwal ini sudah dibuatkan surat jalan.");
                else
                    Notify.failure(
                        "Gagal membuat surat jalan. Periksa kembali input Anda."
                    );
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Buat Surat Jalan
                </h2>
            }
        >
            <Head title="Buat Surat Jalan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Form Pembuatan Surat Jalan
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="schedule_id"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Pilih Jadwal
                                </label>
                                <select
                                    id="schedule_id"
                                    name="schedule_id"
                                    value={data.schedule_id}
                                    onChange={(e) =>
                                        setData("schedule_id", e.target.value)
                                    }
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    required
                                >
                                    <option value="">
                                        -- Pilih Jadwal yang Akan Berangkat --
                                    </option>
                                    {availableSchedules.map((schedule) => (
                                        <option
                                            key={schedule.id}
                                            value={schedule.id}
                                        >
                                            {schedule.route.origin_city} →{" "}
                                            {schedule.route.destination_city} (
                                            {formatDate(
                                                schedule.departure_time
                                            )}
                                            )
                                        </option>
                                    ))}
                                    {availableSchedules.length === 0 && (
                                        <option disabled>
                                            Tidak ada jadwal yang siap.
                                        </option>
                                    )}
                                </select>
                                {errors.schedule_id && (
                                    <div className="text-red-600 mt-1">
                                        {errors.schedule_id}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="bus_id"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Pilih Bus
                                    </label>
                                    <select
                                        id="bus_id"
                                        name="bus_id"
                                        value={data.bus_id}
                                        onChange={(e) =>
                                            setData("bus_id", e.target.value)
                                        }
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        required
                                    >
                                        <option value="">
                                            -- Pilih Bus --
                                        </option>
                                        {buses.map((bus) => (
                                            <option key={bus.id} value={bus.id}>
                                                {bus.name} ({bus.license_plate})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.bus_id && (
                                        <div className="text-red-600 mt-1">
                                            {errors.bus_id}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="driver_id"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Pilih Driver
                                    </label>
                                    <select
                                        id="driver_id"
                                        name="driver_id"
                                        value={data.driver_id}
                                        onChange={(e) =>
                                            setData("driver_id", e.target.value)
                                        }
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        required
                                    >
                                        <option value="">
                                            -- Pilih Driver --
                                        </option>
                                        {drivers.map((driver) => (
                                            <option
                                                key={driver.id}
                                                value={driver.id}
                                            >
                                                {driver.name} (
                                                {driver.phone_number})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.driver_id && (
                                        <div className="text-red-600 mt-1">
                                            {errors.driver_id}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={
                                    processing ||
                                    availableSchedules.length === 0
                                }
                            >
                                <FileText size={16} className="mr-2" />
                                Buat Surat Jalan
                            </Button>
                        </form>
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Daftar Surat Jalan (Sudah Dibuat)
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Jadwal
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Bus
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Driver
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Dibuat Oleh
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {createdSuratJalan.map((sj) => (
                                        <tr key={sj.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {sj.schedule.route.origin_city}{" "}
                                                -{" "}
                                                {
                                                    sj.schedule.route
                                                        .destination_city
                                                }
                                                <br />
                                                <span className="text-xs text-gray-400">
                                                    {formatDate(
                                                        sj.schedule
                                                            .departure_time
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {sj.bus.name} (
                                                {sj.bus.license_plate})
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {sj.driver.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {sj.admin.name}
                                            </td>
                                        </tr>
                                    ))}
                                    {createdSuratJalan.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="px-6 py-4 text-center text-gray-500"
                                            >
                                                Belum ada surat jalan yang
                                                dibuat.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
