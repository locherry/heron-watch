import * as Print from "expo-print";
import { t } from "i18next";
import { AlertCircle, Printer } from "lucide-react-native";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { useEffect, useRef, useState } from "react";
import { Platform, View } from "react-native";
import QrCode from "react-native-qrcode-svg";
import { ViewProps } from "react-native-svg/lib/typescript/fabric/utils";
import Row from "~/components/layout/Row";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { useFetchMutation } from "~/lib/hooks/useFetchMutation";
import { capitalizeFirst, cn } from "~/lib/utils";
import { Card } from "./card";

type PalletSheetData = {
    product_code : string, 
    origin : string | undefined, 
    client :  string | undefined, 
    product_name : string, 
    lot_number : string, 
    expiration_date : string, 
    quantity : number | undefined
} | undefined


type StockCategory = "PF_G" | "PF_M" | "MP_F" | "MP_C" | "MP_S" | "EMB";


function CreatePalletSheet({
    stockCategory,
    data, 
    className,
    ...props
} :{stockCategory :StockCategory,  data : PalletSheetData} & ViewProps, ) {
    const qrRef = useRef<any>(null);
    const [qrCodeValue, setQrCodeValue] = useState<number | undefined>(undefined);
    const [isDataSet, setIsDataSet] = useState(false);
    const [emitAlert, setEmitAlert] = useState(false);

    const {mutate : createNewQR } = useFetchMutation(
        "/qr-code/{stock_category}",
        "post"
    );

    useEffect(() => {

      if (!data) {
        setIsDataSet(false);
      }
    }, [data]);


    const verifyDataIsCorrect = (data : any) => {
      //Type guard
      return typeof data?.product_code === "string" && typeof data?.client === "string" && typeof data?.origin === "string" && typeof data?.lot_number === "string" && typeof data?.expiration_date === "string" && typeof data?.quantity === "number" && typeof data?.product_name === "string" ;
    }
    const handleNewQRCreation = () => {
        createNewQR(
            {
                pathParams : {stock_category : stockCategory},
                body : {
                    product_code : data?.product_code,
                    lot_number : data?.lot_number,
                    quantity : data?.quantity,
                    expiration_date : data?.expiration_date,
                }
            },
            {
                onSuccess : (data) => {
                    console.log(data?.data?.id)
                    setQrCodeValue(data?.data?.id);
                },

                onError : (error) => {
                    console.log(error.message);
                } 
            }
        );
    }
    
    const getQRBase64 = () =>  new Promise<string>((resolve) => {
        qrRef.current?.toDataURL((b64 : string) => resolve(b64));
        })
        
    const makePdf = async () => {
        const qrBase64 = await getQRBase64();
    
    //Adapt font size with lentgh of the product name
    const maxLength = 22;
    let fontSizeContent = 35;
    if (data?.product_name.length ?? 0 > maxLength ) {
      fontSizeContent -= Math.floor(data?.product_name.length ?? 0 / 2) - maxLength ;
    }
    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Tableau Etiquette</title>
  <style>
    @page {size : A4 landscape; margin: 12mm 10mm;}
    body {
      font-family: Arial, sans-serif;
      margin: 10px;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      height : 100%;
      position : relative;
    }
    td {
      border: 2px solid black;
      padding: 12px;
      vertical-align: middle;
      position : relative
    }
    .label {
      font-weight: bold;
      font-size : 20pt;
      width: 150px;
      height:50px;
      text-transform: uppercase;
      text-align : center;
    }
    .content {
      font-size : 40pt;
      text-align : center;
      overflow-wrap : break-word;
      white-space : normal;
    }
    .productName {
      font-size : ${fontSizeContent}pt;
      text-align : center;
      overflow-wrap : break-word;
      white-space : normal;
    }
    .center {
      text-align: center;
      width : 50px;
    }
    .qr-container {
      width: 100px;
      height: 100px;
      text-align: center;
      vertical-align: middle;
    }
    .qr-container img {
      max-width: 100%;
      height:auto;
    }
  </style>
</head>
<body>
  <table>
    <tr>
      <td class="label">${capitalizeFirst(t("add_pallet_sheet.product_code"))}</td>
      <td colspan="2" class="content">${escapeHtml(data?.product_code ?? "")}</td>
      <td rowspan="2" class="qr-container">
        <img src="data:image/png;base64,${qrBase64}" alt="QR Code" >
      </td>
    </tr>
    <tr>
      <td class="label">${t("add_pallet_sheet.origin")}</td>
      <td colspan="2" class="content">${escapeHtml(data?.origin ?? "")}</td>
    </tr>
    <tr>
      <td class="label">${t("add_pallet_sheet.client")}</td>
      <td colspan="3" class="content">${escapeHtml(data?.client ?? "")}</td>
    </tr>
    <tr>
      <td class="label">${t("add_pallet_sheet.product")}</td>
      <td colspan="3" class="productName">${escapeHtml(data?.product_name ?? "")}</td>
    </tr>
    <tr>
      <td class="label">${t("add_pallet_sheet.lot_number")}</td>
      <td colspan="3" class="content">${escapeHtml(data?.lot_number ?? "")}</td>
    </tr>
    <tr>
      <td class="label">${t("add_pallet_sheet.expiration_date")}</td>
      <td colspan="3" class="content">${escapeHtml(data?.expiration_date ?? "")}</td>
    </tr>
    <tr>
      <td class="label" rowspan="2">${t("add_pallet_sheet.quantity")}</td>
      <td class="center">UV</td>
      <td colspan="2"></td>
    </tr>
    <tr>
      <td class="center">UV</td>
      <td colspan="2"></td>
    </tr>
  </table>
</body>
</html>`;

    //Directly print generated PDF file.
    if (Platform.OS !== "web") {
      await Print.printAsync({html,orientation:"landscape"});
    } else {
      pdfMake.vfs = pdfFonts.vfs;

      pdfMake.createPdf({content : [
    {
      table: {
        widths: [150, 50, '*', 100], // colonnes : label, product code/origin, product name/origin, QR
        body: [
          // Ligne 1 : Code produit + product code + origin + QR
          [
            { text: capitalizeFirst(t("add_pallet_sheet.product_code")).toUpperCase(), fontSize: 20, bold: true, alignment: 'center' },
            { text: escapeHtml(data?.product_code ?? "").toUpperCase(), fontSize: 35, alignment: 'center', colSpan: 2 },
            {},
            { image: `data:image/png;base64,${qrBase64}`, width: 100, height: 100, alignment: 'center', rowSpan: 2 }
          ],
          [
            { text: t("add_pallet_sheet.origin").toUpperCase(), fontSize: 20, bold: true, alignment: 'center' }, 
            { text: escapeHtml(data?.origin ?? "").toUpperCase(), fontSize: 35, alignment: "center", colSpan: 2 },
            {},
            {}
          ],
          // Ligne 2 : Client
          [
            { text: t("add_pallet_sheet.client").toUpperCase(), fontSize: 20, bold: true, alignment: 'center' },
            { text: escapeHtml(data?.client ?? "").toUpperCase(), fontSize: 35, alignment: 'center', colSpan: 3 },
            {}, 
            {}
          ],
          // Ligne 3 : Product
          [
            { text: t("add_pallet_sheet.product").toUpperCase(), fontSize: 20, bold: true, alignment: 'center' },
            { text: escapeHtml(data?.product_name ?? "").toUpperCase(), fontSize: fontSizeContent, alignment: 'center', colSpan: 3 },
            {},
            {}
          ],
          // Ligne 4 : Lot Number
          [
            { text: t("add_pallet_sheet.lot_number").toUpperCase(), fontSize: 20, bold: true, alignment: 'center' },
            { text: escapeHtml(data?.lot_number ?? "").toUpperCase(), fontSize: 35, alignment: 'center', colSpan: 3 },
            {},
            {}
          ],
          // Ligne 5 : Expiration Date
          [
            { text: t("add_pallet_sheet.expiration_date").toUpperCase(), fontSize: 20, bold: true, alignment: 'center' },
            { text: escapeHtml(data?.expiration_date ?? "").toUpperCase(), fontSize: 35, alignment: 'center', colSpan: 3 },
            {},
            {}
          ],
          // Ligne 6 & 7 : Quantity UV
          [
            { text: t("add_pallet_sheet.quantity").toUpperCase(), fontSize: 20, bold: true, alignment: 'center', rowSpan: 2 },
            { text: "UV", alignment: 'center', width: 20 },
            { text: '', colSpan: 2, alignment: "center"},
            {}
          ],
          [
            {}, // cellule rowspan
            { text: "UV", alignment: 'center', width: 20 },
            { text: '', colSpan: 2, alignment: "center"},
            {}
          ]
        ]
      },
      layout: {
        hLineWidth: () => 2,
        vLineWidth: () => 2,
        hLineColor: () => 'black',
        vLineColor: () => 'black',
        paddingLeft: () => 12,
        paddingRight: () => 12,
        paddingTop: () => 12,
        paddingBottom: () => 12
      }
    }
  ], pageSize : "A4", pageOrientation : "landscape" }).download("Feuille_Pallette.pdf");
    }

    }
    return (
        <View className={cn("content-center", className)}>
            <View className={cn("items-center",isDataSet ? "hidden" : "flex")}>
              <Button onPress={() => {
                if (verifyDataIsCorrect(data)) {
                  setEmitAlert(false);
                  setIsDataSet(true);
                  handleNewQRCreation();
                } else {
                  setEmitAlert(true);
                }
              }}>
                {capitalizeFirst(t("add_pallet_sheet.create_qr_code"))}
              </Button>
              <Alert icon={AlertCircle} className={cn("text-red-500 text-xs mt-1",emitAlert ? "flex" : "hidden")}>
                <AlertTitle className="text-red-500 text-xl mt-1">
                  {capitalizeFirst(t("add_pallet_sheet.alert_unable_to_create_qr"))}
                </AlertTitle>
                <AlertDescription className="text-red-500 text-xs mt-1">
                  {capitalizeFirst(t("add_pallet_sheet.alert_field_missing"))}
                </AlertDescription>
              </Alert>
            </View>
            <Row className={cn("items-center", isDataSet ? "justify-center" : "hidden")} gap={20}>
              <Card className="p-2">
                <QrCode getRef={(c) => (qrRef.current = c)} value={qrCodeValue?.toString()}/>
              </Card>
              <Button  className="" onPress={makePdf} icon={Printer}>
                  {capitalizeFirst(t("add_pallet_sheet.create_sheet"))}
              </Button>
            </Row>
        </View>
    )
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export { CreatePalletSheet };
