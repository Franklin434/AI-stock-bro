import { GoogleGenAI } from "https://esm.sh/@google/genai";
import { CONFIG } from "./config.js";
import { dates } from "/utils/dates.js";

const gemini = new GoogleGenAI ({
  apiKey: CONFIG.GEMINI_API_KEY
})

const tickersArr = [];

const generateReportBtn = document.querySelector(".generate-report-btn");

generateReportBtn.addEventListener("click", fetchStockData);

document.getElementById("ticker-input-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const tickerInput = document.getElementById("ticker-input");
  if (tickerInput.value.length > 2) {
    generateReportBtn.disabled = false;
    const newTickerStr = tickerInput.value;
    tickersArr.push(newTickerStr.toUpperCase());
    tickerInput.value = "";
    renderTickers();
  } else {
    const label = document.getElementsByTagName("label")[0];
    label.style.color = "red";
    label.textContent =
      "You must add at least one ticker. A ticker is a 3 letter or more code for a stock. E.g TSLA for Tesla.";
  }
});

function renderTickers() {
  const tickersDiv = document.querySelector(".ticker-choice-display");
  tickersDiv.innerHTML = "";
  tickersArr.forEach((ticker) => {
    const newTickerSpan = document.createElement("span");
    newTickerSpan.textContent = ticker;
    newTickerSpan.classList.add("ticker");
    tickersDiv.appendChild(newTickerSpan);
  });
}

const loadingArea = document.querySelector(".loading-panel");
const apiMessage = document.getElementById("api-message");

async function fetchStockData() {
  document.querySelector(".action-panel").style.display = "none";
  loadingArea.style.display = "flex";
  try {
    const stockData = await Promise.all(
      tickersArr.map(async (ticker) => {
        const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${dates.startDate}/${dates.endDate}?apiKey=${CONFIG.POLYGON_API_KEY}`;
        const response = await fetch(url);
        const data = await response.text();
        const status = await response.status;
        if (status === 200) {
          apiMessage.innerText = "Creating report...";
          return data;
        } else {
          loadingArea.innerText = "There was an error fetching stock data.";
        }
      }),
    );
    const report = await fetchReport(stockData.join(""));
    if (report) {
      renderReport(report);
    }
  } catch (err) {
    loadingArea.innerText = "There was an error fetching stock data.";
    console.error("error: ", err);
  }
}

async function fetchReport(data) {
  console.log(data);
  try {
    const geminiResponse = await gemini.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: data,
      config: {
        systemInstruction: `you are a stock bro financial guru, when passed a set stock data you are to write a report not more than 150 words recommending whether to buy, hold or sell your response should be in regular plain text no tables, make use of funny obivious sexual inuendos and jokes. Use the example provided between ### to set the style and tone of your responses.
        ###
        Okay bro based on what i am looking at hear bro the market is trying to build up some crazy motion by consolidating after then is gonna fuck some niggas who goin sell by shooting up on some diddy shit. ion think that its gonnna slide like its been lubed up so hold hard ma nigga.
        ###
        `,
        temperature: 1
      }
    });
    const output = geminiResponse.text;
    console.log(output)
    return output;
  } catch (error) {
    loadingArea.style.backgroundColor = "red";
    loadingArea.innerText = "There was an error generating the report.";
    console.error("error: ", error);
  }
}

function renderReport(output) {
  loadingArea.style.display = "none";
  const outputArea = document.querySelector(".output-panel");
  const report = document.createElement("p");
  outputArea.appendChild(report);
  report.textContent = output;
  outputArea.style.display = "flex";
}
