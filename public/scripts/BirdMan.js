document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".navbar", {
        y: -50, opacity: 0, duration: 1, ease: "power3.out"
    });

    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    heroTl.from(".hero-card", {
        x: -50, opacity: 0, duration: 1.2, delay: 0.3
    }).from(".hero-img", {
        scale: 1.1, opacity: 0, duration: 1.2
    }, "-=0.9");

    gsap.from(".quote-section .container > *", {
        scrollTrigger: {
            trigger: ".quote-section", start: "top 85%",
            toggleActions: "play none none none"
        },
        y: 30, opacity: 0, duration: 1, stagger: 0.2,
        ease: "power2.out"
    });

    gsap.from("main .row.text-center > div > *", {
        scrollTrigger: {
            trigger: "main", start: "top 80%",
            toggleActions: "play none none none"
        },
        y: 30, opacity: 0, duration: 0.8, stagger: 0.2,
        ease: "power2.out"
    });

    gsap.from(".custom-card", {
        scrollTrigger: {
            trigger: ".row.g-4", start: "top 85%",
            toggleActions: "play none none none"
        },
        y: 50, opacity: 0, duration: 0.9, stagger: 0.2,
        ease: "power3.out"
    });

    gsap.from("footer", {
        scrollTrigger: {
            trigger: "footer", start: "top 95%",
            toggleActions: "play none none none"
        },
        opacity: 0, duration: 0.8, ease: "power2.out"
    });
});

document.getElementById("birdManPage")?.addEventListener("click", () => {
    if (typeof toastr !== "undefined") toastr.error("Already in the Page");
});
