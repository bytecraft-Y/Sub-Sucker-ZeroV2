// --- FEATURE 1: THE ABYSS DIVER (SMOOTH SCROLL) ---
document.getElementById("scroll-btn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab.url.includes("youtube.com/feed/channels")) {
    alert(
      "SYSTEM ERROR: Navigate to YouTube Subscriptions first (youtube.com/feed/channels)",
    );
    return;
  }

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: autoScrollPage,
  });
});

// This runs inside the YouTube page
function autoScrollPage() {
  alert(
    "ABYSS DIVER ACTIVATED: Keep your hands off the mouse. Initiating smooth dive...",
  );

  let retries = 0;
  let scrollStep = 500; // Scroll down in smaller chunks instead of jumping

  const timer = setInterval(() => {
    window.scrollBy(0, scrollStep); // Smooth scroll down

    // Check if we hit the absolute bottom of the page
    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight
    ) {
      retries++;
      if (retries >= 8) {
        // Give YouTube a few seconds to load more if it is lagging
        clearInterval(timer);
        window.scrollTo(0, 0); // Jump back up to the top automatically
        alert(
          "ABYSS REACHED: All visual telemetry loaded! You may now Initiate Extraction.",
        );
      }
    } else {
      retries = 0;
    }
  }, 200); // 200ms delay gives the lazy-loader time to fetch the image URLs
}

// --- FEATURE 2: VISUAL TELEMETRY & EXTRACTION ---
document.getElementById("extract-btn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: extractChannels,
    },
    (results) => {
      if (!results || !results[0] || !results[0].result)
        return alert("EXTRACTION FAILED.");

      const channels = results[0].result;
      if (channels.length === 0) return alert("NO TARGETS FOUND.");

      chrome.storage.local.set({ extractedData: channels }, () => {
        chrome.tabs.create({ url: "export.html" });
      });
    },
  );
});

function extractChannels() {
  const elements = document.querySelectorAll("ytd-channel-renderer");
  const channelData = [];

  elements.forEach((el) => {
    const nameEl = el.querySelector("#text.ytd-channel-name");
    const linkEl = el.querySelector("a#main-link");
    const imgEl = el.querySelector("yt-img-shadow img");

    if (nameEl && linkEl) {
      const name = nameEl.textContent.trim();
      const url = linkEl.href;

      let avatar = "";
      // Secure the image, but ignore blank YouTube placeholders
      if (imgEl && imgEl.src && !imgEl.src.includes("data:image")) {
        avatar = imgEl.src;
      }

      if (name && !channelData.some((c) => c.name === name)) {
        channelData.push({ name: name, url: url, avatar: avatar });
      }
    }
  });
  return channelData;
}
