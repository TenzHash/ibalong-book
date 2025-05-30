// Helper function to create a temporary element to measure content
function measureContent(html) {
  const temp = document.createElement("div");
  try {
    temp.style.visibility = "hidden";
    temp.style.position = "absolute";
    temp.style.width = "100%";
    temp.innerHTML = html;
    document.body.appendChild(temp);
    return temp.offsetHeight;
  } finally {
    // Ensure the temporary element is removed
    document.body.removeChild(temp);
  }
}

// Function to split content into pages
function splitContentIntoPages(content) {
  const pages = [];
  const maxHeight = 700; // Maximum height for each page

  // Process each section of content
  for (let i = 0; i < content.length; i++) {
    const section = content[i];

    // Ensure section and its properties exist
    if (!section || !section.left || !section.right) {
      console.warn(`Invalid content at index ${i}`);
      continue;
    }

    const leftContent = section.left;
    const rightContent = section.right;

    // Measure the height of the content
    const leftHeight = measureContent(leftContent);
    const rightHeight = measureContent(rightContent);

    // If content is too tall for one page, split it
    if (leftHeight > maxHeight) {
      // Split left content into multiple pages
      const leftPages = splitContent(leftContent, maxHeight);
      pages.push(...leftPages);
    } else {
      pages.push(leftContent);
    }

    if (rightHeight > maxHeight) {
      // Split right content into multiple pages
      const rightPages = splitContent(rightContent, maxHeight);
      pages.push(...rightPages);
    } else {
      pages.push(rightContent);
    }
  }

  return pages;
}

// Function to render pages (placeholder, implement as needed)
function renderPages() {
  console.log("Rendering pages...");
  const leftPage = document.getElementById("left-page");
  const rightPage = document.getElementById("right-page");

  // Clear existing content
  leftPage.innerHTML = "";
  rightPage.innerHTML = "";

  // Add current page content
  // Check if the left page exists in the pages array
  if (currentIndex < pages.length) {
    const leftContent = document.createElement("div");
    leftContent.className = "page-content";
    leftContent.innerHTML = pages[currentIndex]; // Use the content directly
    leftPage.appendChild(leftContent);

    // Add page number for left page
    const leftPageNum = document.createElement("div");
    leftPageNum.className = "page-number";
    leftPageNum.textContent = `Page ${currentIndex + 1}`;
    leftPage.appendChild(leftPageNum);
  }

  // Add right page content if available
  // Check if the right page exists in the pages array
  if (currentIndex + 1 < pages.length) {
    const rightContent = document.createElement("div");
    rightContent.className = "page-content";
    rightContent.innerHTML = pages[currentIndex + 1]; // Use the content directly
    rightPage.appendChild(rightContent);

    // Add page number for right page
    const rightPageNum = document.createElement("div");
    rightPageNum.className = "page-number";
    rightPageNum.textContent = `Page ${currentIndex + 2}`;
    rightPage.appendChild(rightPageNum);
  }

  // Add popup listeners to new content
  addPopupListeners();
}

// Function to go to a specific page number
function goToPage(pageNumber) {
  const targetIndex = pageNumber - 1; // Adjust for 0-based index
  const totalPages = pages.length;

  // Validate the page number
  if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
    console.warn(`Invalid page number: ${pageNumber}. Please enter a number between 1 and ${totalPages}.`);
    // Optionally, provide user feedback in the UI
    return;
  }

  // Update currentIndex to the start of the spread containing the target page
  // If the target page is odd, it's a left page, index is targetIndex.
  // If the target page is even, it's a right page, the spread starts at targetIndex - 1.
  currentIndex = (pageNumber % 2 !== 0) ? targetIndex : targetIndex - 1;

  // Ensure currentIndex is not negative
  if (currentIndex < 0) {
    currentIndex = 0;
  }

  renderPages();
}

// On window load, split content into pages and render them
window.onload = function () {
  // Assuming `originalContent` is defined and contains the content to be split
  const pages = splitContentIntoPages(originalContent);
  currentIndex = 0;
  renderPages();

  // Apply zoom level
  const bookElement = document.querySelector('.book');
  if (bookElement) {
    bookElement.style.transform = 'scale(1)';
    bookElement.style.transformOrigin = 'top left'; // Optional: adjust origin if needed
  }

  // Generate and display page number list
  const pageListContainer = document.getElementById('page-list-container');
  const pageSize = 10; // Number of page numbers to display at once
  let currentPageNumbersPage = 0; // Start at the first page of numbers (0-indexed)

  function renderPageNumbers() {
    if (!pageListContainer) return;

    // Clear previous list and arrows
    pageListContainer.innerHTML = '';

    const totalPages = pages.length;
    const start = currentPageNumbersPage * pageSize;
    const end = Math.min(start + pageSize, totalPages);

    // Add previous arrow
    const prevArrow = document.createElement('span');
    prevArrow.textContent = '<'; // Or use an image/icon
    prevArrow.style.cursor = 'pointer';
    prevArrow.style.marginRight = '10px';
    prevArrow.style.fontWeight = 'bold';
    prevArrow.style.visibility = currentPageNumbersPage > 0 ? 'visible' : 'hidden';
    prevArrow.addEventListener('click', () => {
      if (currentPageNumbersPage > 0) {
        currentPageNumbersPage--;
        renderPageNumbers();
      }
    });
    pageListContainer.appendChild(prevArrow);

    const pageList = document.createElement('ol');
    // Add styles to the ordered list
    pageList.style.padding = '0';
    pageList.style.margin = '10px 0';
    pageList.style.listStyle = 'none';
    pageList.style.textAlign = 'center'; // Center the list
    pageList.style.display = 'inline-block'; // Keep list inline with arrows

    for (let i = start; i < end; i++) {
      const listItem = document.createElement('li');
      const pageNumber = i + 1;
      listItem.textContent = pageNumber;
      listItem.style.cursor = 'pointer'; // Indicate it's clickable
      listItem.style.margin = '0 5px'; // Add some spacing
      listItem.style.display = 'inline-block'; // Display horizontally
      // Add more styling for appearance
      listItem.style.width = '25px';
      listItem.style.height = '25px';
      listItem.style.lineHeight = '25px'; // Center text vertically
      listItem.style.borderRadius = '50%'; // Make it a circle
      listItem.style.backgroundColor = '#eee'; // Light grey background
      listItem.style.color = '#333'; // Dark text color
      listItem.style.fontWeight = 'bold';
      listItem.style.transition = 'background-color 0.3s ease'; // Smooth hover transition

      // Highlight current page number
      if (i === currentIndex) {
          listItem.style.backgroundColor = '#ccc';
      }

      // Add hover effect
      listItem.addEventListener('mouseover', () => {
        listItem.style.backgroundColor = '#ccc';
      });
      listItem.addEventListener('mouseout', () => {
          if (i !== currentIndex) {
              listItem.style.backgroundColor = '#eee';
          }
      });

      listItem.addEventListener('click', () => {
        goToPage(pageNumber);
      });
      pageList.appendChild(listItem);
    }
    pageListContainer.appendChild(pageList);

    // Add next arrow
    const nextArrow = document.createElement('span');
    nextArrow.textContent = '>'; // Or use an image/icon
    nextArrow.style.cursor = 'pointer';
    nextArrow.style.marginLeft = '10px';
    nextArrow.style.fontWeight = 'bold';
    nextArrow.style.visibility = end < totalPages ? 'visible' : 'hidden';
    nextArrow.addEventListener('click', () => {
      if (end < totalPages) {
        currentPageNumbersPage++;
        renderPageNumbers();
      }
    });
    pageListContainer.appendChild(nextArrow);
  }

  // Initial render of page numbers
  renderPageNumbers();

  // Modify renderPages to re-render page numbers to highlight current page
  const originalRenderPages = renderPages;
  renderPages = () => {
      originalRenderPages();
      renderPageNumbers(); // Re-render page numbers to update highlighting
  };
};

// Helper function to split content into multiple pages
function splitContent(content, maxHeight) {
  const pages = [];
  const temp = document.createElement("div");
  temp.innerHTML = content;
  const elements = Array.from(temp.children);
  let currentPage = "";
  let currentHeight = 0;

  elements.forEach((element) => {
    const elementHeight = measureContent(element.outerHTML);

    if (currentHeight + elementHeight > maxHeight) {
      if (currentPage) {
        pages.push(currentPage);
      }
      currentPage = element.outerHTML;
      currentHeight = elementHeight;
    } else {
      currentPage += element.outerHTML;
      currentHeight += elementHeight;
    }
  });

  if (currentPage) {
    pages.push(currentPage);
  }

  return pages;
}

// Original content array
const originalContent = [
  {
    left: `<h1>Ibalong</h1>
             <h2>A Virtual Coffee Table Book</h2>
            <img src="images/ibalong.jpg" alt="Ibalong" width="80%" height="80%" />`,
    right: `<h2>Introduction</h2>
                <p>The Ibalong, an epic poem from the Bicol region of the Philippines, serves as a cultural treasure that encapsulates the values, struggles, and beliefs of the ancient Bikolanos. Preserved through oral tradition and later transcribed by Spanish friars, the Ibalong recounts a mytho-historical narrative centered on heroism, the triumph over chaos, and the civilizing mission of its protagonists.</p>
                <p>This guide explores the major characters within the epic—both heroes and antagonists—offering insights into their roles and mythological significance.</p>`,
  },
  // BALTOG - Spread 1
  {
    left: `<h2>Baltog</h2>
            <img src="images/baltog.png" alt="Baltog" />`,
    right: `<h2>Baltog</h2>
            <p><b>Short Title:</b> "The Boar Slayer of Ibalong"</p>
            <p><b>Mythical Origin / Ethnic Background:</b> Boltavara (ancient India) - A legendary warrior-settler who migrated to the Philippines and became the founding hero of Ibalon (ancient Bicol region)</p>
            <p><b>Key Role in the Epic:</b> Baltog was the first hero who settled in Ibalong and slew the wild boar Tandayag, making the land safe for cultivation.</p>
            <p><b>Major Feats or Contributions:</b></p>
            <ul>
            <li style="text-align: left;">Defeated the monstrous boar Tandayag with his bare hands</li>
            <li style="text-align: left;">Introduced taro cultivation to the region</li>
            <li style="text-align: left;">Paved the way for future heroes to flourish in Ibalong</li>
            <li style="text-align: left;">Became a symbol of strength, leadership, and agrarian prosperity</li>
            </ul>`,
  },
  // BALTOG - Spread 2
  {
    left: `<h2>Baltog</h2>
            <p><b>Symbolism / Cultural Meaning:</b> Baltog represents heroism, agricultural advancement, and the triumph of civilization over chaos in Bicolano mythology.</p>
            <p><b>Allies and Enemies:</b></p>
            <p>Allies: Handyong (later hero of Ibalong)</p>
            <p>Enemies: Tandayag the boar, early monsters that terrorized the land</p>`,
    right: `<h2>Baltog</h2>
            <p><b>Known Artifacts or Tools (Optional):</b></p>
            <ul>
            <li>Boar tusks (kept as trophies or symbols of victory)</li>
            <li>Clay jar used for taro storage</li>
            <li>Bolo for farming and defense</li>
            </ul>
            <p><b>Quote / Excerpt from the Epic:</b> "With the strength of twenty men, Baltog seized the mighty Tandayag and broke its tusks with his bare hands, bringing peace to the land of Ibalong."
            <p><b>Geographic / Mythical Locations:</b></p>
            <ul>
            <li style="text-align: left;">Ibalong Valley</li>
            <li style="text-align: left;">Tandayag's Forest</li>
            </ul>
            <p><b>Trivia or Fun Fact:</b> Baltog is considered the patron of farmers in Bicol folklore. The taro plant (gabi) that he introduced remains a staple food in the region today.</p>`,
  },
  // HANDIONG - Spread 1
  {
    left: `<h2>Handiong</h2>
            <img src="images/handiong.png" alt="Handiong" />`,
    right: `<h2>Handiong</h2>
            <p><b>Short Title:</b> "The Monster Slayer"</p>
            <p><b>Mythical Origin / Ethnic Background:</b> Noble warrior from Boltavara (ancient India) - Second great hero of Ibalong, successor to Baltog, possessing both martial prowess and wisdom of governance</p>
            <p><b>Key Role in the Epic:</b> Handiong was the second great hero who continued Baltog's work, eliminated the remaining monsters terrorizing Ibalong, and established the first system of laws, writing, and advanced civilization in the region.</p>
            <p><b>Major Feats or Contributions:</b></p>
            <ul>
            <li style="text-align: left;">Defeated the multi-headed monster Rabot and countless other beasts</li>
            <li style="text-align: left;">Established the first written laws and legal system</li>
            <li style="text-align: left;">Introduced the first writing system (syllabary) to the region</li>
            </ul>`,
  },
  // HANDIONG - Spread 2
  {
    left: `<h2>Handiong</h2>
            <p><b>Symbolism / Cultural Meaning:</b> Symbol of law, order, education, and civilization. Represents the transition from primitive survival to organized society, the importance of literacy and justice, and the ideal ruler who serves his people through wisdom and strength.</p>
            <p><b>Allies and Enemies:</b></p>
            <p>Allies: Bantong (his loyal lieutenant), surviving followers of Baltog, local chieftains</p>
            <p>Enemies: Rabot (multi-headed monster), various giants and supernatural beasts, bandits and lawless elements</p>`,
    right: `<h2>Handiong</h2>
            <p><b>Known Artifacts or Tools:</b></p>
            <ul>
            <li>Enchanted sword or kampilan</li>
            <li>Clay tablets with the first syllabary</li>
            <li>Law tablets</li>
            <li>Surveying tools for road-building</li>
            <li>Royal seal</li>
            </ul>
            <p><b>Quote / Excerpt from the Epic:</b> "Handiong brought forth the light of learning to Ibalong, teaching the people to read and write, while his sword kept evil at bay."
            <p><b>Geographic/Mythical Locations:</b></p>
            <ul>
            <li style="text-align: left;">Mount Asog (Rabot's lair)</li>
            <li style="text-align: left;">the first roads of Ibalong</li>
            <li style="text-align: left;">sites of the earliest schools and courts</li>
            <li style="text-align: left;">the royal settlement (predecessor to modern Legazpi)</li>
            <li style="text-align: left;">Inarihan River</li>
            </ul>
            <p><b>Trivia or Fun Fact:</b> Handiong is credited with creating the first Filipino alphabet and legal code.</p>`,
  },
  // BANTONG - Spread 1
  {
    left: `<h2>Bantong</h2>
            <img src="images/bantong.png" alt="Bantong" />`,
    right: `<h2>Bantong</h2>
            <p><b>Short Title:</b> "The Swift Warrior"</p>
            <p><b>Mythical Origin / Ethnic Background:</b> Native-born hero of Ibalong - Third great hero, younger generation warrior trained under Handiong's guidance, representing the new breed of local-born defenders</p>
            <p><b>Key Role in the Epic:</b> Bantong was the young warrior who completed the heroic trilogy by delivering the final blow to Rabot, the most fearsome monster in Ibalong, when even the mighty Handiong struggled to defeat it alone.</p>
            <p><b>Major Feats or Contributions:</b></p>
            <ul>
            <li style="text-align: left;">Delivered the killing blow to the giant Rabot with a precise spear thrust</li>
            <li style="text-align: left;">Demonstrated that skill and courage could triumph over size and strength</li>
            <li style="text-align: left;">Became the symbol of the new generation of local heroes</li>
            <li style="text-align: left;">Helped complete the pacification of Ibalong</li>
            <li style="text-align: left;">Served as loyal lieutenant and eventual successor to Handiong</li>
            </ul>`,
  },
  // BANTONG - Spread 2
  {
    left: `<h2>Bantong</h2>
            <p><b>Symbolism / Cultural Meaning:</b> Symbol of youth, precision, loyalty, and the coming-of-age of the local people.</p>
            <p><b>Allies and Enemies:</b></p>
            <p>Allies: Handiong (mentor and commander), the warriors of Ibalong, local communities</p>
            <p>Enemies: Rabot (the multi-headed giant), remaining monsters and threats to the kingdom</p>`,
    right: `<h2>Bantong</h2>
            <p><b>Known Artifacts or Tools:</b></p>
            <ul>
            <li style="text-align: left;">Legendary spear or bow that could pierce any hide</li>
            <li style="text-align: left;">Hunting knives</li>
            <li style="text-align: left;">Lightweight armor designed for speed and agility</li>
            </ul>
            <p><b>Quote / Excerpt from the Epic:</b> "Young Bantong, swift as the wind, struck true where others had failed, and the mighty Rabot fell at last to the courage of youth."
            <p><b>Geographic/Mythical Locations:</b></p>
            <ul>
            <li style="text-align: left;">Mount Asog (site of Rabot's defeat)</li>
            <li style="text-align: left;">training fields where Handiong taught him</li>
            </ul>
            <p><b>Trivia or Fun Fact:</b> Bantong is often considered the most relatable hero of the three, representing the "everyman" who rises to greatness through determination rather than supernatural strength. Some versions say he was the first hero born in Ibalong itself, making him truly a local champion. His victory over Rabot is celebrated in some areas as a coming-of-age story for the entire Bicol region.</p>`,
  },
  // TANDAYAG - Spread 1
  {
    left: `<h2>Tandayag</h2>
            <img src="images/tandayag.png" alt="Tandayag" />`,
    right: `<h2>Tandayag</h2>
            <p><b>Short Title:</b> "The Mighty Boar of Ibalon"</p>
            <p><b>Mythical Origin / Ethnic Background:</b> Ancient wild boar spirit of immense size and supernatural strength, embodying the untamed wilderness of early Bicol</p>
            <p><b>Key Role in the Epic:</b> Primary antagonist representing the chaotic forces of nature that the heroes must overcome to establish civilization</p>
            <p><b>Major Feats or Contributions:</b></p>
            <ul>
            <li style="text-align: left;">Terrorized the early inhabitants of Ibalon with his massive tusks and supernatural strength</li>
            <li style="text-align: left;">Destroyed crops and settlements, preventing agricultural development</li>
            <li style="text-align: left;">Served as the ultimate test of Baltog's heroic strength and leadership</li>
            <li style="text-align: left;">His defeat marked the beginning of organized civilization in the region</li>
            </ul>`,
  },
    // TANDAYAG - Spread 2
  {
    left: `<h2>Tandayag</h2>
            <p><b>Symbolism / Cultural Meaning:</b> Represents the wild, untamed forces of nature that must be conquered for civilization to flourish; symbolizes the struggle between order and chaos, cultivation and wilderness</p>
            <p><b>Allies and Enemies:</b></p>
            <p>Allies: Other wild creatures and spirits of the forest</p>
            <p>Enemies: Baltog (primary), early settlers of Ibalon</p>`,
    right: `<h2>Tandayag</h2>
            <p><b>Known Artifacts or Tools:</b></p>
            <ul>
            <li style="text-align: left;">His massive ivory tusks, which became trophies after his defeat</li>
            </ul>
            <p><b>Quote / Excerpt from the Epic:</b> "With tusks like spears and strength beyond measure, Tandayag ruled the wilderness with terror."
            <p><b>Geographic/Mythical Locations:</b></p>
            <ul>
            <li style="text-align: left;">The dense forests and wild lands of ancient Ibalon</li>
            <li style="text-align: left;">particularly the mountainous regions</li>
            </ul>
            <p><b>Trivia or Fun Fact:</b> Tandayag's tusks were said to be so large they could uproot entire trees, and his defeat required Baltog to use both strength and cunning rather than brute force alone.</p>`,
  },
    // ORYOL - Spread 1
  {
    left: `<h2>Oryol</h2>
            <img src="images/oryol.png" alt="Oryol" />`,
    right: `<h2>Oryol</h2>
            <p><b>Short Title:</b> The Serpent Princess, The Beautiful Serpent</p>
            <p><b>Mythical Origin / Ethnic Background:</b> Half-woman, half-serpent deity with origins in ancient Bicolano water and earth spirits</p>
            <p><b>Key Role in the Epic:</b> Seductive antagonist who represents temptation and the dangerous allure of the supernatural world</p>
            <p><b>Major Feats or Contributions:</b></p>
            <ul>
            <li style="text-align: left;">Possessed the power to shapeshift between beautiful woman and massive serpent</li>
            <li style="text-align: left;">Lured warriors and heroes with her beauty before revealing her true nature</li>
            <li style="text-align: left;">Controlled water sources and could cause floods or droughts</li>
            <li style="text-align: left;">Challenged the heroes' resolve and moral strength</li>
            </ul>`,
  },
    // ORYOL - Spread 2
  {
    left: `<h2>Oryol</h2>
            <p><b>Symbolism / Cultural Meaning:</b> Embodies the dual nature of beauty and danger, the feminine mystique, and the power of water and fertility; represents temptation that tests moral character</p>
            <p><b>Allies and Enemies:</b></p>
            <p>Allies: Water spirits, other shape-shifting creatures</p>
            <p>Enemies: Handyong (primary), other heroes of Ibalon</p>`,
    right: `<h2>Oryol</h2>
            <p><b>Known Artifacts or Tools:</b></p>
            <ul>
            <li style="text-align: left;">Her serpentine form itself</li>
            <li style="text-align: left;">power over water and weather</li>
            </ul>
            <p><b>Quote / Excerpt from the Epic:</b> "Fair as the morning star was Oryol's face, but beneath lay the coils of the ancient serpent."
            <p><b>Geographic/Mythical Locations:</b></p>
            <ul>
            <li style="text-align: left;">Rivers, lakes, and water sources throughout Ibalon</li>
            <li style="text-align: left;">particularly associated with Mount Isarog area</li>
            </ul>
            <p><b>Trivia or Fun Fact:</b> Oryol's beauty was said to be so enchanting that even the bravest warriors would forget their purpose upon seeing her, making her defeat as much a triumph of will as of strength.</p>`,
  },
    // RABOT - Spread 1
  {
    left: `<h2>Rabot</h2>
            <img src="images/rabot.png" alt="Rabot" />`,
    right: `<h2>Rabot</h2>
            <p><b>Short Title:</b> The Half-Man Half-Beast, The Ferocious Giant, The Mountain Terror</p>
            <p><b>Mythical Origin / Ethnic Background:</b> Born from the savage wilderness, part human and part beast, representing the boundary between civilization and wild nature</p>
            <p><b>Key Role in the Epic:</b> Formidable monster antagonist whose defeat represents another step in taming the wild lands of Ibalon.</p>
            <p><b>Major Feats or Contributions:</b></p>
            <ul>
            <li style="text-align: left;">Possessed incredible physical strength combining human intelligence with bestial ferocity</li>
            <li style="text-align: left;">Terrorized mountain regions and prevented settlement of highland areas</li>
            <li style="text-align: left;">His hybrid nature made him particularly dangerous as he could think like a human but fight like a wild beast</li>
            <li style="text-align: left;">His defeat opened up new territories for the people of Ibalon</li>
            <li style="text-align: left;">Represented the evolutionary challenge between primitive and civilized existence</li>
            </ul>`,
  },
    // RABOT - Spread 2
  {
    left: `<h2>Rabot</h2>
            <p><b>Symbolism / Cultural Meaning:</b> Symbolizes the struggle between humanity's civilized nature and its primal instincts; represents the fears of regression to savagery and the ongoing battle to maintain civilization.</p>
            <p><b>Allies and Enemies:</b></p>
            <p>Allies: Other monsters and wild creatures of the mountains</p>
            <p>Enemies: Handiong and other heroes who sought to civilize the land</p>`,
    right: `<h2>Rabot</h2>
            <p><b>Known Artifacts or Tools:</b></p>
            <ul>
            <li style="text-align: left;">His natural weapons - claws, fangs, and immense physical strength</li>
            </ul>
            <p><b>Quote / Excerpt from the Epic:</b> "Rabot's roar echoed through the mountains, a sound that froze the blood of even the bravest warriors."
            <p><b>Geographic/Mythical Locations:</b></p>
            <ul>
            <li style="text-align: left;">Mountain caves and highland forests</li>
            <li style="text-align: left;">particularly areas that were considered too dangerous for human settlement</li>
            </ul>
            <p><b>Trivia or Fun Fact:</b> Rabot's half-human, half-beast nature reflects ancient Filipino beliefs about the thin boundary between humanity and the animal world, suggesting transformation was always possible in both directions.</p>`,
  },
      // SARIMAO - Spread 1
  {
    left: `<h2>Sarimao</h2>
            <img src="images/sarimao.png" alt="Sarimao" />`,
    right: `<h2>Sarimao</h2>
            <p><b>Short Title:</b> The Dog-like Monster, The Savage Hound, The Howling Terror</p>
            <p><b>Mythical Origin / Ethnic Background:</b> Supernatural canine entity born from the wild spirits of the forest</p>
            <p><b>Key Role in the Epic:</b> Beast antagonist representing loyalty corrupted and the dangers of uncontrolled animal instincts.</p>
            <p><b>Major Feats or Contributions:</b></p>
            <ul>
            <li style="text-align: left;">Possessed extraordinary hunting abilities and pack leadership</li>
            <li style="text-align: left;">Could rally other wild animals to attack human settlements</li>
            <li style="text-align: left;">Represented the challenge of domesticating the natural world</li>
            <li style="text-align: left;">His defeat symbolized humanity's mastery over animal kingdom</li>
            <li style="text-align: left;">Served as a test of heroes' ability to face creatures that mirrored positive traits (loyalty, courage) turned malevolent</li>
            </ul>`,
  },
    // SARIMAO - Spread 2
  {
    left: `<h2>Sarimao</h2>
            <p><b>Symbolism / Cultural Meaning:</b> Represents the double-edged nature of animal traits - loyalty and ferocity, protection and destruction; symbolizes the need to channel animal instincts constructively rather than destructively.</p>
            <p><b>Allies and Enemies:</b></p>
            <p>Allies: Wild dogs, wolves, and other pack animals of the forest</p>
            <p>Enemies: The heroes and settlers of Ibalon</p>`,
    right: `<h2>Sarimao</h2>
            <p><b>Known Artifacts or Tools:</b></p>
            <ul>
            <li style="text-align: left;">Natural weapons of fangs and claws</li>
            <li style="text-align: left;">supernatural howl that could summon other beasts</li>
            </ul>
            <p><b>Quote / Excerpt from the Epic:</b> "The howl of Sarimao called forth all the wild dogs of the forest, their eyes gleaming like stars in the darkness."
            <p><b>Geographic/Mythical Locations:</b></p>
            <ul>
            <li style="text-align: left;">Dense forests and hunting grounds where wild packs roamed</li>
            </ul>
            <p><b>Trivia or Fun Fact:</b> Sarimao's characterization reflects the ancient Bicolano understanding of dogs as both protectors and potential threats, embodying the importance of proper relationships between humans and animals.</p>`,
  },
     // BURING - Spread 1
  {
    left: `<h2>Buring</h2>
            <img src="images/buring.png" alt="Buring" />`,
    right: `<h2>Buring</h2>
            <p><b>Short Title:</b> The One-Eyed Giant, The Cyclops of Ibalon, The Mountain Guardian</p>
            <p><b>Mythical Origin / Ethnic Background:</b> Giant born from the rocks and stones of the mountains, embodying geological forces</p>
            <p><b>Key Role in the Epic:</b> Colossal antagonist representing the massive, seemingly immovable obstacles that civilization must overcome.</p>
            <p><b>Major Feats or Contributions:</b></p>
            <ul>
            <li style="text-align: left;">Possessed strength capable of hurling massive boulders</li>
            <li style="text-align: left;">His single eye could see great distances, making surprise attacks difficult</li>
            <li style="text-align: left;">Controlled mountain passes and prevented trade and communication</li>
            <li style="text-align: left;">His defeat opened up major transportation routes</li>
            <li style="text-align: left;">Represented the challenge of overcoming seemingly impossible odds through cleverness rather than just strength</li>
            </ul>`,
  },
    // BURING - Spread 2
  {
    left: `<h2>Buring</h2>
            <p><b>Symbolism / Cultural Meaning:</b> Symbolizes the massive challenges that appear insurmountable but can be overcome through wisdom, strategy, and perseverance; represents the geological forces that shape the landscape and must be worked with rather than against.</p>
            <p><b>Allies and Enemies:</b></p>
            <p>Allies: Other giants and mountain spirits</p>
            <p>Enemies: Heroes seeking to connect the communities of Ibalon</p>`,
    right: `<h2>Buring</h2>
            <p><b>Known Artifacts or Tools:</b></p>
            <ul>
            <li style="text-align: left;">Massive stone weapons and his all-seeing eye</li>
            </ul>
            <p><b>Quote / Excerpt from the Epic:</b> "With his single eye, Buring could spot a sparrow from across the valley, but wisdom blinded him to the hero's clever approach."
            <p><b>Geographic/Mythical Locations:</b></p>
            <ul>
            <li style="text-align: left;">Mountain passes, rocky outcroppings, and stone formations throughout Ibalon</li>
            </ul>
            <p><b>Trivia or Fun Fact:</b> Buring's single eye likely represents the focused but limited perspective that comes with great power - suggesting that even the mightiest can be defeated by those who see the bigger picture.</p>`,
  },
      // BUAYA - Spread 1
  {
    left: `<h2>Buaya</h2>
            <img src="images/buaya.png" alt="Buaya" />`,
    right: `<h2>Buaya</h2>
            <p><b>Short Title:</b> The Great Crocodile, The River Dragon, The Swamp Terror</p>
            <p><b>Mythical Origin / Ethnic Background:</b> Ancient reptilian spirit born from the primordial waters and swamplands of Ibalon</p>
            <p><b>Key Role in the Epic:</b> Aquatic monster representing the untamed waterways and the dangers that lurked beneath the surface of rivers and swamps.</p>
            <p><b>Major Feats or Contributions:</b></p>
            <ul>
            <li style="text-align: left;">Controlled the major waterways of Ibalon, preventing safe river travel and fishing</li>
            <li style="text-align: left;">Possessed armor-like scales that made him nearly invulnerable to conventional weapons</li>
            <li style="text-align: left;">Could remain submerged for long periods, launching surprise attacks on unsuspecting victims</li>
            <li style="text-align: left;">His massive jaws could crush canoes and small boats with ease</li>
            <li style="text-align: left;">His defeat made river transportation and fishing safe for the people of Ibalon</li>
            <li style="text-align: left;">Represented mastery over the aquatic realm alongside the terrestrial victories</li>
            </ul>`,
  },
    // BUAYA - Spread 2
  {
    left: `<h2>Buaya</h2>
            <p><b>Symbolism / Cultural Meaning:</b> Embodies the hidden dangers of water and the need for respect and caution around aquatic environments; represents the primal fears of being consumed or dragged into the depths; symbolizes the importance of conquering fear to utilize natural resources safely.</p>
            <p><b>Allies and Enemies:</b></p>
            <p>Allies: Other water spirits, serpents, and aquatic monsters</p>
            <p>Enemies: Heroes of Ibalon, particularly those who needed to cross waterways or establish fishing communities</p>`,
    right: `<h2>Buaya</h2>
            <p><b>Known Artifacts or Tools:</b></p>
            <ul>
            <li style="text-align: left;">Impenetrable scales that served as natural armor</li>
            <li style="text-align: left;">powerful jaws capable of crushing stone</li>
            <li style="text-align: left;">ability to remain hidden underwater for extended periods</li>
            </ul>
            <p><b>Quote / Excerpt from the Epic:</b> "The great Buaya rose from the murky depths, his eyes like burning coals above the water, his jaws wide enough to swallow a warrior whole."
            <p><b>Geographic/Mythical Locations:</b></p>
            <ul>
            <li style="text-align: left;">Rivers, swamps, and marshlands throughout Ibalon</li>
            <li style="text-align: left;">particularly the major waterways that connected different regions</li>
            </ul>
            <p><b>Trivia or Fun Fact:</b> Buaya represents the real dangers that crocodiles posed to ancient Filipino communities, but elevated to mythic proportions. His defeat symbolized not just physical conquest but the mastery of water-based resources essential for agriculture and trade.</p>`,
  },
];

// Split content into pages
const pages = splitContentIntoPages(originalContent);

let currentIndex = 0;
let isAnimating = false;

// Add popup functionality
function createPopup() {
  const popup = document.createElement("div");
  popup.className = "image-popup";
  document.body.appendChild(popup);
  return popup;
}

function showPopup(element, imagePath) {
  const popup = document.querySelector(".image-popup") || createPopup();
  const rect = element.getBoundingClientRect();

  popup.innerHTML = `<img src="images/${imagePath}" alt="${element.textContent}">`;
  popup.style.display = "block";

  // Position the popup
  const popupRect = popup.getBoundingClientRect();
  let left = rect.left + rect.width / 2 - popupRect.width / 2;
  let top = rect.bottom + 10;

  // Adjust if popup would go off screen
  if (left + popupRect.width > window.innerWidth) {
    left = window.innerWidth - popupRect.width - 10;
  }
  if (top + popupRect.height > window.innerHeight) {
    top = rect.top - popupRect.height - 10;
  }

  popup.style.left = `${left}px`;
  popup.style.top = `${top}px`;
}

function hidePopup() {
  const popup = document.querySelector(".image-popup");
  if (popup) {
    popup.style.display = "none";
  }
}

// Add event listeners for popups
function addPopupListeners() {
  document
    .querySelectorAll(".character, .creature, .landmark")
    .forEach((element) => {
      element.addEventListener("mouseenter", (e) => {
        const imagePath = e.target.dataset.image;
        showPopup(e.target, imagePath);
      });

      element.addEventListener("mouseleave", hidePopup);
    });
}

// Function to turn the page
function turnPage(direction) {
  if (isAnimating) return;
  isAnimating = true;

  const leftPage = document.getElementById("left-page");
  const rightPage = document.getElementById("right-page");

  // Add turning class for animation
  rightPage.classList.add("turning");

  // After animation completes
  setTimeout(() => {
    rightPage.classList.remove("turning");
    if (direction === "next") {
      currentIndex += 2; // Increment by 2 to move to the next spread
    } else {
      currentIndex -= 2; // Decrement by 2 to move to the previous spread
    }
    renderPages();
    isAnimating = false;
  }, 600); // Match this with CSS transition duration
}

function nextPage() {
  if (currentIndex + 2 <= pages.length && !isAnimating) { // Check if there's a next spread (2 pages) available
    turnPage("next");
  }
}

function prevPage() {
  if (currentIndex >= 2 && !isAnimating) { // Check if there's a previous spread (2 pages) available
    turnPage("prev");
  }
}

// Add keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    nextPage();
  } else if (e.key === "ArrowLeft") {
    prevPage();
  }
});

// Add touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.querySelector(".book").addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

document.querySelector(".book").addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      nextPage();
    } else {
      prevPage();
    }
  }
}
