(async function runTrial15Tests() {
  function assert(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }

  function assertEqual(actual, expected, message) {
    assert(actual === expected, `${message} Expected ${expected}, received ${actual}.`);
  }

  function assertDeepEqual(actual, expected, message) {
    const actualJson = JSON.stringify(actual);
    const expectedJson = JSON.stringify(expected);
    assert(actualJson === expectedJson, `${message} Expected ${expectedJson}, received ${actualJson}.`);
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
      name: "renders the spin-history empty state on initial load",
      async run() {
        window.localStorage.clear();

        const appWindow = await loadPageInIframe("../index.html");
        const emptyState = appWindow.document.querySelector("#spinHistoryList .empty-state");

        assert(emptyState, "Trial 15 should render a spin-history empty state.");
        assertEqual(
          emptyState.textContent.trim(),
          "No spins recorded yet.",
          "Trial 15 should describe the empty spin-history state.",
        );
      },
    },
    {
      name: "keeps the expected paytable ordering in game configuration",
      run() {
        const config = window.SLOT_CONFIG;

        assertDeepEqual(
          config.symbols.map((symbol) => symbol.key),
          ["star", "diamond", "gold", "silver", "bronze"],
          "Trial 15 should keep the expected symbol ordering.",
        );
        assertEqual(
          config.symbols.find((symbol) => symbol.key === "bronze").weight,
          5,
          "Bronze should remain the most common paying symbol.",
        );
        assertEqual(
          config.payoutMultiplier("star", 5),
          60,
          "A five-star line should pay 60x in Trial 15.",
        );
        assertEqual(config.paylines.length, 10, "Trial 15 should expose ten paylines.");
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
