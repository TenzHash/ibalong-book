// Function to split content into pages
function splitContentIntoPages(content) {
    const pages = [];
    let currentPage = { left: '', right: '' };
    let currentSide = 'left';
    let currentHeight = 0;
    const maxHeight = 600; // Maximum height for each page

    // Helper function to create a temporary element to measure content
    function measureContent(html) {
        const temp = document.createElement('div');
        temp.style.visibility = 'hidden';
        temp.style.position = 'absolute';
        temp.style.width = '100%';
        temp.innerHTML = html;
        document.body.appendChild(temp);
        const height = temp.offsetHeight;
        document.body.removeChild(temp);
        return height;
    }

    // Process each section of content
    content.forEach(section => {
        const leftContent = section.left;
        const rightContent = section.right;

        // Measure the height of the content
        const leftHeight = measureContent(leftContent);
        const rightHeight = measureContent(rightContent);

        // If content is too tall for one page, split it
        if (leftHeight > maxHeight || rightHeight > maxHeight) {
            // Split the content into multiple pages
            const leftPages = splitContent(leftContent, maxHeight);
            const rightPages = splitContent(rightContent, maxHeight);

            // Add pages
            for (let i = 0; i < Math.max(leftPages.length, rightPages.length); i++) {
                pages.push({
                    left: leftPages[i] || '',
                    right: rightPages[i] || ''
                });
            }
        } else {
            // Add as a single page
            pages.push({
                left: leftContent,
                right: rightContent
            });
        }
    });

    return pages;
}

// Helper function to split content into multiple pages
function splitContent(content, maxHeight) {
    const pages = [];
    const temp = document.createElement('div');
    temp.innerHTML = content;
    const elements = Array.from(temp.children);
    let currentPage = '';
    let currentHeight = 0;

    elements.forEach(element => {
        const elementHeight = measureContent(element.outerHTML);
        
        if (currentHeight + elementHeight > maxHeight) {
            pages.push(currentPage);
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
             <p>Exploring the rich cultural heritage of Bicol through its epic tale</p>
             <div class="image-placeholder">
               <!-- Add a beautiful cover image of Mayon Volcano or Bicol landscape -->
             </div>`,
      right: `<h2>Foreword</h2>
              <p>Welcome to this journey through the epic tale of Ibalong, a story that has shaped the cultural identity of the Bicol region for generations. This virtual coffee table book invites you to explore the rich tapestry of myths, heroes, and legends that continue to resonate in modern Bicolano life.</p>
              <p>Through these pages, we will journey through time, from the ancient settlements of Ibalong to the vibrant modern Bicol region. We will meet legendary heroes, encounter mythical creatures, and discover how this epic continues to influence Bicolano culture today.</p>
              <div class="image-placeholder">
                <!-- Add an image of traditional Bicolano art or manuscript -->
              </div>`
    },
    {
      left: `<h2>Introduction: The Legend of Ibalong</h2>
             <p>The Ibalong Epic is one of the Philippines' most significant literary treasures, originating from the Bicol region. This epic poem, passed down through generations, tells the story of how the ancient land of Ibalong was settled and civilized by three legendary heroes.</p>
             <p>The epic begins with the arrival of Baltog, a mighty warrior from the land of Botavara. His victory over the giant wild boar Tandayag marked the beginning of human settlement in Ibalong. This was followed by the arrival of Handyong, who brought order and civilization to the land, and finally Bantong, who defeated the last remaining monster, Rabot.</p>
             <div class="image-placeholder">
               <!-- Add an image of ancient Bicolano settlement or artifacts -->
             </div>`,
      right: `<h2>Map of Ancient Ibalong</h2>
              <p>The ancient land of Ibalong encompassed what is now known as the Bicol region, stretching from the southern tip of Luzon to the islands of Masbate and Catanduanes. This fertile land, surrounded by the Pacific Ocean and the Philippine Sea, was home to both mythical creatures and the first settlers of Bicol.</p>
              <p>The region's geography played a crucial role in shaping the epic's narrative. The majestic Mayon Volcano, the lush forests, and the surrounding seas all feature prominently in the stories of Ibalong's heroes and their battles against the forces of nature and mythical creatures.</p>
              <div class="image-placeholder">
                <!-- Add a map of ancient Ibalong -->
              </div>`
    },
    {
      left: `<h2>The Bicolano Worldview</h2>
             <p>The Bicolano worldview is deeply rooted in the harmony between nature and spirituality. This perspective is beautifully reflected in the Ibalong Epic, where the natural world is both revered and respected, and where humans must learn to live in balance with the forces of nature.</p>
             <p>Key aspects of the Bicolano worldview include:</p>
             <ul>
               <li>Deep respect for nature and its forces</li>
               <li>Belief in the interconnectedness of all living things</li>
               <li>Importance of community and collective well-being</li>
               <li>Balance between tradition and progress</li>
             </ul>
             <div class="image-placeholder">
               <!-- Add an image of traditional Bicolano spiritual practices -->
             </div>`,
      right: `<h2>The Origins of the Epic</h2>
              <p>The Ibalong Epic was first recorded by Spanish friars in the 17th century, though its origins date back much further. The epic was traditionally performed during festivals and important gatherings, serving as both entertainment and a means of preserving cultural knowledge.</p>
              <p>The epic's preservation and transmission involved:</p>
              <ul>
                <li>Oral tradition through generations</li>
                <li>Performance during community gatherings</li>
                <li>Documentation by Spanish chroniclers</li>
                <li>Modern scholarly research and interpretation</li>
              </ul>
              <div class="image-placeholder">
                <!-- Add an image of historical manuscripts or traditional performance -->
              </div>`
    },
    {
      left: `<h2>The Three Great Heroes</h2>
             <h3>6.1 Baltog</h3>
             <p>Baltog, the first hero of Ibalong, was a mighty warrior from the land of Botavara. He is best known for his legendary battle with the giant wild boar Tandayag, which he defeated using his bare hands. His victory marked the beginning of human settlement in Ibalong.</p>
             <p>Key achievements of Baltog:</p>
             <ul>
               <li>First to establish human settlement in Ibalong</li>
               <li>Defeated the giant wild boar Tandayag</li>
               <li>Cleared the land for agriculture</li>
               <li>Established the first community in the region</li>
             </ul>
             <div class="image-placeholder">
               <!-- Add an image of Baltog's battle with Tandayag -->
             </div>`,
      right: `<h3>6.2 Handyong</h3>
              <p>Handyong, the second hero, was a lawgiver and civilizer who brought order to Ibalong. Under his leadership, the land experienced its golden age. He established laws, taught agriculture, and led the people in their battles against the remaining monsters.</p>
              <p>Handyong's contributions to Ibalong:</p>
              <ul>
                <li>Established a system of laws and governance</li>
                <li>Introduced advanced agricultural techniques</li>
                <li>Led the campaign against remaining monsters</li>
                <li>Fostered peace and prosperity in the region</li>
              </ul>
              <div class="image-placeholder">
                <!-- Add an image of Handyong's golden age -->
              </div>`
    },
    {
      left: `<h3>6.3 Bantong</h3>
             <p>Bantong, the third hero, was Handyong's trusted companion. He is most famous for his cunning and bravery in defeating the half-man, half-beast Rabot, the last remaining monster in Ibalong. His victory marked the end of the age of monsters.</p>
             <p>Bantong's legacy includes:</p>
             <ul>
               <li>Defeat of the last monster, Rabot</li>
               <li>Completion of Ibalong's transformation</li>
               <li>Establishment of lasting peace</li>
               <li>Symbol of courage and wisdom</li>
             </ul>
             <div class="image-placeholder">
               <!-- Add an image of Bantong's battle with Rabot -->
             </div>`,
      right: `<h2>The Monsters of Ibalong</h2>
              <h3>7.1 Tandayag the Wild Boar</h3>
              <p>Tandayag was a giant wild boar that terrorized the early settlers of Ibalong. Its massive size and strength made it a formidable opponent, until it was finally defeated by Baltog in an epic battle that would be remembered for generations.</p>
              <p>Characteristics of Tandayag:</p>
              <ul>
                <li>Gigantic size and strength</li>
                <li>Destructive force of nature</li>
                <li>Symbol of untamed wilderness</li>
                <li>First major challenge to human settlement</li>
              </ul>
              <div class="image-placeholder">
                <!-- Add an image of Tandayag -->
              </div>`
    },
    {
      left: `<h3>7.2 Oryol the Serpent</h3>
             <p>Oryol, a beautiful serpent with a woman's head, was one of the most complex characters in the epic. Initially an enemy of the settlers, she later became an ally and even a lover to Handyong, symbolizing the transformation of chaos into order.</p>
             <p>Oryol's significance:</p>
             <ul>
               <li>Representation of nature's dual nature</li>
               <li>Symbol of transformation and change</li>
               <li>Bridge between human and natural worlds</li>
               <li>Complex character development</li>
             </ul>
             <div class="image-placeholder">
               <!-- Add an image of Oryol -->
             </div>`,
      right: `<h3>7.3 Other Mythical Beasts</h3>
              <p>The epic tells of many other creatures that once roamed Ibalong: the one-eyed giants, the flying crocodiles, and the man-eating birds. Each of these creatures represented different challenges that the early settlers had to overcome.</p>
              <p>Notable mythical creatures:</p>
              <ul>
                <li>One-eyed giants (Sarimao)</li>
                <li>Flying crocodiles (Buringcantada)</li>
                <li>Man-eating birds (Tandayag na Opong)</li>
                <li>Giant snakes (Buringcantada)</li>
              </ul>
              <div class="image-placeholder">
                <!-- Add an image of mythical creatures -->
              </div>`
    },
    {
      left: `<h2>Oryol: Enemy and Lover</h2>
             <p>The story of Oryol represents one of the most fascinating aspects of the Ibalong Epic. Her transformation from a fearsome monster to a beloved companion of Handyong symbolizes the reconciliation between the natural world and human civilization.</p>
             <p>Key aspects of Oryol's story:</p>
             <ul>
               <li>Initial conflict with human settlers</li>
               <li>Transformation through love</li>
               <li>Role in establishing peace</li>
               <li>Symbol of nature's benevolence</li>
             </ul>
             <div class="image-placeholder">
               <!-- Add an image of Oryol and Handyong -->
             </div>`,
      right: `<h2>The Golden Age under Handyong</h2>
              <p>Under Handyong's leadership, Ibalong experienced unprecedented peace and prosperity. The people learned agriculture, established laws, and built communities. This period represents the ideal state of harmony between humans and nature.</p>
              <p>Achievements of the Golden Age:</p>
              <ul>
                <li>Advanced agricultural systems</li>
                <li>Structured social organization</li>
                <li>Peaceful coexistence with nature</li>
                <li>Cultural and artistic development</li>
              </ul>
              <div class="image-placeholder">
                <!-- Add an image of Ibalong's golden age -->
              </div>`
    },
    {
      left: `<h2>The Fall and Resilience of Ibalong</h2>
             <p>Despite the golden age, Ibalong faced challenges that led to its decline. However, the spirit of the epic lives on, continuing to inspire the Bicolano people to overcome adversity and maintain their cultural identity.</p>
             <p>Factors in Ibalong's transformation:</p>
             <ul>
               <li>Natural disasters and calamities</li>
               <li>External influences and changes</li>
               <li>Adaptation to new circumstances</li>
               <li>Preservation of cultural heritage</li>
             </ul>
             <div class="image-placeholder">
               <!-- Add an image of historical Bicol -->
             </div>`,
      right: `<h2>Symbolism in the Epic</h2>
              <p>The Ibalong Epic is rich in symbolism, with each character and event representing deeper meanings about human nature, the relationship between humans and nature, and the challenges of building a civilization.</p>
              <p>Key symbolic elements:</p>
              <ul>
                <li>Heroes as cultural ideals</li>
                <li>Monsters as natural challenges</li>
                <li>Landscape as character</li>
                <li>Transformation as growth</li>
              </ul>
              <div class="image-placeholder">
                <!-- Add an image of symbolic elements -->
              </div>`
    },
    {
      left: `<h2>Modern Interpretations</h2>
             <p>Contemporary artists, writers, and scholars continue to find new meaning in the Ibalong Epic. Their interpretations help keep the story relevant to modern audiences while preserving its cultural significance.</p>
             <p>Modern adaptations include:</p>
             <ul>
               <li>Literary retellings</li>
               <li>Visual arts and illustrations</li>
               <li>Performance arts</li>
               <li>Digital media presentations</li>
             </ul>
             <div class="image-placeholder">
               <!-- Add an image of modern interpretations -->
             </div>`,
      right: `<h2>The Ibalong Festival</h2>
              <p>The Ibalong Festival, celebrated annually in Legazpi City, brings the epic to life through street performances, parades, and cultural shows. This modern celebration helps preserve the story and its cultural significance.</p>
              <p>Festival highlights:</p>
              <ul>
                <li>Street performances</li>
                <li>Cultural parades</li>
                <li>Art exhibitions</li>
                <li>Traditional ceremonies</li>
              </ul>
              <div class="image-placeholder">
                <!-- Add an image of the Ibalong Festival -->
              </div>`
    },
    {
      left: `<h2>Artifacts and Ancient Scripts</h2>
             <p>Archaeological findings and ancient scripts provide valuable insights into the historical context of the Ibalong Epic. These artifacts help us understand the real-world basis for the epic's stories and characters.</p>
             <p>Notable artifacts include:</p>
             <ul>
               <li>Ancient pottery and tools</li>
               <li>Traditional weapons</li>
               <li>Religious artifacts</li>
               <li>Historical documents</li>
             </ul>
             <div class="image-placeholder">
               <!-- Add an image of artifacts -->
             </div>`,
      right: `<h2>Legacy of Ibalong in Modern Bicolano Identity</h2>
              <p>The Ibalong Epic continues to shape Bicolano identity, influencing art, literature, and cultural practices. Its themes of heroism, resilience, and harmony with nature remain relevant to contemporary Bicolano life.</p>
              <p>Modern influences:</p>
              <ul>
                <li>Cultural festivals</li>
                <li>Artistic expressions</li>
                <li>Educational programs</li>
                <li>Tourism initiatives</li>
              </ul>
              <div class="image-placeholder">
                <!-- Add an image of modern Bicolano culture -->
              </div>`
    },
    {
      left: `<h2>Photographic Essay: Bicol Today</h2>
             <p>Modern Bicol showcases the enduring legacy of the Ibalong Epic. From its majestic Mayon Volcano to its vibrant festivals, the region continues to embody the spirit of the epic's heroes and their connection to the land.</p>
             <p>Key photographic subjects:</p>
             <ul>
               <li>Natural landscapes</li>
               <li>Cultural events</li>
               <li>Traditional crafts</li>
               <li>Modern developments</li>
             </ul>
             <div class="image-placeholder">
               <!-- Add a photo essay image -->
             </div>`,
      right: `<h2>Glossary of Terms</h2>
              <p>Key terms and concepts from the Ibalong Epic, explained to help readers better understand the cultural and historical context of the story.</p>
              <ul>
                <li>Ibalong - The ancient name of the Bicol region</li>
                <li>Sarimao - One-eyed giants in the epic</li>
                <li>Buringcantada - Flying crocodiles</li>
                <li>Rabot - The last monster defeated by Bantong</li>
                <li>Botavara - The homeland of Baltog</li>
              </ul>
              <div class="image-placeholder">
                <!-- Add an image of traditional Bicolano script -->
              </div>`
    },
    {
      left: `<h2>Bibliography and Sources</h2>
             <p>A comprehensive list of sources used in the creation of this book, including academic papers, historical documents, and cultural resources.</p>
             <ul>
               <li>Academic Research Papers</li>
               <li>Historical Documents</li>
               <li>Cultural Studies</li>
               <li>Oral Histories</li>
               <li>Contemporary Interpretations</li>
             </ul>
             <div class="image-placeholder">
               <!-- Add an image of historical documents -->
             </div>`,
      right: `<h2>Acknowledgments</h2>
              <p>Special thanks to the scholars, artists, and cultural workers who have helped preserve and promote the Ibalong Epic throughout the years.</p>
              <ul>
                <li>Academic Researchers</li>
                <li>Cultural Heritage Workers</li>
                <li>Local Artists</li>
                <li>Community Leaders</li>
                <li>Historical Preservationists</li>
              </ul>
              <div class="image-placeholder">
                <!-- Add an image of contributors -->
              </div>`
    },
    {
      left: `<h2>About the Author</h2>
             <p>Information about the author's background, research, and connection to the Bicol region and its cultural heritage.</p>
             <ul>
               <li>Academic Background</li>
               <li>Research Experience</li>
               <li>Cultural Connections</li>
               <li>Previous Works</li>
             </ul>
             <div class="image-placeholder">
               <!-- Add author photo -->
             </div>`,
      right: `<h2>Contact Information</h2>
              <p>For more information about the Ibalong Epic and Bicolano culture, please visit our website or contact us directly.</p>
              <ul>
                <li>Website</li>
                <li>Email</li>
                <li>Social Media</li>
                <li>Cultural Center</li>
              </ul>
              <div class="image-placeholder">
                <!-- Add contact information image -->
              </div>`
    }
];

// Split content into pages
const pages = splitContentIntoPages(originalContent);

let currentIndex = 0;
let isAnimating = false;

function renderPages() {
    const leftPage = document.getElementById("left-page");
    const rightPage = document.getElementById("right-page");
    
    // Clear existing content
    leftPage.innerHTML = '';
    rightPage.innerHTML = '';
    
    // Add new content
    const leftContent = document.createElement('div');
    leftContent.className = 'page-content';
    leftContent.innerHTML = pages[currentIndex].left;
    leftPage.appendChild(leftContent);
    
    const rightContent = document.createElement('div');
    rightContent.className = 'page-content';
    rightContent.innerHTML = pages[currentIndex].right;
    rightPage.appendChild(rightContent);
    
    // Add page numbers
    const leftPageNum = document.createElement('div');
    leftPageNum.className = 'page-number';
    leftPageNum.textContent = `Page ${currentIndex * 2 + 1}`;
    leftPage.appendChild(leftPageNum);
    
    const rightPageNum = document.createElement('div');
    rightPageNum.className = 'page-number';
    rightPageNum.textContent = `Page ${currentIndex * 2 + 2}`;
    rightPage.appendChild(rightPageNum);
    
    // Update button states
    document.querySelector('button[onclick="prevPage()"]').disabled = currentIndex === 0;
    document.querySelector('button[onclick="nextPage()"]').disabled = currentIndex === pages.length - 1;
}

function turnPage(direction) {
    if (isAnimating) return;
    isAnimating = true;

    const rightPage = document.getElementById('right-page');
    
    // Add turning class for animation
    rightPage.classList.add('turning');

    // After animation completes
    setTimeout(() => {
        rightPage.classList.remove('turning');
        if (direction === 'next') {
            currentIndex++;
        } else {
            currentIndex--;
        }
        renderPages();
        isAnimating = false;
    }, 600); // Match this with CSS transition duration
}

function nextPage() {
    if (currentIndex < pages.length - 1 && !isAnimating) {
        turnPage('next');
    }
}

function prevPage() {
    if (currentIndex > 0 && !isAnimating) {
        turnPage('prev');
    }
}

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        nextPage();
    } else if (e.key === 'ArrowLeft') {
        prevPage();
    }
});

// Add touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.querySelector('.book').addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.querySelector('.book').addEventListener('touchend', (e) => {
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

window.onload = renderPages;
  