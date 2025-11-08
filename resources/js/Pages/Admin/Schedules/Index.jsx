import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import { PencilSimple, Trash } from "@phosphor-icons/react";
import { DateTimePicker } from "@/Components/DateTimePicker";

function TextInput({
    id,
    type,
    name,
    value,
    className,
    autoComplete,
    isFocused,
    onChange,
    required,
    step,
}) {
    return (
        <input
            id={id}
            type={type}
            name={name}
            value={value}
            className={
                `border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ` +
                className
            }
            autoComplete={autoComplete}
            onChange={onChange}
            required={required}
            step={step}
        />
    );
}

function PrimaryButton({ className = "", disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 ${
                    disabled && "opacity-25"
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}

const formatDateTimeForInput = (dateTimeString) => {
    if (!dateTimeString) return "";
    const date = new Date(dateTimeString);
    return date.toISOString().slice(0, 16);
};

export default function Index({ auth, schedules, routes }) {
    const { flash, errors } = usePage().props;
    const [isEditing, setIsEditing] = useState(false);

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        reset,
    } = useForm({
        id: "",
        route_id: "",
        departure_time: "",
        arrival_time: "",
        total_seats: "",
        price: "",
    });

    useEffect(() => {
        if (flash.message) {
            Notify.success(flash.message);
        }
    }, [flash]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route("admin.schedules.update", data.id), {
                onSuccess: () => {
                    reset();
                    setIsEditing(false);
                },
            });
        } else {
            post(route("admin.schedules.store"), {
                onSuccess: () => reset(),
            });
        }
    };

    const handleEdit = (schedule) => {
        setIsEditing(true);
        setData({
            id: schedule.id,
            route_id: schedule.route_id,
            departure_time: formatDateTimeForInput(schedule.departure_time),
            arrival_time: formatDateTimeForInput(schedule.arrival_time),
            total_seats: schedule.total_seats,
            price: schedule.price,
        });
        window.scrollTo(0, 0);
    };

    const handleDelete = (id) => {
        Confirm.show(
            "Konfirmasi Hapus",
            "Yakin ingin menghapus jadwal ini?",
            "Ya, Hapus",
            "Batal",
            () => {
                destroy(route("admin.schedules.destroy", id));
            }
        );
    };

    const handleCancel = () => {
        reset();
        setIsEditing(false);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Master Jadwal
                </h2>
            }
        >
            <Head title="Master Jadwal" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            {isEditing ? "Edit Jadwal" : "Tambah Jadwal Baru"}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="route_id">Rute</label>
                                <select
                                    id="route_id"
                                    name="route_id"
                                    value={data.route_id}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    onChange={(e) =>
                                        setData("route_id", e.target.value)
                                    }
                                    required
                                >
                                    <option value="">Pilih Rute</option>
                                    {routes.map((route) => (
                                        <option key={route.id} value={route.id}>
                                            {route.origin_city} -{" "}
                                            {route.destination_city}
                                        </option>
                                    ))}
                                </select>
                                {errors.route_id && (
                                    <div className="text-red-600 mt-1">
                                        {errors.route_id}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="departure_time">
                                        Waktu Berangkat
                                    </label>
                                    <DateTimePicker
                                        date={data.departure_time}
                                        setDate={(date) =>
                                            setData("departure_time", date)
                                        }
                                    />
                                    {errors.departure_time && (
                                        <div className="text-red-600 mt-1 text-sm">
                                            {errors.departure_time}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="arrival_time">
                                        Waktu Tiba
                                    </label>
                                    <DateTimePicker
                                        date={data.arrival_time}
                                        setDate={(date) =>
                                            setData("arrival_time", date)
                                        }
                                    />
                                    {errors.arrival_time && (
                                        <div className="text-red-600 mt-1 text-sm">
                                            {errors.arrival_time}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="total_seats">
                                        Total Kursi
                                    </label>
                                    <TextInput
                                        id="total_seats"
                                        type="number"
                                        name="total_seats"
                                        value={data.total_seats}
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData(
                                                "total_seats",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    {errors.total_seats && (
                                        <div className="text-red-600 mt-1">
                                            {errors.total_seats}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="price">Harga (Rp)</label>
                                    <TextInput
                                        id="price"
                                        type="number"
                                        name="price"
                                        value={data.price}
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData("price", e.target.value)
                                        }
                                        step="500"
                                        required
                                    />
                                    {errors.price && (
                                        <div className="text-red-600 mt-1">
                                            {errors.price}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing}>
                                    {isEditing
                                        ? "Update Jadwal"
                                        : "Simpan Jadwal"}
                                </PrimaryButton>
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="text-gray-600 hover:text-gray-900"
                                    >
                                        Batal
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Daftar Jadwal
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Rute
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Berangkat
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Tiba
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Kursi
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Harga
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {schedules.map((schedule) => (
                                        <tr key={schedule.id}>
                                            <td className="px-6 py-4">
                                                {schedule.route
                                                    ? `${schedule.route.origin_city} - ${schedule.route.destination_city}`
                                                    : "N/A"}
                                            </td>
                                            <td className="px-6 py-4">
                                                {new Date(
                                                    schedule.departure_time
                                                ).toLocaleString("id-ID")}
                                            </td>
                                            <td className="px-6 py-4">
                                                {new Date(
                                                    schedule.arrival_time
                                                ).toLocaleString("id-ID")}
                                            </td>
                                            <td className="px-6 py-4">
                                                {schedule.total_seats}
                                            </td>
                                            <td className="px-6 py-4">
                                                {new Intl.NumberFormat(
                                                    "id-ID",
                                                    {
                                                        style: "currency",
                                                        currency: "IDR",
                                                    }
                                                ).format(schedule.price)}
                                            </td>
                                            <td className="px-6 py-4 flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(schedule)
                                                    }
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    <PencilSimple size={20} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            schedule.id
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <Trash size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {schedules.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="px-6 py-4 text-center text-gray-500"
                                            >
                                                Belum ada data jadwal.
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
