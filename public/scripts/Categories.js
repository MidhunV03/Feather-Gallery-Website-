const birdGrid = document.getElementById("birdGrid");
const loadingOverlay = document.getElementById("loadingOverlay");
const searchInput = document.getElementById("searchInput");

const birdCache = {};
let currentCategory = "all";

async function loadCategory(category) {
    currentCategory = category;

    if (loadingOverlay) loadingOverlay.style.display = "flex";
    birdGrid.innerHTML =
        '<div class="text-center py-5 w-100">Loading birds...</div>';

    try {
        let birdsToRender;

        if (birdCache[category]) {
            birdsToRender = birdCache[category];
        } else {
            const response = await fetch(
                `/api/birds/category?category=${encodeURIComponent(category)}`
            );

            if (!response.ok) throw new Error("Category API request failed.");

            birdsToRender = await response.json();

            if (!Array.isArray(birdsToRender)) {
                throw new Error("API did not return a valid bird array.");
            }

            birdCache[category] = birdsToRender;
        }

        renderBirds(birdsToRender);
    } catch (error) {
        console.error("Category load failed:", error);
        birdGrid.innerHTML =
            '<div class="text-center py-5 w-100 text-danger">Failed to load birds. Please check your server/API configuration.</div>';
    } finally {
        if (loadingOverlay) loadingOverlay.style.display = "none";
    }
}

function renderBirds(birds) {
    birdGrid.innerHTML = "";

    if (!birds.length) {
        birdGrid.innerHTML =
            '<div class="text-center py-5 w-100 text-muted">No birds found.</div>';
        return;
    }

    birds.forEach(bird => {
        const col = document.createElement("div");
        col.className = "col bird-item";
        col.dataset.category = bird.category || currentCategory;
        col.dataset.name = bird.name;

        col.innerHTML = `
            <div class="card border-0 shadow-sm rounded-4 h-100 bird-card overflow-hidden">
                <img src="${bird.imageUrl}" class="card-img-top object-fit-cover"
                     style="height: 250px;" alt="${bird.name}">
                <div class="card-body bg-white d-flex flex-column">
                    <h5 class="card-title fw-bold">${bird.name}</h5>
                    <p class="card-text text-muted small flex-grow-1">${bird.description}</p>
                    <a href="/pages/Details.html?bird=${encodeURIComponent(bird.name)}"
                       class="btn btn-outline-success btn-sm mt-3 rounded-pill">
                       View Details
                    </a>
                </div>
            </div>
        `;

        birdGrid.appendChild(col);
    });

    if (typeof gsap !== "undefined") {
        gsap.from(".bird-item", {
            y: 40, opacity: 0, duration: 0.8,
            stagger: 0.1, ease: "power2.out"
        });
    }
}

let searchTimeout;

searchInput?.addEventListener("input", e => {
    const query = e.target.value.toLowerCase().trim();

    clearTimeout(searchTimeout);

    if (!query) {
        renderBirds(birdCache[currentCategory] || []);
        return;
    }

    searchTimeout = setTimeout(async () => {
        if (loadingOverlay) loadingOverlay.style.display = "flex";
        birdGrid.innerHTML =
            '<div class="text-center py-5 w-100">Searching for bird...</div>';

        try {
            // The same Express endpoint is used for category-style discovery.
            const response = await fetch(
                `/api/birds/category?category=${encodeURIComponent(query)}`
            );

            if (!response.ok) throw new Error("Search API request failed.");

            const results = await response.json();

            if (!Array.isArray(results) || !results.length) {
                birdGrid.innerHTML =
                    `<div class="text-center py-5 w-100 text-muted">No results found for "${query}".</div>`;
                return;
            }

            renderBirds(results);
        } catch (error) {
            console.error("Search failed:", error);
            birdGrid.innerHTML =
                '<div class="text-center py-5 w-100 text-danger">Failed to fetch search results.</div>';
        } finally {
            if (loadingOverlay) loadingOverlay.style.display = "none";
        }
    }, 500);
});

document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", e => {
        document.querySelectorAll(".filter-btn").forEach(button => {
            button.classList.remove("btn-dark", "active");
            button.classList.add("btn-outline-dark");
        });

        e.currentTarget.classList.remove("btn-outline-dark");
        e.currentTarget.classList.add("btn-dark", "active");

        if (searchInput) searchInput.value = "";

        loadCategory(e.currentTarget.getAttribute("data-category"));
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const navCategory = params.get("category");
    const initialCategory =
        navCategory && navCategory !== "undefined" ? navCategory : "all";

    document.querySelectorAll(".filter-btn").forEach(btn => {
        const active = btn.getAttribute("data-category") === initialCategory;
        btn.classList.toggle("btn-dark", active);
        btn.classList.toggle("active", active);
        btn.classList.toggle("btn-outline-dark", !active);
    });

    loadCategory(initialCategory);
    initCategoryAnimations();
});

document.getElementById("SamePage")?.addEventListener("click", () => {
    if (typeof toastr !== "undefined") toastr.error("Already in same page");
});

function initCategoryAnimations() {
    if (typeof gsap === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".navbar", {
        y: -50, opacity: 0, duration: 1, ease: "power3.out"
    });

    gsap.from(".container.my-5.text-center > *", {
        y: 30, opacity: 0, duration: 1, stagger: 0.2,
        ease: "power3.out", delay: 0.2
    });

    gsap.from("#searchInput", {
        y: 20, opacity: 0, duration: 0.8,
        ease: "power2.out", delay: 0.5
    });

    gsap.from(".filter-btn", {
        y: 20, opacity: 0, duration: 0.8, stagger: 0.08,
        ease: "power2.out", delay: 0.6
    });

    gsap.from("footer .row > div", {
        scrollTrigger: {
            trigger: "footer", start: "top 90%",
            toggleActions: "play none none none"
        },
        y: 30, opacity: 0, duration: 0.8,
        stagger: 0.15, ease: "power2.out"
    });
}
