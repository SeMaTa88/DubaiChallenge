document.addEventListener("DOMContentLoaded", function() {
    const fire = document.querySelector(".fire");
    const seesaw = document.querySelector(".seesaw");
    let leftWeight = 0, rightWeight = 0;

    function updateSeesaw() {
        let angle = (rightWeight - leftWeight) * 5; // تفاوت وزن باعث چرخش می‌شود
        seesaw.style.transform = `rotate(${angle}deg)`;
    }

    function increaseFire() {
        let fireWidth = parseFloat(getComputedStyle(fire).width);
        if (fireWidth < 800) {
            fire.style.width = (fireWidth + 10) + "px";
        } else {
            alert("🔥 آتش کل صفحه را گرفت! بازی تمام شد.");
            location.reload();
        }
    }

    document.querySelectorAll(".animal").forEach(animal => {
        animal.addEventListener("click", function() {
            let weight = parseInt(this.getAttribute("data-weight"));
            if (this.parentElement.classList.contains("left-queue")) {
                leftWeight += weight;
            } else {
                rightWeight += weight;
            }
            updateSeesaw();
            this.remove();
        });
    });

    setInterval(increaseFire, 3000);
});
