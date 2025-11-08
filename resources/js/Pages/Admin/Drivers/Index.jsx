import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import { PencilSimple, Trash } from "@phosphor-icons/react";

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

export default function Index({ auth, drivers }) {
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
        name: "",
        phone_number: "",
    });

    useEffect(() => {
        if (flash.message) {
            Notify.success(flash.message);
        }
    }, [flash]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route("admin.drivers.update", data.id), {
                onSuccess: () => {
                    reset();
                    setIsEditing(false);
                },
            });
        } else {
            post(route("admin.drivers.store"), {
                onSuccess: () => reset(),
            });
        }
    };

    const handleEdit = (driver) => {
        setIsEditing(true);
        setData({
            id: driver.id,
            name: driver.name,
            phone_number: driver.phone_number,
        });
        window.scrollTo(0, 0);
    };

    const handleDelete = (id) => {
        Confirm.show(
            "Konfirmasi Hapus",
            "Yakin ingin menghapus data driver ini?",
            "Ya, Hapus",
            "Batal",
            () => {
                destroy(route("admin.drivers.destroy", id));
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
                    Master Driver
                </h2>
            }
        >
            <Head title="Master Driver" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            {isEditing ? "Edit Driver" : "Tambah Driver Baru"}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name">Nama Driver</label>
                                    <TextInput
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        required
                                    />
                                    {errors.name && (
                                        <div className="text-red-600 mt-1">
                                            {errors.name}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="phone_number">
                                        Nomor Telepon
                                    </label>
                                    <TextInput
                                        id="phone_number"
                                        type="text"
                                        name="phone_number"
                                        value={data.phone_number}
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData(
                                                "phone_number",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    {errors.phone_number && (
                                        <div className="text-red-600 mt-1">
                                            {errors.phone_number}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing}>
                                    {isEditing
                                        ? "Update Driver"
                                        : "Simpan Driver"}
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
                            Daftar Driver
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            No
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Nama Driver
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Nomor Telepon
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {drivers.map(
                                        (
                                            driver,
                                            index
                                        ) => (
                                            <tr key={driver.id}>
                                                <td className="px-6 py-4">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {driver.name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {driver.phone_number}
                                                </td>
                                                <td className="px-6 py-4 flex gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(driver)
                                                        }
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        <PencilSimple
                                                            size={20}
                                                        />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                driver.id
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <Trash size={20} />
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                    {drivers.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="px-6 py-4 text-center text-gray-500"
                                            >
                                                Belum ada data driver.
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
