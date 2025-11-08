import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import React from "react";
import {
    Dropzone,
    DropzoneContent,
    DropzoneEmptyState,
} from "@/Components/ui/dropzone";

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

export default function Upload({ auth, booking }) {
    const { data, setData, post, processing, errors, progress } = useForm({
        payment_proof: null,
    });

    const handleDrop = (files) => {
        if (files && files.length > 0) {
            setData("payment_proof", files[0]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.payment_proof) {
            Notify.failure("Silakan pilih file untuk di-upload.");
            return;
        }

        post(route("customer.payment.store", booking.id), {
            onError: (e) => {
                if (e.payment_proof) {
                    Notify.failure(e.payment_proof);
                }
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Upload Bukti Pembayaran
                </h2>
            }
        >
            <Head title="Upload Pembayaran" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="text-gray-600">
                                <p>Silakan lakukan pembayaran sebesar</p>
                                <p className="text-2xl font-bold text-indigo-700 my-2">
                                    {formatCurrency(booking.total_price)}
                                </p>
                                <p>
                                    untuk booking{" "}
                                    <strong className="text-gray-900">
                                        {booking.booking_code}
                                    </strong>
                                    .
                                </p>
                                <p className="mt-2 text-sm text-gray-500">
                                    {booking.schedule.route.origin_city} →{" "}
                                    {booking.schedule.route.destination_city}
                                    <br />
                                    {formatDate(
                                        booking.schedule.departure_time
                                    )}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Upload Bukti Transfer (Max 2MB)
                                </label>
                                <Dropzone
                                    accept={{ "image/*": [] }}
                                    maxFiles={1}
                                    maxSize={1024 * 1024 * 2}
                                    onDrop={handleDrop}
                                    onError={(err) => {
                                        console.error(err);
                                        Notify.failure(
                                            "File ditolak. Pastikan file adalah gambar dan di bawah 2MB."
                                        );
                                    }}
                                    src={
                                        data.payment_proof
                                            ? [data.payment_proof]
                                            : undefined
                                    }
                                >
                                    <DropzoneEmptyState />
                                    <DropzoneContent />
                                </Dropzone>
                                {errors.payment_proof && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.payment_proof}
                                    </p>
                                )}
                            </div>

                            {progress && (
                                <div className="w-full bg-gray-200 rounded-full">
                                    <div
                                        className="bg-indigo-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                                        style={{
                                            width: `${progress.percentage}%`,
                                        }}
                                    >
                                        {progress.percentage}%
                                    </div>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={processing || !data.payment_proof}
                                className="w-full justify-center"
                            >
                                {processing
                                    ? "Mengupload..."
                                    : "Simpan dan Konfirmasi"}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
