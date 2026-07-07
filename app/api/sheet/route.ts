import { NextResponse } from "next/server";

const SPREADSHEET_ID = "1QOZbuUnDm1_ceehUPSJH1iJnafv5h9D6NRlsVPT260M";
const API_KEY = "AIzaSyAaVDnjtjfeK-HTbeUkCUQ3G07J3kxPr5w";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tab = searchParams.get("tab");

  try {
    if (!tab) {
      // Fetch metadata (list of sheets)
      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?key=${API_KEY}`,
        {
          next: { revalidate: 300 }, // Cache metadata for 5 minutes
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch spreadsheet metadata: ${res.statusText}`);
      }

      const data = await res.json();
      const sheets = data.sheets.map((sheet: any) => ({
        id: sheet.properties.sheetId,
        title: sheet.properties.title,
        index: sheet.properties.index,
        rowCount: sheet.properties.gridProperties.rowCount,
        columnCount: sheet.properties.gridProperties.columnCount,
      }));

      return NextResponse.json({
        title: data.properties?.title || "Spreadsheet",
        sheets,
      });
    } else {
      // Fetch sheet values
      const encodedTab = encodeURIComponent(tab);
      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodedTab}?key=${API_KEY}`,
        {
          next: { revalidate: 60 }, // Cache sheet values for 1 minute
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch sheet values for "${tab}": ${res.statusText}`);
      }

      const data = await res.json();
      return NextResponse.json({
        range: data.range,
        values: data.values || [],
      });
    }
  } catch (error: any) {
    console.error("Spreadsheet API Error:", error);
    return NextResponse.json(
      { error: error.message || "An unknown error occurred" },
      { status: 500 }
    );
  }
}
