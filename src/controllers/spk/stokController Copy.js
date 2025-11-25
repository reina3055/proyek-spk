import * as stokModel from "../../models/stokModel copy.js";
//import { autoKonversiNilai } from "../../utils/autoKonversiNilaiKlinis.js";



export const getAllStok = async (req, res) => {
  try {
    const data = await stokModel.getAllStok();
    res.json(data);
  } catch (err) {
    console.error("getAllStok error:", err);
    res.status(500).json({ message: "Gagal mengambil data stok obat" });
  }
};

export const getStokById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await stokModel.getStokById(id);
    if (!data) return res.status(404).json({ message: "Data stok tidak ditemukan" });
    res.json(data);
  } catch (err) {
    console.error("getStokById error:", err);
    res.status(500).json({ message: "Gagal mengambil detail stok" });
  }
};

export const createStok = async (req, res) => {
  try {
    const id = await stokModel.createStok(req.body);
    res.json({ message: "Stok obat berhasil ditambahkan", id });
  } catch (err) {
    console.error("createStok error:", err);
    res.status(500).json({ message: "Gagal menambahkan stok obat" });
  }
};

export const updateStok = async (req, res) => {
  try {
    const { id } = req.params;
    await stokModel.updateStok(id, req.body);
    res.json({ message: "Stok obat berhasil diperbarui" });
  } catch (err) {
    console.error("updateStok error:", err);
    res.status(500).json({ message: "Gagal memperbarui stok obat" });
  }
};

export const deleteStok = async (req, res) => {
  try {
    const { id } = req.params;
    await stokModel.deleteStok(id);
    res.json({ message: "Stok obat berhasil dihapus" });
  } catch (err) {
    console.error("deleteStok error:", err);
    res.status(500).json({ message: "Gagal menghapus stok obat" });
  }
};

//await autoKonversiNilai();