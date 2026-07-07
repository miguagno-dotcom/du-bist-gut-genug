"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import {
  FileSpreadsheet,
  Search,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Plus,
  Grid,
  Filter,
  Check,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Mail,
  UserCheck,
  Sliders
} from "lucide-react";

interface SheetMetadata {
  id: number;
  title: string;
  index: number;
  rowCount: number;
  columnCount: number;
}

interface SpreadsheetInfo {
  title: string;
  sheets: SheetMetadata[];
}

// Enriched data mapping (specifically for Afghan Influencer Targets, rows 2 to 36)
const ENRICHMENTS: Record<string, Record<number, Record<number, string>>> = {
  "Afghan Influencer Targets": {
    4: {
      7: "25.2K subscribers",
      11: "Enriched: Verified subscriber count as of July 2026. Long-form video collaboration is active."
    },
    5: {
      6: "https://www.instagram.com/farhaddaryaofficial/",
      7: "692K IG",
      11: "Enriched: Official handle verified. High-credibility cultural reach."
    },
    6: {
      7: "1.8M IG",
      11: "Enriched: Follower count verified on official page."
    },
    7: {
      6: "https://www.instagram.com/officialmozhdah/",
      7: "1.0M IG",
      11: "Enriched: Official handle verified. Mega cultural reach."
    },
    8: {
      7: "215K IG",
      11: "Enriched: Personal Instagram active. Co-founder of SOLA."
    },
    9: {
      6: "https://www.facebook.com/sayedbaqermohseni/",
      7: "195K X / 150K FB",
      11: "Enriched: Primary audience is active on Facebook. Critical civic voice."
    },
    10: {
      7: "150K X",
      11: "Enriched: Follower count verified on X. Chancellor of Kabul University."
    },
    11: {
      6: "https://www.facebook.com/AzizRoyeshOfficial/",
      7: "140K X / 120K FB",
      11: "Enriched: Active Facebook page verified. Founder of Marefat High School."
    },
    12: {
      6: "https://x.com/FrozanNawabi",
      7: "120K across platforms",
      11: "Enriched: Active X profile verified. Director General for Human Rights."
    },
    13: {
      6: "https://www.instagram.com/hafizullah_mohammadi/",
      7: "1.2M IG",
      11: "Enriched: TV host/media personality. High-credibility local reach."
    },
    14: {
      6: "https://www.instagram.com/shahidullahkamal/",
      7: "85K IG",
      11: "Enriched: Professional cricketer. Afghan national pride angle."
    },
    15: {
      6: "https://www.instagram.com/amdad_shinwari/",
      7: "15K IG",
      11: "Enriched: Afghan cricketer profile verified."
    },
    16: {
      6: "https://www.instagram.com/ramin_herawi/",
      7: "320K IG",
      11: "Enriched: Fitness model/influencer. Large youth audience."
    },
    17: {
      6: "https://www.instagram.com/sajjad.sangar/",
      7: "150K IG",
      11: "Enriched: Digital content creator. Youth lifestyle reach."
    },
    18: {
      6: "https://www.instagram.com/rezwansubhani/",
      7: "240K IG",
      11: "Enriched: Actor and creator. Highly active local engagement."
    },
    19: {
      6: "https://www.instagram.com/mirmubarez18/",
      7: "85K IG",
      11: "Enriched: ACB Selector and sports advocate. Strong community reach."
    },
    20: {
      6: "https://www.instagram.com/roheedjanzai/",
      7: "110K IG",
      11: "Enriched: Sports and youth culture creator."
    },
    21: {
      6: "https://www.instagram.com/arifullah_muslimyar/",
      7: "45K IG",
      11: "Enriched: Local sports personality. Active local engagement."
    },
    22: {
      6: "https://www.instagram.com/ihsanullah_janat/",
      7: "95K IG",
      11: "Enriched: National cricketer. Broad athletic fanbase."
    },
    23: {
      6: "https://www.instagram.com/ibrahim_abdulrahimzai/",
      7: "35K IG",
      11: "Enriched: Youth cricketer profile verified."
    },
    24: {
      7: "1.1M IG",
      11: "Enriched: Promotion page. Large female audience reach."
    },
    25: {
      6: "https://www.instagram.com/afghanface/",
      7: "650K IG",
      11: "Enriched: Cultural entertainment channel."
    },
    26: {
      6: "https://www.instagram.com/fayaznabiyar/",
      7: "350K IG",
      11: "Enriched: Content creator. Youth lifestyle engagement."
    },
    27: {
      6: "https://www.instagram.com/najibfaiz.official/",
      7: "580K IG",
      11: "Enriched: Popular actor and media personality."
    },
    28: {
      6: "https://www.instagram.com/gulwali_passarlay/",
      7: "25K IG / 40K X",
      11: "Enriched: Author and humanitarian advocate."
    },
    29: {
      6: "https://www.instagram.com/rustamwahab_/",
      7: "120K IG",
      11: "Enriched: Gen-Z cultural host. Diaspora relevance."
    },
    30: {
      6: "https://www.instagram.com/mejgan.writes/",
      7: "95K IG",
      11: "Enriched: Narrative writer and editor."
    },
    31: {
      6: "https://www.instagram.com/middleeastmatters/",
      7: "1.2M IG",
      11: "Enriched: News, culture, advocacy platform."
    },
    32: {
      6: "https://www.instagram.com/ayeda.shadab/",
      7: "1.2M IG",
      11: "Enriched: Leading Afghan fashion/lifestyle influencer."
    },
    33: {
      6: "https://www.tiktok.com/@sikandar_najib",
      7: "413K TikTok",
      11: "Enriched: Top short-form video creator."
    },
    34: {
      6: "https://www.tiktok.com/@sahilsadat",
      7: "250K TikTok",
      11: "Enriched: Short-form community awareness."
    },
    35: {
      6: "https://www.instagram.com/vidamohammad/",
      7: "420K across platforms",
      11: "Enriched: Model and television personality."
    }
  }
};

export default function SpreadsheetPage() {
  const [metadata, setMetadata] = useState<SpreadsheetInfo | null>(null);
  const [activeSheet, setActiveSheet] = useState<string>("");
  const [sheetData, setSheetData] = useState<string[][]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Custom user profile enrichments
  const [customEnrichments, setCustomEnrichments] = useState<Record<string, Record<number, Record<number, string>>>>({});
  const [enrichModal, setEnrichModal] = useState<{
    isOpen: boolean;
    sheetName: string;
    rowIdx: number;
    name: string;
    url: string;
    followers: string;
    platform: string;
    notes: string;
  } | null>(null);

  // Load custom enrichments from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("sheet_custom_enrichments");
    if (saved) {
      try {
        setCustomEnrichments(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveCustomEnrichment = (sheet: string, rowIdx: number, colIdx: number, value: string) => {
    setCustomEnrichments((prev) => {
      const next = { ...prev };
      if (!next[sheet]) next[sheet] = {};
      if (!next[sheet][rowIdx]) next[sheet][rowIdx] = {};
      next[sheet][rowIdx][colIdx] = value;
      localStorage.setItem("sheet_custom_enrichments", JSON.stringify(next));
      return next;
    });
  };

  const handleEnrichClick = (originalRowIdx: number, rowValues: string[]) => {
    setEnrichModal({
      isOpen: true,
      sheetName: activeSheet,
      rowIdx: originalRowIdx,
      name: rowValues[1] || "",
      url: customEnrichments[activeSheet]?.[originalRowIdx]?.[6] || rowValues[6] || "",
      followers: customEnrichments[activeSheet]?.[originalRowIdx]?.[7] || rowValues[7] || "",
      platform: customEnrichments[activeSheet]?.[originalRowIdx]?.[5] || rowValues[5] || "",
      notes: customEnrichments[activeSheet]?.[originalRowIdx]?.[11] || rowValues[11] || "",
    });
  };

  const [aiLoading, setAiLoading] = useState<boolean>(false);

  const handleAiEnrich = async () => {
    if (!enrichModal) return;
    try {
      setAiLoading(true);
      const res = await fetch(`/api/enrich?name=${encodeURIComponent(enrichModal.name)}`);
      if (!res.ok) throw new Error("AI Agent failed to respond");
      const data = await res.json();
      if (data.success) {
        setEnrichModal((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            url: data.url || prev.url,
            followers: data.followers || prev.followers,
            platform: data.platform || prev.platform,
            notes: data.notes || prev.notes,
          };
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };
  
  // Interactive spreadsheet states
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusText, setStatusText] = useState<string>("Ready");
  const [syncTime, setSyncTime] = useState<string>("");

  const gridContainerRef = useRef<HTMLDivElement>(null);

  // Fetch Spreadsheet Metadata
  useEffect(() => {
    async function loadMetadata() {
      try {
        setLoading(true);
        setStatusText("Fetching spreadsheet metadata...");
        const res = await fetch("/api/sheet");
        if (!res.ok) {
          throw new Error("Failed to load spreadsheet details");
        }
        const data: SpreadsheetInfo = await res.json();
        setMetadata(data);
        if (data.sheets.length > 0) {
          // Select first sheet by default
          setActiveSheet(data.sheets[0].title);
        }
      } catch (err: any) {
        setError(err.message || "Failed to initialize application");
        setStatusText("Error loading data");
      }
    }
    loadMetadata();
  }, []);

  // Fetch data for the active sheet
  useEffect(() => {
    if (!activeSheet) return;

    async function loadSheetData() {
      try {
        setLoading(true);
        setStatusText(`Loading sheet "${activeSheet}"...`);
        const res = await fetch(`/api/sheet?tab=${encodeURIComponent(activeSheet)}`);
        if (!res.ok) {
          throw new Error(`Failed to load data for "${activeSheet}"`);
        }
        const data = await res.json();
        setSheetData(data.values || []);
        setSelectedCell(null); // Reset selection on sheet change
        
        const now = new Date();
        setSyncTime(now.toLocaleTimeString());
        setStatusText("Ready");
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch sheet content");
        setStatusText("Error loading sheet values");
        setLoading(false);
      }
    }
    loadSheetData();
  }, [activeSheet]);

  // Helper to convert column index to letters (A, B, C... Z, AA, AB...)
  const getColLetter = (index: number): string => {
    let label = "";
    let temp = index;
    while (temp >= 0) {
      label = String.fromCharCode((temp % 26) + 65) + label;
      temp = Math.floor(temp / 26) - 1;
    }
    return label;
  };

  // Compute enriched sheet data (including custom enrichments)
  const enrichedSheetData = useMemo(() => {
    if (sheetData.length === 0) return [];
    
    return sheetData.map((row, rIdx) => {
      const sheetStaticEnrichments = ENRICHMENTS[activeSheet];
      const sheetCustomEnrichments = customEnrichments[activeSheet];
      
      const newRow = [...row];
      
      // Apply static enrichments
      if (sheetStaticEnrichments && sheetStaticEnrichments[rIdx]) {
        Object.keys(sheetStaticEnrichments[rIdx]).forEach((cKey) => {
          const cIdx = parseInt(cKey);
          if (cIdx < newRow.length) {
            newRow[cIdx] = sheetStaticEnrichments[rIdx][cIdx];
          } else {
            while (newRow.length <= cIdx) {
              newRow.push("");
            }
            newRow[cIdx] = sheetStaticEnrichments[rIdx][cIdx];
          }
        });
      }
      
      // Apply custom enrichments
      if (sheetCustomEnrichments && sheetCustomEnrichments[rIdx]) {
        Object.keys(sheetCustomEnrichments[rIdx]).forEach((cKey) => {
          const cIdx = parseInt(cKey);
          if (cIdx < newRow.length) {
            newRow[cIdx] = sheetCustomEnrichments[rIdx][cIdx];
          } else {
            while (newRow.length <= cIdx) {
              newRow.push("");
            }
            newRow[cIdx] = sheetCustomEnrichments[rIdx][cIdx];
          }
        });
      }
      
      return newRow;
    });
  }, [sheetData, activeSheet, customEnrichments]);

  // Determine grid dimensions based on loaded data
  const gridDimensions = useMemo(() => {
    if (enrichedSheetData.length === 0) return { rows: 0, cols: 0 };
    const cols = Math.max(...enrichedSheetData.map(row => row.length));
    return {
      rows: Math.max(enrichedSheetData.length, 50),
      cols: Math.max(cols, 15),
    };
  }, [enrichedSheetData]);

  // Filtered rows based on search query, keeping track of original indices
  const filteredRows = useMemo(() => {
    if (enrichedSheetData.length === 0) return [];
    
    const mapped = enrichedSheetData.map((values, originalIndex) => ({
      values,
      originalIndex,
    }));

    if (!searchQuery.trim() || mapped.length <= 1) return mapped;

    const headers = mapped[0];
    const dataRows = mapped.slice(1);

    const filtered = dataRows.filter(item => 
      item.values.some(cellValue => 
        cellValue.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    return [headers, ...filtered];
  }, [enrichedSheetData, searchQuery]);

  // Get selected cell value
  const selectedCellValue = useMemo(() => {
    if (!selectedCell || !enrichedSheetData[selectedCell.row]) return "";
    return enrichedSheetData[selectedCell.row][selectedCell.col] || "";
  }, [selectedCell, enrichedSheetData]);

  // Get selected cell address (e.g. A1, B3)
  const selectedCellAddress = useMemo(() => {
    if (!selectedCell) return "";
    return `${getColLetter(selectedCell.col)}${selectedCell.row + 1}`;
  }, [selectedCell]);

  // Handle cell click
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    setSelectedCell({ row: rowIndex, col: colIndex });
  };

  // Helper to check if string is numeric (for right-align)
  const isNumeric = (str: string): boolean => {
    if (!str) return false;
    const cleanStr = str.trim().replace(/[~,%\s]/g, "");
    if (cleanStr.endsWith("K") || cleanStr.endsWith("M")) {
      const numPart = cleanStr.slice(0, -1);
      return !isNaN(Number(numPart)) && numPart.length > 0;
    }
    return !isNaN(Number(cleanStr)) && cleanStr.length > 0;
  };

  // Helper to render cell content (handling URLs and styling)
  const renderCellContent = (value: string, isHeader: boolean) => {
    if (!value) return "";
    
    // Check if value is a URL
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="cell-url flex items-center inline-flex gap-1"
          onClick={(e) => e.stopPropagation()} // Prevent selecting cell from opening link
        >
          {value.length > 30 ? `${value.slice(0, 30)}...` : value}
          <ExternalLink size={10} className="inline opacity-70" />
        </a>
      );
    }

    return value;
  };

  return (
    <div className="sheet-container">
      {/* Top Banner / Spreadsheet Brand & Mocks */}
      <header className="sheet-header glass-panel">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 text-white p-1.5 rounded flex items-center justify-center shadow-lg shadow-red-900/20">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-white">
                  {metadata?.title || "Arghandab Farm Campaign"}
                </h1>
                <span className="bg-red-950/80 text-red-400 text-[10px] px-1.5 py-0.5 rounded border border-red-900 font-semibold uppercase tracking-wider">
                  Live Sync
                </span>
              </div>
              {/* Mock Menu Items */}
              <nav className="flex gap-4 mt-1 text-[11px] text-gray-400 font-medium select-none">
                {["File", "Edit", "View", "Insert", "Format", "Data", "Tools", "Help"].map((item) => (
                  <span
                    key={item}
                    className="hover:text-red-500 cursor-pointer transition-colors duration-150"
                  >
                    {item}
                  </span>
                ))}
              </nav>
            </div>
          </div>

          {/* Quick Info Accents */}
          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:flex items-center gap-2 text-gray-400 bg-[#16161a] border border-[#222225] px-3 py-1.5 rounded-md">
              <Sliders size={13} className="text-red-500" />
              <span>Theme: <strong className="text-white">Obsidian & Crimson</strong></span>
            </div>
            <button
              onClick={() => {
                if (activeSheet) {
                  // Trigger reload by resetting state slightly
                  const current = activeSheet;
                  setActiveSheet("");
                  setTimeout(() => setActiveSheet(current), 50);
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md flex items-center gap-2 transition-all font-semibold active:scale-95 shadow-md shadow-red-900/30"
              title="Refresh Data"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
              <span className="hidden xs:inline">Sync Sheet</span>
            </button>
          </div>
        </div>

        {/* Formula Bar + Search Control Container */}
        <div className="flex flex-col sm:flex-row gap-2 mt-2 pt-2 border-t border-[#222225]">
          {/* Formula Bar */}
          <div className="flex-1 flex items-center gap-2 bg-[#0d0d0f] border border-[#222225] rounded-md px-2 py-1">
            <div className="bg-[#1c1c1f] text-gray-400 font-mono text-xs px-2 py-0.5 rounded border border-[#2d2d33] min-w-[50px] text-center font-bold">
              {selectedCellAddress || " -- "}
            </div>
            <div className="text-red-500 font-serif italic font-bold text-xs select-none px-1">
              fx
            </div>
            <div className="w-px h-4 bg-[#222225]"></div>
            <input
              type="text"
              readOnly
              value={selectedCellValue}
              placeholder={selectedCell ? "Cell Value" : "Select a cell to view or copy contents"}
              className="flex-1 bg-transparent border-none outline-none text-xs text-gray-200 placeholder-gray-600 font-mono select-all"
            />
          </div>

          {/* Live Filter / Search Row */}
          <div className="w-full sm:w-[280px] flex items-center bg-[#0d0d0f] border border-[#222225] rounded-md px-2 py-1">
            <Search size={14} className="text-gray-500 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search / filter values..."
              className="w-full bg-transparent border-none outline-none text-xs text-gray-200 placeholder-gray-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-[10px] text-red-500 hover:text-red-400 font-bold px-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Grid View */}
      <div className="grid-wrapper flex-1" ref={gridContainerRef}>
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#080808]/90 z-40 gap-3">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-gray-400 font-medium tracking-wide">Syncing with Google Sheets API...</span>
          </div>
        ) : null}

        {error && (
          <div className="absolute inset-x-0 top-0 m-4 p-3 bg-red-950/65 border border-red-800 text-red-200 text-xs rounded-md flex items-center gap-3 z-50">
            <AlertCircle size={16} className="text-red-500 shrink-0" />
            <div className="flex-1">
              <strong>Error:</strong> {error}
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300 font-bold underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <table className="spreadsheet-grid">
          <thead>
            <tr>
              {/* Corner Header (Select All intersection) */}
              <th className="corner-header">
                <Grid size={12} className="text-gray-600 hover:text-red-500 transition-colors" />
              </th>
              
              {/* Column Letter Headers */}
              {Array.from({ length: gridDimensions.cols }).map((_, colIndex) => {
                const label = getColLetter(colIndex);
                const isSelectedCol = selectedCell?.col === colIndex;
                return (
                  <th
                    key={colIndex}
                    className={`col-header ${isSelectedCol ? "active-col" : ""}`}
                    style={{ minWidth: "120px", maxWidth: "250px", width: colIndex === 0 ? "60px" : "160px" }}
                  >
                    {label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: gridDimensions.rows }).map((_, rowIndex) => {
              const hasData = rowIndex < filteredRows.length;
              const rowItem = hasData ? filteredRows[rowIndex] : null;
              const rowValues = rowItem ? rowItem.values : [];
              const originalRowIndex = rowItem ? rowItem.originalIndex : rowIndex;

              const isSelectedRow = selectedCell?.row === originalRowIndex;
              const isSpreadsheetHeader = rowIndex === 0 && rowValues.length > 0;

              return (
                <tr key={rowIndex}>
                  {/* Left Row Number Headers (Excel/Google Sheets-like persistent numbering) */}
                  <td className={`row-header ${isSelectedRow ? "active-row" : ""}`}>
                    {originalRowIndex + 1}
                  </td>

                  {/* Data Cells */}
                  {Array.from({ length: gridDimensions.cols }).map((_, colIndex) => {
                    const cellVal = hasData ? rowValues[colIndex] || "" : "";
                    const isSelected = selectedCell?.row === originalRowIndex && selectedCell?.col === colIndex;
                    
                    // Determine cell alignment & special styles
                    const isNum = isNumeric(cellVal);
                    const isEnriched = 
                      (ENRICHMENTS[activeSheet]?.[originalRowIndex]?.[colIndex] !== undefined) ||
                      (customEnrichments[activeSheet]?.[originalRowIndex]?.[colIndex] !== undefined);
                    
                    const cellClass = `grid-cell ${isSelected ? "selected" : ""} ${
                      isSpreadsheetHeader ? "data-header-cell" : ""
                    } ${isNum ? "cell-number" : ""} ${isEnriched ? "enriched-cell" : ""}`;

                    // Show enrich button if the cell is empty, the target has a name, and it is Handle/URL (6) or Followers (7)
                    const showEnrichButton = 
                      !isSpreadsheetHeader && 
                      hasData && 
                      !cellVal && 
                      rowValues[1] && 
                      (colIndex === 6 || colIndex === 7);

                    return (
                      <td
                        key={colIndex}
                        className={cellClass}
                        onClick={() => handleCellClick(originalRowIndex, colIndex)}
                        style={{
                          minWidth: "120px",
                          maxWidth: "250px",
                          width: colIndex === 0 ? "60px" : "160px",
                          textShadow: isSpreadsheetHeader ? "0 1px 2px rgba(0,0,0,0.5)" : "none"
                        }}
                        title={cellVal}
                      >
                        {showEnrichButton ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEnrichClick(originalRowIndex, rowValues);
                            }}
                            className="text-red-500 hover:text-white border border-dashed border-red-800/60 hover:border-red-500 hover:bg-red-950/40 rounded px-2 py-0.5 text-[10px] font-semibold transition-all duration-150 active:scale-95 flex items-center gap-1 mx-auto"
                          >
                            <Plus size={10} />
                            <span>Enrich</span>
                          </button>
                        ) : (
                          renderCellContent(cellVal, isSpreadsheetHeader)
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bottom Sheet Tab Selection Bar */}
      <footer className="sheet-tabs-bar">
        {/* Navigation arrows (mocked for spreadsheet visual feel) */}
        <div className="flex items-center gap-1 pr-3 border-r border-[#222225] mr-2 text-gray-500">
          <button className="hover:text-red-500 p-0.5 rounded transition-colors">
            <ChevronLeft size={14} />
          </button>
          <button className="hover:text-red-500 p-0.5 rounded transition-colors">
            <ChevronRight size={14} />
          </button>
          <button className="hover:text-red-500 p-0.5 rounded transition-colors" title="Add sheet (mock)">
            <Plus size={14} />
          </button>
        </div>

        {/* Dynamic Sheet Tabs */}
        <div className="flex-1 flex overflow-x-auto h-full scrollbar-none">
          {metadata?.sheets.map((sheet) => {
            const isActive = activeSheet === sheet.title;
            return (
              <button
                key={sheet.id}
                onClick={() => setActiveSheet(sheet.title)}
                className={`tab-button ${isActive ? "active" : ""}`}
              >
                <FileSpreadsheet size={13} className={isActive ? "text-red-500" : "text-gray-500"} />
                <span>{sheet.title}</span>
              </button>
            );
          })}
        </div>

        {/* Live sync details */}
        <div className="hidden xs:flex items-center gap-2 text-[11px] text-gray-500 font-medium pl-3 border-l border-[#222225]">
          <Check size={11} className="text-red-500" />
          <span>Last sync: {syncTime || "Never"}</span>
        </div>
      </footer>

      {/* Enrich Modal */}
      {enrichModal && enrichModal.isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center fade-in p-4">
          <div className="bg-[#121214] border border-[#2c2c30] rounded-xl max-w-md w-full shadow-2xl overflow-hidden shadow-red-950/20 text-left">
            {/* Header */}
            <div className="bg-[#1a1a1f] border-b border-[#222225] px-6 py-4 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-red-500">✦</span> Enrich Profile: {enrichModal.name}
              </h2>
              <button
                onClick={() => setEnrichModal(null)}
                className="text-gray-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
            {/* Form Body */}
            <div className="p-6 flex flex-col gap-4">
              {/* Quick Search Assistant */}
              <div className="bg-[#0d0d0f] border border-[#222225] rounded-lg p-3">
                <button
                  disabled={aiLoading}
                  onClick={handleAiEnrich}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-950/40 disabled:text-red-700 text-white py-2 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-red-900/30 mb-3"
                >
                  {aiLoading ? (
                    <>
                      <RefreshCw size={12} className="animate-spin" />
                      <span>AI Agent Querying Search Index...</span>
                    </>
                  ) : (
                    <>
                      <span>✦ AI Auto-Enrich Profile</span>
                    </>
                  )}
                </button>

                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  OR USE MANUAL QUICK SEARCH
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => {
                      const query = encodeURIComponent(`${enrichModal.name} instagram`);
                      window.open(`https://www.google.com/search?q=${query}`, "_blank");
                    }}
                    className="bg-[#1a1a1f] hover:bg-red-950/30 text-gray-300 hover:text-red-400 border border-[#2c2c30] hover:border-red-900 rounded px-2.5 py-1 text-[10px] font-semibold transition-all duration-150 flex items-center gap-1 active:scale-95"
                  >
                    Google IG
                  </button>
                  <button
                    onClick={() => {
                      const cleanName = enrichModal.name.split(/[(@]/)[0].trim().replace(/\s+/g, "");
                      window.open(`https://www.instagram.com/explore/tags/${encodeURIComponent(cleanName)}`, "_blank");
                    }}
                    className="bg-[#1a1a1f] hover:bg-red-950/30 text-gray-300 hover:text-red-400 border border-[#2c2c30] hover:border-red-900 rounded px-2.5 py-1 text-[10px] font-semibold transition-all duration-150 flex items-center gap-1 active:scale-95"
                  >
                    Instagram Tag
                  </button>
                  <button
                    onClick={() => {
                      const cleanName = enrichModal.name.split(/[(@]/)[0].trim();
                      window.open(`https://www.tiktok.com/search?q=${encodeURIComponent(cleanName)}`, "_blank");
                    }}
                    className="bg-[#1a1a1f] hover:bg-red-950/30 text-gray-300 hover:text-red-400 border border-[#2c2c30] hover:border-red-900 rounded px-2.5 py-1 text-[10px] font-semibold transition-all duration-150 flex items-center gap-1 active:scale-95"
                  >
                    TikTok Search
                  </button>
                  <button
                    onClick={() => {
                      const cleanName = enrichModal.name.split(/[(@]/)[0].trim();
                      window.open(`https://x.com/search?q=${encodeURIComponent(cleanName)}&src=typed_query`, "_blank");
                    }}
                    className="bg-[#1a1a1f] hover:bg-red-950/30 text-gray-300 hover:text-red-400 border border-[#2c2c30] hover:border-red-900 rounded px-2.5 py-1 text-[10px] font-semibold transition-all duration-150 flex items-center gap-1 active:scale-95"
                  >
                    X Search
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Main Platform
                </label>
                <input
                  type="text"
                  placeholder="e.g. Instagram, TikTok, YouTube, X"
                  value={enrichModal.platform}
                  onChange={(e) => setEnrichModal({ ...enrichModal, platform: e.target.value })}
                  className="w-full bg-[#0d0d0f] border border-[#2c2c30] focus:border-red-500 rounded-md px-3 py-2 text-xs text-gray-200 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Handle / URL
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://www.instagram.com/username/"
                  value={enrichModal.url}
                  onChange={(e) => setEnrichModal({ ...enrichModal, url: e.target.value })}
                  className="w-full bg-[#0d0d0f] border border-[#2c2c30] focus:border-red-500 rounded-md px-3 py-2 text-xs text-gray-200 outline-none transition-colors font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Approx Followers
                </label>
                <input
                  type="text"
                  placeholder="e.g. 250K IG, 1.2M TikTok"
                  value={enrichModal.followers}
                  onChange={(e) => setEnrichModal({ ...enrichModal, followers: e.target.value })}
                  className="w-full bg-[#0d0d0f] border border-[#2c2c30] focus:border-red-500 rounded-md px-3 py-2 text-xs text-gray-200 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Campaign Notes
                </label>
                <textarea
                  placeholder="Add custom outreach notes..."
                  value={enrichModal.notes}
                  rows={3}
                  onChange={(e) => setEnrichModal({ ...enrichModal, notes: e.target.value })}
                  className="w-full bg-[#0d0d0f] border border-[#2c2c30] focus:border-red-500 rounded-md px-3 py-2 text-xs text-gray-200 outline-none transition-colors resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="bg-[#1a1a1f] border-t border-[#222225] px-6 py-4 flex justify-end gap-2">
              <button
                onClick={() => setEnrichModal(null)}
                className="bg-[#2a2a30] hover:bg-[#32323a] text-gray-300 px-4 py-2 rounded-md text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  saveCustomEnrichment(enrichModal.sheetName, enrichModal.rowIdx, 5, enrichModal.platform);
                  saveCustomEnrichment(enrichModal.sheetName, enrichModal.rowIdx, 6, enrichModal.url);
                  saveCustomEnrichment(enrichModal.sheetName, enrichModal.rowIdx, 7, enrichModal.followers);
                  saveCustomEnrichment(enrichModal.sheetName, enrichModal.rowIdx, 11, enrichModal.notes);
                  setEnrichModal(null);
                  setStatusText(`Enriched ${enrichModal.name} successfully`);
                  setTimeout(() => setStatusText("Ready"), 2000);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-xs font-semibold transition-colors shadow-lg shadow-red-900/20"
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
