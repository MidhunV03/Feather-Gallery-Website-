const birdInputForm = document.getElementById("birdInputForm");
const birdInput = document.getElementById("birdInput");

birdInputForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const birdName = birdInput.value.trim();

    if (birdName) {
        window.location.href = `/pages/Details.html?bird=${encodeURIComponent(birdName)}`;
    }
});

document.addEventListener("click", (e) => {
    const card = e.target.closest(".categoryCard");
    if (!card) return;

    const category = card.dataset.category;
    window.location.href = `/pages/Category.html?category=${encodeURIComponent(category)}`;
});

document.getElementById("kingFisherbtn")?.addEventListener("click", () => {
    window.location.href = `/pages/Details.html?bird=kingfisher`;
});

document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap === "undefined") return;

    if (typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    gsap.from(".navbar", {
        y: -50, opacity: 0, duration: 1, ease: "power3.out"
    });

    gsap.from(".hero-contents > *", {
        y: 40, opacity: 0, duration: 1.2, stagger: 0.2,
        ease: "power3.out", delay: 0.3
    });

    gsap.from(".hero-bg", {
        scale: 1.15, duration: 2, ease: "power2.out"
    });

    if (typeof ScrollTrigger !== "undefined") {
        gsap.from(".cards-Container > h1, .cards-Container > p", {
            scrollTrigger: {
                trigger: ".cards-Container", start: "top 80%",
                toggleActions: "play none none none"
            },
            y: 30, opacity: 0, duration: 0.8, stagger: 0.2,
            ease: "power2.out"
        });

        gsap.from(".categoryCard", {
            scrollTrigger: {
                trigger: ".cards-Container", start: "top 75%",
                toggleActions: "play none none none"
            },
            y: 50, opacity: 0, duration: 1, stagger: 0.3,
            ease: "power3.out"
        });

        gsap.from(".custom-bg img", {
            scrollTrigger: {
                trigger: ".custom-bg", start: "top 75%",
                toggleActions: "play none none none"
            },
            x: -50, opacity: 0, duration: 1, ease: "power3.out"
        });

        gsap.from(".custom-bg .col-lg-6 > *", {
            scrollTrigger: {
                trigger: ".custom-bg", start: "top 75%",
                toggleActions: "play none none none"
            },
            x: 50, opacity: 0, duration: 1, stagger: 0.2,
            ease: "power3.out"
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
});

if (typeof toastr !== "undefined") {
    toastr.options = {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-bottom-right",
        timeOut: 3000
    };
}

document.getElementById("homePagebtn")?.addEventListener("click", () => {
    if (typeof toastr !== "undefined") toastr.error("Already in Home Page");
});
