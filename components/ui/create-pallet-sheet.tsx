import * as Print from "expo-print";
import { t } from "i18next";
import { Printer } from "lucide-react-native";
import { useRef, useState } from "react";
import QrCode from "react-native-qrcode-svg";
import { ViewProps } from "react-native-svg/lib/typescript/fabric/utils";
import { Button } from "~/components/ui/button";
import { useFetchMutation } from "~/lib/hooks/useFetchMutation";
import { capitalizeFirst, cn } from "~/lib/utils";
import Row from "../layout/Row";

type PalletSheetData = {
    product_code : string, 
    origin : string, 
    client :  string, 
    product : string, 
    lot_number : string, 
    expiration_date : string, 
    quantity : number
}

type StockCategory = "PF_G" | "PF_M" | "MP_F" | "MP_C" | "MP_S" | "EMB";


async function CreatePalletSheet({
    stockCategory,
    data, 
    className,
    ...props
} :{stockCategory :StockCategory,  data : PalletSheetData | undefined} & ViewProps, ) {
    const qrRef = useRef<any>(null);
    const [qrCodeValue, setQrCodeValue] = useState<number | undefined>(undefined);

    const {mutate : createNewQR } = useFetchMutation(
        "/qr-code/",
        "post"
    );

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


    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Tableau Etiquette</title>
  <style>
    @page {size : A4 ; margin: 12mm 10mm;}
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
    }
    table {
      border-collapse: collapse;
      width: 100%;
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
      width: 150px;
      text-transform: uppercase;
      text-align : center;
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
      <td colspan="2">${escapeHtml(data?.product_code ?? "")}</td>
      <td rowspan="2" class="qr-container">
        <img src="data:image/png;base64,${qrBase64}" alt="QR Code" >
      </td>
    </tr>
    <tr>
      <td class="label">${t("add_pallet_sheet.origin")}</td>
      <td colspan="2">${escapeHtml(data?.origin ?? "")}</td>
    </tr>
    <tr>
      <td class="label">${t("add_pallet_sheet.client")}</td>
      <td colspan="3">${escapeHtml(data?.client ?? "")}</td>
    </tr>
    <tr>
      <td class="label">${t("add_pallet_sheet.product")}</td>
      <td colspan="3">${escapeHtml(data?.product ?? "")}</td>
    </tr>
    <tr>
      <td class="label">${t("add_pallet_sheet.lot_number")}</td>
      <td colspan="3">${escapeHtml(data?.lot_number ?? "")}</td>
    </tr>
    <tr>
      <td class="label">${t("add_pallet_sheet.expiration_date")}</td>
      <td colspan="3">${escapeHtml(data?.expiration_date ?? "")}</td>
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
    await Print.printAsync({html});

    }
    return (
        <Row className={cn("",className)} gap={20}>
            <QrCode getRef={(c) => (qrRef.current = c)} value={qrCodeValue?.toString()}>

            </QrCode>
            <Button onPress={makePdf} icon={Printer} disabled={qrCodeValue ? false : true}>
                {capitalizeFirst(t("add_pallet_sheet.create_sheet"))}
            </Button>
        </Row>
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
