import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import Logo from "/Sakura_Spa_Logo.png";

const styles = StyleSheet.create({
  page: { 
    padding: 30, 
    fontSize: 12, 
    fontFamily: "Helvetica", 
    display: "flex", 
    flexDirection: "column", 
    height: "100%",
    width:"100%",
    position: "relative" // Allows watermark positioning
  },

  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 20 
  },

  leftSection: { 
    flexDirection: "column", 
    width: "50%" ,
    justifyContent: 'center',
  },

  leftSectionHeader:{
    fontSize: '15',
  },

  rightSection: { 
    textAlign: "right", 
    width: "50%" 
  },

  logo: { 
    width: 120, 
    height: 120, 
    marginBottom: 10,
    alignSelf: "flex-end" // Moves logo to the right
  },

  watermark: {
    position: "absolute",
    top: "60%",
    left: "50%",
    transform: "translate(150%, 150%)", // Centers the watermark
    width: 300,
    height: 300,
    opacity: 0.2 // 20% opacity
  },

  title: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#133409" 
  },

  section: { 
    marginBottom: 10, 
    flexGrow: 1 
  },

  table: { 
    width: "100%", 
    borderWidth: 1, 
    borderColor: "#ddd" 
  },

  tableRow: { 
    flexDirection: "row", 
    borderBottomWidth: 1, 
    borderBottomColor: "#ddd" 
  },

  tableCell: { 
    padding: 5, 
    flex: 1, 
    textAlign: "center" 
  },

  footer: { 
    marginTop: "auto", 
    padding: 10, 
    backgroundColor: "#eef", 
    textAlign: "center" 
  }
});


interface InvoicePDFProps {
  transaction: {
    transaction_id: string;
    customer_name: string;
    service_name: string;
    service_price: number;
    service_duration: number;
    payment_method: string;
  };
}

const InvoicePDF:React.FC<InvoicePDFProps> = ({ transaction }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Watermark */}
      <Image style={styles.watermark} src={Logo} />

      {/* HEADER */}
      <View style={styles.header}>
        {/* Left: Invoice Info */}
        <View style={styles.leftSection}>
          <Text style={styles.leftSectionHeader}>Nama Customer : {transaction.customer_name}</Text>
          <Text style={styles.leftSectionHeader}>Invoice #: {transaction.transaction_id}</Text>
          <Text style={styles.leftSectionHeader}>Tanggal : {new Date().toLocaleDateString()} </Text>
        </View>

        {/* Right: Company Info + Logo */}
        <View style={styles.rightSection}>
          <Image style={styles.logo} src={Logo} />
          <Text style={styles.title}>Sakura Spa</Text>
          <Text>Perumahan Pelindung Alam No 2</Text>
          <Text>Jalan Kertanegara, Kebalenan, Banyuwangi</Text>
          <Text>Phone: +62 851 8326 6288</Text>
        </View>
      </View>

      {/* CONTENT (Table) */}
      <View style={styles.section}>
        {/* Table Header */}
        <View style={[styles.tableRow, { backgroundColor: "#0047AB", color: "#fff" }]}>
          <Text style={styles.tableCell}>Layanan</Text>
          <Text style={styles.tableCell}>Durasi</Text>
          <Text style={styles.tableCell}>Harga</Text>
        </View>

        {/* Table Data */}
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>{transaction.service_name}</Text>
          <Text style={styles.tableCell}>{transaction.service_duration} min</Text>
          <Text style={styles.tableCell}>Rp {transaction.service_price.toLocaleString()}</Text>
        </View>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text>Metode Pembayaran: {transaction.payment_method}</Text>
        <Text>Powered by Sakura Spa</Text>
      </View>
    </Page>
  </Document>
);

export const downloadInvoice = async (transaction: InvoicePDFProps["transaction"]) => {
  const blob = await pdf(<InvoicePDF transaction={transaction} />).toBlob();
  const pdfBlob = new Blob([blob], { type: "application/pdf" });
  saveAs(pdfBlob, `Invoice_${transaction.transaction_id}.pdf`);
};

export default InvoicePDF;
