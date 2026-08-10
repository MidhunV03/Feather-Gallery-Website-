const swiper = new Swiper(".coverflowSwiper", {
    effect: "coverflow",
    centeredSlides: true,
    slidesPerView: "3",
    loop: true,
    autoplay: { delay: 3000, disableOnInteraction: false },
    coverflowEffect: {
        rotate: 40, stretch: 0, depth: 150, modifier: 1, slideShadows: true
    },
    pagination: { el: ".swiper-pagination", clickable: true },
    breakpoints: {
        0: { slidesPerView: 1, coverflowEffect: { rotate: 10, depth: 80 } },
        320: { slidesPerView: 1, coverflowEffect: { rotate: 20, depth: 100 } },
        576: { slidesPerView: 2, coverflowEffect: { rotate: 30, depth: 120 } },
        768: { slidesPerView: 2, coverflowEffect: { rotate: 30, depth: 120 } },
        1024: { slidesPerView: 3, coverflowEffect: { rotate: 40, depth: 150 } }
    }
});

document.addEventListener("click", (e) => {
    const card = e.target.closest(".bird-card");
    if (!card) return;

    if (card.closest(".swiper")?.classList.contains("swiper-slide-dragging")) return;

    const birdName = card.getAttribute("data-bird");
    if (birdName) {
        window.location.href = `/pages/Details.html?bird=${encodeURIComponent(birdName)}`;
    }
});

async function heroContents() {
    const heroImage = document.getElementById("hero-image");
    const heroName = document.getElementById("hero-name");
    const heroDesc = document.getElementById("hero-desc");
    const heroNavigation = document.getElementById("hero-navigation");
    const loadingOverlay = document.getElementById("loadingOverlay");

    try {
        const response = await fetch("/api/birds/explore");
        if (!response.ok) throw new Error("Failed to fetch explore bird.");

        const birdInfo = await response.json();

        heroName.textContent = birdInfo.name;
        heroDesc.textContent = birdInfo.description;
        heroImage.src = birdInfo.imageUrl;
        heroNavigation.href = `/pages/Details.html?bird=${encodeURIComponent(birdInfo.name)}`;
    } catch (error) {
        console.error(error);
    } finally {
        loadingOverlay?.classList.add("d-none");
        initExploreAnimations();
    }
}

document.addEventListener("DOMContentLoaded", heroContents);

function initExploreAnimations() {
    if (typeof gsap === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".navbar", {
        y: -50, opacity: 0, duration: 1, ease: "power3.out"
    });

    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    heroTl.from("#hero-image", {
        scale: 1.08, opacity: 0, duration: 1.4
    }).from(".main-contents", {
        y: 40, opacity: 0, duration: 1
    }, "-=0.8");

    gsap.from(".container > .headline-font", {
        scrollTrigger: {
            trigger: ".coverflowSwiper", start: "top 85%",
            toggleActions: "play none none none"
        },
        y: 30, opacity: 0, duration: 0.8, ease: "power2.out"
    });

    gsap.from(".coverflowSwiper", {
        scrollTrigger: {
            trigger: ".coverflowSwiper", start: "top 80%",
            toggleActions: "play none none none"
        },
        y: 50, opacity: 0, duration: 1, ease: "power3.out"
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

document.getElementById("ExplorePagebtn")?.addEventListener("click", () => {
    if (typeof toastr !== "undefined") toastr.error("Already in Explore Page");
});
