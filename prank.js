document.addEventListener('DOMContentLoaded', () => {
  const prankBtn = document.getElementById("prankBtn");

  prankBtn.addEventListener("click", () => {
    document.body.classList.add("glitch");
    setTimeout(() => document.body.classList.remove("glitch"), 500);

    const sound = new Audio("https://od.lk/s/OV8yNDgzMzg4MDBf/Prank%20sound%20desah%20halal.mp3");
    sound.play().catch(() => {});

    const messages = [
      "yahahahhah",
      "mammpua.",
      "cemas kau dekk",
      "🥀🥀🥀🥀🥀🥀",
      "😜😜😜😜😜😜"
    ];
    alert(messages[Math.floor(Math.random() * messages.length)]);
  });
});
