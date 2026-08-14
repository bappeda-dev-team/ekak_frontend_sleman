'use client'

import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { Font } from '@react-pdf/renderer';
import { RencanaKinerja, IndikatorSasaranOpd } from '../../type';
import { formatRupiah } from '@/components/utils/format-rupiah';

Font.register({ family: 'Times-Roman', src: '/font/times.ttf', fontStyle: 'normal', fontWeight: 'normal' });

interface Modal {
    Data: RencanaKinerja[];
    sasaran: string;
    indikator: IndikatorSasaranOpd[];
    nama_opd: string;
    tahun: number;
}

const styles = StyleSheet.create({
    page: {
        paddingVertical: 30, // px-20
        paddingHorizontal: 38, // py-5
        fontFamily: "Times-Roman",
        textAlign: 'justify'
    },
    container: {
        marginBottom: 10,
        marginLeft: 15,
        paddingRight: 15,
        fontSize: 11,
        fontFamily: "Times-Roman",
        lineHeight: 1.4, // Sedikit dikurangi agar tidak terlalu renggang saat wrap
    },
    column1: {
        width: 70, // Sesuaikan lebar label "Nama" dan "Jabatan"
    },
    column2: {
        width: 15, // Lebar tetap untuk titik dua ":"
        textAlign: 'center',
    },
    column3: {
        // Menggunakan flex: 1 alih-alih flexGrow saja agar react-pdf 
        // tahu batas pasti area teks untuk melakukan wrapping
        flex: 1,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center', // Untuk centering horizontal teks
    },
    logoContainer: {
        marginBottom: 20, // Spasi bawah logo
        alignItems: 'center',
    },
    heading: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        textAlign: 'center',
        marginBottom: 5,
    },
    paragraph: {
        fontSize: 11,
        marginBottom: 10,
        lineHeight: 1.5,
    },
    // --- Gaya Tabel Umum ---
    table: {
        width: 'auto',
        marginBottom: 20,
        borderWidth: 1,
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'stretch', // Pastikan sel mengisi tinggi baris
    },
    tableSasaran: {
        flexDirection: 'row',
    },
    tableColHeader: {
        padding: 5,
        backgroundColor: 'white', // Latar belakang abu-abu untuk header
        fontWeight: 'bold',
        textAlign: 'center',
        justifyContent: 'center', // Center content vertically
        alignItems: 'center', // Center content horizontally
    },
    tableCol: {
        justifyContent: 'flex-start', // Center content vertically
        alignItems: 'flex-start', // Default align text to start
        textAlign: 'left',
        hyphens: 'none',
        padding: 10
    },
    colBorderRight: {
        borderRightWidth: 1,
    },
    colBorderBottom: {
        borderBottom: 1,
    },
    tableCell: {
        margin: 'auto', // Tidak perlu margin, padding sudah diatur di tableCol
        fontSize: 8, // Ukuran font untuk konten sel
    },
    tableCellCenter: {
        textAlign: 'center', // Untuk sel yang teksnya di tengah
    },
    tableCellBold: {
        fontWeight: 'bold', // Untuk teks tebal
    },

    // --- Lebar Kolom Spesifik ---
    col1: { width: '5%' },   // No
    col2: { width: '25%' },  // Rencana Kinerja
    col3: { width: '30%' },  // Sasaran Kinerja
    col4: { width: '15%' },  // Sasaran Kinerja
    col5: { width: '10%' },  // Target
    col6: { width: '50%' },  // Target
    col7: { width: '7%' },  // Target
});

const DocumentRenaksiOpd: React.FC<Modal> = ({ Data, sasaran, indikator, nama_opd, tahun }) => {

    return (
        <Document title='Rencana Aksi OPD first'>
            <Page size="A4" orientation="landscape" style={styles.page}>
                <Text style={styles.heading}>
                    Rencana Aksi OPD
                </Text>
                <Text style={styles.heading}>
                    {nama_opd || ""}
                </Text>
                <Text style={styles.heading}>
                    Tahun {tahun || ""}
                </Text>
                {/* SASARAN */}
                <View style={styles.container}>
                    <View style={styles.tableRow}>
                        <Text style={styles.column1}>Sasaran OPD</Text>
                        <Text style={styles.column2}>:</Text>
                        <Text style={[styles.column3]}>
                            {sasaran || "-"}
                        </Text>
                    </View>
                    {indikator ?
                        indikator.map((i: IndikatorSasaranOpd, i_index: number) => (
                            <React.Fragment key={i_index}>
                                <View style={styles.tableRow}>
                                    <Text style={styles.column1}>Indikator</Text>
                                    <Text style={styles.column2}>:</Text>
                                    <Text style={[styles.column3]}>
                                        {i.indikator || "-"}
                                    </Text>
                                </View>
                                <View style={styles.tableRow}>
                                    <Text style={styles.column1}>Target / Satuan</Text>
                                    <Text style={styles.column2}>:</Text>
                                    <Text style={[styles.column3]}>
                                        {i.target.target || "-"} / {i.target.satuan || "-"}
                                    </Text>
                                </View>
                            </React.Fragment>
                        ))
                        :
                        <View style={styles.tableRow}>
                            <Text style={styles.column1}>Indikator</Text>
                            <Text style={styles.column2}>:</Text>
                            <Text style={[styles.column3]}>-</Text>
                        </View>
                    }
                </View>
                <View style={styles.table}>
                    {/* HEADER */}
                    <View style={styles.tableRow}>
                        <View style={[styles.tableColHeader, styles.col1, styles.colBorderRight, styles.colBorderBottom]}>
                            <Text style={styles.tableCell}>No</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col2, styles.colBorderRight, styles.colBorderBottom]}>
                            <Text style={styles.tableCell}>Aksi/Kegiatan</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col2, styles.colBorderRight, styles.colBorderBottom]}>
                            <Text style={styles.tableCell}>Indikator</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col4, styles.colBorderRight, styles.colBorderBottom]}>
                            <Text style={styles.tableCell}>Target / Satuan</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col3, styles.colBorderRight, styles.colBorderBottom]}>
                            <Text style={styles.tableCell}>Sub Kegiatan</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col2, styles.colBorderRight, styles.colBorderBottom]}>
                            <Text style={styles.tableCell}>Anggaran</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col3, styles.colBorderRight, styles.colBorderBottom]}>
                            <Text style={styles.tableCell}>Nama Pemilik</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col7, styles.colBorderRight, styles.colBorderBottom]}>
                            <Text style={styles.tableCell}>TW1</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col7, styles.colBorderRight, styles.colBorderBottom]}>
                            <Text style={styles.tableCell}>TW2</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col7, styles.colBorderRight, styles.colBorderBottom]}>
                            <Text style={styles.tableCell}>TW3</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col7, styles.colBorderRight, styles.colBorderBottom]}>
                            <Text style={styles.tableCell}>TW4</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col4, styles.colBorderRight, styles.colBorderBottom]}>
                            <Text style={styles.tableCell}>Keterangan</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableColHeader, styles.col1, styles.colBorderRight, styles.colBorderBottom]}>
                            <Text style={styles.tableCell}>(1)</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col2, styles.colBorderRight, styles.colBorderBottom]}>
                            <Text style={styles.tableCell}>(2)</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col2, styles.colBorderRight, styles.colBorderBottom]}>
                            <Text style={styles.tableCell}>(3)</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col4, styles.colBorderRight, styles.colBorderBottom]}>
                            <Text style={styles.tableCell}>(4)</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col3, styles.colBorderRight, styles.colBorderBottom]}>
                            <Text style={styles.tableCell}>(5)</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col2, styles.colBorderRight, styles.colBorderBottom]}>
                            <Text style={styles.tableCell}>(6)</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col3, styles.colBorderRight, styles.colBorderBottom]}>
                            <Text style={styles.tableCell}>(7)</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col7, styles.colBorderRight, styles.colBorderBottom]}>
                            <Text style={styles.tableCell}>(8)</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col7, styles.colBorderRight, styles.colBorderBottom]}>
                            <Text style={styles.tableCell}>(9)</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col7, styles.colBorderRight, styles.colBorderBottom]}>
                            <Text style={styles.tableCell}>(10)</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col7, styles.colBorderRight, styles.colBorderBottom]}>
                            <Text style={styles.tableCell}>(11)</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col4, styles.colBorderRight, styles.colBorderBottom]}>
                            <Text style={styles.tableCell}>(12)</Text>
                        </View>
                    </View>
                    {Data.map((data: RencanaKinerja, index: number) => (
                        <View key={index} style={styles.tableRow} wrap={false} >
                            {/* NO */}
                            <View style={[styles.tableCol, styles.col1, styles.colBorderRight, styles.tableCellCenter, styles.colBorderBottom]}>
                                <Text style={styles.tableCell}>{index + 1}</Text>
                            </View>
                            {/* Aksi/kegiatan */}
                            <View style={[styles.tableCol, styles.col2, styles.colBorderRight, styles.colBorderBottom]}>
                                <Text style={styles.tableCell}>{data.nama_rencana_kinerja || ""}</Text>
                            </View>
                            {/* Indikator */}
                            <View style={[styles.tableCol, styles.col2, styles.colBorderRight, styles.colBorderBottom]}>
                                <Text style={styles.tableCell}>-</Text>
                            </View>
                            {/* Target Satuan */}
                            <View style={[styles.tableCol, styles.col4, styles.colBorderRight, styles.colBorderBottom]}>
                                <Text style={styles.tableCell}>-</Text>
                            </View>
                            {/* Sub Kegiatan */}
                            <View style={[styles.tableCol, styles.col3, styles.colBorderRight, styles.colBorderBottom]}>
                                <Text style={styles.tableCell}>({data.subkegiatan[0].kode_subkegiatan || ""}) - {data.subkegiatan[0].nama_subkegiatan || ""}</Text>
                            </View>
                            {/* Anggaran */}
                            <View style={[styles.tableCol, styles.col2, styles.colBorderRight, styles.colBorderBottom]}>
                                <Text style={styles.tableCell}>Rp.{formatRupiah(data.total_anggaran || 0)}</Text>
                            </View>
                            {/* Nama Pemilik */}
                            <View style={[styles.tableCol, styles.col3, styles.colBorderRight, styles.colBorderBottom]}>
                                <Text style={styles.tableCell}>{data.nama_pegawai || ""}</Text>
                            </View>
                            {/* TW1 */}
                            <View style={[styles.tableCol, styles.col7, styles.colBorderRight, styles.colBorderBottom]}>
                                <Text style={styles.tableCell}>{data.tw1 || 0}</Text>
                            </View>
                            {/* TW2 */}
                            <View style={[styles.tableCol, styles.col7, styles.colBorderRight, styles.colBorderBottom]}>
                                <Text style={styles.tableCell}>{data.tw2 || 0}</Text>
                            </View>
                            {/* TW3 */}
                            <View style={[styles.tableCol, styles.col7, styles.colBorderRight, styles.colBorderBottom]}>
                                <Text style={styles.tableCell}>{data.tw3 || 0}</Text>
                            </View>
                            {/* TW4 */}
                            <View style={[styles.tableCol, styles.col7, styles.colBorderRight, styles.colBorderBottom]}>
                                <Text style={styles.tableCell}>{data.tw4 || 0}</Text>
                            </View>
                            {/* Keterangan */}
                            <View style={[styles.tableCol, styles.col4, styles.colBorderRight, styles.colBorderBottom]}>
                                <Text style={styles.tableCell}>{data.keterangan || ""}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </Page>
        </Document >
    );
}

export default DocumentRenaksiOpd;
