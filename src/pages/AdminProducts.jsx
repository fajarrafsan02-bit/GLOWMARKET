import { useState, useEffect, useCallback } from "react";
import AdminLayout from "../components/AdminLayout.jsx";
import api from "../api/Axios";
import { X, Search as SearchIcon } from "lucide-react";

export default function AdminProducts() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    nama: "",
    gambar: "",
    gambarPreview: "",
    harga: "",
    stock: "",
    karatEmas: "",
    beratGram: "",
    status: "TERSEDIA"
  });

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("admin_token");
      const res = await api.get("/api/produk", { headers: { Authorization: `Bearer ${token}` } });
      setItems(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal mengambil data produk";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchProducts = useCallback(async (nama) => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("admin_token");
      const res = await api.get("/api/produk/search", { params: { nama }, headers: { Authorization: `Bearer ${token}` } });
      setItems(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal mencari produk";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (query.trim().length > 0) searchProducts(query.trim());
      else fetchProducts();
    }, 300);
    return () => clearTimeout(t);
  }, [query, searchProducts, fetchProducts]);

  const openCreate = () => {
    setForm({ nama: "", gambar: "", gambarPreview: "", harga: "", stock: "", karatEmas: "", beratGram: "", status: "TERSEDIA" });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setForm({
      nama: p.nama || "",
      gambar: p.gambar || "",
      gambarPreview: p.gambar || "",
      harga: p.harga ? new Intl.NumberFormat("id-ID").format(p.harga) : "",
      stock: p.stock ?? "",
      karatEmas: p.karatEmas ?? "",
      beratGram: p.beratGram ?? "",
      status: p.status || "TERSEDIA"
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  const tryUploadImage = async (file) => {
    const token = localStorage.getItem("admin_token");
    const fd = new FormData();
    fd.append("file", file);
    const res = await api.post("/api/produk/upload-image", fd, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = res.data || {};
    const url = data.imageUrl;
    if (!url) throw new Error("Upload gagal: tidak ada URL gambar");
    return String(url);
  };

  const handlePriceChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    const formattedValue = rawValue ? new Intl.NumberFormat("id-ID").format(rawValue) : "";
    setForm({ ...form, harga: formattedValue });
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    if (!form.nama.trim()) {
      setError("Nama produk wajib diisi");
      return;
    }
    const hargaNum = Number(form.harga.replace(/\./g, ""));
    const stockNum = Number(form.stock);
    const karatNum = Number(form.karatEmas);
    const beratNum = Number(form.beratGram);
    if (Number.isNaN(hargaNum) || hargaNum < 0) {
      setError("Harga harus angka dan tidak boleh negatif");
      return;
    }
    if (Number.isNaN(stockNum) || stockNum < 0) {
      setError("Stock harus angka dan tidak boleh negatif");
      return;
    }
    if (Number.isNaN(karatNum) || karatNum <= 0) {
      setError("Karat emas harus angka dan lebih dari 0");
      return;
    }
    if (Number.isNaN(beratNum) || beratNum <= 0) {
      setError("Berat gram harus angka dan lebih dari 0");
      return;
    }
    const payload = {
      nama: form.nama.trim(),
      gambar: form.gambar ? String(form.gambar).slice(0, 500) : null,
      harga: hargaNum,
      stock: stockNum,
      karatEmas: karatNum,
      beratGram: beratNum,
      status: form.status
    };
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("admin_token");
      if (editingId) {
        await api.put(`/api/produk/${editingId}`, payload, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } });
      } else {
        await api.post("/api/produk", payload, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } });
      }
      setShowForm(false);
      await fetchProducts();
    } catch (err) {
      const msg = err.response?.data?.validationErrors
        ? Object.values(err.response.data.validationErrors).join(", ")
        : (err.response?.data?.message || "Gagal menyimpan produk");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Yakin ingin menghapus produk ini?")) return;
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("admin_token");
      await api.delete(`/api/produk/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      await fetchProducts();
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal menghapus produk";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (val) => {
    if (typeof val !== "number") return val;
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
  };

  return (
    <AdminLayout title="Produk" activeMenu="products">
      <div className="p-4 md:p-6">
        {/* Search & Tambah */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama produk..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition text-sm"
            />
          </div>
          <button
            onClick={openCreate}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-medium shadow-md transition flex items-center gap-2"
          >
            + Tambah Produk
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse border border-gray-200 dark:border-gray-700">
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && items.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-xl font-medium text-gray-700 dark:text-gray-300">Belum ada produk</p>
            <p className="text-gray-500 dark:text-gray-500 mt-2">Tambah produk pertama kamu sekarang</p>
          </div>
        )}

        {/* Produk List - Card di HP, Table di Desktop */}
        {!loading && items.length > 0 && (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Produk</th>
                    <th className="px-6 py-4">Harga</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {items.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                            {p.gambar ? (
                              <img src={p.gambar} alt={p.nama} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-2xl">✨</div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{p.nama}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{p.karatEmas}K • {p.beratGram}g</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        {formatPrice(p.harga)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={p.stock <= 5 ? "text-red-600 font-medium" : "text-gray-900 dark:text-white"}>
                          {p.stock} pcs
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-medium ${
                          p.status === "TERSEDIA" ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                          : p.status === "TIDAK_TERSEDIA" ? "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                        }`}>
                          {p.status === "TERSEDIA" ? "Tersedia" : p.status === "TIDAK_TERSEDIA" ? "Tidak Tersedia" : "Habis"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEdit(p)}
                            className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
                            title="Hapus"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-6">
              {items.map((p) => (
                <div key={p.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="aspect-square relative">
                    {p.gambar ? (
                      <img src={p.gambar} alt={p.nama} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-6xl">✨</div>
                    )}
                    <div className="absolute top-3 left-3 px-3 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-full">
                      {p.karatEmas}K
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{p.nama}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{p.karatEmas}K</span>
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{p.beratGram}g</span>
                    </div>
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-3">
                      {formatPrice(p.harga)}
                    </p>
                    <div className="flex justify-between items-center mb-4">
                      <span className={p.stock <= 5 ? "text-red-600 font-medium" : "text-gray-700 dark:text-gray-300"}>
                        Stock: {p.stock} pcs
                      </span>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                        p.status === "TERSEDIA" ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                      }`}>
                        {p.status === "TERSEDIA" ? "Tersedia" : "Habis"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="flex-1 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Modal Form - Full di HP */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-2xl max-h-[95vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingId ? "Edit Produk" : "Tambah Produk"}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <form onSubmit={saveProduct} className="p-5 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nama Produk</label>
                  <input
                    type="text"
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition text-sm"
                    placeholder="Nama produk"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gambar Produk</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const previewUrl = URL.createObjectURL(file);
                      try {
                        const uploadedUrl = await tryUploadImage(file);
                        setForm({ ...form, gambar: uploadedUrl, gambarPreview: previewUrl });
                      } catch {
                        setError("Upload gambar gagal");
                        setForm({ ...form, gambarPreview: previewUrl });
                      }
                    }}
                    className="block w-full text-sm text-gray-900 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-500 file:text-white hover:file:bg-amber-600"
                  />
                  {(form.gambarPreview || form.gambar) && (
                    <div className="mt-3 w-32 h-32 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600">
                      <img src={form.gambarPreview || form.gambar} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Harga</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                      <input
                        type="text"
                        value={form.harga}
                        onChange={handlePriceChange}
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Berat (gram)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={form.beratGram}
                      onChange={(e) => setForm({ ...form, beratGram: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Stock</label>
                    <input
                      type="number"
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                      placeholder="Stock"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Karat</label>
                    <input
                      type="number"
                      min="1"
                      max="24"
                      value={form.karatEmas}
                      onChange={(e) => setForm({ ...form, karatEmas: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                      placeholder="24"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  >
                    <option value="TERSEDIA">Tersedia</option>
                    <option value="TIDAK_TERSEDIA">Tidak Tersedia</option>
                    <option value="HABIS">Habis</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-medium transition disabled:opacity-70"
                  >
                    {loading ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}