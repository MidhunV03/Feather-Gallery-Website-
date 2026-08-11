const urlParams = new URLSearchParams(window.location.search);
const birdName = urlParams.get("bird");

const birdHeroName = document.getElementById("birdName");
const birdSciName = document.getElementById("birdSciName");
const birdHeroImg = document.getElementById("birdHeroImg");

async function birdDetails() {
    const loader = document.getElementById("loadingOverlay");

    if (!birdName) {
        loader?.classList.add("d-none");
        return;
    }

    try {
        const response = await fetch(`/api/birds/details?name=${encodeURIComponent(birdName)}`);
        if (!response.ok) throw new Error("Failed to fetch bird details.");

        const bird = await response.json();

        if (!bird || Object.keys(bird).length === 0) {
            document.getElementById("errorContainer")?.classList.remove("d-none");
            document.querySelectorAll(".toHiddenOnError")
                .forEach(element => element.classList.add("d-none"));
            return;
        }

        renderHero(bird);
        renderBaseDetails(bird);
     
        renderAudioPlayer(bird.commonName);
        initAnimations();
    } catch (error) {
        console.error("Bird details failed:", error);
        document.getElementById("errorContainer")?.classList.remove("d-none");
    } finally {
        loader?.classList.add("d-none");
    }
}

document.addEventListener("DOMContentLoaded", birdDetails);

function renderHero(bird) {
    if (birdHeroName) birdHeroName.textContent = bird.commonName;
    if (birdSciName) birdSciName.textContent = bird.scientificName;

    const images = bird.images || [];
    const heroImage = document.getElementById("birdHeroImg");

    if (heroImage && images[0]) heroImage.src = images[0];

    const featureCards = document.querySelectorAll(".ApperanceImg");
    if (featureCards[0] && images[1]) featureCards[0].src = images[1];
    if (featureCards[1] && images[2]) featureCards[1].src = images[2];
}

function renderBaseDetails(bird) {
    const fields = {
        sciName: bird.scientificName,
        lifeSpan: bird.lifespan,
        diet: bird.diet,
        habitat: bird.habitat,
        ApperanceInfoP: bird.appearance,
        ecologyinfoP: bird.ecology
    };

    Object.entries(fields).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value || "Yet Unknown";
    });
}

async function renderAudioPlayer(bird) {
   
    const audioPlayer = document.getElementById("birdAudioPlayer");
    const audioBtn = document.getElementById("audioFallbackBtn");
    const metadataText = document.getElementById("audioMetadata");
    const response  = await fetch(`/api/audio?query=${bird}`);
    const audioData = await response.json();
 

    if (!audioPlayer || !audioBtn || !metadataText) return;

    if (audioData?.audioUrl) {
        audioPlayer.src = audioData.audioUrl;
        audioPlayer.classList.remove("d-none");

        audioBtn.outerHTML =
            `<span class="badge bg-success-subtle text-success px-3 py-2 rounded-pill">
                <i class="fa-solid fa-check me-1"></i> Audio Ready
            </span>`;

        metadataText.textContent =
            `Recorded by ${audioData.recordist || "Unknown"} in ${audioData.location || ""}, ${audioData.country || ""}`;
    } else {
        audioBtn.outerHTML =
            `<span class="badge bg-secondary-subtle text-secondary px-3 py-2 rounded-pill">
                No audio recording available
            </span>`;

        metadataText.textContent =
            "Vocalization sample could not be found for this species.";
    }
}

document.getElementById("backButton")?.addEventListener("click", () => {
    window.history.back();
});

function initAnimations() {
    if (typeof gsap === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".navbar", {
        y: -50, opacity: 0, duration: 1, ease: "power3.out"
    });

    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    heroTl.from("#birdHeroImg", {
        scale: 1.1, opacity: 0, duration: 1.4
    }).from(".main-contents", {
        y: 40, opacity: 0, duration: 1
    }, "-=0.8");

    // gsap.from(".atGlance", {
    //     scrollTrigger: {
    //         trigger: ".atGlance", start: "top 85%",
    //         toggleActions: "play none none none"
    //     },
    //     y: 40, opacity: 0, duration: 0.8, stagger: 0.15,
    //     ease: "power2.out"
    // });

    document.querySelectorAll(".toHiddenOnError .row:not(.atGlance)")
        .forEach(section => {
            const textCol = section.querySelector("div:nth-child(1)");
            const imgCol = section.querySelector("div:nth-child(2)");

            if (textCol && imgCol) {
                gsap.from(textCol, {
                    scrollTrigger: {
                        trigger: section, start: "top 80%",
                        toggleActions: "play none none none"
                    },
                    x: -50, opacity: 0, duration: 1, ease: "power3.out"
                });

                gsap.from(imgCol, {
                    scrollTrigger: {
                        trigger: section, start: "top 80%",
                        toggleActions: "play none none none"
                    },
                    x: 50, opacity: 0, duration: 1, ease: "power3.out", delay: 0.2
                });
            }
        });

    gsap.from("footer .row > div", {
        scrollTrigger: {
            trigger: "footer", start: "top 90%",
            toggleActions: "play none none none"
        },
        y: 30, opacity: 0, duration: 0.8, stagger: 0.15,
        ease: "power2.out"
    });
}
