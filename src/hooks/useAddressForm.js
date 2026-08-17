import { useState, useEffect } from "react";
import api from "../api/Axios.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function useAddressForm({ userName, notify, setShowAuth }) {
    const { isAuthenticated, user } = useAuth();
    const [addrProvince, setAddrProvince] = useState("");
    const [addrCity, setAddrCity] = useState("");
    const [addrDistrict, setAddrDistrict] = useState("");
    const [addrVillage, setAddrVillage] = useState("");
    const [addrPostal, setAddrPostal] = useState("");
    const [addrLine, setAddrLine] = useState("");
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [villages, setVillages] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [selectedDefaultId, setSelectedDefaultId] = useState(null);

    /*
     * Lewat backend kita (bukan langsung ke domain emsifa/kodepos dari
     * browser) — form alamat tidak lagi bergantung pada DNS/jaringan milik
     * pengguna ke domain pihak ketiga (lihat WilayahController di backend).
     */
    const fetchList = async (path) => {
        const res = await api.get(`/api/wilayah/${path}`);
        const list = res.data?.data;
        return Array.isArray(list) ? list : [];
    };

    useEffect(() => {
        const loadProvinces = async () => {
            try {
                const list = await fetchList("provinces");
                setProvinces(list);
            } catch (error) {
                console.error("Error loading provinces:", error);
            }
        };
        loadProvinces();

        const loadAddress = async () => {
            if (!isAuthenticated) return;
            try {
                const res = await api.get("/api/alamat");
                const list = Array.isArray(res.data?.data)
                    ? res.data.data
                    : Array.isArray(res.data)
                      ? res.data
                      : [];
                setAddresses(list);
                const a = Array.isArray(list)
                    ? list.find((x) => x.isDefault || x.is_default) || list[0]
                    : res.data?.data || res.data || null;
                if (a) {
                    setSelectedDefaultId(a.id || null);
                    const pName = a.provinsi || a.province || "";
                    const cName = a.kota || a.kabupaten || a.city || "";
                    const dName = a.kecamatan || a.district || "";
                    const vName = a.kelurahan || a.village || "";
                    const p = provinces.find(
                        (pr) => (pr.name || "").toLowerCase() === (pName || "").toLowerCase(),
                    );
                    const provinceId = p?.id || "";
                    setAddrProvince(provinceId);
                    if (provinceId) {
                        try {
                            const cArr = await fetchList(`regencies/${provinceId}`);
                            setCities(cArr);
                            const c = cArr.find(
                                (ci) =>
                                    (ci.name || "").toLowerCase() === (cName || "").toLowerCase(),
                            );
                            const cityId = c?.id || "";
                            setAddrCity(cityId);
                            if (cityId) {
                                const dArr = await fetchList(`districts/${cityId}`);
                                setDistricts(dArr);
                                const d = dArr.find(
                                    (di) =>
                                        (di.name || "").toLowerCase() ===
                                        (dName || "").toLowerCase(),
                                );
                                const districtId = d?.id || "";
                                setAddrDistrict(districtId);
                                if (districtId) {
                                    const vArr = await fetchList(`villages/${districtId}`);
                                    setVillages(vArr);
                                    const v = vArr.find(
                                        (vi) =>
                                            (vi.name || "").toLowerCase() ===
                                            (vName || "").toLowerCase(),
                                    );
                                    const villageId = v?.id || "";
                                    setAddrVillage(villageId);
                                }
                            }
                        } catch (error) {
                            console.error("Error loading address details:", error);
                        }
                    }
                    setAddrPostal(a.kodePos || a.postalCode || "");
                    setAddrLine(a.alamat || a.alamatLengkap || a.shippingAddress || "");
                }
            } catch (error) {
                console.error("Error loading address:", error);
            }
        };
        loadAddress();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onProvinceChange = async (id) => {
        setAddrProvince(id);
        setAddrCity("");
        setAddrDistrict("");
        setAddrVillage("");
        setCities([]);
        setDistricts([]);
        setVillages([]);
        if (!id) return;
        try {
            setCities(await fetchList(`regencies/${id}`));
        } catch (error) {
            console.error("Error loading cities:", error);
        }
    };

    const onCityChange = async (id) => {
        setAddrCity(id);
        setAddrDistrict("");
        setAddrVillage("");
        setDistricts([]);
        setVillages([]);
        if (!id) return;
        try {
            setDistricts(await fetchList(`districts/${id}`));
        } catch (error) {
            console.error("Error loading districts:", error);
        }
    };

    const onDistrictChange = async (id) => {
        setAddrDistrict(id);
        setAddrVillage("");
        setVillages([]);
        if (!id) return;
        try {
            setVillages(await fetchList(`villages/${id}`));
        } catch (error) {
            console.error("Error loading villages:", error);
        }
    };

    const onVillageChange = async (id) => {
        setAddrVillage(id);
        if (!id) return;
        try {
            const village = villages.find((v) => String(v.id) === String(id));
            const dName =
                districts.find((d) => String(d.id) === String(addrDistrict))?.name || addrDistrict;
            const cName = cities.find((c) => String(c.id) === String(addrCity))?.name || addrCity;
            const pName =
                provinces.find((p) => String(p.id) === String(addrProvince))?.name || addrProvince;
            const q = `${village?.name || id} ${dName} ${cName} ${pName}`;
            const res = await api.get("/api/wilayah/kode-pos", { params: { q } });
            const list = res.data?.data || [];
            if (Array.isArray(list) && list.length) {
                setAddrPostal(list[0].postalcode || list[0].kodepos || "");
            }
        } catch (error) {
            console.error("Error fetching postal code:", error);
        }
    };

    const reloadAddresses = async () => {
        try {
            const res = await api.get("/api/alamat");
            const list = Array.isArray(res.data?.data)
                ? res.data.data
                : Array.isArray(res.data)
                  ? res.data
                  : [];
            setAddresses(list);
            return list;
        } catch (error) {
            console.error("Error reloading addresses:", error);
            return [];
        }
    };

    const saveAddress = async () => {
        if (!isAuthenticated) {
            setShowAuth(true);
            return;
        }
        try {
            const pName = provinces.find((p) => String(p.id) === String(addrProvince))?.name || "";
            const cName = cities.find((c) => String(c.id) === String(addrCity))?.name || "";
            const dName = districts.find((d) => String(d.id) === String(addrDistrict))?.name || "";
            const vName = villages.find((v) => String(v.id) === String(addrVillage))?.name || "";

            if (!pName || !cName || !dName || !vName || !addrLine) {
                notify("Lengkapi semua field alamat", "error", 3000);
                return;
            }

            const payload = {
                namaLengkap: userName,
                nomorTelepon: user?.noHp || "",
                alamatLengkap: `${addrLine}, ${vName}, ${dName}, ${cName}, ${pName}${addrPostal ? " " + addrPostal : ""}`,
                provinsi: pName,
                kota: cName,
                kecamatan: dName,
                kelurahan: vName,
                kodePos: addrPostal,
                isDefault: true,
                catatan: "",
            };

            const normalize = (s) =>
                String(s || "")
                    .replace(/\s+/g, " ")
                    .trim()
                    .toLowerCase();
            const fullNew = normalize(payload.alamatLengkap);
            const match = Array.isArray(addresses)
                ? addresses.find(
                      (a) =>
                          normalize(a.alamatLengkap || a.alamat || a.shippingAddress) === fullNew,
                  )
                : null;

            if (match?.id) {
                await api.put(`/api/alamat/${match.id}`, payload);
                notify("Alamat sudah sama • diperbarui sebagai default", "success", 3000);
            } else {
                await api.post("/api/alamat", payload);
                notify("Alamat baru ditambahkan", "success", 3000);
            }
            await reloadAddresses();
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Gagal menyimpan alamat";
            notify(msg, "error", 4000);
        }
    };

    const setPrimaryAddress = async (id) => {
        if (!isAuthenticated) {
            setShowAuth(true);
            return;
        }
        try {
            setSelectedDefaultId(id);
            const target = addresses.find((a) => String(a.id) === String(id));
            if (!target) return;
            const payload = {
                ...(target || {}),
                isDefault: true,
                is_default: true,
            };
            // Endpoint khusus untuk menandai alamat utama
            await api.put(`/api/alamat/${id}/set-default`, payload);
            const ok = true;

            if (ok) {
                const list = await reloadAddresses();
                const a = Array.isArray(list)
                    ? list.find((x) => x.isDefault || x.is_default) || list[0]
                    : null;
                if (a) {
                    setAddrProvince(a.provinsi || a.province || "");
                    setAddrCity(a.kota || a.kabupaten || a.city || "");
                    setAddrDistrict(a.kecamatan || a.district || "");
                    setAddrVillage(a.kelurahan || a.village || "");
                    setAddrPostal(a.kodePos || a.postalCode || "");
                    setAddrLine(a.alamat || a.alamatLengkap || a.shippingAddress || "");
                }
                notify("Alamat utama berhasil diatur", "success", 2500);
            }
        } catch (err) {
            const msg = err.response?.data?.message || "Gagal mengatur alamat utama";
            notify(msg, "error", 3000);
        }
    };

    const getDisplayAddress = () => {
        const active =
            addresses.find(
                (a) => a.isDefault || a.is_default || String(a.id) === String(selectedDefaultId),
            ) || addresses[0];
        if (active) {
            if (active.alamatLengkap) return active.alamatLengkap;

            const parts = [
                active.alamat || active.shippingAddress,
                active.kelurahan || active.village,
                active.kecamatan || active.district,
                active.kota || active.kabupaten || active.city,
                active.provinsi || active.province,
                active.kodePos || active.postalCode,
            ];
            const constructed = parts.filter((p) => p && String(p).trim() !== "").join(", ");
            if (constructed.length > 10) return constructed;

            return active.alamat || active.shippingAddress || addrLine;
        }
        return addrLine || "Belum diatur";
    };

    return {
        addrProvince,
        addrCity,
        addrDistrict,
        addrVillage,
        addrPostal,
        addrLine,
        provinces,
        cities,
        districts,
        villages,
        addresses,
        selectedDefaultId,
        onProvinceChange,
        onCityChange,
        onDistrictChange,
        onVillageChange,
        onPostalChange: setAddrPostal,
        onLineChange: setAddrLine,
        saveAddress,
        setPrimaryAddress,
        getDisplayAddress,
    };
}
