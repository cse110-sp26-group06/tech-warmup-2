(async function runTrial10Tests() {
  function assert(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }

  function assertEqual(actual, expected, message) {
    assert(actual === expected, `${message} Expected ${expected}, received ${actual}.`);
  }

  function renderResults(results) {
    const summary = document.getElementById("summary");
    const list = document.getElementById("results");
    const passed = results.filter((result) => !result.error).length;

    summary.textContent = `${passed}/${results.length} tests passed`;
    list.textContent = "";

    results.forEach((result) => {
      const item = document.createElement("li");
      item.className = result.error ? "failed" : "passed";
      item.textContent = result.error
        ? `${result.name}: ${result.error.message}`
        : `${result.name}: passed`;
      list.append(item);
    });
  }

  function loadPageInIframe(relativeUrl) {
    return new Promise((resolve, reject) => {
      const iframe = document.createElement("iframe");
      iframe.hidden = true;
      iframe.src = relativeUrl;
      iframe.addEventListener("load", () => resolve(iframe.contentWindow));
      iframe.addEventListener("error", () => reject(new Error(`Could not load ${relativeUrl}.`)));
      document.body.append(iframe);
    });
  }

  const tests = [
    {
      name: "applies a stored dark theme during initialization",
      async run() {
        window.localStorage.clear();
        window.localStorage.setItem("prompt-drop-theme-v1", "dark");
        window.localStorage.setItem(
          "prompt-drop-consent-v1",
          JSON.stringify({
            accepted: true,
            locationMode: "manual",
            locationLabel: "Manual: California",
            coords: null,
            stateCode: "CA",
          }),
        );

        const appWindow = await loadPageInIframe("../index.html");
        const appDocument = appWindow.document;

        assertEqual(
          appDocument.documentElement.dataset.theme,
          "dark",
          "Trial 10 should hydrate the dark theme from local storage.",
        );
      },
    },
  ];

  const results = [];

  for (const test of tests) {
    try {
      await test.run();
      results.push({ name: test.name });
    } catch (error) {
      results.push({ name: test.name, error });
    }
  }

  renderResults(results);
})();
