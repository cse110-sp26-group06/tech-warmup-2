(async function runTrial19Tests() {
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

  function findButtonByText(container, pattern) {
    return Array.from(container.querySelectorAll("button")).find((button) =>
      pattern.test(button.textContent),
    );
  }

  const tests = [
    {
      name: "sanitizes and persists the saved player name on the profile page",
      async run() {
        window.localStorage.clear();

        const profileWindow = await loadPageInIframe("../profile.html");
        const profileDocument = profileWindow.document;
        const nameInput = profileDocument.getElementById("playerNameInput");
        const saveButton = profileDocument.getElementById("saveNameButton");

        nameInput.value = "   Ada    Lovelace   ";
        saveButton.click();

        assertEqual(
          profileDocument.getElementById("profileNameDisplay").textContent,
          "Ada Lovelace",
          "The saved name should be sanitized and displayed.",
        );
        assertEqual(
          profileDocument.getElementById("playerNameStatus").textContent,
          "Welcome, Ada Lovelace.",
          "Saving the player name should update the status copy.",
        );

        const storedProfile = JSON.parse(window.localStorage.getItem("prompt-drop-player-profile-v1"));

        assertEqual(storedProfile.name, "Ada Lovelace", "The sanitized name should persist.");
        assertEqual(storedProfile.selectedIcon, "🙂", "Saving the name should not change the icon.");
      },
    },
    {
      name: "purchases and equips an icon while updating the shared wallet",
      async run() {
        window.localStorage.clear();
        window.localStorage.setItem("prompt-drop-wallet-v1", JSON.stringify({ tokens: 1000 }));
        window.localStorage.setItem(
          "prompt-drop-player-profile-v1",
          JSON.stringify({
            name: "Guest",
            selectedIcon: "🙂",
            ownedIcons: ["🙂"],
          }),
        );

        const profileWindow = await loadPageInIframe("../profile.html");
        const profileDocument = profileWindow.document;
        const botBuddyButton = findButtonByText(
          profileDocument.getElementById("iconShopList"),
          /Bot Buddy/i,
        );

        assert(botBuddyButton, "The Bot Buddy icon should be available in the shop.");
        botBuddyButton.click();

        assertEqual(
          profileDocument.getElementById("profileTokenCount").textContent,
          "650",
          "Buying Bot Buddy should spend 350 credits.",
        );
        assertEqual(
          profileDocument.getElementById("profileIconDisplay").textContent,
          "🤖",
          "Buying Bot Buddy should equip the robot icon.",
        );
        assertEqual(
          profileDocument.getElementById("playerNameStatus").textContent,
          "Bot Buddy purchased and equipped.",
          "Buying Bot Buddy should confirm the purchase in the status copy.",
        );

        const storedWallet = JSON.parse(window.localStorage.getItem("prompt-drop-wallet-v1"));
        const storedProfile = JSON.parse(window.localStorage.getItem("prompt-drop-player-profile-v1"));

        assertEqual(storedWallet.tokens, 650, "The shared wallet should persist the reduced token balance.");
        assertEqual(storedProfile.selectedIcon, "🤖", "The purchased icon should persist as selected.");
        assert(
          storedProfile.ownedIcons.includes("🤖"),
          "The purchased icon should persist in the owned-icons list.",
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
