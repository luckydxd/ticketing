import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import { PencilSimple, Trash, Plus } from "@phosphor-icons/react";

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

export default function Index({ auth, routes }) {
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
        origin_city: "",
        destination_city: "",
    });

    useEffect(() => {
        if (flash.message) {
            Notify.success(flash.message);
        }
    }, [flash]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route("admin.routes.update", data.id), {
                onSuccess: () => {
                    reset();
                    setIsEditing(false);
                },
            });
        } else {
            post(route("admin.routes.store"), {
                onSuccess: () => reset(),
            });
        }
    };

    const handleEdit = (route) => {
        setIsEditing(true);
        setData({
            id: route.id,
            origin_city: route.origin_city,
            destination_city: route.destination_city,
        });
        window.scrollTo(0, 0);
    };

    const handleDelete = (id) => {
        Confirm.show(
            "Konfirmasi Hapus",
            "Yakin ingin menghapus rute ini?",
            "Ya, Hapus",
            "Batal",
            () => {
                destroy(route("admin.routes.destroy", id));
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
                    Master Rute
                </h2>
            }
        >
            <Head title="Master Rute" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            {isEditing ? "Edit Rute" : "Tambah Rute Baru"}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="origin_city">
                                        Kota Asal
                                    </label>
                                    <TextInput
                                        id="origin_city"
                                        type="text"
                                        name="origin_city"
                                        value={data.origin_city}
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData(
                                                "origin_city",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    {errors.origin_city && (
                                        <div className="text-red-600 mt-1">
                                            {errors.origin_city}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="destination_city">
                                        Kota Tujuan
                                    </label>
                                    <TextInput
                                        id="destination_city"
                                        type="text"
                                        name="destination_city"
                                        value={data.destination_city}
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData(
                                                "destination_city",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    {errors.destination_city && (
                                        <div className="text-red-600 mt-1">
                                            {errors.destination_city}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing}>
                                    {isEditing ? "Update Rute" : "Simpan Rute"}
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
                            Daftar Rute
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            No
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Kota Asal
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Kota Tujuan
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {routes.map((route, index) => (
                                        <tr key={route.id}>
                                            <td className="px-6 py-4">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4">
                                                {route.origin_city}
                                            </td>
                                            <td className="px-6 py-4">
                                                {route.destination_city}
                                            </td>
                                            <td className="px-6 py-4 flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(route)
                                                    }
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    <PencilSimple size={20} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(route.id)
                                                    }
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <Trash size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {routes.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="px-6 py-4 text-center text-gray-500"
                                            >
                                                Belum ada data rute.
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
