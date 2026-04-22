(function runTrial4Tests() {
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

  function installDeterministicCrypto(values) {
    let queue = [...values];
    const originalGetRandomValues = window.crypto.getRandomValues.bind(window.crypto);

    function deterministicGetRandomValues(typedArray) {
      for (let index = 0; index < typedArray.length; index += 1) {
        typedArray[index] = queue.length > 0 ? queue.shift() : 0;
      }

      return typedArray;
    }

    try {
      window.crypto.getRandomValues = deterministicGetRandomValues;
    } catch (error) {
      Object.defineProperty(window.crypto, "getRandomValues", {
        configurable: true,
        value: deterministicGetRandomValues,
      });
    }

    return function restoreCrypto() {
      try {
        window.crypto.getRandomValues = originalGetRandomValues;
      } catch (error) {
        Object.defineProperty(window.crypto, "getRandomValues", {
          configurable: true,
          value: originalGetRandomValues,
        });
      }
    };
  }

  const tests = [
    {
      name: "exposes the expected paytable and payline configuration",
      run() {
        const config = window.SLOT_CONFIG;

        assertEqual(config.rows, 3, "Trial 4 should use three rows.");
        assertEqual(config.reels, 5, "Trial 4 should use five reels.");
        assertEqual(config.paylines.length, 10, "Trial 4 should expose ten paylines.");
        assertEqual(config.paylines[0].name, "Top Row", "The first payline should be Top Row.");
        assertDeepEqual(
          config.paylines[0].cells,
          [
            { col: 0, row: 0 },
            { col: 1, row: 0 },
            { col: 2, row: 0 },
            { col: 3, row: 0 },
            { col: 4, row: 0 },
          ],
          "The Top Row payline cells should be ordered left to right.",
        );
        assertDeepEqual(
          config.states.find((entry) => entry.code === "CA"),
          { code: "CA", name: "California" },
          "California should be present in the state list.",
        );
        assertEqual(
          config.payoutMultiplier("star", 5),
          60,
          "A five-star line should pay 60x in Trial 4.",
        );
        assertEqual(
          config.payoutMultiplier("missing", 3),
          0,
          "Unknown symbols should pay zero.",
        );
      },
    },
    {
      name: "builds a deterministic 5x3 spin grid from the weighted symbol picker",
      run() {
        const restoreCrypto = installDeterministicCrypto([
          0, 1, 3,
          6, 10, 0,
          1, 3, 6,
          10, 0, 1,
          3, 6, 10,
        ]);

        try {
          const grid = window.SLOT_CONFIG
            .createSpinGrid()
            .map((column) => column.map((symbol) => symbol.key));

          assertDeepEqual(
            grid,
            [
              ["star", "diamond", "gold"],
              ["silver", "bronze", "star"],
              ["diamond", "gold", "silver"],
              ["bronze", "star", "diamond"],
              ["gold", "silver", "bronze"],
            ],
            "The deterministic spin grid should match the queued weighted stops.",
          );
        } finally {
          restoreCrypto();
        }
      },
    },
  ];

  const results = tests.map((test) => {
    try {
      test.run();
      return { name: test.name };
    } catch (error) {
      return { name: test.name, error };
    }
  });

  renderResults(results);
})();
