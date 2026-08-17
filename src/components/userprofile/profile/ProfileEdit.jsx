import { Mail, Phone, User } from "lucide-react";

const inputClass =
    "w-full h-11 pl-10 pr-3.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition";

function ProfileEditField({ id, label, icon: Icon, inputProps }) {
    return (
        <div>
            <label
                htmlFor={id}
                className="block mb-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400"
            >
                {label}
            </label>

            <div className="relative">
                {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}

                <input id={id} className={inputClass} {...inputProps} />
            </div>
        </div>
    );
}

export default function ProfileEdit({
    editName,
    editEmail,
    editPhone,
    onEditName,
    onEditPhone,
    onSaveProfile,
    onCancelEdit,
}) {
    return (
        <>
            <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                    Edit Profil
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Perbarui informasi pribadi yang terhubung dengan akun Anda.
                </p>
            </div>

            <div className="space-y-5">
                <ProfileEditField
                    id="profile-name"
                    label="Nama Lengkap"
                    icon={User}
                    inputProps={{
                        type: "text",
                        value: editName,
                        onChange: (e) => onEditName(e.target.value),
                        placeholder: "Masukkan nama lengkap",
                    }}
                />

                {/* Email (read-only) */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label
                            htmlFor="profile-email"
                            className="text-xs font-semibold text-gray-600 dark:text-gray-400"
                        >
                            Email
                        </label>

                        <span className="text-[10px] text-gray-400">Tidak dapat diubah</span>
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                        <input
                            id="profile-email"
                            type="email"
                            value={editEmail}
                            disabled
                            className="w-full h-11 pl-10 pr-3.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-500 cursor-not-allowed"
                        />
                    </div>
                </div>

                <ProfileEditField
                    id="profile-phone"
                    label="Nomor Telepon"
                    icon={Phone}
                    inputProps={{
                        type: "tel",
                        value: editPhone,
                        onChange: (e) => onEditPhone(e.target.value),
                        placeholder: "+62 8xx xxxx xxxx",
                    }}
                />
            </div>

            {/* Actions */}
            <div className="mt-7 pt-5 border-t border-gray-100 dark:border-gray-800 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                <button
                    type="button"
                    onClick={onCancelEdit}
                    className="h-10 px-5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                    Batal
                </button>

                <button
                    type="button"
                    onClick={onSaveProfile}
                    className="h-10 px-5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition"
                >
                    Simpan Perubahan
                </button>
            </div>
        </>
    );
}
