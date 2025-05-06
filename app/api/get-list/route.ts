/* eslint-disable @typescript-eslint/no-explicit-any */
import { google } from "googleapis";

export async function POST() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.NEXT_PUBLIC_CLIENT_EMAIL,
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
        private_key: process.env.NEXT_PUBLIC_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({
      auth,
      version: "v4",
    });

    const lotteryResult: any = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.NEXT_PUBLIC_SPREADSHEET_ID,
      range: `Lottery`,
    });

    console.log("lotteryResult", lotteryResult);

    return Response.json({
      message: "ok",
      data: lotteryResult.data.values.map((item: any) => Number(item[0])),
    });
  } catch (e) {
    console.log(e);
  }
}
